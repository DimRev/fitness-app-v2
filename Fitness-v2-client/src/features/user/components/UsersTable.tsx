import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/features/shared/components/ui/table";
import UsersTableRow from "./UsersTableRow";

function UsersTable() {
  return (
    <DashboardContentCards title="User Table">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="truncate">Name</TableHead>
              <TableHead className="truncate">Email</TableHead>
              <TableHead className="truncate">Role</TableHead>
              <TableHead className="truncate">Created At</TableHead>
              <TableHead className="truncate">Updated At</TableHead>
              <TableHead className="truncate">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <UsersTableRow />
          </TableBody>
        </Table>
      </div>
    </DashboardContentCards>
  );
}

export default UsersTable;
