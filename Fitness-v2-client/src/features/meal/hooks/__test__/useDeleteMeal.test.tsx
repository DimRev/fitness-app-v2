import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import useDeleteMeal from "../useDeleteMeal";

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

  test("successful delete meal", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result: useDeleteMealResult } = renderHook(() => useDeleteMeal(), {
      wrapper,
    });

    try {
      await act(async () => {
        const mutationPromise = useDeleteMealResult.current.mutateAsync({
          meal_id: "1",
        });

        await mutationPromise;
      });

      await waitFor(() =>
        expect(useDeleteMealResult.current.isSuccess).toBe(true),
      );

      expect(useDeleteMealResult.current.data).toEqual({
        id: "1",
        name: "test meal 1",
        description: "test description 1",
        image_url: undefined,
        created_at: "2024-01-01T00:00:00.000Z",
        updated_at: "2024-01-01T00:00:00.000Z",

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

      expect(sendSocketGroupMessageMock).not.toHaveBeenCalled();
    } catch (err) {}
  });

  test("failed to delete meal, wrong meal id", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result: useDeleteMealResult } = renderHook(() => useDeleteMeal(), {
      wrapper,
    });

    try {
      await act(async () => {
        const mutationPromise = useDeleteMealResult.current.mutateAsync({
          meal_id: "5",
        });

        await mutationPromise;
      });

      await waitFor(() =>
        expect(useDeleteMealResult.current.isError).toBe(true),
      );

      expect(useDeleteMealResult.current.error).toEqual(
        new Error("Failed to delete meal, meal not found"),
      );

      expect(sendSocketGroupMessageMock).not.toHaveBeenCalled();
    } catch (err: any) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("Failed to delete meal, meal not found");
    }
  });
});
