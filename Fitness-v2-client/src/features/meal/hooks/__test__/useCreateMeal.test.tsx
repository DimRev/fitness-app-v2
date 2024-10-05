import { QueryClient, QueryClientProvider } from "react-query";
import useCreateMeal from "../useCreateMeal";
import { act, renderHook, waitFor } from "@testing-library/react";

const sendSocketGroupMessageMock = vi.fn();

vi.mock("~/features/socket/hooks/useSocket", () => {
  return {
    default: () => ({
      sendSocketGroupMessage: sendSocketGroupMessageMock,
    }),
  };
});

describe("useCreateMeal", () => {
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

  test("successful create meal", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result: useCreateMealResult } = renderHook(() => useCreateMeal(), {
      wrapper,
    });

    try {
      await act(async () => {
        const mutationPromise = useCreateMealResult.current.mutateAsync({
          name: "test meal 5",
          description: "test description 5",
          image_url: null,
          food_items: [
            {
              food_item_id: "1",
              amount: 1,
            },
          ],
        });

        await mutationPromise;
      });

      await waitFor(() =>
        expect(useCreateMealResult.current.isSuccess).toBe(true),
      );

      expect(useCreateMealResult.current.data).toEqual({
        meal: {
          id: "5",
          name: "test meal 5",
          description: "test description 5",
          image_url: undefined,
          created_at: "2024-01-05T00:00:00.000Z",
          updated_at: "2024-01-05T00:00:00.000Z",
        },
        food_items: [
          {
            id: "1",
            name: "test food item 1",
            description: "test description 1",
            image_url: undefined,
            food_type: "protein",
            calories: "1000",
            fat: "1000",
            protein: "1000",
            carbs: "1000",
          },
        ],
      });
    } catch (err) {}
  });
});
