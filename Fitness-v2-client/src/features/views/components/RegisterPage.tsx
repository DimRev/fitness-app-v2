import RegisterForm from "~/features/auth/components/RegisterForm";
import {
  Card,
  CardContent,
  CardHeader,
} from "~/features/shared/components/ui/card";

function RegisterPage() {
  return (
    <div className="relative h-main w-main">
      <Card className="absolute left-1/2 top-1/2 w-[80%] max-w-lg -translate-x-1/2 -translate-y-1/2">
        <CardHeader className="flex items-center justify-center text-xl font-bold">
          Register
        </CardHeader>

        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default RegisterPage;
