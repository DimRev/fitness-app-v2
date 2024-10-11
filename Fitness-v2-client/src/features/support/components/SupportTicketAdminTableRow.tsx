import { TableCell, TableRow } from "~/features/shared/components/ui/table";

type Props = {
  supportTicket: SupportTicket;
  isPending: boolean;
};

function SupportTicketAdminTableRow({ supportTicket, isPending }: Props) {
  return (
    <TableRow>
      <TableCell className="truncate">{supportTicket.title}</TableCell>
      <TableCell className="truncate">{supportTicket.support_type}</TableCell>
      <TableCell className="truncate">{supportTicket.description}</TableCell>
      <TableCell className="truncate">
        {new Date(supportTicket.created_at).toLocaleString()}
      </TableCell>
      <TableCell className="truncate">{supportTicket.author}</TableCell>
      <TableCell className="truncate">
        {supportTicket.handler ?? "Unassigned"}
      </TableCell>
    </TableRow>
  );
}

export default SupportTicketAdminTableRow;
