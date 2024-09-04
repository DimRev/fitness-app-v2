import RegisterForm from "~/features/auth/components/RegisterForm";
import {
  Card,
  CardContent,
  CardHeader,
} from "~/features/shared/components/ui/card";

function RegisterPage() {
  return (
    <div className="relative w-main h-main">
      <Card className="top-1/2 left-1/2 absolute w-[80%] max-w-lg -translate-x-1/2 -translate-y-1/2">
        <CardHeader className="flex justify-center items-center font-bold text-xl">
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
