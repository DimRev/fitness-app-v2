import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  userEditFormSchema,
  userRoles,
  type UserEditFormSchema,
} from "../user.schema";
import useUpdateUserByAdmin from "../hooks/useUpdateUserByAdmin";
import useUserStore from "../hooks/useUserStore";
import { toast } from "sonner";

type Props = {
  user: User;
};

function UserAdminEditForm({ user }: Props) {
  const {
    mutateAsync: updateUser,
    isLoading: isUpdateUserLoading,
    isError,
    error,
  } = useUpdateUserByAdmin();
  const { setUserEditDialogOpen } = useUserStore();
  const form = useForm<UserEditFormSchema>({
    resolver: zodResolver(userEditFormSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      image_url: user.image_url,
      role: user.role,
    },
  });

  function onSubmit(data: UserEditFormSchema) {
    void updateUser(
      {
        email: data.email,
        image_url: data.image_url,
        username: data.username,
        role: data.role,
        userId: user.id,
      },
      {
        onSuccess: () => {
          void form.reset();
          toast.success("Successfully updated user", {
            dismissible: true,
            description: `Updated: ${data.username}`,
          });
          setUserEditDialogOpen(false);
        },
        onError: (err) => {
          toast.error("Failed to update user", {
            dismissible: true,
            description: `Error: ${err.message}`,
          });
        },
      },
    );
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="Image URL"
                  type="text"
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
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {userRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isError && (
          <div className="font-bold text-destructive">{error.message}</div>
        )}
        <div className="mt-4 flex justify-end">
          <Button type="submit">
            {isUpdateUserLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default UserAdminEditForm;
