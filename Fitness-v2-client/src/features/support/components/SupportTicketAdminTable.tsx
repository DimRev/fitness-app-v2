import { useMemo, useState } from "react";
import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import ListPaginationButtons from "~/features/shared/components/ListPaginationButtons";
import { useGetSupportTickets } from "../hooks/useGetSupportTickets";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/features/shared/components/ui/table";
import SupportTicketAdminTableRow from "./SupportTicketAdminTableRow";

function SupportTicketAdminTable() {
  const [page, setPage] = useState(1);
  // TODO: Make dynamic page size changes
  const [pageSize] = useState(8);
  const offset = useMemo(() => page * pageSize - pageSize, [page, pageSize]);
  const [pendingIds, setPendingIds] = useState<string[]>([]);

  const {
    data: supportTickets,
    isLoading: supportTicketsLoading,
    isError: isSupportTicketsError,
    error: supportTicketsError,
  } = useGetSupportTickets({
    limit: pageSize,
    offset,
  });

  function onChangePage(type: "next" | "prev") {
    if (
      type === "next" &&
      supportTickets?.total_pages &&
      page < supportTickets.total_pages
    ) {
      setPage((prev) => prev + 1);
    }
    if (type === "prev" && supportTickets?.total_pages && page > 1) {
      setPage((prev) => prev - 1);
    }
  }

  if (supportTicketsLoading) {
    return <div>Loading...</div>;
  }

  if (isSupportTicketsError || !supportTickets?.support_tickets) {
    return (
      <div> Error loading support tickets, {supportTicketsError?.message}</div>
    );
  }

  console.log(supportTickets);

  return (
    <DashboardContentCards title="Support Tickets">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="truncate">Title</TableHead>
              <TableHead className="truncate">Type</TableHead>
              <TableHead className="truncate">Description</TableHead>
              <TableHead className="truncate">Created At</TableHead>
              <TableHead className="truncate">Author</TableHead>
              <TableHead className="truncate">Handler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {supportTickets.support_tickets.map((supportTicket) => (
              <SupportTicketAdminTableRow
                key={supportTicket.id}
                isPending={pendingIds.includes(supportTicket.id)}
                supportTicket={supportTicket}
              />
            ))}
            {/* {new Array(pageSize - supportTickets.support_tickets.length)
              .fill(null)
              .map((_, i) => (
                <FoodItemAdminTableRowEmpty key={`empty-${i}`} />
              ))} */}
          </TableBody>
        </Table>
      </div>
      <ListPaginationButtons
        page={page}
        onChangePage={onChangePage}
        totalPages={supportTickets?.total_pages}
      />
    </DashboardContentCards>
  );
}

export default SupportTicketAdminTable;
