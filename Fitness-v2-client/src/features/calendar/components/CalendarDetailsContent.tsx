import { DashboardContentCards } from "~/features/shared/components/CustomCards";

type Props = {
  dateStr: string;
};

function CalendarDetailsContent({ dateStr }: Props) {
  return (
    <DashboardContentCards
      title={`Calendar Details - ${new Date(dateStr).toLocaleDateString(
        "en-US",
        {
          dateStyle: "long",
        },
      )}`}
    >
      CalendarDetailsContent
    </DashboardContentCards>
  );
}

export default CalendarDetailsContent;
