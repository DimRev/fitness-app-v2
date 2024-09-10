import { Button } from "~/features/shared/components/ui/button";
import { Skeleton } from "~/features/shared/components/ui/skeleton";
import { TableCell, TableRow } from "~/features/shared/components/ui/table";

type Props = {
  user: User;
};

function UsersTableRow({ user }: Props) {
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
          <Button variant="ghost">Edit</Button>
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
        <Skeleton className="w-full h-[24px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-[24px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-[24px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-[24px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-[24px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-[24px]" />
      </TableCell>
    </TableRow>
  );
}

export default UsersTableRow;
