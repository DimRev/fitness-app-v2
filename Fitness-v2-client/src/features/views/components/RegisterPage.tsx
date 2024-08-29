import RegisterForm from "~/features/auth/components/RegisterForm";
import {
  Card,
  CardContent,
  CardHeader,
} from "~/features/shared/components/ui/card";

function RegisterPage() {
  return (
    <Card className="m-auto max-w-lg">
      <CardHeader>Register</CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  );
}

export default RegisterPage;
