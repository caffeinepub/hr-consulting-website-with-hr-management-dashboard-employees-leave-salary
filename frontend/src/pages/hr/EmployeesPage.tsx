import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAllEmployees } from '@/hooks/useQueries';
import EmployeesTable from '@/components/employees/EmployeesTable';
import EmployeeForm from '@/components/employees/EmployeeForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function EmployeesPage() {
  const { data: employees, isLoading } = useGetAllEmployees();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredEmployees = employees?.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Employees</h2>
          <p className="text-sm text-muted-foreground">Manage employee records and information</p>
        </div>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="w-full sm:w-auto shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create employee
        </Button>
      </div>

      {/* Main Content Card */}
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>
            Search and manage all employee records
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Section */}
          <div className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search employees by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Table Section */}
          <div className="w-full">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <EmployeesTable employees={filteredEmployees || []} />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Employee Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col gap-0 p-0">
          <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 shrink-0 border-b">
            <DialogTitle>Create New Employee</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 px-4 sm:px-6 py-4">
            <EmployeeForm onSuccess={() => setIsCreateDialogOpen(false)} />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
