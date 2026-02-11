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
export interface UserInfo {
    principal: Principal;
    role: UserRole;
    profile?: UserProfile;
}
export type JobRoleId = bigint;
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
export interface JobRole {
    id: JobRoleId;
    title: string;
    createdAt: bigint;
    description: string;
    isOpen: boolean;
    linkedInUrl: string;
    location: Location;
}
export interface ContactMessage {
    id: ContactMessageId;
    name: string;
    isOpen: boolean;
    email: string;
    message: string;
    timestamp: bigint;
}
export type EmployeeId = bigint;
export interface Employee {
    id: EmployeeId;
    salary: Salary;
    leaveBalance: bigint;
    name: string;
    createdAt: bigint;
    joiningDate: bigint;
    isOpen: boolean;
    pfDetails: string;
    totalLeavesTaken: bigint;
    bonus: bigint;
}
export type LeaveId = bigint;
export interface UserProfile {
    name: string;
    email: string;
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
    createEmployee(name: string, joiningDate: bigint, baseSalary: bigint, pfDetails: string, bonus: bigint): Promise<EmployeeId>;
    createJobRole(jobRoleEntry: JobRole): Promise<JobRoleId>;
    getAllContactMessages(): Promise<Array<ContactMessage>>;
    getAllEmployeesSorted(): Promise<Array<Employee>>;
    getAllOpenJobRoles(): Promise<Array<JobRole>>;
    getCallerRole(): Promise<UserRole>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactMessage(messageId: ContactMessageId): Promise<ContactMessage | null>;
    getEmployee(employeeId: EmployeeId): Promise<Employee | null>;
    getEmployeeLeaveBalance(employeeId: EmployeeId): Promise<bigint>;
    getEmployeeLeaveEntries(employeeId: EmployeeId): Promise<Array<LeaveEntry>>;
    getOpenJobRolesCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserRole(user: Principal): Promise<UserRole>;
    hasPermission(user: Principal, requiredRole: UserRole): Promise<boolean>;
    isAdmin(user: Principal): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    listAllUsers(): Promise<Array<UserInfo>>;
    quickLeaveMark(request: QuickLeaveMarkRequest): Promise<LeaveId>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitContactMessage(name: string, email: string, message: string): Promise<ContactMessageId>;
    updateEmployeeSalary(employeeId: EmployeeId, newBaseSalary: bigint): Promise<void>;
}
