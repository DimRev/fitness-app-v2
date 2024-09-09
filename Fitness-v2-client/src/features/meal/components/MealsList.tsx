import { Link } from "react-router-dom";
import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import { buttonVariants } from "~/features/shared/components/ui/button";
import useGetMealsByUserID from "../hooks/useGetMealsByUserID";
import MealPreview, {
  MealPreviewEmpty,
  MealPreviewSkeleton,
} from "./MealPreview";
import ListPaginationButtons from "~/features/shared/components/ListPaginationButtons";
import { useMemo, useState } from "react";

function MealsList() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const offset = useMemo(() => page * pageSize - pageSize, [page, pageSize]);
  const {
    data: mealsWithNutrition,
    isLoading,
    isError,
  } = useGetMealsByUserID({
    limit: pageSize,
    offset,
  });

  function onChangePage(type: "next" | "prev") {
    if (
      type === "next" &&
      mealsWithNutrition?.total_pages &&
      page < mealsWithNutrition.total_pages
    ) {
      setPage((prev) => prev + 1);
    }
    if (type === "prev" && mealsWithNutrition?.total_pages && page > 1) {
      setPage((prev) => prev - 1);
    }
  }

  if (isLoading) {
    return (
      <DashboardContentCards title="Meals">
        <div className="flex justify-end">
          <Link className={buttonVariants()} to="/dashboard/meal/add">
            Add Meal
          </Link>
        </div>
        <div className="gap-3 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 mt-2">
          <MealPreviewSkeleton />
          <MealPreviewSkeleton />
          <MealPreviewSkeleton />
          <MealPreviewSkeleton />
        </div>
        <ListPaginationButtons
          page={page}
          onChangePage={onChangePage}
          totalPages={mealsWithNutrition}
        />
      </DashboardContentCards>
    );
  }
  if (isError || !mealsWithNutrition) {
    return (
      <DashboardContentCards title="Meals">
        <div className="flex justify-end">
          <Link className={buttonVariants()} to="/dashboard/meal/add">
            Add Meal
          </Link>
        </div>
        <div className="gap-3 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 mt-2">
          <div>An error occurred</div>
        </div>
      </DashboardContentCards>
    );
  }

  return (
    <DashboardContentCards title="Meals">
      <div className="flex justify-end">
        <Link className={buttonVariants()} to="/dashboard/meal/add">
          Add Meal
        </Link>
      </div>
      <div className="gap-3 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 mt-2">
        {mealsWithNutrition.meals.map((mealWithNutrition) => (
          <MealPreview
            key={mealWithNutrition.meal.id}
            mealWithNutrition={mealWithNutrition}
          />
        ))}
        {new Array(pageSize - mealsWithNutrition.meals.length)
          .fill("")
          .map((_, idx) => (
            <MealPreviewEmpty key={idx} />
          ))}
      </div>
      <ListPaginationButtons
        page={page}
        onChangePage={onChangePage}
        totalPages={mealsWithNutrition.total_pages}
      />
    </DashboardContentCards>
  );
}

export default MealsList;
