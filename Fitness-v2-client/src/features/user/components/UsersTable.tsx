import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/features/shared/components/ui/table";
import UsersTableRow from "./UsersTableRow";
import { useMemo, useState } from "react";
import useGetUsers from "../hooks/useGetUsers";

function UsersTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const offset = useMemo(() => page * pageSize - pageSize, [page, pageSize]);

  const {
    data: usersWithPages,
    error: usersWithPagesError,
    isLoading: isUsersWithPagesLoading,
    isError: isUsersWithPagesError,
  } = useGetUsers({
    limit: pageSize,
    offset,
  });

  if (isUsersWithPagesLoading) {
    return <div>Loading...</div>;
  }

  if (isUsersWithPagesError && usersWithPagesError) {
    return <div>{usersWithPagesError.message}</div>;
  }

  if (!usersWithPages?.users) {
    return <div>No users found</div>;
  }

  return (
    <DashboardContentCards title="User Table">
      <div className="border rounded-md">
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
            {usersWithPages.users.map((user) => (
              <UsersTableRow key={user.id} user={user} />
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardContentCards>
  );
}

export default UsersTable;
