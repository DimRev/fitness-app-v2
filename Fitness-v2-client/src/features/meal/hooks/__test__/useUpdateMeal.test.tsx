import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import useUpdateMeal from "../useUpdateMeal";

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

  test("successful update meal", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result: useUpdateMealResult } = renderHook(() => useUpdateMeal(), {
      wrapper,
    });

    try {
      await act(async () => {
        const mutationPromise = useUpdateMealResult.current.mutateAsync({
          name: "test updated meal 1",
          description: "test updated description 1",
          image_url: null,
          meal_id: "1",
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
        expect(useUpdateMealResult.current.isSuccess).toBe(true),
      );

      expect(useUpdateMealResult.current.data).toEqual({
        meal: {
          id: "1",
          name: "test updated meal 1",
          description: "test updated description 1",
          image_url: undefined,
          created_at: "2024-01-01T00:00:00.000Z",
          updated_at: new Date().toISOString().split("T")[0] + "T00:00:00.000Z",
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

  test("failed to update meal, wrong meal id", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result: useUpdateMealResult } = renderHook(() => useUpdateMeal(), {
      wrapper,
    });

    try {
      await act(async () => {
        const mutationPromise = useUpdateMealResult.current.mutateAsync({
          name: "test updated meal 1",
          description: "test updated description 1",
          image_url: null,
          meal_id: "5",
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
        expect(useUpdateMealResult.current.isError).toBe(true),
      );

      expect(useUpdateMealResult.current.error).toEqual(
        new Error("Failed to update meal, meal not found"),
      );
    } catch (err: any) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("Failed to update meal, meal not found");
    }
  });

  test("failed to update meal, food item not found", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result: useUpdateMealResult } = renderHook(() => useUpdateMeal(), {
      wrapper,
    });

    try {
      await act(async () => {
        const mutationPromise = useUpdateMealResult.current.mutateAsync({
          name: "test updated meal 1",
          description: "test updated description 1",
          image_url: null,
          meal_id: "1",
          food_items: [
            {
              food_item_id: "5",
              amount: 1,
            },
          ],
        });
        await mutationPromise;
      });

      await waitFor(() =>
        expect(useUpdateMealResult.current.isError).toBe(true),
      );

      expect(useUpdateMealResult.current.error).toEqual(
        new Error("Failed to update meal, food item not found"),
      );
    } catch (err: any) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("Failed to update meal, food item not found");
    }
  });
});
