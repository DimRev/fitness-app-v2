import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  settingsEditFormSchema,
  type SettingsEditFormSchema,
} from "../layout.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/features/shared/components/ui/form";
import { Input } from "~/features/shared/components/ui/input";
import { Button } from "~/features/shared/components/ui/button";
import useUpdateSettings from "../hooks/useUpdateSettings";
import useAuthStore from "~/features/auth/hooks/useAuthStore";
import useLayoutStore from "../hooks/useLayoutStore";
import { useRef } from "react";
import AvatarImageInput from "~/features/shared/components/AvatarImageInput";

type Props = {
  user: AuthUser;
};

function SettingsEditForm({ user }: Props) {
  const inputFileRef = useRef<{
    triggerSubmit: () => Promise<string | null> | undefined;
  }>(null);
  const form = useForm<SettingsEditFormSchema>({
    resolver: zodResolver(settingsEditFormSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      image_url: user.image_url,
    },
  });

  const {
    mutateAsync: updateSettings,
    isLoading: isUpdateSettingsLoading,
    isError,
    error,
  } = useUpdateSettings();
  const { setUser } = useAuthStore();
  const { setSettingsDialogOpen } = useLayoutStore();

  async function onSubmit(data: SettingsEditFormSchema) {
    if (inputFileRef.current) {
      const imageUrl = await inputFileRef.current.triggerSubmit();
      void updateSettings(
        {
          email: data.email,
          username: data.username,
          image_url: imageUrl ? `${imageUrl}` : null,
        },
        {
          onSuccess: (res) => {
            const updatedUser = {
              ...user,
              username: res.username,
              email: res.email,
              image_url: res.image_url,
            };
            void form.reset();
            setUser(updatedUser);
            setSettingsDialogOpen(false);
          },
        },
      );
    }
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
        <AvatarImageInput
          label="Avatar"
          ref={inputFileRef}
          initImageUrl={user.image_url ?? undefined}
          accepts="image/jpeg,image/png,image/webp"
          size={1024 * 1024 * 2} // 2 MB
        />

        {isError && (
          <div className="font-bold text-destructive">{error.message}</div>
        )}
        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={isUpdateSettingsLoading}>
            {isUpdateSettingsLoading ? "Updating..." : "Update Settings"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default SettingsEditForm;
