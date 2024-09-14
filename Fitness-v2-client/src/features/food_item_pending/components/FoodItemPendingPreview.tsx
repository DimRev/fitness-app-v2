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
        <div className="gap-2 grid grid-cols-[4fr_2fr]">
          <div className="p-2 border rounded-md">
            <div className="p-1 h-[50%]">{foodItemPending.description}</div>
            <div className="flex justify-center items-center border rounded-md w-full h-[50%]">
              {foodItemPending.image_url ? (
                <img
                  src={foodItemPending.image_url}
                  alt={foodItemPending.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Apple className="w-full h-full object-contain" />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="px-2 border rounded-md">
              <div className="border-b font-bold text-center">Type</div>
              <div className="text-center">{foodItemPending.food_type}</div>
            </div>
            <div className="px-2 border rounded-md">
              <div className="border-b font-bold text-center">Calories</div>
              <div className="text-center">{foodItemPending.calories}</div>
            </div>
            <div className="px-2 border rounded-md">
              <div className="border-b font-bold text-center">Protein</div>
              <div className="text-center">{foodItemPending.protein}</div>
            </div>
            <div className="px-2 border rounded-md">
              <div className="border-b font-bold text-center">Fat</div>
              <div className="text-center">{foodItemPending.fat}</div>
            </div>
            <div className="px-2 border rounded-md">
              <div className="border-b font-bold text-center">Carbs</div>
              <div className="text-center">{foodItemPending.carbs}</div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between items-center gap-2 w-full">
          <div className="px-4 py-2 border rounded-md">
            <div
              className="flex gap-2 cursor-pointer"
              onClick={onToggleFoodItemPending}
            >
              <Heart fill={foodItemPending.liked ? "red" : "transparent"} />
              <span className="font-bold">{foodItemPending.likes}</span>
            </div>
          </div>
          <div className="px-4 py-2 border rounded-md">
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
        <Skeleton className="w-full h-5" />
      </CardHeader>
      <CardContent>
        <div className="gap-2 grid grid-cols-[4fr_2fr]">
          <div className="px-1 border rounded-md">
            <div className="flex flex-col gap-1 p-1 h-[50%]">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
            </div>

            <div className="flex justify-center items-center w-full h-[50%]">
              <Skeleton className="size-[80%]" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="px-2 border rounded-md">
              <div className="border-b font-bold text-center">Type</div>
              <div className="text-center">
                <Skeleton className="w-full h-4" />
              </div>
            </div>
            <div className="px-2 border rounded-md">
              <div className="border-b font-bold text-center">Calories</div>
              <div className="text-center">
                <Skeleton className="w-full h-4" />
              </div>
            </div>
            <div className="px-2 border rounded-md">
              <div className="border-b font-bold text-center">Protein</div>
              <div className="text-center">
                <Skeleton className="w-full h-4" />
              </div>
            </div>
            <div className="px-2 border rounded-md">
              <div className="border-b font-bold text-center">Fat</div>
              <div className="text-center">
                <Skeleton className="w-full h-4" />
              </div>
            </div>
            <div className="px-2 border rounded-md">
              <div className="border-b font-bold text-center">Carbs</div>
              <div className="text-center">
                <Skeleton className="w-full h-4" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between items-center gap-2 w-full">
          <div className="px-4 py-2 border rounded-md">
            <div className="flex items-center gap-2">
              <Heart fill={"transparent"} />
              <span className="flex w-4 font-bold">
                <Skeleton className="w-full h-4" />
              </span>
            </div>
          </div>
          <div className="px-4 py-2 border rounded-md">
            <div className="flex items-center gap-2 w-20">
              By:
              <span className="font-bold">
                <Skeleton className="w-14 h-4" />
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
        <div className="gap-2 grid grid-cols-[4fr_2fr]">
          <div className="px-1 border rounded-md">
            <div className="flex flex-col gap-1 opacity-50 p-1 h-[50%]">
              N/A
            </div>

            <div className="flex justify-center items-center opacity-50 w-full h-[50%]">
              <Ban className="size-[80%]" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="px-2 border rounded-md">
              <div className="border-b font-bold text-center">Type</div>
              <div className="opacity-50 text-center">0.00</div>
            </div>
            <div className="px-2 border rounded-md">
              <div className="border-b font-bold text-center">Calories</div>
              <div className="opacity-50 text-center">0.00</div>
            </div>
            <div className="px-2 border rounded-md">
              <div className="border-b font-bold text-center">Protein</div>
              <div className="opacity-50 text-center">0.00</div>
            </div>
            <div className="px-2 border rounded-md">
              <div className="border-b font-bold text-center">Fat</div>
              <div className="opacity-50 text-center">0.00</div>
            </div>
            <div className="px-2 border rounded-md">
              <div className="border-b font-bold text-center">Carbs</div>
              <div className="opacity-50 text-center">0.00</div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between items-center gap-2 w-full">
          <div className="px-4 py-2 border rounded-md">
            <div className="flex items-center gap-2">
              <Heart fill={"transparent"} className="opacity-50" />
              <span className="flex opacity-50 w-4 font-bold">0</span>
            </div>
          </div>
          <div className="px-4 py-2 border rounded-md">
            <div className="flex items-center gap-2 w-20">
              By:
              <span className="opacity-50 font-bold">N/A</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default FoodItemPendingPreview;
