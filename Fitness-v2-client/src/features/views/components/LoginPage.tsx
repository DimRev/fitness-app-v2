import LoginForm from "~/features/auth/components/LoginForm";
import {
  Card,
  CardContent,
  CardHeader,
} from "~/features/shared/components/ui/card";

function LoginPage() {
  return (
    <div className="relative h-main w-main">
      <Card className="absolute left-1/2 top-1/2 w-[80%] max-w-lg -translate-x-1/2 -translate-y-1/2">
        <CardHeader className="flex items-center justify-center text-xl font-bold">
          Login
        </CardHeader>
        <div className="mx-4 border-b-2 border-muted"></div>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
