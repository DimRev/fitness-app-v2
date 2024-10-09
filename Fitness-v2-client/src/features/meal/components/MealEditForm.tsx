import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import { H4 } from "~/features/shared/components/Typography";
import { Button } from "~/features/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/features/shared/components/ui/form";
import { Input } from "~/features/shared/components/ui/input";
import { Separator } from "~/features/shared/components/ui/separator";
import { Textarea } from "~/features/shared/components/ui/textarea";
import { mealFormSchema, type MealFormSchema } from "../meal.schema";
import MealFoodItemsList from "./MealFoodItemsList";
import { useNavigate } from "react-router-dom";
import useGetMealByID from "../hooks/useGetMealByID";
import useUpdateMeal from "../hooks/useUpdateMeal";
import { toast } from "sonner";
import FoodItemBadge from "~/features/food_item/components/FoodItemBadge";

type Props = {
  mealId: string;
};

function MealEditForm({ mealId }: Props) {
  const {
    data: mealWithNutritionAndFoodItems,
    isLoading: isGetMealLoading,
    isError: isGetMealError,
    error: getMealError,
  } = useGetMealByID({
    mealId,
  });
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const {
    mutateAsync: updateMeal,
    isLoading: isUpdateMealLoading,
    isError,
    error,
  } = useUpdateMeal();
  const navigate = useNavigate();
  const form = useForm<MealFormSchema>({
    resolver: zodResolver(mealFormSchema),
    defaultValues: {
      name: "",
      description: "",
      food_items: [],
    },
  });

  const {
    fields: foodItemsFields,
    append: foodItemsAppend,
    remove: foodItemsRemove,
    update: foodItemsUpdate,
  } = useFieldArray({
    control: form.control,
    name: "food_items",
  });

  useEffect(() => {
    if (mealWithNutritionAndFoodItems) {
      form.reset({
        name: mealWithNutritionAndFoodItems.meal.meal.name,
        description: mealWithNutritionAndFoodItems.meal.meal.description,
      });
      mealWithNutritionAndFoodItems.food_items.forEach((foodItem, idx) => {
        toggleFoodItems([foodItem.food_item]);
        foodItemsUpdate(idx, {
          food_item_id: foodItem.food_item.id,
          amount: foodItem.amount,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mealWithNutritionAndFoodItems]);

  function onSubmit(data: MealFormSchema) {
    void updateMeal(
      {
        name: data.name,
        description: data.description,
        image_url: null,
        food_items: data.food_items,
        meal_id: mealId,
      },
      {
        onSuccess: (res) => {
          void form.reset();
          toast.success("Successfully updated meal", {
            dismissible: true,
            description: `Updated: ${res.meal.name}`,
          });
          navigate(`/dashboard/meal/details/${mealId}`);
        },
        onError: (err) => {
          toast.error("Failed to update meal", {
            dismissible: true,
            description: `Error: ${err.message}`,
          });
        },
      },
    );
  }

  function toggleFoodItems(foodItems: FoodItem[]) {
    for (const foodItem of foodItems) {
      const fieldIdx = foodItemsFields.findIndex((field) => {
        return field.food_item_id === foodItem.id;
      });
      if (fieldIdx === -1) {
        foodItemsAppend({
          food_item_id: foodItem.id,
          amount: 1,
        });
        setFoodItems((prev) => [...prev, foodItem]);
      } else {
        foodItemsRemove(fieldIdx);
        setFoodItems((prev) => prev.filter((item) => item.id !== foodItem.id));
      }
    }
  }

  const totalNutValue = useMemo(() => {
    const nutValues = {
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    };
    if (!foodItems?.length) return nutValues;

    for (let i = 0; i < foodItems.length; i++) {
      const amount = foodItemsFields[i]?.amount ?? 1;
      const foodItem = foodItems[i];
      nutValues.calories += Number(foodItem.calories) * amount;
      nutValues.fat += Number(foodItem.fat) * amount;
      nutValues.carbs += Number(foodItem.carbs) * amount;
      nutValues.protein += Number(foodItem.protein) * amount;
    }
    return nutValues;
  }, [foodItems, foodItemsFields]);

  if (isGetMealLoading) {
    return <div>Loading...</div>;
  }

  if (isGetMealError || !mealWithNutritionAndFoodItems) {
    return <div>Error loading meal, {getMealError?.message}</div>;
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
          <FormField
            control={form.control}
            name="food_items"
            render={() => (
              <FormItem>
                <FormLabel>Food Items</FormLabel>
                <MealFoodItemsList
                  toggleFoodItems={toggleFoodItems}
                  initFoodItems={mealWithNutritionAndFoodItems.food_items.map(
                    (foodItems) => foodItems.food_item,
                  )}
                />
                <div className="mt-4 flex flex-wrap gap-5">
                  {foodItemsFields?.map((field, idx) => (
                    <div
                      key={field.id}
                      className="flex flex-col gap-2 rounded-md border p-2"
                    >
                      <div className="flex items-center gap-4">
                        <H4>{foodItems[idx]?.name}</H4>
                        <FoodItemBadge
                          foodItemTypes={foodItems[idx]?.food_type}
                        />
                      </div>
                      <Separator />
                      {foodItems[idx]?.description && (
                        <div>{foodItems[idx]?.description}</div>
                      )}
                      <div className="grid flex-1 grid-cols-2 gap-x-4">
                        <div>Calories:</div>
                        <div className="text-end">
                          {(
                            Number(foodItems[idx]?.calories) * field.amount
                          ).toFixed(2)}
                        </div>
                        <div>Protein:</div>
                        <div className="text-end">
                          {(
                            Number(foodItems[idx]?.protein) * field.amount
                          ).toFixed(2)}
                        </div>
                        <div>Fat:</div>
                        <div className="text-end">
                          {(Number(foodItems[idx]?.fat) * field.amount).toFixed(
                            2,
                          )}
                        </div>
                        <div>Carbs:</div>
                        <div className="text-end">
                          {(
                            Number(foodItems[idx]?.carbs) * field.amount
                          ).toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between rounded-md border">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-e-none"
                          onClick={() =>
                            foodItemsUpdate(idx, {
                              food_item_id: field.food_item_id,
                              amount:
                                field.amount - 1 < 1 ? 1 : field.amount - 1,
                            })
                          }
                        >
                          <Minus />
                        </Button>
                        <div className="flex h-full flex-1 items-center justify-center bg-muted/50">
                          {field.amount}
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-s-none"
                          onClick={() =>
                            foodItemsUpdate(idx, {
                              food_item_id: field.food_item_id,
                              amount: field.amount + 1,
                            })
                          }
                        >
                          <Plus />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-4 rounded-md border p-2">
            <H4>Total Nutrition</H4>
            <Separator className="mt-1" />
            <div className="mt-2 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div>Calories:</div>
                <div className="text-end">
                  {totalNutValue.calories.toFixed(2)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div>Fat:</div>
                <div className="text-end">{totalNutValue.fat.toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-2">
                <div>Carbs:</div>
                <div className="text-end">{totalNutValue.carbs.toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-2">
                <div>Protein:</div>
                <div className="text-end">
                  {totalNutValue.protein.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            {isError && <div className="text-destructive">{error.message}</div>}
            <Button type="submit" disabled={isUpdateMealLoading}>
              {isUpdateMealLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </DashboardContentCards>
  );
}

export default MealEditForm;
