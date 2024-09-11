import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";
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
import useCreateMeal from "../hooks/useCreateMeal";
import { useNavigate } from "react-router-dom";

function MealAddForm() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const {
    mutateAsync: createMeal,
    isLoading: isCreateMealLoading,
    isError,
    error,
  } = useCreateMeal();
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

  function onSubmit(data: MealFormSchema) {
    void createMeal(
      {
        name: data.name,
        description: data.description,
        image_url: null,
        food_items: data.food_items,
      },
      {
        onSuccess: () => {
          void form.reset();
          navigate("/dashboard/meal");
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
      const amount = foodItemsFields[i].amount;
      const foodItem = foodItems[i];
      nutValues.calories += Number(foodItem.calories) * amount;
      nutValues.fat += Number(foodItem.fat) * amount;
      nutValues.carbs += Number(foodItem.carbs) * amount;
      nutValues.protein += Number(foodItem.protein) * amount;
    }
    return nutValues;
  }, [foodItems, foodItemsFields]);

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
                <MealFoodItemsList toggleFoodItems={toggleFoodItems} />
                <div className="mt-4 flex flex-wrap gap-5">
                  {foodItemsFields.map((field, idx) => (
                    <div
                      key={field.id}
                      className="flex flex-col gap-2 rounded-md border p-2"
                    >
                      <div>
                        <H4>{foodItems[idx].name}</H4>
                      </div>
                      <Separator />
                      {foodItems[idx].description && (
                        <div>{foodItems[idx].description}</div>
                      )}
                      <div className="grid flex-1 grid-cols-2 gap-x-4">
                        <div>Calories:</div>
                        <div className="text-end">
                          {(
                            Number(foodItems[idx].calories) * field.amount
                          ).toFixed(2)}
                        </div>
                        <div>Protein:</div>
                        <div className="text-end">
                          {(
                            Number(foodItems[idx].protein) * field.amount
                          ).toFixed(2)}
                        </div>
                        <div>Fat:</div>
                        <div className="text-end">
                          {(Number(foodItems[idx].fat) * field.amount).toFixed(
                            2,
                          )}
                        </div>
                        <div>Carbs:</div>
                        <div className="text-end">
                          {(
                            Number(foodItems[idx].carbs) * field.amount
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
            <Button type="submit" disabled={isCreateMealLoading}>
              {isCreateMealLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </DashboardContentCards>
  );
}

export default MealAddForm;
