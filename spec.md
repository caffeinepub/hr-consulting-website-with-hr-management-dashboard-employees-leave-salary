# Specification

## Summary
**Goal:** Fix the Create Employee feature so that employee data is properly submitted to the backend, persisted, and displayed in the employee list.

**Planned changes:**
- Fix the Create Employee form submission in `EmployeesPage.tsx` to correctly call the backend `createEmployee` function
- Update `EmployeeForm.tsx` to include fields for Name, Job Title, Department, Email, and Salary with inline validation
- Update the Motoko backend (`main.mo`) to store all required employee fields and return them via `getEmployees`
- Invalidate the React Query cache after successful creation so the employee list refreshes immediately without a page reload
- Show a success toast/notification after a new employee is successfully created

**User-visible outcome:** Users can fill in the Create Employee form, submit it, and see the new employee appear immediately in the employee list along with a success confirmation message.
