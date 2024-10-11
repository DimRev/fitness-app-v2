import { Skeleton } from "~/features/shared/components/ui/skeleton";
import { TableCell, TableRow } from "~/features/shared/components/ui/table";

type Props = {
  supportTicket: SupportTicket;
  isPending: boolean;
};

function SupportTicketAdminTableRow({ supportTicket }: Props) {
  return (
    <TableRow className="h-[65px]">
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

export function SupportTicketAdminTableRowSkeleton() {
  return (
    <TableRow className="h-[65px]">
      <TableCell>
        <Skeleton className="h-[20px] w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-[20px] w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-[20px] w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-[20px] w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-[20px] w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-[20px] w-full" />
      </TableCell>
    </TableRow>
  );
}
export function SupportTicketAdminTableRowEmpty() {
  return (
    <TableRow className="h-[65px]">
      <TableCell>
        <div></div>
      </TableCell>
      <TableCell>
        <div></div>
      </TableCell>
      <TableCell>
        <div></div>
      </TableCell>
      <TableCell>
        <div></div>
      </TableCell>
      <TableCell>
        <div></div>
      </TableCell>
      <TableCell>
        <div></div>
      </TableCell>
    </TableRow>
  );
}

export default SupportTicketAdminTableRow;
