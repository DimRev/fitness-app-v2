import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import useCreateFoodItemPending from "../useCreateFoodItemPending";

const sendSocketGroupMessageMock = vi.fn();

vi.mock("~/features/socket/hooks/useSocket", () => {
  return {
    default: () => ({
      sendSocketGroupMessage: sendSocketGroupMessageMock,
    }),
  };
});

describe("useCreateFoodItemPending", () => {
  const createTestQueryClient = () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    });

  afterEach(() => {
    sendSocketGroupMessageMock.mockClear();
  });

  test("successful create food item pending", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result: useCreateFoodItemPendingResult } = renderHook(
      () => useCreateFoodItemPending(),
      { wrapper },
    );

    try {
      await act(async () => {
        const mutationPromise =
          useCreateFoodItemPendingResult.current.mutateAsync({
            name: "test food item pending 5",
            description: "test description 5",
            image_url: undefined,
            food_type: "protein",
            calories: "5000",
            fat: "5000",
            protein: "5000",
            carbs: "5000",
          });

        await mutationPromise;
      });

      await waitFor(() =>
        expect(useCreateFoodItemPendingResult.current.isSuccess).toBe(true),
      );

      expect(useCreateFoodItemPendingResult.current.data).toEqual({
        id: "5",
        name: "test food item pending 5",
        description: "test description 5",
        image_url: undefined,
        food_type: "protein",
        calories: "5000",
        fat: "5000",
        protein: "5000",
        carbs: "5000",
        likes: 0,
        liked: false,
        author_name: "test",
      });
    } catch (err) {}
  });
});
