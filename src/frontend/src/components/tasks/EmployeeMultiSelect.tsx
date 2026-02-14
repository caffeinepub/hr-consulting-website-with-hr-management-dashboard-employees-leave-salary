import { useState } from 'react';
import { useGetAllEmployees } from '@/hooks/useQueries';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmployeeMultiSelectProps {
  selectedEmployeeIds: bigint[];
  onSelectionChange: (ids: bigint[]) => void;
  disabled?: boolean;
}

export default function EmployeeMultiSelect({
  selectedEmployeeIds,
  onSelectionChange,
  disabled = false,
}: EmployeeMultiSelectProps) {
  const { data: employees, isLoading } = useGetAllEmployees();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = employees?.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (employeeId: bigint) => {
    if (disabled) return;
    
    const isSelected = selectedEmployeeIds.some((id) => id === employeeId);
    if (isSelected) {
      onSelectionChange(selectedEmployeeIds.filter((id) => id !== employeeId));
    } else {
      onSelectionChange([...selectedEmployeeIds, employeeId]);
    }
  };

  const handleRemove = (employeeId: bigint) => {
    if (disabled) return;
    onSelectionChange(selectedEmployeeIds.filter((id) => id !== employeeId));
  };

  const getSelectedEmployeeNames = () => {
    if (!employees) return [];
    return selectedEmployeeIds
      .map((id) => {
        const emp = employees.find((e) => e.id === id);
        return emp ? { id, name: emp.name } : null;
      })
      .filter((item): item is { id: bigint; name: string } => item !== null);
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading employees...</div>;
  }

  const selectedNames = getSelectedEmployeeNames();

  return (
    <div className="space-y-3">
      {/* Selected Employees Display */}
      {selectedNames.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedNames.map((emp) => (
            <Badge key={emp.id.toString()} variant="secondary" className="gap-1">
              {emp.name}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemove(emp.id)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search and Selection */}
      <div className="border rounded-md">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              disabled={disabled}
            />
          </div>
        </div>
        <ScrollArea className="h-[200px]">
          <div className="p-3 space-y-2">
            {filteredEmployees && filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => {
                const isSelected = selectedEmployeeIds.some((id) => id === employee.id);
                return (
                  <div
                    key={employee.id.toString()}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent cursor-pointer"
                    onClick={() => handleToggle(employee.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggle(employee.id)}
                      disabled={disabled}
                    />
                    <label className="flex-1 cursor-pointer text-sm">
                      {employee.name}
                    </label>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                {searchQuery ? 'No employees found' : 'No employees available'}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
