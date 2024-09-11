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
      className="cursor-pointer antialiased transition-all duration-500 hover:scale-[1.03] hover:shadow-sm"
      onClick={() =>
        navigate(`/dashboard/meal/details/${mealWithNutrition.meal.id}`)
      }
    >
      <CardHeader>
        <H2>{mealWithNutrition.meal.name}</H2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[3fr_2fr] gap-2">
          <div className="line-clamp-3 break-words">
            {mealWithNutrition.meal.description ?? "No description"}
          </div>
          <div className="truncate">
            <div className="flex items-center justify-between gap-2">
              <div>Calories:</div>
              <div>{mealWithNutrition.total_calories.toFixed(2)}</div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div>Fat:</div>
              <div>{mealWithNutrition.total_fat.toFixed(2)}</div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div>Carbs:</div>
              <div>{mealWithNutrition.total_carbs.toFixed(2)}</div>
            </div>
            <div className="flex items-center justify-between gap-2">
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
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[3fr_2fr] gap-2">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="truncate">
            <div className="flex items-center justify-between gap-2">
              <div>Calories:</div>
              <div className="text-end">
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div>Fat:</div>
              <div className="text-end">
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div>Carbs:</div>
              <div className="text-end">
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div>Protein:</div>
              <div className="text-end">
                <Skeleton className="h-4 w-20" />
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
        <div className="grid grid-cols-[3fr_2fr] gap-2">
          <div>N/A</div>
          <div className="truncate">
            <div className="flex items-center justify-between gap-2">
              <div>Calories:</div>
              <div className="text-end">0.00</div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div>Fat:</div>
              <div className="text-end">0.00</div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div>Carbs:</div>
              <div className="text-end">0.00</div>
            </div>
            <div className="flex items-center justify-between gap-2">
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
