import { Link } from "react-router-dom";
import useAuthStore from "~/features/auth/hooks/useAuthStore";
import { H1, P } from "~/features/shared/components/Typography";
import { buttonVariants } from "~/features/shared/components/ui/button";
import { Separator } from "~/features/shared/components/ui/separator";

function HomeContent() {
  const { user } = useAuthStore();
  return (
    <div className="">
      <div className="grid grid-cols-1 gap-y-4 md:grid-cols-[2fr_3fr] md:gap-x-4 lg:grid-cols-[1fr_2fr] lg:gap-x-6">
        <div className="pt-4">
          <H1 className="bg-gradient-to-l from-primary/50 via-primary/80 to-primary bg-clip-text pb-2 text-5xl text-primary/10">
            Welcome to Fitness App
          </H1>
        </div>
        <div>
          <P>
            Fitness App is a comprehensive fitness tracking solution designed to
            help you achieve your fitness goals. With our user-friendly
            interface and powerful features, you can easily monitor your
            progress, set achievable goals, and stay motivated to reach your
            fitness goals.
          </P>
          <P>
            This app is designed to empower you to track your progress
            effortlessly. It's open-source, customizable, and packed with the
            tools you need to stay on top of your game. Join a community of
            like-minded individuals and start transforming your fitness routine
            today!
          </P>
          <P>
            Stay motivated, stay consistent, and let our app be your personal
            guide to a healthier, stronger you.
          </P>

          {user ? <P>Move to your dashboard</P> : <P>Ready to get started?</P>}
        </div>
      </div>

      <div className="mb-4 mt-2 flex justify-end gap-2 rounded-md bg-muted/30 p-2">
        {user ? (
          <Link
            to="/dashboard"
            className={buttonVariants({ variant: "default", size: "lg" })}
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link
              to="/auth/register"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Sign up
            </Link>
            <Link
              to="/auth/login"
              className={buttonVariants({ variant: "default", size: "lg" })}
            >
              Sign in
            </Link>
          </>
        )}
      </div>
      <Separator />
    </div>
  );
}

export default HomeContent;
