import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Migration "migration";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Runtime "mo:core/Runtime";

(with migration = Migration.run)
actor {
  public type JobRoleId = Nat;
  public type EmployeeId = Nat;
  public type LeaveId = Nat;
  public type TaskId = Nat;
  public type ContactMessageId = Nat;
  public type PayslipId = Nat;

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
    createdAt : Int;
  };

  public type ContactMessage = {
    id : ContactMessageId;
    name : Text;
    email : Text;
    message : Text;
    timestamp : Int;
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
    jobTitle : Text;
    department : Text;
    email : Text;
    joiningDate : Int;
    salary : Salary;
    leaveBalance : Nat;
    totalLeavesTaken : Nat;
    pfDetails : Text;
    bonus : Nat;
    createdAt : Int;
    isOpen : Bool;
  };

  public type LeaveEntry = {
    id : LeaveId;
    employeeId : EmployeeId;
    startDate : Int;
    endDate : Int;
    leaveType : Text;
    reason : Text;
    status : Text;
    createdAt : Int;
    isOpen : Bool;
  };

  public type QuickLeaveMarkRequest = {
    employeeId : EmployeeId;
    leaveDate : Int;
    leaveType : Text;
    reason : Text;
  };

  public type TaskPriority = {
    #low;
    #medium;
    #high;
  };

  public type Task = {
    id : TaskId;
    title : Text;
    description : Text;
    dueDate : Int;
    priority : TaskPriority;
    assignedTo : [EmployeeId];
    createdAt : Int;
    isComplete : Bool;
  };

  public type TaskUpdate = {
    title : Text;
    description : Text;
    dueDate : Int;
    priority : TaskPriority;
    assignedTo : [EmployeeId];
    isComplete : Bool;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  public type UserInfo = {
    principal : Principal;
    role : AccessControl.UserRole;
    profile : ?UserProfile;
  };

  public type OfficeAddress = {
    title : Text;
    addressLines : [Text];
    phone : Text;
    email : Text;
  };

  public type Payslip = {
    id : PayslipId;
    employeeId : EmployeeId;
    month : Nat;
    year : Nat;
    salaryDetails : Salary;
    leaveBalance : Nat;
    createdAt : Int;
  };

  public type EmployeePayslipSummary = {
    employeeId : EmployeeId;
    payslips : [Payslip];
  };

  public type LeaveSummary = {
    leaveBalance : Nat;
    totalLeavesTaken : Nat;
  };

  public type EmployeeDashboardData = {
    profile : UserProfile;
    employee : Employee;
    tasks : [Task];
    leaveEntries : [LeaveEntry];
    leaveSummary : LeaveSummary;
    payslips : [Payslip];
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let jobRoles = Map.empty<JobRoleId, JobRole>();
  let contactMessages = Map.empty<ContactMessageId, ContactMessage>();
  let employees = Map.empty<EmployeeId, Employee>();
  let leaveEntries = Map.empty<LeaveId, LeaveEntry>();
  let tasks = Map.empty<TaskId, Task>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let payslips = Map.empty<PayslipId, Payslip>();
  let principalToEmployeeId = Map.empty<Principal, EmployeeId>();

  var nextJobRoleId = 1;
  var nextEmployeeId = 1;
  var nextLeaveId = 1;
  var nextTaskId = 1;
  var nextContactMessageId = 1;
  var nextPayslipId = 1;

  // -------------------------------------------------------------
  // Public (no auth required) endpoints
  // -------------------------------------------------------------

  public query func getOfficeAddress() : async OfficeAddress {
    {
      title = "Contact Germanystream";
      addressLines = [
        "Schwanallee 27",
        "35037 Marburg",
        "Hessen, Germany",
      ];
      phone = "+49 1512 0032959";
      email = "info@germanystream.com";
    };
  };

  // Public job listings - no auth required (recruitment page)
  public query func getAllOpenJobRoles() : async [JobRole] {
    let openJobRoles = jobRoles.values().filter(func(jobRole) { jobRole.isOpen });
    openJobRoles.toArray();
  };

  public query func getOpenJobRolesCount() : async Nat {
    jobRoles.values().filter(func(role) { role.isOpen }).size();
  };

  // Public contact form submission - no auth required
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

  // -------------------------------------------------------------
  // HR Dashboard - Admin-only queries
  // -------------------------------------------------------------

  // Admin-only: returns all employees for HR dashboard
  public query ({ caller }) func getAllEmployeesPublic() : async [Employee] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all employees");
    };
    employees.values().toArray().sort(EmployeeUtils.compareByName);
  };

  // Admin-only: get employee by ID
  public query ({ caller }) func getEmployeePublic(employeeId : EmployeeId) : async ?Employee {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view employee details");
    };
    employees.get(employeeId);
  };

  // Admin-only: get all tasks for HR dashboard
  public query ({ caller }) func getAllTasksPublic() : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all tasks");
    };
    tasks.values().toArray();
  };

  // Admin-only: get employee leave balance
  public query ({ caller }) func getEmployeeLeaveBalancePublic(employeeId : EmployeeId) : async ?Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view employee leave balances");
    };
    switch (employees.get(employeeId)) {
      case (null) { null };
      case (?employee) { ?employee.leaveBalance };
    };
  };

  // Admin-only: get employee leave entries
  public query ({ caller }) func getEmployeeLeaveEntriesPublic(employeeId : EmployeeId) : async [LeaveEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view employee leave entries");
    };
    leaveEntries.values().filter(func(entry) { entry.employeeId == employeeId }).toArray();
  };

  // -------------------------------------------------------------
  // User and Role Management Functions
  // -------------------------------------------------------------

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

  public query ({ caller }) func getCallerRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public query ({ caller }) func getUserRole(user : Principal) : async AccessControl.UserRole {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only check your own role");
    };
    AccessControl.getUserRole(accessControlState, user);
  };

  public query ({ caller }) func isAdmin(user : Principal) : async Bool {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only check your own admin status");
    };
    AccessControl.isAdmin(accessControlState, user);
  };

  public query ({ caller }) func hasPermission(user : Principal, requiredRole : AccessControl.UserRole) : async Bool {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only check your own permissions");
    };
    AccessControl.hasPermission(accessControlState, user, requiredRole);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func assignUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  // Users can associate themselves with an employee record; admins can associate any principal
  public shared ({ caller }) func associateEmployeeWithPrincipal(employeeId : EmployeeId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can associate employees");
    };
    switch (employees.get(employeeId)) {
      case (null) { Runtime.trap("Employee not found") };
      case (?_employee) {
        principalToEmployeeId.add(caller, employeeId);
      };
    };
  };

  // Caller can only look up their own association; admins can look up any principal
  public query ({ caller }) func getAssociatedEmployeeId(principal : Principal) : async ?EmployeeId {
    if (caller != principal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only look up your own employee association");
    };
    principalToEmployeeId.get(principal);
  };

  // Admin-only: list all users
  public query ({ caller }) func listAllUsers() : async [UserInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list all users");
    };

    let users = userProfiles.keys().map(func(principal) {
      {
        principal;
        role = AccessControl.getUserRole(accessControlState, principal);
        profile = userProfiles.get(principal);
      };
    }).toArray();

    users;
  };

  // -------------------------------------------------------------
  // Admin-only: Job Role Management
  // -------------------------------------------------------------

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

  // -------------------------------------------------------------
  // Admin-only: Task Management
  // -------------------------------------------------------------

  public shared ({ caller }) func createTask(
    title : Text,
    description : Text,
    dueDate : Int,
    priority : TaskPriority,
    assignedTo : [EmployeeId],
  ) : async TaskId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create tasks");
    };

    let newId = nextTaskId;
    let newTask : Task = {
      id = newId;
      title;
      description;
      dueDate;
      priority;
      assignedTo;
      createdAt = Time.now();
      isComplete = false;
    };
    tasks.add(newId, newTask);
    nextTaskId += 1;
    newId;
  };

  public shared ({ caller }) func updateTask(taskId : TaskId, update : TaskUpdate) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update tasks");
    };

    switch (tasks.get(taskId)) {
      case (null) {
        Runtime.trap("Task not found");
      };
      case (?existingTask) {
        let updatedTask : Task = {
          existingTask with
          title = update.title;
          description = update.description;
          dueDate = update.dueDate;
          priority = update.priority;
          assignedTo = update.assignedTo;
          isComplete = update.isComplete;
        };
        tasks.add(taskId, updatedTask);
      };
    };
  };

  public shared ({ caller }) func deleteTask(taskId : TaskId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete tasks");
    };

    if (not tasks.containsKey(taskId)) {
      Runtime.trap("Task not found");
    };

    tasks.remove(taskId);
  };

  // -------------------------------------------------------------
  // Admin-only: Employee Management
  // -------------------------------------------------------------

  public shared ({ caller }) func createEmployee(
    name : Text,
    jobTitle : Text,
    department : Text,
    email : Text,
    joiningDate : Int,
    salary : Salary,
  ) : async EmployeeId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create employees");
    };
    let newId = nextEmployeeId;
    let newEmployee : Employee = {
      id = newId;
      name;
      jobTitle;
      department;
      email;
      joiningDate;
      salary;
      leaveBalance = 20;
      totalLeavesTaken = 0;
      pfDetails = "";
      bonus = 0;
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

  // -------------------------------------------------------------
  // Leave Management
  // Admin can add leave for any employee; users can only add leave
  // for the employee record associated with their own principal.
  // -------------------------------------------------------------

  public shared ({ caller }) func addLeaveEntry(employeeId : EmployeeId, startDate : Int, endDate : Int, reason : Text) : async LeaveId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add leave entries");
    };

    // Non-admins may only add leave for their own associated employee
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      switch (principalToEmployeeId.get(caller)) {
        case (null) {
          Runtime.trap("Unauthorized: No employee record linked to your account");
        };
        case (?associatedId) {
          if (associatedId != employeeId) {
            Runtime.trap("Unauthorized: You can only add leave for your own employee record");
          };
        };
      };
    };

    switch (employees.get(employeeId)) {
      case (null) { Runtime.trap("Employee not found") };
      case (?_employee) {
        let newId = nextLeaveId;
        let newLeaveEntry : LeaveEntry = {
          id = newId;
          employeeId;
          startDate;
          endDate;
          leaveType = "General";
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

  public shared ({ caller }) func quickLeaveMark(request : QuickLeaveMarkRequest) : async LeaveId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can mark quick leaves");
    };

    // Non-admins may only mark leave for their own associated employee
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      switch (principalToEmployeeId.get(caller)) {
        case (null) {
          Runtime.trap("Unauthorized: No employee record linked to your account");
        };
        case (?associatedId) {
          if (associatedId != request.employeeId) {
            Runtime.trap("Unauthorized: You can only mark leave for your own employee record");
          };
        };
      };
    };

    switch (employees.get(request.employeeId)) {
      case (null) { Runtime.trap("Employee not found") };
      case (?_employee) {
        let newId = nextLeaveId;
        let newLeaveEntry : LeaveEntry = {
          id = newId;
          employeeId = request.employeeId;
          startDate = request.leaveDate;
          endDate = request.leaveDate;
          leaveType = request.leaveType;
          reason = request.reason;
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

  // -------------------------------------------------------------
  // Admin-only: Payslip Management
  // -------------------------------------------------------------

  public shared ({ caller }) func generateMonthlyPayslips(month : Nat, year : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can generate payslips");
    };

    let currentTime = Time.now();

    let payslipEntries = employees.toArray().map(
      func((employeeId, employee)) {
        let payslipId = nextPayslipId;
        let payslip : Payslip = {
          id = payslipId;
          employeeId;
          month;
          year;
          salaryDetails = employee.salary;
          leaveBalance = employee.leaveBalance;
          createdAt = currentTime;
        };
        nextPayslipId += 1;
        (payslipId, payslip);
      }
    );

    payslipEntries.forEach(func(p) { payslips.add(p.0, p.1) });
  };

  // Users can only view their own payslips; admins can view any
  public query ({ caller }) func getEmployeePayslips(employeeId : EmployeeId) : async [Payslip] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view payslips");
    };

    let isAdminCaller = AccessControl.isAdmin(accessControlState, caller);
    let isAssociatedWithEmployee = switch (principalToEmployeeId.get(caller)) {
      case (?associatedId) { associatedId == employeeId };
      case (null) { false };
    };

    if (not isAdminCaller and not isAssociatedWithEmployee) {
      Runtime.trap("Unauthorized: You can only view your own payslips");
    };

    let payslipList = List.empty<Payslip>();
    payslips.entries().forEach(func((_, payslip)) {
      if (payslip.employeeId == employeeId) {
        payslipList.add(payslip);
      };
    });
    payslipList.toArray();
  };

  public query ({ caller }) func getPayslip(payslipId : PayslipId) : async ?Payslip {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be at least a user to view payslips");
    };

    // Non-admins may only view payslips belonging to their own employee record
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      switch (payslips.get(payslipId)) {
        case (null) { return null };
        case (?payslip) {
          let isAssociated = switch (principalToEmployeeId.get(caller)) {
            case (?associatedId) { associatedId == payslip.employeeId };
            case (null) { false };
          };
          if (not isAssociated) {
            Runtime.trap("Unauthorized: You can only view your own payslips");
          };
        };
      };
    };

    payslips.get(payslipId);
  };

  // -------------------------------------------------------------
  // Employee Self-Service APIs
  // -------------------------------------------------------------

  public query ({ caller }) func getCallerAssociatedEmployeeId() : async EmployeeId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: You must be logged in to access your employee record");
    };
    switch (principalToEmployeeId.get(caller)) {
      case (null) {
        Runtime.trap("No employee record linked to your account. Please contact HR for assistance.");
      };
      case (?employeeId) { employeeId };
    };
  };

  public query ({ caller }) func getMyEmployee() : async Employee {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: You must be logged in to access your employee record");
    };
    switch (principalToEmployeeId.get(caller)) {
      case (null) {
        Runtime.trap("No employee record linked to your account. Please contact HR for assistance.");
      };
      case (?employeeId) {
        switch (employees.get(employeeId)) {
          case (null) {
            Runtime.trap("Associated employee record not found. Please contact HR for assistance.");
          };
          case (?employee) { employee };
        };
      };
    };
  };

  public query ({ caller }) func getMyTasks() : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: You must be logged in to access your tasks");
    };
    switch (principalToEmployeeId.get(caller)) {
      case (null) {
        Runtime.trap("No employee record linked to your account. Please contact HR for assistance.");
      };
      case (?employeeId) {
        tasks.values().filter(
          func(task) {
            task.assignedTo.filter(func(id) { id == employeeId }).size() > 0
          }
        ).toArray();
      };
    };
  };

  public query ({ caller }) func getMyLeaveEntriesAndSummary() : async ([LeaveEntry], LeaveSummary) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: You must be logged in to access your leave records");
    };
    switch (principalToEmployeeId.get(caller)) {
      case (null) {
        Runtime.trap("No employee record linked to your account. Please contact HR for assistance.");
      };
      case (?employeeId) {
        switch (employees.get(employeeId)) {
          case (null) {
            Runtime.trap("Associated employee record not found. Please contact HR for assistance.");
          };
          case (?employee) {
            let leaveEntriesArray = leaveEntries.values().filter(
              func(entry) { entry.employeeId == employeeId }
            ).toArray();
            let summary : LeaveSummary = {
              leaveBalance = employee.leaveBalance;
              totalLeavesTaken = employee.totalLeavesTaken;
            };
            (leaveEntriesArray, summary);
          };
        };
      };
    };
  };

  public query ({ caller }) func getMyPayslips() : async [Payslip] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: You must be logged in to access your payslips");
    };
    switch (principalToEmployeeId.get(caller)) {
      case (null) {
        Runtime.trap("No employee record linked to your account. Please contact HR for assistance.");
      };
      case (?employeeId) {
        payslips.values().filter(func(payslip) { payslip.employeeId == employeeId }).toArray();
      };
    };
  };

  public shared ({ caller }) func submitMyTimeOffRequest(
    startDate : Int,
    endDate : Int,
    leaveType : Text,
    reason : Text,
  ) : async LeaveId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: You must be logged in to submit time off requests");
    };
    switch (principalToEmployeeId.get(caller)) {
      case (null) {
        Runtime.trap("No employee record linked to your account. Please contact HR for assistance.");
      };
      case (?employeeId) {
        let newId = nextLeaveId;
        let newLeaveEntry : LeaveEntry = {
          id = newId;
          employeeId;
          startDate;
          endDate;
          leaveType;
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

  module EmployeeUtils {
    public func compareByName(e1 : Employee, e2 : Employee) : Order.Order {
      Text.compare(e1.name, e2.name);
    };

    public func compareById(e1 : Employee, e2 : Employee) : Order.Order {
      Nat.compare(e1.id, e2.id);
    };
  };
};
