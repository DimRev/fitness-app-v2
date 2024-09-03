import LoginForm from "~/features/auth/components/LoginForm";
import {
  Card,
  CardContent,
  CardHeader,
} from "~/features/shared/components/ui/card";

function LoginPage() {
  return (
    <div className="relative w-main h-main">
      <Card className="top-1/2 left-1/2 absolute w-[80%] max-w-lg -translate-x-1/2 -translate-y-1/2">
        <CardHeader className="flex justify-center items-center font-bold text-xl">
          Login
        </CardHeader>
        <div className="border-muted mx-4 border-b-2"></div>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
