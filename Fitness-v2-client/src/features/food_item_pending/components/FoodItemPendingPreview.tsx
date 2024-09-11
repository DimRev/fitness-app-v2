import { H3 } from "~/features/shared/components/Typography";
import { Apple, Heart, Ban } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/features/shared/components/ui/card";
import { Skeleton } from "~/features/shared/components/ui/skeleton";

type Props = {
  foodItemPending: FoodItemsPending;
  handleToggleFoodItemPending: (foodItemPendingId: string) => void;
};

function FoodItemPendingPreview({
  foodItemPending,
  handleToggleFoodItemPending,
}: Props) {
  function onToggleFoodItemPending() {
    handleToggleFoodItemPending(foodItemPending.id);
  }

  return (
    <Card>
      <CardHeader>
        <H3>{foodItemPending.name}</H3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[4fr_2fr] gap-2">
          <div className="rounded-md border p-2">
            <div className="h-[50%] p-1">{foodItemPending.description}</div>
            <div className="flex h-[50%] w-full items-center justify-center rounded-md border">
              {foodItemPending.image_url ? (
                <img
                  src={foodItemPending.image_url}
                  alt={foodItemPending.name}
                  className="h-[%50] w-full object-cover"
                />
              ) : (
                <Apple className="size-[80%]" />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="rounded-md border px-2">
              <div className="border-b text-center font-bold">Type</div>
              <div className="text-center">{foodItemPending.food_type}</div>
            </div>
            <div className="rounded-md border px-2">
              <div className="border-b text-center font-bold">Calories</div>
              <div className="text-center">{foodItemPending.calories}</div>
            </div>
            <div className="rounded-md border px-2">
              <div className="border-b text-center font-bold">Protein</div>
              <div className="text-center">{foodItemPending.protein}</div>
            </div>
            <div className="rounded-md border px-2">
              <div className="border-b text-center font-bold">Fat</div>
              <div className="text-center">{foodItemPending.fat}</div>
            </div>
            <div className="rounded-md border px-2">
              <div className="border-b text-center font-bold">Carbs</div>
              <div className="text-center">{foodItemPending.carbs}</div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-between gap-2">
          <div className="rounded-md border px-4 py-2">
            <div
              className="flex cursor-pointer gap-2"
              onClick={onToggleFoodItemPending}
            >
              <Heart fill={foodItemPending.liked ? "red" : "transparent"} />
              <span className="font-bold">{foodItemPending.likes}</span>
            </div>
          </div>
          <div className="rounded-md border px-4 py-2">
            <div>
              By:{" "}
              <span className="font-bold">{foodItemPending.author_name}</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export function FoodItemPendingPreviewSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-full" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[4fr_2fr] gap-2">
          <div className="rounded-md border px-1">
            <div className="flex h-[50%] flex-col gap-1 p-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>

            <div className="flex h-[50%] w-full items-center justify-center">
              <Skeleton className="size-[80%]" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="rounded-md border px-2">
              <div className="border-b text-center font-bold">Type</div>
              <div className="text-center">
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
            <div className="rounded-md border px-2">
              <div className="border-b text-center font-bold">Calories</div>
              <div className="text-center">
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
            <div className="rounded-md border px-2">
              <div className="border-b text-center font-bold">Protein</div>
              <div className="text-center">
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
            <div className="rounded-md border px-2">
              <div className="border-b text-center font-bold">Fat</div>
              <div className="text-center">
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
            <div className="rounded-md border px-2">
              <div className="border-b text-center font-bold">Carbs</div>
              <div className="text-center">
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-between gap-2">
          <div className="rounded-md border px-4 py-2">
            <div className="flex items-center gap-2">
              <Heart fill={"transparent"} />
              <span className="flex w-4 font-bold">
                <Skeleton className="h-4 w-full" />
              </span>
            </div>
          </div>
          <div className="rounded-md border px-4 py-2">
            <div className="flex w-20 items-center gap-2">
              By:
              <span className="font-bold">
                <Skeleton className="h-4 w-14" />
              </span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export function FoodItemPendingPreviewEmpty() {
  return (
    <Card className="opacity-70">
      <CardHeader className="opacity-50">Empty</CardHeader>
      <CardContent>
        <div className="grid grid-cols-[4fr_2fr] gap-2">
          <div className="rounded-md border px-1">
            <div className="flex h-[50%] flex-col gap-1 p-1 opacity-50">
              N/A
            </div>

            <div className="flex h-[50%] w-full items-center justify-center opacity-50">
              <Ban className="size-[80%]" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="rounded-md border px-2">
              <div className="border-b text-center font-bold">Type</div>
              <div className="text-center opacity-50">0.00</div>
            </div>
            <div className="rounded-md border px-2">
              <div className="border-b text-center font-bold">Calories</div>
              <div className="text-center opacity-50">0.00</div>
            </div>
            <div className="rounded-md border px-2">
              <div className="border-b text-center font-bold">Protein</div>
              <div className="text-center opacity-50">0.00</div>
            </div>
            <div className="rounded-md border px-2">
              <div className="border-b text-center font-bold">Fat</div>
              <div className="text-center opacity-50">0.00</div>
            </div>
            <div className="rounded-md border px-2">
              <div className="border-b text-center font-bold">Carbs</div>
              <div className="text-center opacity-50">0.00</div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-between gap-2">
          <div className="rounded-md border px-4 py-2">
            <div className="flex items-center gap-2">
              <Heart fill={"transparent"} className="opacity-50" />
              <span className="flex w-4 font-bold opacity-50">0</span>
            </div>
          </div>
          <div className="rounded-md border px-4 py-2">
            <div className="flex w-20 items-center gap-2">
              By:
              <span className="font-bold opacity-50">N/A</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default FoodItemPendingPreview;
