import { useMemo, useState } from "react";
import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import ListPaginationButtons from "~/features/shared/components/ListPaginationButtons";
import { Button } from "~/features/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/features/shared/components/ui/dialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/features/shared/components/ui/table";
import useGetUsers from "../hooks/useGetUsers";
import UsersTableRow, {
  UsersTableRowEmpty,
  UsersTableRowSkeleton,
} from "./UsersTableRow";

function UsersTable() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [isOpenUserEditDialog, setIsOpenUserEditDialog] = useState(false);
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

  function onChangePage(type: "next" | "prev") {
    if (
      type === "next" &&
      usersWithPages?.total_pages &&
      page < usersWithPages.total_pages
    ) {
      setPage((prev) => prev + 1);
    }
    if (type === "prev" && usersWithPages?.total_pages && page > 1) {
      setPage((prev) => prev - 1);
    }
  }

  function onOpenEditUser(user: User) {
    console.log(user);
    setIsOpenUserEditDialog(true);
  }

  if (isUsersWithPagesLoading) {
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
              <UsersTableRowSkeleton />
              <UsersTableRowSkeleton />
              <UsersTableRowSkeleton />
              <UsersTableRowSkeleton />
              <UsersTableRowSkeleton />
              <UsersTableRowSkeleton />
              <UsersTableRowSkeleton />
              <UsersTableRowSkeleton />
            </TableBody>
          </Table>
        </div>
        <Dialog
          open={isOpenUserEditDialog}
          onOpenChange={setIsOpenUserEditDialog}
        >
          <DialogTrigger>
            <Button>Add User</Button>
          </DialogTrigger>
          <DialogContent>
            <div>Add User</div>
          </DialogContent>
        </Dialog>
        <ListPaginationButtons
          page={page}
          onChangePage={onChangePage}
          totalPages={usersWithPages}
        />
      </DashboardContentCards>
    );
  }

  if (isUsersWithPagesError && usersWithPagesError) {
    return (
      <DashboardContentCards title="User Table">
        {usersWithPagesError.message}
      </DashboardContentCards>
    );
  }

  if (!usersWithPages?.users) {
    return <div>No users found</div>;
  }

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
            {usersWithPages.users.map((user) => (
              <UsersTableRow
                key={user.id}
                user={user}
                onOpenEditUser={onOpenEditUser}
              />
            ))}
            {new Array(pageSize - usersWithPages.users.length)
              .fill("")
              .map((_, idx) => (
                <UsersTableRowEmpty key={idx} />
              ))}
          </TableBody>
        </Table>
      </div>
      <Dialog>
        <DialogTrigger>
          <Button>Add User</Button>
        </DialogTrigger>
        <DialogContent>
          <div>Add User</div>
        </DialogContent>
      </Dialog>
      <ListPaginationButtons
        page={page}
        onChangePage={onChangePage}
        totalPages={usersWithPages.total_pages}
      />
    </DashboardContentCards>
  );
}

export default UsersTable;
