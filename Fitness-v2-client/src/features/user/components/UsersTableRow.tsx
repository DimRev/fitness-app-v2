import { Button } from "~/features/shared/components/ui/button";
import { TableCell, TableRow } from "~/features/shared/components/ui/table";

type Props = {
  user: User;
};

function UsersTableRow({ user }: Props) {
  return (
    <TableRow>
      <TableCell>{user.username}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.role}</TableCell>
      <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
      <TableCell>{new Date(user.updated_at).toLocaleString()}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button variant="ghost">Edit</Button>
          <Button variant="ghost">Delete</Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default UsersTableRow;
