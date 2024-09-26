import axios from "axios";
import { useEffect } from "react";
import { useQuery } from "react-query";
import useSocket from "~/features/socket/hooks/useSocket";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS, USE_QUERY_DEFAULT_OPTIONS } from "~/lib/reactQuery";

type GetCalendarDataByDateRequestBody = {
  date?: Date;
};

type ErrorResponseBody = {
  message: string;
};

function useGetCalendarDataByDate(params: GetCalendarDataByDateRequestBody) {
  const { joinSocketGroup, leaveSocketGroup } = useSocket();
  useEffect(() => {
    void joinSocketGroup(QUERY_KEYS.CALENDAR_DATA.GET_CALENDAR_DATA_BY_DATE);
    return () => {
      void leaveSocketGroup(QUERY_KEYS.CALENDAR_DATA.GET_CALENDAR_DATA_BY_DATE);
    };
  }, [joinSocketGroup, leaveSocketGroup]);

  return useQuery<CalendarData, Error>({
    ...USE_QUERY_DEFAULT_OPTIONS,
    queryKey: [
      QUERY_KEYS.CALENDAR_DATA.GET_CALENDAR_DATA_BY_DATE,
      {
        ts: params.date,
      },
    ],

    queryFn: () => GetCalendarDataByDatePending(params),
    enabled: !!params,
  });
}

async function GetCalendarDataByDatePending({
  date,
}: GetCalendarDataByDateRequestBody): Promise<CalendarData> {
  try {
    if (!date)
      return {
        meals: [],
        total_calories: 0,
        total_fat: 0,
        total_protein: 0,
        total_carbs: 0,
      };
    const response = await axiosInstance.get<CalendarData>(`/calendar`, {
      params: { date },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errResponse = error.response.data as ErrorResponseBody;
      console.error(`${error.response.status} | ${errResponse.message}`);
      throw new Error(errResponse.message);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
}

export default useGetCalendarDataByDate;
