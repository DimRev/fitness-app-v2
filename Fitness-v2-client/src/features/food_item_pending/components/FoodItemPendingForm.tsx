import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { DashboardContentCards } from "~/features/shared/components/CustomCards";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/features/shared/components/ui/select";
import { Textarea } from "~/features/shared/components/ui/textarea";
import {
  foodItemPendingFormSchema,
  foodTypes,
  type FoodItemPendingFormSchema,
} from "../foodItemsPending.schema";
import useCreateFoodItemPending from "../hooks/useCreateFoodItemPending";

function FoodItemPendingForm() {
  const {
    mutateAsync: createFoodItemPending,
    isLoading: isPending,
    isError,
    error,
  } = useCreateFoodItemPending();
  const navigate = useNavigate();

  const form = useForm<FoodItemPendingFormSchema>({
    resolver: zodResolver(foodItemPendingFormSchema),
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

  function onSubmit(data: FoodItemPendingFormSchema) {
    void createFoodItemPending(data, {
      onSuccess: () => {
        void form.reset();
        navigate("/dashboard/food_item");
      },
    });
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

export default FoodItemPendingForm;
