import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateEmployee, useUpdateEmployeeSalary } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { Employee } from '@/backend';

interface EmployeeFormProps {
  employee?: Employee;
  onSuccess?: () => void;
}

interface FormErrors {
  name?: string;
  jobTitle?: string;
  department?: string;
  email?: string;
  joiningDate?: string;
  baseSalary?: string;
}

export default function EmployeeForm({ employee, onSuccess }: EmployeeFormProps) {
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [baseSalary, setBaseSalary] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployeeSalary();

  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setJobTitle(employee.jobTitle);
      setDepartment(employee.department);
      setEmail(employee.email);
      setJoiningDate(new Date(Number(employee.joiningDate) / 1000000).toISOString().split('T')[0]);
      setBaseSalary(Number(employee.salary.base).toString());
    }
  }, [employee]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) newErrors.name = 'Employee name is required';
    if (!employee) {
      if (!jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
      if (!department.trim()) newErrors.department = 'Department is required';
      if (!email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!joiningDate) newErrors.joiningDate = 'Joining date is required';
    }
    if (!baseSalary) {
      newErrors.baseSalary = 'Base salary is required';
    } else {
      const salaryNum = parseInt(baseSalary);
      if (isNaN(salaryNum) || salaryNum <= 0) {
        newErrors.baseSalary = 'Please enter a valid salary greater than zero';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const salaryNum = parseInt(baseSalary);

    try {
      if (employee) {
        await updateMutation.mutateAsync({
          employeeId: employee.id,
          newBaseSalary: BigInt(salaryNum),
        });
        toast.success('Employee salary updated successfully!');
      } else {
        const joiningDateNano = BigInt(new Date(joiningDate).getTime()) * BigInt(1000000);
        const pfDeduction = Math.round(salaryNum * 0.12);
        const salary = {
          base: BigInt(salaryNum),
          pfDeduction: BigInt(pfDeduction),
          bonus: BigInt(0),
          finalPayable: BigInt(salaryNum - pfDeduction),
        };

        await createMutation.mutateAsync({
          name: name.trim(),
          jobTitle: jobTitle.trim(),
          department: department.trim(),
          email: email.trim(),
          joiningDate: joiningDateNano,
          salary,
        });
        toast.success('Employee created successfully!');
        // Reset form fields after successful creation
        setName('');
        setJobTitle('');
        setDepartment('');
        setEmail('');
        setJoiningDate('');
        setBaseSalary('');
        setErrors({});
      }
      // Call onSuccess callback to close dialog and refresh list
      onSuccess?.();
    } catch (error: any) {
      console.error('Employee operation error:', error);
      toast.error(`Failed to ${employee ? 'update' : 'create'} employee: ${error.message || 'Unknown error'}`);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div className="space-y-1">
        <Label htmlFor="name">Employee Name *</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: undefined })); }}
          placeholder="Full name"
          disabled={isPending || !!employee}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      {/* Job Title - only for new employees */}
      {!employee && (
        <div className="space-y-1">
          <Label htmlFor="jobTitle">Job Title *</Label>
          <Input
            id="jobTitle"
            type="text"
            value={jobTitle}
            onChange={(e) => { setJobTitle(e.target.value); setErrors(prev => ({ ...prev, jobTitle: undefined })); }}
            placeholder="e.g. Software Engineer"
            disabled={isPending}
          />
          {errors.jobTitle && <p className="text-xs text-destructive">{errors.jobTitle}</p>}
        </div>
      )}

      {/* Department - only for new employees */}
      {!employee && (
        <div className="space-y-1">
          <Label htmlFor="department">Department *</Label>
          <Input
            id="department"
            type="text"
            value={department}
            onChange={(e) => { setDepartment(e.target.value); setErrors(prev => ({ ...prev, department: undefined })); }}
            placeholder="e.g. Engineering"
            disabled={isPending}
          />
          {errors.department && <p className="text-xs text-destructive">{errors.department}</p>}
        </div>
      )}

      {/* Email - only for new employees */}
      {!employee && (
        <div className="space-y-1">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
            placeholder="employee@company.com"
            disabled={isPending}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
      )}

      {/* Joining Date - only for new employees */}
      {!employee && (
        <div className="space-y-1">
          <Label htmlFor="joiningDate">Joining Date *</Label>
          <Input
            id="joiningDate"
            type="date"
            value={joiningDate}
            onChange={(e) => { setJoiningDate(e.target.value); setErrors(prev => ({ ...prev, joiningDate: undefined })); }}
            disabled={isPending}
          />
          {errors.joiningDate && <p className="text-xs text-destructive">{errors.joiningDate}</p>}
        </div>
      )}

      {/* Base Salary */}
      <div className="space-y-1">
        <Label htmlFor="baseSalary">Base Salary (₹) *</Label>
        <Input
          id="baseSalary"
          type="number"
          value={baseSalary}
          onChange={(e) => { setBaseSalary(e.target.value); setErrors(prev => ({ ...prev, baseSalary: undefined })); }}
          placeholder="50000"
          disabled={isPending}
          min="1"
        />
        {errors.baseSalary && <p className="text-xs text-destructive">{errors.baseSalary}</p>}
        {!employee && baseSalary && parseInt(baseSalary) > 0 && (
          <p className="text-xs text-muted-foreground">
            PF deduction (12%): ₹{Math.round(parseInt(baseSalary) * 0.12).toLocaleString('en-IN')}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {employee ? 'Updating...' : 'Creating...'}
          </>
        ) : employee ? (
          'Update Salary'
        ) : (
          'Create Employee'
        )}
      </Button>
    </form>
  );
}
