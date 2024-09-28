import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
import useCreateMeasurement from "../hooks/useCreateMeasurement";
import {
  measurementSchema,
  type MeasurementSchema,
} from "../measurement.schema";

function MeasurementAddForm() {
  const {
    mutateAsync: createMeasurement,
    isLoading: isCreateMeasurementLoading,
    isError,
    error,
  } = useCreateMeasurement();
  const navigate = useNavigate();
  const form = useForm<MeasurementSchema>({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      weight: "0",
      height: "0",
    },
  });

  function onSubmit(data: MeasurementSchema) {
    void createMeasurement(
      {
        weight: data.weight,
        height: data.height,
      },
      {
        onSuccess: (res) => {
          void form.reset();
          toast.success("Successfully created measurement", {
            dismissible: true,
            description: `Created: ${res.weight} kg`,
          });
          navigate("/dashboard/measurement");
        },
        onError: (err) => {
          toast.error("Failed to create measurement", {
            dismissible: true,
            description: `Error: ${err.message}`,
          });
        },
      },
    );
  }

  return (
    <DashboardContentCards title="Measurement Form">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (m)</FormLabel>
                <FormControl>
                  <Input placeholder="Height" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input placeholder="Weight" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end mt-4">
            {isError && <div className="text-destructive">{error.message}</div>}
            <Button type="submit" disabled={isCreateMeasurementLoading}>
              {isCreateMeasurementLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </DashboardContentCards>
  );
}

export default MeasurementAddForm;
