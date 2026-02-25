# Specification

## Summary
**Goal:** Fix the non-functional "Create employee" button in the HR Dashboard to properly open the employee creation dialog and enable adding new employees.

**Planned changes:**
- Fix the "Create employee" button click handler in EmployeesPage.tsx to open the EmployeeForm dialog
- Ensure EmployeeForm.tsx properly submits employee data using the createEmployee mutation
- Verify form validation and success feedback (toast notification and list refresh) work correctly

**User-visible outcome:** Users can click the "Create employee" button to open a dialog, fill in employee details (name, email, role, department, employee ID, hire date, salary), and successfully create new employees with immediate feedback and list updates.
