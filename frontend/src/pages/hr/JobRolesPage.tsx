import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGetAllJobRoles } from '@/hooks/useQueries';
import JobRoleForm from '@/components/jobroles/JobRoleForm';
import JobRolesTable from '@/components/jobroles/JobRolesTable';
import { Plus, Briefcase } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function JobRolesPage() {
  const { data: jobRoles, isLoading } = useGetAllJobRoles();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Job Roles</h2>
        <p className="text-muted-foreground">Manage job postings and recruitment</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Open Positions</CardTitle>
              <CardDescription>Create and manage job role listings</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Job Role
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Job Role</DialogTitle>
                </DialogHeader>
                <JobRoleForm onSuccess={() => setDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : jobRoles && jobRoles.length > 0 ? (
            <JobRolesTable jobRoles={jobRoles} />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No job roles found</p>
              <p className="text-sm mt-2">Create your first job role to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
