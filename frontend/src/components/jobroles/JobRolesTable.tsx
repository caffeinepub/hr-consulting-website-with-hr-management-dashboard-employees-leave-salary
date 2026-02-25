import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import type { JobRole } from '@/backend';

interface JobRolesTableProps {
  jobRoles: JobRole[];
}

export default function JobRolesTable({ jobRoles }: JobRolesTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobRoles.map((role) => (
            <TableRow key={Number(role.id)}>
              <TableCell className="font-medium">{role.title}</TableCell>
              <TableCell>
                {role.location.city}, {role.location.country}
              </TableCell>
              <TableCell>
                <Badge variant={role.isOpen ? 'default' : 'secondary'}>
                  {role.isOpen ? 'Open' : 'Closed'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <a
                    href={role.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    LinkedIn
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
