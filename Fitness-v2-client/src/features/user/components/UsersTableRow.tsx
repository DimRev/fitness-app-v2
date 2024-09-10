import { TableCell, TableRow } from "~/features/shared/components/ui/table";

function UsersTableRow() {
  return (
    <TableRow>
      <TableCell>DimaR</TableCell>
      <TableCell>dimrev444@gamil.com</TableCell>
      <TableCell>admin</TableCell>
      <TableCell>{new Date().toLocaleString()}</TableCell>
      <TableCell>{new Date().toLocaleString()}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div>Edit</div>
          <div>Delete</div>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default UsersTableRow;
