import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
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

function MealAddForm() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
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

  function onSubmit(data: MealFormSchema) {
    console.log(data);
  }

  function toggleFoodItems(foodItems: FoodItem[]) {
    for (const foodItem of foodItems) {
      const fieldIdx = fields.findIndex((field) => {
        return field.food_item_id === foodItem.id;
      });
      if (fieldIdx === -1) {
        append({
          food_item_id: foodItem.id,
          amount: 1,
        });
        setFoodItems((prev) => [...prev, foodItem]);
      } else {
        remove(fieldIdx);
        setFoodItems((prev) => prev.filter((item) => item.id !== foodItem.id));
      }
    }
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
          <MealFoodItemsList toggleFoodItems={toggleFoodItems} />
          <div className="flex flex-wrap gap-5 mt-4">
            {fields.map((field, idx) => (
              <div
                key={field.id}
                className="flex flex-col gap-2 p-2 border rounded-md"
              >
                <div>
                  <H4>{foodItems[idx].name}</H4>
                </div>
                <Separator />
                {foodItems[idx].description && (
                  <div>{foodItems[idx].description}</div>
                )}
                <div className="flex-1 gap-x-4 grid grid-cols-2">
                  <div>Calories:</div>
                  <div className="text-end">{foodItems[idx].calories}</div>
                  <div>Protein:</div>
                  <div className="text-end">{foodItems[idx].protein}</div>
                  <div>Fat:</div>
                  <div className="text-end">{foodItems[idx].fat}</div>
                  <div>Carbs:</div>
                  <div className="text-end">{foodItems[idx].carbs}</div>
                </div>
                <div className="flex justify-between items-center border rounded-md">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-e-none"
                    onClick={() =>
                      update(idx, {
                        food_item_id: field.food_item_id,
                        amount: field.amount - 1 < 1 ? 1 : field.amount - 1,
                      })
                    }
                  >
                    <Minus />
                  </Button>
                  <div className="flex flex-1 justify-center items-center bg-muted/50 h-full">
                    {field.amount}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-s-none"
                    onClick={() =>
                      update(idx, {
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
          <div className="flex justify-end mt-4">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Form>
    </DashboardContentCards>
  );
}

export default MealAddForm;
