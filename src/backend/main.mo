import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type JobRoleId = Nat;
  public type EmployeeId = Nat;
  public type LeaveId = Nat;
  public type ContactMessageId = Nat;

  public type Location = {
    city : Text;
    country : Text;
  };

  public type JobRole = {
    id : JobRoleId;
    title : Text;
    location : Location;
    description : Text;
    linkedInUrl : Text;
    isOpen : Bool;
    createdAt : Int; // SystemTime in nanoseconds
  };

  public type ContactMessage = {
    id : ContactMessageId;
    name : Text;
    email : Text;
    message : Text;
    timestamp : Int; // SystemTime in nanoseconds
    isOpen : Bool;
  };

  public type Salary = {
    base : Nat;
    pfDeduction : Nat;
    bonus : Nat;
    finalPayable : Nat;
  };

  public type Employee = {
    id : EmployeeId;
    name : Text;
    joiningDate : Int; // SystemTime in nanoseconds
    salary : Salary;
    leaveBalance : Nat;
    totalLeavesTaken : Nat;
    pfDetails : Text;
    bonus : Nat;
    createdAt : Int; // SystemTime in nanoseconds
    isOpen : Bool;
  };

  public type LeaveEntry = {
    id : LeaveId;
    employeeId : EmployeeId;
    startDate : Int; // SystemTime in nanoseconds
    endDate : Int; // SystemTime in nanoseconds
    reason : Text;
    status : Text;
    createdAt : Int; // SystemTime in nanoseconds
    isOpen : Bool;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  // Initialize the access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Map for storing job roles
  let jobRoles = Map.empty<JobRoleId, JobRole>();

  // Map for storing contact messages
  let contactMessages = Map.empty<ContactMessageId, ContactMessage>();

  // Map for storing employees and leave entries
  let employees = Map.empty<EmployeeId, Employee>();
  let leaveEntries = Map.empty<LeaveId, LeaveEntry>();

  // Map for storing user profiles
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Counters for generating unique IDs
  var nextJobRoleId = 1;
  var nextEmployeeId = 1;
  var nextLeaveId = 1;
  var nextContactMessageId = 1;

  // User Profile Management (Required by frontend)

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Access control initialization

  public shared ({ caller }) func initializeSystem(adminToken : Text, userProvidedToken : Text) : async () {
    AccessControl.initialize(accessControlState, caller, adminToken, userProvidedToken);
  };

  // Job Role Management (Admin only for creation, public for viewing)

  public shared ({ caller }) func createJobRole(jobRoleEntry : JobRole) : async JobRoleId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create job roles");
    };
    let newId = nextJobRoleId;
    let jobRoleWithId : JobRole = {
      jobRoleEntry with id = newId;
    };
    jobRoles.add(newId, jobRoleWithId);
    nextJobRoleId += 1;
    newId;
  };

  // Public query - accessible to everyone including guests (for recruitment page)
  public query func getAllOpenJobRoles() : async [JobRole] {
    let openJobRoles = jobRoles.values().filter(func(jobRole : JobRole) : Bool { jobRole.isOpen });
    openJobRoles.toArray();
  };

  // Public query - accessible to everyone including guests
  public query func getOpenJobRolesCount() : async Nat {
    jobRoles.values().filter(func(role : JobRole) : Bool { role.isOpen }).size();
  };

  // Employee Management (Admin only)

  public shared ({ caller }) func createEmployee(name : Text, joiningDate : Int, baseSalary : Nat, pfDetails : Text, bonus : Nat) : async EmployeeId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create employees");
    };
    let newId = nextEmployeeId;
    let newEmployee : Employee = {
      id = newId;
      name;
      joiningDate;
      salary = {
        base = baseSalary;
        pfDeduction = 0;
        bonus;
        finalPayable = baseSalary + bonus;
      };
      leaveBalance = 20;
      totalLeavesTaken = 0;
      pfDetails;
      bonus;
      createdAt = Time.now();
      isOpen = true;
    };
    employees.add(newId, newEmployee);
    nextEmployeeId += 1;
    newId;
  };

  public shared ({ caller }) func updateEmployeeSalary(employeeId : EmployeeId, newBaseSalary : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update employee salary");
    };
    switch (employees.get(employeeId)) {
      case (null) { Runtime.trap("Employee not found") };
      case (?employee) {
        let updatedEmployee : Employee = {
          employee with
          salary = {
            employee.salary with
            base = newBaseSalary;
            finalPayable = newBaseSalary + employee.salary.bonus - employee.salary.pfDeduction;
          };
        };
        employees.add(employeeId, updatedEmployee);
      };
    };
  };

  public query ({ caller }) func getAllEmployeesSorted() : async [Employee] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all employees");
    };
    employees.values().toArray().sort(EmployeeUtils.compareByName);
  };

  public query ({ caller }) func getEmployee(employeeId : EmployeeId) : async ?Employee {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view employee details");
    };
    employees.get(employeeId);
  };

  // Leave Management (Admin only)

  public shared ({ caller }) func addLeaveEntry(employeeId : EmployeeId, startDate : Int, endDate : Int, reason : Text) : async LeaveId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add leave entries");
    };

    switch (employees.get(employeeId)) {
      case (null) { Runtime.trap("Employee not found") };
      case (?employee) {
        let newId = nextLeaveId;
        let newLeaveEntry : LeaveEntry = {
          id = newId;
          employeeId;
          startDate;
          endDate;
          reason;
          status = "Pending";
          createdAt = Time.now();
          isOpen = true;
        };
        leaveEntries.add(newId, newLeaveEntry);
        nextLeaveId += 1;
        newId;
      };
    };
  };

  public query ({ caller }) func getEmployeeLeaveBalance(employeeId : EmployeeId) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view leave balance");
    };
    switch (employees.get(employeeId)) {
      case (null) { Runtime.trap("Employee not found") };
      case (?employee) { employee.leaveBalance };
    };
  };

  public query ({ caller }) func getEmployeeLeaveEntries(employeeId : EmployeeId) : async [LeaveEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view leave entries");
    };
    leaveEntries.values().filter(func(entry : LeaveEntry) : Bool { entry.employeeId == employeeId }).toArray();
  };

  // Contact Message Management (Public submission, Admin viewing)

  // Public - accessible to everyone including guests (for contact form)
  public shared ({ caller }) func submitContactMessage(name : Text, email : Text, message : Text) : async ContactMessageId {
    let newId = nextContactMessageId;
    let newMessage : ContactMessage = {
      id = newId;
      name;
      email;
      message;
      timestamp = Time.now();
      isOpen = true;
    };
    contactMessages.add(newId, newMessage);
    nextContactMessageId += 1;
    newId;
  };

  public query ({ caller }) func getAllContactMessages() : async [ContactMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view contact messages");
    };
    contactMessages.values().toArray();
  };

  public query ({ caller }) func getContactMessage(messageId : ContactMessageId) : async ?ContactMessage {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view contact messages");
    };
    contactMessages.get(messageId);
  };

  // Role Assignment (Admin only, delegated to AccessControl)

  public shared ({ caller }) func assignUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  // Helper Query Functions (Admin only)

  public query ({ caller }) func isAdmin(user : Principal) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can check admin status");
    };
    AccessControl.isAdmin(accessControlState, user);
  };

  public query ({ caller }) func hasPermission(user : Principal, requiredRole : AccessControl.UserRole) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can check permissions");
    };
    AccessControl.hasPermission(accessControlState, user, requiredRole);
  };

  // Custom comparison functions for sorting
  module EmployeeUtils {
    public func compareByName(e1 : Employee, e2 : Employee) : Order.Order {
      Text.compare(e1.name, e2.name);
    };

    public func compareById(e1 : Employee, e2 : Employee) : Order.Order {
      Nat.compare(e1.id, e2.id);
    };
  };
};
