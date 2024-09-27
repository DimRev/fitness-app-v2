import { XCircle } from "lucide-react";
import { Helmet } from "react-helmet";
import {
  Card,
  CardContent,
  CardHeader,
} from "~/features/shared/components/ui/card";

function PageNotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found</title>
      </Helmet>
      <Card className="bg-gradient-to-tl from-destructive to-destructive/70 m-auto max-w-lg text-destructive-foreground stroke-destructive-foreground">
        <CardHeader className="flex font-bold text-xl">
          <span className="text-center text-red-900 uppercase">
            Error! (<span className="font-extrabold text-red-950">404</span>)
          </span>
        </CardHeader>
        <div className="border-muted mx-4 border-b-2"></div>
        <CardContent>
          <div className="flex items-center gap-4 pt-4">
            <XCircle className="size-10 stroke-red-950" />
            <p className="text-center text-lg text-red-900">Page not found</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default PageNotFound;
