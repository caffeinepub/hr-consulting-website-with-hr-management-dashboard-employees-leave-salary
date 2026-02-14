import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Employee, JobRole, ContactMessage, LeaveEntry, UserProfile, UserRole, UserInfo, QuickLeaveMarkRequest, Task, TaskUpdate, Payslip } from '../backend';
import { TaskPriority } from '../backend';
import { Principal } from '@dfinity/principal';

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
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserRole>({
    queryKey: ['callerRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerRole();
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

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
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

export function useListAllUsers() {
  const { actor, isFetching } = useActor();

  return useQuery<UserInfo[]>({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAssignUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignUserRole(data.user, data.role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      queryClient.invalidateQueries({ queryKey: ['callerRole'] });
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
    },
  });
}

export function useGetAllEmployees() {
  const { actor, isFetching } = useActor();

  return useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEmployeesSorted();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetEmployee(employeeId: number) {
  const { actor, isFetching } = useActor();

  return useQuery<Employee | null>({
    queryKey: ['employee', employeeId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getEmployee(BigInt(employeeId));
    },
    enabled: !!actor && !isFetching && employeeId > 0,
  });
}

export function useGetAssociatedEmployee() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Employee | null>({
    queryKey: ['associatedEmployee', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return null;
      try {
        const employeeId = await actor.getAssociatedEmployeeId(identity.getPrincipal());
        if (!employeeId) return null;
        return actor.getEmployee(employeeId);
      } catch (error) {
        console.error('Error fetching associated employee:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!identity,
    retry: false,
  });
}

export function useCreateEmployee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      joiningDate: bigint;
      baseSalary: bigint;
      pfDetails: string;
      bonus: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createEmployee(
        data.name,
        data.joiningDate,
        data.baseSalary,
        data.pfDetails,
        data.bonus
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
    mutationFn: async (data: { employeeId: number; newBaseSalary: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateEmployeeSalary(BigInt(data.employeeId), data.newBaseSalary);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', variables.employeeId] });
    },
  });
}

export function useGetEmployeeLeaveEntries(employeeId: number) {
  const { actor, isFetching } = useActor();

  return useQuery<LeaveEntry[]>({
    queryKey: ['leaveEntries', employeeId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEmployeeLeaveEntries(BigInt(employeeId));
    },
    enabled: !!actor && !isFetching && employeeId > 0,
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
      queryClient.invalidateQueries({ queryKey: ['leaveEntries', Number(variables.employeeId)] });
      queryClient.invalidateQueries({ queryKey: ['employee', Number(variables.employeeId)] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
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
      queryClient.invalidateQueries({ queryKey: ['leaveEntries', Number(variables.employeeId)] });
      queryClient.invalidateQueries({ queryKey: ['employee', Number(variables.employeeId)] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useGetAllOpenJobRoles() {
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

export function useGetOpenJobRolesCount() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['jobRolesCount'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getOpenJobRolesCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateJobRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      location: { city: string; country: string };
      description: string;
      linkedInUrl: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      const jobRole = {
        id: BigInt(0),
        title: data.title,
        location: data.location,
        description: data.description,
        linkedInUrl: data.linkedInUrl,
        isOpen: true,
        createdAt: BigInt(Date.now()) * BigInt(1000000),
      };
      return actor.createJobRole(jobRole);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobRoles'] });
      queryClient.invalidateQueries({ queryKey: ['jobRolesCount'] });
    },
  });
}

export function useGetAllContactMessages() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactMessage[]>({
    queryKey: ['contactMessages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContactMessages();
    },
    enabled: !!actor && !isFetching,
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

// ============================================================================
// Task Management Hooks
// ============================================================================

export function useGetAllTasks() {
  const { actor, isFetching } = useActor();

  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTasks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetEmployeeTasks(employeeId: number) {
  const { actor, isFetching } = useActor();

  return useQuery<Task[]>({
    queryKey: ['employeeTasks', employeeId],
    queryFn: async () => {
      if (!actor || employeeId === 0) return [];
      try {
        return await actor.getEmployeeTasks(BigInt(employeeId));
      } catch (error) {
        console.error('Error fetching employee tasks:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && employeeId > 0,
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
      queryClient.invalidateQueries({ queryKey: ['employeeTasks'] });
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
      queryClient.invalidateQueries({ queryKey: ['employeeTasks'] });
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
      queryClient.invalidateQueries({ queryKey: ['employeeTasks'] });
    },
  });
}

// ============================================================================
// Payslip Management Hooks
// ============================================================================

export function useGetEmployeePayslips(employeeId: number) {
  const { actor, isFetching } = useActor();

  return useQuery<Payslip[]>({
    queryKey: ['employeePayslips', employeeId],
    queryFn: async () => {
      if (!actor || employeeId === 0) return [];
      try {
        return await actor.getEmployeePayslips(BigInt(employeeId));
      } catch (error) {
        console.error('Error fetching employee payslips:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && employeeId > 0,
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
      queryClient.invalidateQueries({ queryKey: ['employeePayslips'] });
    },
  });
}
