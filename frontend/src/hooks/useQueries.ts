import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Employee, JobRole, LeaveEntry, UserProfile, UserRole, UserInfo, QuickLeaveMarkRequest, Task, TaskUpdate, Payslip, ContactMessageId, LeaveSummary, Salary } from '../backend';
import { TaskPriority } from '../backend';
import { Principal } from '@dfinity/principal';

// Define ContactMessage type locally since it's not exported from backend
export interface ContactMessage {
  id: ContactMessageId;
  name: string;
  email: string;
  message: string;
  timestamp: bigint;
  isOpen: boolean;
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetCallerRole() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['callerRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor || !identity) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

export function useListAllUsers() {
  const { actor, isFetching } = useActor();

  return useQuery<UserInfo[]>({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAssignUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignUserRole(user, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
}

export function useGetAllEmployees() {
  const { actor, isFetching } = useActor();

  return useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEmployeesPublic();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetEmployee(employeeId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Employee | null>({
    queryKey: ['employee', employeeId?.toString()],
    queryFn: async () => {
      if (!actor || !employeeId) return null;
      return actor.getEmployeePublic(employeeId);
    },
    enabled: !!actor && !!employeeId && !isFetching,
  });
}

export function useCreateEmployee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      jobTitle: string;
      department: string;
      email: string;
      joiningDate: bigint;
      salary: Salary;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createEmployee(
        data.name,
        data.jobTitle,
        data.department,
        data.email,
        data.joiningDate,
        data.salary
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useUpdateEmployeeSalary() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { employeeId: bigint; newBaseSalary: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateEmployeeSalary(data.employeeId, data.newBaseSalary);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', variables.employeeId.toString()] });
    },
  });
}

export function useGetAllJobRoles() {
  const { actor, isFetching } = useActor();

  return useQuery<JobRole[]>({
    queryKey: ['jobRoles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOpenJobRoles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateJobRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobRole: Omit<JobRole, 'id' | 'createdAt' | 'isOpen'>) => {
      if (!actor) throw new Error('Actor not available');
      const fullJobRole: JobRole = {
        ...jobRole,
        id: BigInt(0),
        createdAt: BigInt(Date.now() * 1000000),
        isOpen: true,
      };
      return actor.createJobRole(fullJobRole);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobRoles'] });
    },
  });
}

export function useSubmitContactMessage() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: { name: string; email: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitContactMessage(data.name, data.email, data.message);
    },
  });
}

export function useGetEmployeeLeaveEntries(employeeId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<LeaveEntry[]>({
    queryKey: ['leaveEntries', employeeId?.toString()],
    queryFn: async () => {
      if (!actor || !employeeId) return [];
      return actor.getEmployeeLeaveEntriesPublic(employeeId);
    },
    enabled: !!actor && !!employeeId && !isFetching,
  });
}

export function useAddLeaveEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      employeeId: bigint;
      startDate: bigint;
      endDate: bigint;
      reason: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addLeaveEntry(data.employeeId, data.startDate, data.endDate, data.reason);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leaveEntries', variables.employeeId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['employee', variables.employeeId.toString()] });
    },
  });
}

export function useQuickLeaveMark() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: QuickLeaveMarkRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.quickLeaveMark(request);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leaveEntries', variables.employeeId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['employee', variables.employeeId.toString()] });
    },
  });
}

export function useGetAllTasks() {
  const { actor, isFetching } = useActor();

  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTasksPublic();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetEmployeeTasks(employeeId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Task[]>({
    queryKey: ['employeeTasks', employeeId?.toString()],
    queryFn: async () => {
      if (!actor || !employeeId) return [];
      const allTasks = await actor.getAllTasksPublic();
      return allTasks.filter(task =>
        task.assignedTo.some(id => id === employeeId)
      );
    },
    enabled: !!actor && !!employeeId && !isFetching,
  });
}

export function useCreateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      dueDate: bigint;
      priority: TaskPriority;
      assignedTo: bigint[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTask(
        data.title,
        data.description,
        data.dueDate,
        data.priority,
        data.assignedTo
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { taskId: bigint; update: TaskUpdate }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTask(data.taskId, data.update);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useDeleteTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useGetEmployeePayslips(employeeId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Payslip[]>({
    queryKey: ['payslips', employeeId?.toString()],
    queryFn: async () => {
      if (!actor || !employeeId) return [];
      return actor.getEmployeePayslips(employeeId);
    },
    enabled: !!actor && !!employeeId && !isFetching,
  });
}

export function useGenerateMonthlyPayslips() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { month: bigint; year: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.generateMonthlyPayslips(data.month, data.year);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payslips'] });
    },
  });
}

export function useGetAllContactMessages() {
  // Stub: backend doesn't support querying contact messages yet
  return useQuery<ContactMessage[]>({
    queryKey: ['contactMessages'],
    queryFn: async () => [],
    enabled: false,
  });
}

// Employee self-service hooks
export function useGetMyEmployee() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Employee>({
    queryKey: ['myEmployee'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyEmployee();
    },
    enabled: !!actor && !!identity && !isFetching,
    retry: false,
  });
}

export function useGetMyTasks() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Task[]>({
    queryKey: ['myTasks'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyTasks();
    },
    enabled: !!actor && !!identity && !isFetching,
    retry: false,
  });
}

export function useGetMyLeaveEntriesAndSummary() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<[LeaveEntry[], LeaveSummary]>({
    queryKey: ['myLeaveEntries'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyLeaveEntriesAndSummary();
    },
    enabled: !!actor && !!identity && !isFetching,
    retry: false,
  });
}

export function useGetMyPayslips() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Payslip[]>({
    queryKey: ['myPayslips'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyPayslips();
    },
    enabled: !!actor && !!identity && !isFetching,
    retry: false,
  });
}

export function useSubmitMyTimeOffRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      startDate: bigint;
      endDate: bigint;
      leaveType: string;
      reason: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitMyTimeOffRequest(data.startDate, data.endDate, data.leaveType, data.reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myLeaveEntries'] });
    },
  });
}

export function useAssociateEmployeeWithPrincipal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.associateEmployeeWithPrincipal(employeeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myEmployee'] });
      queryClient.invalidateQueries({ queryKey: ['isEmployeeAssociated'] });
    },
  });
}

/**
 * Returns true if the currently authenticated user has an associated employee record.
 * Gracefully returns false if the user is not authenticated or has no association.
 */
export function useIsEmployeeAssociated() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isEmployeeAssociated'],
    queryFn: async () => {
      if (!actor || !identity) return false;
      try {
        await actor.getCallerAssociatedEmployeeId();
        return true;
      } catch {
        return false;
      }
    },
    enabled: !!actor && !!identity && !isFetching,
    retry: false,
  });
}
