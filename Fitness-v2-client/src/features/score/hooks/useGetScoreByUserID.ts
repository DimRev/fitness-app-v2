import useGetQuery from "~/features/shared/hooks/useGetQuery";
import { QUERY_KEYS } from "~/lib/reactQuery";

interface ErrorResponseBody extends Error {
  message: string;
}

export function useGetScoreByUserID() {
  return useGetQuery<void, Score, ErrorResponseBody>(
    undefined,
    QUERY_KEYS.SCORE.GET_SCORE_BY_USER_ID,
    "/score",
  );
}
