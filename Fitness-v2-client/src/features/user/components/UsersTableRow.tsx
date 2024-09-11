import { Button } from "~/features/shared/components/ui/button";
import { Skeleton } from "~/features/shared/components/ui/skeleton";
import { TableCell, TableRow } from "~/features/shared/components/ui/table";

type Props = {
  user: User;
  onOpenEditUser: (user: User) => void;
};

function UsersTableRow({ user, onOpenEditUser }: Props) {
  return (
    <TableRow>
      <TableCell className="py-2">{user.username}</TableCell>
      <TableCell className="py-2">{user.email}</TableCell>
      <TableCell className="py-2">{user.role}</TableCell>
      <TableCell className="py-2">
        {new Date(user.created_at).toLocaleString()}
      </TableCell>
      <TableCell className="py-2">
        {new Date(user.updated_at).toLocaleString()}
      </TableCell>
      <TableCell className="py-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => onOpenEditUser(user)}>
            Edit
          </Button>
          <Button variant="ghost">Delete</Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function UsersTableRowEmpty() {
  return (
    <TableRow>
      <TableCell>
        <div className="py-[12px]"></div>
      </TableCell>
      <TableCell>
        <div className="py-[12px]"></div>
      </TableCell>
      <TableCell>
        <div className="py-[12px]"></div>
      </TableCell>
      <TableCell>
        <div className="py-[12px]"></div>
      </TableCell>
      <TableCell>
        <div className="py-[12px]"></div>
      </TableCell>
      <TableCell>
        <div className="py-[12px]"></div>
      </TableCell>
    </TableRow>
  );
}

export function UsersTableRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-[24px] w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-[24px] w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-[24px] w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-[24px] w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-[24px] w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-[24px] w-full" />
      </TableCell>
    </TableRow>
  );
}

export default UsersTableRow;
