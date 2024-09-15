import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import useRegister from "../hooks/useRegister";
import useAuthStore from "../hooks/useAuthStore";
import { toast } from "sonner";

const registerFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  username: z.string(),
});

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;

function RegisterForm() {
  const { mutateAsync: register, isLoading: isRegisterLoading } = useRegister();
  const { setUser } = useAuthStore();
  const [error, setError] = useState<string | undefined>();

  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  async function handleSubmit(data: RegisterFormSchema) {
    void register(data, {
      onSuccess: (user) => {
        sessionStorage.setItem("fitness_app_session", user.session_token);
        toast.success("Successfully registered", {
          dismissible: true,
          description: `Registered: ${user.email}`,
        });
        setUser(user);
      },
      onError: (err) => {
        toast.error("Failed to register", {
          dismissible: true,
          description: `Error: ${err.message}`,
        });
        setError(err.message);
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex justify-end py-4">
          <Button disabled={isRegisterLoading} type="submit">
            Register
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default RegisterForm;
