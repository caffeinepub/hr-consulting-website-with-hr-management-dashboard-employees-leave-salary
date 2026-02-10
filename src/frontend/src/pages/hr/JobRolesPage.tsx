import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGetAllOpenJobRoles } from '@/hooks/useQueries';
import JobRoleForm from '@/components/jobroles/JobRoleForm';
import JobRolesTable from '@/components/jobroles/JobRolesTable';
import { Plus, Briefcase } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function JobRolesPage() {
  const { data: jobRoles, isLoading } = useGetAllOpenJobRoles();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Job Roles</h2>
          <p className="text-muted-foreground">Manage recruitment and job postings</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Job Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Job Role</DialogTitle>
            </DialogHeader>
            <JobRoleForm onSuccess={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Job Postings</CardTitle>
          <CardDescription>
            Manage job roles and LinkedIn integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : jobRoles && jobRoles.length > 0 ? (
            <JobRolesTable jobRoles={jobRoles} />
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Job Roles</h3>
              <p className="text-muted-foreground mb-4">
                Create your first job role to start recruiting.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
