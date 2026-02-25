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
import { Eye, ListTodo, DollarSign, FileText } from 'lucide-react';
import type { Employee } from '@/backend';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface EmployeesTableProps {
  employees: Employee[];
}

export default function EmployeesTable({ employees }: EmployeesTableProps) {
  const navigate = useNavigate();

  if (employees.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No employees found
      </div>
    );
  }

  return (
    <div className="w-full rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-[640px]">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px] max-w-[250px]">Name</TableHead>
              <TableHead className="min-w-[120px]">Joining Date</TableHead>
              <TableHead className="min-w-[120px]">Base Salary</TableHead>
              <TableHead className="min-w-[120px]">Leave Balance</TableHead>
              <TableHead className="text-right min-w-[200px] whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={Number(employee.id)}>
                <TableCell className="font-medium break-words max-w-[250px]">
                  {employee.name}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatDate(Number(employee.joiningDate))}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatCurrency(Number(employee.salary.base))}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {Number(employee.leaveBalance)} days
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        navigate({ to: '/hr/employees/$employeeId', params: { employeeId: String(employee.id) } })
                      }
                      className="shrink-0"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        navigate({ to: '/hr/employees/$employeeId/tasks', params: { employeeId: String(employee.id) } })
                      }
                      className="shrink-0"
                      title="Tasks"
                    >
                      <ListTodo className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        navigate({ to: '/hr/employees/$employeeId/salary', params: { employeeId: String(employee.id) } })
                      }
                      className="shrink-0"
                      title="Salary"
                    >
                      <DollarSign className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        navigate({ to: '/hr/employees/$employeeId/payslips', params: { employeeId: String(employee.id) } })
                      }
                      className="shrink-0"
                      title="Payslips"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
