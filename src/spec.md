# Specification

## Summary
**Goal:** Add an employee-facing dashboard (separate from HR routes) that lets employees view their own tasks, salary details, and download automatically generated payslips, plus HR-side deep links from the Employees list to per-employee tasks/salary/payslips views.

**Planned changes:**
- Add a new “Employee Dashboard” item in the left sidebar under the existing HR Dashboard section, routed to a non-/hr employee-facing page with unauthenticated access blocked.
- Build an Employee Dashboard page that shows the logged-in employee’s daily tasks (status, due date), salary breakdown (base, PF deduction, bonus, final payable), and a payslips list with per-payslip download actions.
- Add backend support to link authenticated Principals to an EmployeeId (admin-settable) and enforce access rules: HR/admin can access any employee data; employees can only access their own associated tasks/salary/payslips.
- Add HR Employees table row actions/deep links for “Tasks”, “Salary”, and “Payslips” that open HR-only per-employee views.
- Implement automatic payslip generation from stored salary data and enable downloading for both employees (own only) and HR/admin (any employee).

**User-visible outcome:** Employees can open a dedicated Employee Dashboard to see only their own tasks, salary details, and download system-generated payslips; HR/admin can jump from the HR Employees list to view a specific employee’s tasks, salary, and payslips, and download generated payslips.
