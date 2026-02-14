import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";

module {
  type OldActor = {
    jobRoles : Map.Map<Nat, OldJobRole>;
    contactMessages : Map.Map<Nat, OldContactMessage>;
    employees : Map.Map<Nat, OldEmployee>;
    leaveEntries : Map.Map<Nat, OldLeaveEntry>;
    tasks : Map.Map<Nat, OldTask>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    nextJobRoleId : Nat;
    nextEmployeeId : Nat;
    nextLeaveId : Nat;
    nextTaskId : Nat;
    nextContactMessageId : Nat;
  };

  type OldJobRole = {
    id : Nat;
    title : Text;
    location : OldLocation;
    description : Text;
    linkedInUrl : Text;
    isOpen : Bool;
    createdAt : Int;
  };

  type OldLocation = {
    city : Text;
    country : Text;
  };

  type OldContactMessage = {
    id : Nat;
    name : Text;
    email : Text;
    message : Text;
    timestamp : Int;
    isOpen : Bool;
  };

  type OldEmployee = {
    id : Nat;
    name : Text;
    joiningDate : Int;
    salary : OldSalary;
    leaveBalance : Nat;
    totalLeavesTaken : Nat;
    pfDetails : Text;
    bonus : Nat;
    createdAt : Int;
    isOpen : Bool;
  };

  type OldSalary = {
    base : Nat;
    pfDeduction : Nat;
    bonus : Nat;
    finalPayable : Nat;
  };

  type OldLeaveEntry = {
    id : Nat;
    employeeId : Nat;
    startDate : Int;
    endDate : Int;
    leaveType : Text;
    reason : Text;
    status : Text;
    createdAt : Int;
    isOpen : Bool;
  };

  type OldTask = {
    id : Nat;
    title : Text;
    description : Text;
    dueDate : Int;
    priority : OldTaskPriority;
    assignedTo : [OldEmployeeId];
    createdAt : Int;
    isComplete : Bool;
  };

  type OldTaskPriority = {
    #low;
    #medium;
    #high;
  };

  type OldEmployeeId = Nat;

  type OldUserProfile = {
    name : Text;
    email : Text;
  };

  type NewActor = {
    jobRoles : Map.Map<Nat, OldJobRole>;
    contactMessages : Map.Map<Nat, OldContactMessage>;
    employees : Map.Map<Nat, OldEmployee>;
    leaveEntries : Map.Map<Nat, OldLeaveEntry>;
    tasks : Map.Map<Nat, OldTask>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    payslips : Map.Map<Nat, NewPayslip>;
    principalToEmployeeId : Map.Map<Principal, Nat>;
    nextJobRoleId : Nat;
    nextEmployeeId : Nat;
    nextLeaveId : Nat;
    nextTaskId : Nat;
    nextContactMessageId : Nat;
    nextPayslipId : Nat;
  };

  type NewPayslip = {
    id : Nat;
    employeeId : Nat;
    month : Nat;
    year : Nat;
    salaryDetails : OldSalary;
    leaveBalance : Nat;
    createdAt : Int;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      payslips = Map.empty<Nat, NewPayslip>();
      principalToEmployeeId = Map.empty<Principal, Nat>();
      nextPayslipId = 1;
    };
  };
};
