import Map "mo:core/Map";

module {
  type OldSalary = {
    base : Nat;
    pfDeduction : Nat;
    bonus : Nat;
    finalPayable : Nat;
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

  type OldPayslip = {
    id : Nat;
    employeeId : Nat;
    month : Nat;
    year : Nat;
    salaryDetails : OldSalary;
    leaveBalance : Nat;
    createdAt : Int;
  };

  type OldActor = {
    employees : Map.Map<Nat, OldEmployee>;
    payslips : Map.Map<Nat, OldPayslip>;
  };

  type NewEmployee = {
    id : Nat;
    name : Text;
    jobTitle : Text;
    department : Text;
    email : Text;
    joiningDate : Int;
    salary : OldSalary;
    leaveBalance : Nat;
    totalLeavesTaken : Nat;
    pfDetails : Text;
    bonus : Nat;
    createdAt : Int;
    isOpen : Bool;
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

  type NewActor = {
    employees : Map.Map<Nat, NewEmployee>;
    payslips : Map.Map<Nat, NewPayslip>;
  };

  public func run(old : OldActor) : NewActor {
    let newEmployees = old.employees.map<Nat, OldEmployee, NewEmployee>(
      func(_id, oldEmployee) {
        {
          oldEmployee with
          jobTitle = "";
          department = "";
          email = "";
        };
      }
    );

    let newPayslips = old.payslips.map<Nat, OldPayslip, NewPayslip>(
      func(_id, oldPayslip) { oldPayslip }
    );

    {
      employees = newEmployees;
      payslips = newPayslips;
    };
  };
};
