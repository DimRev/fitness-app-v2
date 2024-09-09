import React from "react";
import { useNavigate } from "react-router-dom";
import { H2 } from "~/features/shared/components/Typography";
import {
  Card,
  CardContent,
  CardHeader,
} from "~/features/shared/components/ui/card";
import { Skeleton } from "~/features/shared/components/ui/skeleton";

type Props = {
  mealWithNutrition: MealWithNutrition;
};

function MealPreview({ mealWithNutrition }: Props) {
  const navigate = useNavigate();
  return (
    <Card
      className="hover:shadow-sm antialiased transition-all duration-500 cursor-pointer hover:scale-[1.03]"
      onClick={() =>
        navigate(`/dashboard/meal/details/${mealWithNutrition.meal.id}`)
      }
    >
      <CardHeader>
        <H2>{mealWithNutrition.meal.name}</H2>
      </CardHeader>
      <CardContent>
        <div className="gap-2 grid grid-cols-[3fr_2fr]">
          <div className="line-clamp-3 break-words">
            {mealWithNutrition.meal.description ?? "No description"}
          </div>
          <div className="truncate">
            <div className="flex justify-between items-center gap-2">
              <div>Calories:</div>
              <div>{mealWithNutrition.total_calories.toFixed(2)}</div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div>Fat:</div>
              <div>{mealWithNutrition.total_fat.toFixed(2)}</div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div>Carbs:</div>
              <div>{mealWithNutrition.total_carbs.toFixed(2)}</div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div>Protein:</div>
              <div>{mealWithNutrition.total_protein.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MealPreviewSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="w-full h-4" />
      </CardHeader>
      <CardContent>
        <div className="gap-2 grid grid-cols-[3fr_2fr]">
          <div className="flex flex-col gap-2">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
          </div>
          <div className="truncate">
            <div className="flex justify-between items-center gap-2">
              <div>Calories:</div>
              <div className="text-end">
                <Skeleton className="w-20 h-4" />
              </div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div>Fat:</div>
              <div className="text-end">
                <Skeleton className="w-20 h-4" />
              </div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div>Carbs:</div>
              <div className="text-end">
                <Skeleton className="w-20 h-4" />
              </div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div>Protein:</div>
              <div className="text-end">
                <Skeleton className="w-20 h-4" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MealPreviewEmpty() {
  return (
    <Card className="opacity-50">
      <CardHeader>
        <H2>Empty</H2>
      </CardHeader>
      <CardContent>
        <div className="gap-2 grid grid-cols-[3fr_2fr]">
          <div>N/A</div>
          <div className="truncate">
            <div className="flex justify-between items-center gap-2">
              <div>Calories:</div>
              <div className="text-end">0.00</div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div>Fat:</div>
              <div className="text-end">0.00</div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div>Carbs:</div>
              <div className="text-end">0.00</div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div>Protein:</div>
              <div className="text-end">0.00</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MealPreview;
