import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Location {
    country: string;
    city: string;
}
export interface Salary {
    base: bigint;
    finalPayable: bigint;
    bonus: bigint;
    pfDeduction: bigint;
}
export type ContactMessageId = bigint;
export interface QuickLeaveMarkRequest {
    employeeId: EmployeeId;
    leaveDate: bigint;
    leaveType: string;
    reason: string;
}
export interface Task {
    id: TaskId;
    title: string;
    assignedTo: Array<EmployeeId>;
    createdAt: bigint;
    dueDate: bigint;
    description: string;
    priority: TaskPriority;
    isComplete: boolean;
}
export interface UserInfo {
    principal: Principal;
    role: UserRole;
    profile?: UserProfile;
}
export interface LeaveEntry {
    id: LeaveId;
    status: string;
    endDate: bigint;
    createdAt: bigint;
    isOpen: boolean;
    employeeId: EmployeeId;
    leaveType: string;
    startDate: bigint;
    reason: string;
}
export interface TaskUpdate {
    title: string;
    assignedTo: Array<EmployeeId>;
    dueDate: bigint;
    description: string;
    priority: TaskPriority;
    isComplete: boolean;
}
export type JobRoleId = bigint;
export interface LeaveSummary {
    leaveBalance: bigint;
    totalLeavesTaken: bigint;
}
export interface JobRole {
    id: JobRoleId;
    title: string;
    createdAt: bigint;
    description: string;
    isOpen: boolean;
    linkedInUrl: string;
    location: Location;
}
export interface OfficeAddress {
    title: string;
    email: string;
    addressLines: Array<string>;
    phone: string;
}
export type EmployeeId = bigint;
export type TaskId = bigint;
export interface Employee {
    id: EmployeeId;
    salary: Salary;
    leaveBalance: bigint;
    name: string;
    createdAt: bigint;
    joiningDate: bigint;
    isOpen: boolean;
    email: string;
    jobTitle: string;
    pfDetails: string;
    totalLeavesTaken: bigint;
    bonus: bigint;
    department: string;
}
export type PayslipId = bigint;
export type LeaveId = bigint;
export interface UserProfile {
    name: string;
    email: string;
}
export interface Payslip {
    id: PayslipId;
    month: bigint;
    leaveBalance: bigint;
    createdAt: bigint;
    year: bigint;
    employeeId: EmployeeId;
    salaryDetails: Salary;
}
export enum TaskPriority {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addLeaveEntry(employeeId: EmployeeId, startDate: bigint, endDate: bigint, reason: string): Promise<LeaveId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignUserRole(user: Principal, role: UserRole): Promise<void>;
    associateEmployeeWithPrincipal(employeeId: EmployeeId): Promise<void>;
    createEmployee(name: string, jobTitle: string, department: string, email: string, joiningDate: bigint, salary: Salary): Promise<EmployeeId>;
    createJobRole(jobRoleEntry: JobRole): Promise<JobRoleId>;
    createTask(title: string, description: string, dueDate: bigint, priority: TaskPriority, assignedTo: Array<EmployeeId>): Promise<TaskId>;
    deleteTask(taskId: TaskId): Promise<void>;
    generateMonthlyPayslips(month: bigint, year: bigint): Promise<void>;
    getAllEmployeesPublic(): Promise<Array<Employee>>;
    getAllOpenJobRoles(): Promise<Array<JobRole>>;
    getAllTasksPublic(): Promise<Array<Task>>;
    getAssociatedEmployeeId(principal: Principal): Promise<EmployeeId | null>;
    getCallerAssociatedEmployeeId(): Promise<EmployeeId>;
    getCallerRole(): Promise<UserRole>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEmployeeLeaveBalancePublic(employeeId: EmployeeId): Promise<bigint | null>;
    getEmployeeLeaveEntriesPublic(employeeId: EmployeeId): Promise<Array<LeaveEntry>>;
    getEmployeePayslips(employeeId: EmployeeId): Promise<Array<Payslip>>;
    getEmployeePublic(employeeId: EmployeeId): Promise<Employee | null>;
    getMyEmployee(): Promise<Employee>;
    getMyLeaveEntriesAndSummary(): Promise<[Array<LeaveEntry>, LeaveSummary]>;
    getMyPayslips(): Promise<Array<Payslip>>;
    getMyTasks(): Promise<Array<Task>>;
    getOfficeAddress(): Promise<OfficeAddress>;
    getOpenJobRolesCount(): Promise<bigint>;
    getPayslip(payslipId: PayslipId): Promise<Payslip | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserRole(user: Principal): Promise<UserRole>;
    hasPermission(user: Principal, requiredRole: UserRole): Promise<boolean>;
    isAdmin(user: Principal): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    listAllUsers(): Promise<Array<UserInfo>>;
    quickLeaveMark(request: QuickLeaveMarkRequest): Promise<LeaveId>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitContactMessage(name: string, email: string, message: string): Promise<ContactMessageId>;
    submitMyTimeOffRequest(startDate: bigint, endDate: bigint, leaveType: string, reason: string): Promise<LeaveId>;
    updateEmployeeSalary(employeeId: EmployeeId, newBaseSalary: bigint): Promise<void>;
    updateTask(taskId: TaskId, update: TaskUpdate): Promise<void>;
}
