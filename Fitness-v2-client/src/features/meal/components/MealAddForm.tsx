import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useGetFoodItems } from "~/features/food_item/hooks/useGetFoodItems";
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
import { Textarea } from "~/features/shared/components/ui/textarea";
import { mealFormSchema, type MealFormSchema } from "../meal.schema";
import MealFoodItemsList from "./MealFoodItemsList";

function MealAddForm() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const offset = useMemo(() => page * pageSize - pageSize, [page, pageSize]);

  const {
    data: foodItemsWithPages,
    error: foodItemsWithPagesError,
    isLoading: isFoodItemsWithPagesLoading,
    isError: isFoodItemsWithPagesError,
  } = useGetFoodItems({
    limit: pageSize,
    offset,
  });

  const form = useForm<MealFormSchema>({
    resolver: zodResolver(mealFormSchema),
    defaultValues: {
      name: "",
      description: "",
      food_items: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "food_items",
  });

  const foodItemsOptions = useMemo(() => {
    if (!foodItemsWithPages?.food_items) return [];
    return foodItemsWithPages.food_items.map((foodItem) => {
      return {
        label: foodItem.name,
        value: foodItem.id,
      };
    });
  }, [foodItemsWithPages]);

  console.log(foodItemsOptions);

  function onSubmit(data: MealFormSchema) {
    console.log(data);
  }

  return (
    <DashboardContentCards title="Meal Form">
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
        </form>
      </Form>
      <MealFoodItemsList
        FoodItemWithPages={foodItemsWithPages}
        FoodItemWithPagesError={foodItemsWithPagesError}
        isFoodItemWithPagesLoading={isFoodItemsWithPagesLoading}
        isFoodItemWithPagesError={isFoodItemsWithPagesError}
        page={page}
        pageSize={pageSize}
      />
    </DashboardContentCards>
  );
}

export default MealAddForm;
