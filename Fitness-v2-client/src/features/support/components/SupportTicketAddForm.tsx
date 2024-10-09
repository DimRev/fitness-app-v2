import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useLayoutStore from "~/features/layout/hooks/useLayoutStore";
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
} from "~/features/shared/components/ui/select";
import { Textarea } from "~/features/shared/components/ui/textarea";
import { cn } from "~/lib/utils";
import {
  supportTicketAddFormSchema,
  SupportTypes,
  type SupportTicketAddFormSchema,
} from "../support.schema";
import { Button } from "~/features/shared/components/ui/button";

type Props = {
  user: AuthUser;
};

function SupportTicketAddForm({ user }: Props) {
  const form = useForm<SupportTicketAddFormSchema>({
    resolver: zodResolver(supportTicketAddFormSchema),
    defaultValues: {
      title: "",
      support_type: "bug",
      description: "",
      author: user.email,
    },
  });

  const { isDarkMode } = useLayoutStore();

  // const {
  //   mutateAsync: updateSettings,
  //   isLoading: isUpdateSettingsLoading,
  //   isError,
  //   error,
  // } = useUpdateSettings();
  // const { setUser } = useAuthStore();
  // const { setSettingsDialogOpen } = useLayoutStore();

  async function onSubmit(data: SupportTicketAddFormSchema) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Support ticket title"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="support_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ticket Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>{field.value}</SelectTrigger>
                </FormControl>
                <SelectContent className={cn(isDarkMode && "dark")}>
                  {SupportTypes.map((supportType) => (
                    <SelectItem key={supportType} value={supportType}>
                      {supportType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* {isError && (
          <div className="font-bold text-destructive">{error.message}</div>
        )} */}
        <div className="mt-4 flex justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}

export default SupportTicketAddForm;
