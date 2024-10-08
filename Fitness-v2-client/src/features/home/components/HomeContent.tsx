import { H1 } from "~/features/shared/components/Typography";
import { Button } from "~/features/shared/components/ui/button";
import { Separator } from "~/features/shared/components/ui/separator";

function HomeContent() {
  return (
    <div className="">
      <div className="grid grid-cols-[2fr_3fr] items-center">
        <div className="pt-4">
          <H1 className="pb-2 text-5xl">Welcome to Fitness App</H1>
        </div>
        <div>
          <p className="my-2">
            Take control of your fitness journey with our open-source Fitness
            App! Whether you're looking to build strength, improve endurance, or
            simply stay active, we've got you covered. Track your workouts,
            monitor your progress, and hit those fitness goals faster than ever.
          </p>
          <p className="my-2">
            This app is designed to empower you to track your progress
            effortlessly. It's open-source, customizable, and packed with the
            tools you need to stay on top of your game. Join a community of
            like-minded individuals and start transforming your fitness routine
            today!
          </p>
          <p className="my-2">
            Stay motivated, stay consistent, and let our app be your personal
            guide to a healthier, stronger you. Ready to get started?
          </p>
        </div>
      </div>
      <div className="mb-4 mt-2 rounded-md bg-muted/30 p-2 text-end">
        <Button>Login</Button>
      </div>
      <Separator />
    </div>
  );
}

export default HomeContent;
