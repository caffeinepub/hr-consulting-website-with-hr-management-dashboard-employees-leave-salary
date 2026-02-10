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

export default function EmployeeForm({ employee, onSuccess }: EmployeeFormProps) {
  const [name, setName] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [baseSalary, setBaseSalary] = useState('');
  const [pfDetails, setPfDetails] = useState('');
  const [bonus, setBonus] = useState('');

  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployeeSalary();

  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setJoiningDate(new Date(Number(employee.joiningDate) / 1000000).toISOString().split('T')[0]);
      setBaseSalary(Number(employee.salary.base).toString());
      setPfDetails(employee.pfDetails);
      setBonus(Number(employee.bonus).toString());
    }
  }, [employee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !joiningDate || !baseSalary || !pfDetails.trim() || !bonus) {
      toast.error('Please fill in all fields');
      return;
    }

    const salaryNum = parseInt(baseSalary);
    const bonusNum = parseInt(bonus);

    if (isNaN(salaryNum) || salaryNum < 0) {
      toast.error('Please enter a valid base salary');
      return;
    }

    if (isNaN(bonusNum) || bonusNum < 0) {
      toast.error('Please enter a valid bonus amount');
      return;
    }

    try {
      if (employee) {
        await updateMutation.mutateAsync({
          employeeId: Number(employee.id),
          newBaseSalary: BigInt(salaryNum),
        });
        toast.success('Employee updated successfully!');
      } else {
        const joiningDateNano = BigInt(new Date(joiningDate).getTime()) * BigInt(1000000);
        await createMutation.mutateAsync({
          name,
          joiningDate: joiningDateNano,
          baseSalary: BigInt(salaryNum),
          pfDetails,
          bonus: BigInt(bonusNum),
        });
        toast.success('Employee created successfully!');
        setName('');
        setJoiningDate('');
        setBaseSalary('');
        setPfDetails('');
        setBonus('');
      }
      onSuccess?.();
    } catch (error) {
      toast.error(`Failed to ${employee ? 'update' : 'create'} employee`);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Employee Name *</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          required
          disabled={isPending || !!employee}
        />
      </div>
      <div>
        <Label htmlFor="joiningDate">Joining Date *</Label>
        <Input
          id="joiningDate"
          type="date"
          value={joiningDate}
          onChange={(e) => setJoiningDate(e.target.value)}
          required
          disabled={isPending || !!employee}
        />
      </div>
      <div>
        <Label htmlFor="baseSalary">Base Salary (₹) *</Label>
        <Input
          id="baseSalary"
          type="number"
          value={baseSalary}
          onChange={(e) => setBaseSalary(e.target.value)}
          placeholder="50000"
          required
          disabled={isPending}
          min="0"
        />
      </div>
      <div>
        <Label htmlFor="pfDetails">PF Details *</Label>
        <Input
          id="pfDetails"
          type="text"
          value={pfDetails}
          onChange={(e) => setPfDetails(e.target.value)}
          placeholder="PF Account Number"
          required
          disabled={isPending || !!employee}
        />
      </div>
      <div>
        <Label htmlFor="bonus">Bonus (₹) *</Label>
        <Input
          id="bonus"
          type="number"
          value={bonus}
          onChange={(e) => setBonus(e.target.value)}
          placeholder="5000"
          required
          disabled={isPending || !!employee}
          min="0"
        />
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {employee ? 'Updating...' : 'Creating...'}
          </>
        ) : employee ? (
          'Update Employee'
        ) : (
          'Create Employee'
        )}
      </Button>
    </form>
  );
}
