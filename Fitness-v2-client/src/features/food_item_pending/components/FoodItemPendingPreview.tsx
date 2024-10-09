import { H3 } from "~/features/shared/components/Typography";
import { Apple, Heart, Ban, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/features/shared/components/ui/card";
import { Skeleton } from "~/features/shared/components/ui/skeleton";
import FoodItemBadge from "~/features/food_item/components/FoodItemBadge";

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
        <div className="flex items-center justify-between">
          <H3 className="truncate">{foodItemPending.name}</H3>
          <FoodItemBadge foodItemTypes={foodItemPending.food_type} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[4fr_2fr] gap-2">
          <div className="relative rounded-md border p-2">
            <div className="absolute inset-0 z-20 h-[100%] rounded-md bg-white/70 p-1 backdrop-blur-[1px] dark:bg-black/70">
              <div className="line-clamp-6">{foodItemPending.description}</div>
            </div>
            <div className="absolute inset-0 z-10 flex h-[100%] w-full items-center justify-center rounded-md border">
              {foodItemPending.image_url ? (
                <img
                  src={foodItemPending.image_url}
                  alt={foodItemPending.name}
                  className="h-full w-full rounded-md object-cover"
                />
              ) : (
                <Apple className="h-full w-full object-contain" />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
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
    <Card className="opacity-70">
      <CardHeader className="opacity-50">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-full" />
          <FoodItemBadge />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[4fr_2fr] gap-2">
          <div className="relative rounded-md border p-2">
            <div className="absolute inset-0 z-20 h-[100%] rounded-md bg-white/70 p-1 backdrop-blur-[1px] dark:bg-black/70">
              <Skeleton className="mt-2 h-4 w-[99%]" />
              <Skeleton className="mt-2 h-4 w-[93%]" />
              <Skeleton className="mt-2 h-4 w-[89%]" />
              <Skeleton className="mt-2 h-4 w-[95%]" />
              <Skeleton className="mt-2 h-4 w-[90%]" />
              <Skeleton className="mt-2 h-4 w-[50%]" />
            </div>

            <div className="absolute inset-0 z-10 flex h-[100%] w-full items-center justify-center rounded-md border">
              <Loader2 className="size-[80%] animate-spin" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="rounded-md border px-2">
              <div className="animate-pulse border-b text-center font-bold">
                Calories
              </div>
              <div className="text-center opacity-50">
                <Skeleton className="mx-auto my-1 h-4 w-[40%]" />
              </div>
            </div>
            <div className="rounded-md border px-2">
              <div className="animate-pulse border-b text-center font-bold">
                Protein
              </div>
              <div className="text-center opacity-50">
                <Skeleton className="mx-auto my-1 h-4 w-[40%]" />
              </div>
            </div>
            <div className="rounded-md border px-2">
              <div className="animate-pulse border-b text-center font-bold">
                Fat
              </div>
              <div className="text-center opacity-50">
                <Skeleton className="mx-auto my-1 h-4 w-[40%]" />
              </div>
            </div>
            <div className="rounded-md border px-2">
              <div className="animate-pulse border-b text-center font-bold">
                Carbs
              </div>
              <div className="text-center opacity-50">
                <Skeleton className="mx-auto my-1 h-4 w-[40%]" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-between gap-2">
          <div className="rounded-md border px-4 py-2">
            <div className="flex animate-pulse items-center gap-2">
              <Heart fill={"transparent"} className="opacity-70" />
              <span className="flex w-4 font-bold opacity-50">0</span>
            </div>
          </div>
          <div className="animate-pulse rounded-md border px-4 py-2">
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

export function FoodItemPendingPreviewEmpty() {
  return (
    <Card className="opacity-70">
      <CardHeader className="opacity-50">
        <div className="flex items-center justify-between">
          <H3 className="opacity-50">Empty</H3>
          <FoodItemBadge />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[4fr_2fr] gap-2">
          <div className="relative rounded-md border p-2">
            <div className="absolute inset-0 z-20 h-[100%] rounded-md bg-white/70 p-1 backdrop-blur-[1px] dark:bg-black/70">
              N/A
            </div>

            <div className="absolute inset-0 z-10 flex h-[100%] w-full items-center justify-center rounded-md border">
              <Ban className="size-[80%]" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
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
