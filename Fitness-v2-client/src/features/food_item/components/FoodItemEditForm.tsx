import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/features/shared/components/ui/form";
import { Input } from "~/features/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/features/shared/components/ui/select";
import { Textarea } from "~/features/shared/components/ui/textarea";
import FoodItemImageInput from "~/features/upload/components/FoodItemImageInput";
import {
  foodItemFormSchema,
  foodTypes,
  type FoodItemFormSchema,
} from "../foodItem.schema";
import useGetFoodItemsByID from "../hooks/useGetFoodItemByID";
import { Button } from "~/features/shared/components/ui/button";
import useUpdateFoodItem from "../hooks/useUpdateFoodItem";
import { toast } from "sonner";

type Props = {
  foodItemId: string;
};

function FoodItemEditForm({ foodItemId }: Props) {
  const {
    data: foodItem,
    isLoading: isLoadingFoodItem,
    isError: isGetFoodItemError,
    error: getFoodItemError,
  } = useGetFoodItemsByID({
    food_item_id: foodItemId,
  });

  const {
    mutateAsync: updateFoodItem,
    isLoading: isPending,
    isError,
    error,
  } = useUpdateFoodItem();

  const navigate = useNavigate();

  const inputFileRef = useRef<{
    triggerSubmit: () => Promise<string | null> | undefined;
  }>(null);

  const form = useForm<FoodItemFormSchema>({
    resolver: zodResolver(foodItemFormSchema),
    defaultValues: {
      name: "",
      description: "",
      image_url: "",
      food_type: "fruit",
      calories: "0",
      fat: "0",
      protein: "0",
      carbs: "0",
    },
  });

  useEffect(() => {
    if (foodItem) {
      form.reset({
        name: foodItem.name,
        description: foodItem.description,
        image_url: foodItem.image_url,
        food_type: foodItem.food_type,
        calories: foodItem.calories,
        fat: foodItem.fat,
        protein: foodItem.protein,
        carbs: foodItem.carbs,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foodItem]);

  async function onSubmit(data: FoodItemFormSchema) {
    if (inputFileRef.current) {
      const imageUrl = await inputFileRef.current.triggerSubmit();
      void updateFoodItem(
        {
          food_item_id: foodItemId,
          name: data.name,
          calories: data.calories,
          fat: data.fat,
          carbs: data.carbs,
          protein: data.protein,
          food_type: data.food_type,
          description: data.description,
          image_url: imageUrl ?? null,
        },
        {
          onSuccess: (res) => {
            void form.reset();
            toast.success("Successfully updated food item", {
              dismissible: true,
              description: `Updated: ${res.name}`,
            });
            navigate(`/admin/food_item`);
          },
          onError: (err) => {
            toast.error("Failed to update food item", {
              dismissible: true,
              description: `Error: ${err.message}`,
            });
          },
        },
      );
    }
  }

  if (isLoadingFoodItem) {
    return <div>Loading...</div>;
  }

  if (isGetFoodItemError || !foodItem) {
    return <div>Error loading meal, {getFoodItemError?.message}</div>;
  }

  return (
    <DashboardContentCards title="Food Item Form">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    className="resize-none"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="food_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Food Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a food type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {foodTypes.map((foodType) => (
                      <SelectItem key={foodType} value={foodType}>
                        {foodType.charAt(0).toUpperCase() + foodType.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FoodItemImageInput
            label="Image"
            initImageUrl={foodItem?.image_url ?? undefined}
            ref={inputFileRef}
            size={1024 * 1024 * 2}
          />

          <div className="gap-x-2 grid grid-cols-2">
            <FormField
              control={form.control}
              name="calories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calories</FormLabel>
                  <FormControl>
                    <Input placeholder="Calories" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="carbs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carbs</FormLabel>
                  <FormControl>
                    <Input placeholder="Carbs" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="gap-x-2 grid grid-cols-2">
            <FormField
              control={form.control}
              name="fat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fat</FormLabel>
                  <FormControl>
                    <Input placeholder="Fat" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="protein"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Protein</FormLabel>
                  <FormControl>
                    <Input placeholder="Protein" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create"}
            </Button>
          </div>
          {isError && <div className="text-destructive">{error.message}</div>}
        </form>
      </Form>
    </DashboardContentCards>
  );
}

export default FoodItemEditForm;
