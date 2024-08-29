import LoginForm from "~/features/auth/components/LoginForm";
import {
  Card,
  CardContent,
  CardHeader,
} from "~/features/shared/components/ui/card";

function LoginPage() {
  return (
    <Card className="m-auto max-w-lg">
      <CardHeader className="flex justify-center items-center font-bold text-xl">
        Login
      </CardHeader>
      <div className="border-muted mx-4 border-b-2"></div>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}

export default LoginPage;
