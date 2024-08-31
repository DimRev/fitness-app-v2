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
import useLogin from "../hooks/useLogin";
import useAuthStore from "../hooks/useAuthStore";

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;

function LoginForm() {
  const { mutateAsync: login, isLoading: isLoginLoading } = useLogin();
  const { setUser } = useAuthStore();
  const [error, setError] = useState<string | undefined>();

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSubmit(data: LoginFormSchema) {
    try {
      await login(data, {
        onSuccess: (user) => {
          sessionStorage.setItem("fitness_app_session", user.session_token);
          setUser(user);
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
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
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex justify-end py-4">
          <Button disabled={isLoginLoading} type="submit">
            Login
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default LoginForm;
