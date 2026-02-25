import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCreateTask, useUpdateTask } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { Task } from '@/backend';
import { TaskPriority } from '@/backend';
import EmployeeMultiSelect from './EmployeeMultiSelect';
import { Switch } from '@/components/ui/switch';

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  onSuccess?: () => void;
}

export default function TaskFormDialog({ open, onOpenChange, task, onSuccess }: TaskFormDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<bigint[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(new Date(Number(task.dueDate) / 1000000).toISOString().split('T')[0]);
      
      // Extract priority from TaskPriority enum value
      const priorityValue = task.priority as unknown as string;
      if (priorityValue === TaskPriority.high || priorityValue === 'high') {
        setPriority('high');
      } else if (priorityValue === TaskPriority.medium || priorityValue === 'medium') {
        setPriority('medium');
      } else {
        setPriority('low');
      }
      
      setSelectedEmployeeIds(task.assignedTo);
      setIsComplete(task.isComplete);
    } else {
      // Reset form for new task
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setSelectedEmployeeIds([]);
      setIsComplete(false);
    }
  }, [task, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !dueDate || selectedEmployeeIds.length === 0) {
      toast.error('Please fill in all required fields and assign at least one employee');
      return;
    }

    try {
      const dueDateNano = BigInt(new Date(dueDate).getTime()) * BigInt(1000000);
      
      // Convert priority string to TaskPriority enum
      const priorityEnum = priority === 'high' 
        ? TaskPriority.high 
        : priority === 'medium' 
        ? TaskPriority.medium 
        : TaskPriority.low;

      if (task) {
        await updateMutation.mutateAsync({
          taskId: task.id,
          update: {
            title,
            description,
            dueDate: dueDateNano,
            priority: priorityEnum,
            assignedTo: selectedEmployeeIds,
            isComplete,
          },
        });
        toast.success('Task updated successfully');
      } else {
        await createMutation.mutateAsync({
          title,
          description,
          dueDate: dueDateNano,
          priority: priorityEnum,
          assignedTo: selectedEmployeeIds,
        });
        toast.success('Task created successfully');
      }
      onSuccess?.();
    } catch (error) {
      toast.error(`Failed to ${task ? 'update' : 'create'} task`);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col gap-0 p-0">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 shrink-0 border-b">
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-4 sm:px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
                disabled={isPending}
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                required
                disabled={isPending}
                rows={4}
                className="resize-none"
              />
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                disabled={isPending}
              />
            </div>

            <div>
              <Label htmlFor="priority">Priority *</Label>
              <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)} disabled={isPending}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Assign to Employees *</Label>
              <EmployeeMultiSelect
                selectedEmployeeIds={selectedEmployeeIds}
                onSelectionChange={setSelectedEmployeeIds}
                disabled={isPending}
              />
            </div>

            {task && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="isComplete"
                  checked={isComplete}
                  onCheckedChange={setIsComplete}
                  disabled={isPending}
                />
                <Label htmlFor="isComplete" className="cursor-pointer">
                  Mark as complete
                </Label>
              </div>
            )}

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {task ? 'Updating...' : 'Creating...'}
                </>
              ) : task ? (
                'Update Task'
              ) : (
                'Create Task'
              )}
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
