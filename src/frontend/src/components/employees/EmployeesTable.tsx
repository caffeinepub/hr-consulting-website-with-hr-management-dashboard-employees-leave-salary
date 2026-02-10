import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Eye } from 'lucide-react';
import type { Employee } from '@/backend';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface EmployeesTableProps {
  employees: Employee[];
}

export default function EmployeesTable({ employees }: EmployeesTableProps) {
  const navigate = useNavigate();

  if (employees.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No employees found
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Joining Date</TableHead>
            <TableHead>Base Salary</TableHead>
            <TableHead>Leave Balance</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={Number(employee.id)}>
              <TableCell className="font-medium">{employee.name}</TableCell>
              <TableCell>{formatDate(Number(employee.joiningDate))}</TableCell>
              <TableCell>{formatCurrency(Number(employee.salary.base))}</TableCell>
              <TableCell>{Number(employee.leaveBalance)} days</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    navigate({ to: '/hr/employees/$employeeId', params: { employeeId: String(employee.id) } })
                  }
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
