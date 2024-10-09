import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import ListPaginationButtons from "~/features/shared/components/ListPaginationButtons";
import { buttonVariants } from "~/features/shared/components/ui/button";
import { Input } from "~/features/shared/components/ui/input";
import { useDebounce } from "~/features/shared/hooks/useDebounce";
import useGetMealsByUserID from "../hooks/useGetMealsByUserID";
import MealPreview, {
  MealPreviewEmpty,
  MealPreviewSkeleton,
} from "./MealPreview";

function MealsList() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(4);
  const offset = useMemo(() => page * pageSize - pageSize, [page, pageSize]);
  const [textFilter, setTextFilter] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const debounceSetTextFilter = useDebounce(setTextFilter, 500);
  const {
    data: mealsWithNutrition,
    isLoading,
    isError,
  } = useGetMealsByUserID({
    limit: pageSize,
    offset,
    text_filter: textFilter,
  });
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    searchParams.forEach((value, key) => {
      if (key === "text_filter") {
        setTextFilter(value);
        setInputValue(value);
      }
      if (key === "page") {
        setPage(Number(value));
      }
    });
  }, [searchParams]);

  function onChangePage(type: "next" | "prev") {
    if (
      type === "next" &&
      mealsWithNutrition?.total_pages &&
      page < mealsWithNutrition.total_pages
    ) {
      setPage((prev) => prev + 1);
      setSearchParams({ page: String(page + 1) });
    }
    if (type === "prev" && mealsWithNutrition?.total_pages && page > 1) {
      setPage((prev) => prev - 1);
      setSearchParams({ page: String(page - 1) });
    }
  }

  function onTextFilterChange(ev: React.ChangeEvent<HTMLInputElement>) {
    debounceSetTextFilter(() => {
      setSearchParams({ text_filter: ev.target.value });
      return ev.target.value;
    });
    setInputValue(ev.target.value);
  }

  if (isLoading) {
    return (
      <DashboardContentCards title="Meals">
        <div className="flex justify-end gap-2">
          <Input
            placeholder="Search..."
            onChange={onTextFilterChange}
            value={inputValue}
          />
          <Link className={buttonVariants()} to="/dashboard/meal/add">
            Add Meal
          </Link>
        </div>
        <div className="mt-2 grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-4">
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
        <div className="flex justify-end gap-2">
          <Input
            placeholder="Search..."
            onChange={onTextFilterChange}
            value={inputValue ?? ""}
          />
          <Link className={buttonVariants()} to="/dashboard/meal/add">
            Add Meal
          </Link>
        </div>
        <div className="mt-2 grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-4">
          <div>An error occurred</div>
        </div>
      </DashboardContentCards>
    );
  }

  return (
    <DashboardContentCards title="Meals">
      <div className="flex justify-end gap-2">
        <Input
          placeholder="Search..."
          onChange={onTextFilterChange}
          value={inputValue}
        />
        <Link className={buttonVariants()} to="/dashboard/meal/add">
          Add Meal
        </Link>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-4">
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
