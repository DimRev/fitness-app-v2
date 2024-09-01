import { Link } from "react-router-dom";
import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import { buttonVariants } from "~/features/shared/components/ui/button";
import useGetFoodItemsPending from "../hooks/useGetFoodItemsPending";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "~/features/shared/components/ui/table";
import { Heart, XCircleIcon } from "lucide-react";
import { Skeleton } from "~/features/shared/components/ui/skeleton";
import useToggleFoodItemPending from "../hooks/useToggleFoodItemPending";

function FoodItemsPendingList() {
  const {
    data: foodItemsPending,
    isLoading: foodItemsPendingLoading,
    isError: foodItemsPendingError,
  } = useGetFoodItemsPending({
    limit: 10,
    offset: 0,
  });
  const { mutateAsync: toggleFoodItemPending } = useToggleFoodItemPending();

  function handleToggleFoodItemPending(foodItemPendingId: string) {
    void toggleFoodItemPending({
      food_item_pending_id: foodItemPendingId,
    });
  }

  if (foodItemsPendingLoading) {
    return (
      <DashboardContentCards title="Food Items">
        <div className="flex justify-end">
          <Link className={buttonVariants()} to="/dashboard/food_item/add">
            Add Food Item
          </Link>
        </div>
        <Table>
          <TableCaption>Food Items</TableCaption>
          <TableHeader>
            <TableRow>
              <TableCell>Liked</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Likes</TableCell>
              <TableCell>Food Type</TableCell>
              <TableCell>Calories</TableCell>
              <TableCell>Protein</TableCell>
              <TableCell>Fat</TableCell>
              <TableCell>Carbs</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SkeletonTableRow />
            <SkeletonTableRow />
            <SkeletonTableRow />
            <SkeletonTableRow />
          </TableBody>
        </Table>
      </DashboardContentCards>
    );
  }

  if (foodItemsPendingError || !foodItemsPending) {
    return (
      <DashboardContentCards title="Food Items">
        <div className="flex justify-end">
          <Link className={buttonVariants()} to="/dashboard/food_item/add">
            Add Food Item
          </Link>
        </div>
        <Table>
          <TableCaption>Food Items</TableCaption>
          <TableHeader>
            <TableRow>
              <TableCell>Liked</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Likes</TableCell>
              <TableCell>Food Type</TableCell>
              <TableCell>Calories</TableCell>
              <TableCell>Protein</TableCell>
              <TableCell>Fat</TableCell>
              <TableCell>Carbs</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={10}
                rowSpan={4}
                className="font-bold text-center text-destructive text-lg"
              >
                <span className="flex justify-center items-center gap-2">
                  <XCircleIcon /> An Error Has Occurred
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DashboardContentCards>
    );
  }

  return (
    <DashboardContentCards title="Food Items">
      <div className="flex justify-end">
        <Link className={buttonVariants()} to="/dashboard/food_item/add">
          Add Food Item
        </Link>
      </div>
      <Table>
        <TableCaption>Food Items</TableCaption>
        <TableHeader>
          <TableRow>
            <TableCell>Liked</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Likes</TableCell>
            <TableCell>Food Type</TableCell>
            <TableCell>Calories</TableCell>
            <TableCell>Protein</TableCell>
            <TableCell>Fat</TableCell>
            <TableCell>Carbs</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {foodItemsPending.map((foodItemPending) => (
            <TableRow key={foodItemPending.id}>
              <TableCell>
                {foodItemPending.liked ? (
                  <Heart
                    fill="red"
                    className="cursor-pointer"
                    onClick={() =>
                      handleToggleFoodItemPending(foodItemPending.id)
                    }
                  />
                ) : (
                  <Heart
                    className="cursor-pointer"
                    onClick={() =>
                      handleToggleFoodItemPending(foodItemPending.id)
                    }
                  />
                )}
              </TableCell>
              <TableCell>{foodItemPending.name}</TableCell>
              <TableCell>{foodItemPending.description}</TableCell>
              <TableCell>{foodItemPending.author_name}</TableCell>
              <TableCell>{foodItemPending.likes}</TableCell>
              <TableCell>{foodItemPending.food_type}</TableCell>
              <TableCell>{foodItemPending.calories}</TableCell>
              <TableCell>{foodItemPending.protein}</TableCell>
              <TableCell>{foodItemPending.fat}</TableCell>
              <TableCell>{foodItemPending.carbs}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardContentCards>
  );
}

function SkeletonTableRow() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="w-full h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-4" />
      </TableCell>
    </TableRow>
  );
}

export default FoodItemsPendingList;
