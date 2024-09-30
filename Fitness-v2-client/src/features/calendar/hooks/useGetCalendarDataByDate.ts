import useGetQuery from "~/features/shared/hooks/useGetQuery";
import { QUERY_KEYS } from "~/lib/reactQuery";

type GetCalendarDataByDateRequestBody = {
  date?: Date;
};

interface ErrorResponseBody extends Error {
  message: string;
}

function useGetCalendarDataByDate(params: GetCalendarDataByDateRequestBody) {
  return useGetQuery<
    GetCalendarDataByDateRequestBody,
    CalendarData,
    ErrorResponseBody
  >(
    params,
    QUERY_KEYS.CALENDAR_DATA.GET_CALENDAR_DATA_BY_DATE,
    "/calendar",
    false,
  );
}

export default useGetCalendarDataByDate;
