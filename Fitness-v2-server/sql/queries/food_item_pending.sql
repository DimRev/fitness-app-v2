-- name: GetFoodItemsPending :many
SELECT 
  fip.*, 
  COUNT(rufip.user_id) AS likes,
  EXISTS (
    SELECT 1 
    FROM rel_user_like_food_item_pending rufip_check
    WHERE rufip_check.food_item_id = fip.id 
    AND rufip_check.user_id = $1
  ) AS liked,
  u.username
FROM food_items_pending fip
LEFT JOIN rel_user_like_food_item_pending rufip ON rufip.food_item_id = fip.id
LEFT JOIN users u ON u.id = fip.user_id
GROUP BY fip.id, u.username
ORDER BY likes DESC
LIMIT $2
OFFSET $3;

-- name: GetFoodItemsPendingByUserIDWithTextFilter :many
SELECT 
  fip.*, 
  COUNT(rufip.user_id) AS likes,
  EXISTS (
    SELECT 1 
    FROM rel_user_like_food_item_pending rufip_check
    WHERE rufip_check.food_item_id = fip.id 
    AND rufip_check.user_id = $1
  ) AS liked,
  u.username
FROM food_items_pending fip
LEFT JOIN rel_user_like_food_item_pending rufip ON rufip.food_item_id = fip.id
LEFT JOIN users u ON u.id = fip.user_id
WHERE fip.user_id = $1
AND fip.name ILIKE '%' || $2 || '%'
GROUP BY fip.id, u.username
ORDER BY likes DESC
LIMIT $3
OFFSET $4;

-- name: GetFoodItemsPendingTotalPages :one
SELECT COUNT(*) AS total_pages
FROM food_items_pending;

-- name: GetFoodItemsPendingTotalPagesWithTextFilter :one
SELECT COUNT(*) AS total_pages
FROM food_items_pending
WHERE name ILIKE '%' || $1 || '%';

-- name: GetFoodItemsPendingByUserID :many
SELECT 
  fip.*, 
  COUNT(rufip.user_id) AS likes,
  EXISTS (
    SELECT 1 
    FROM rel_user_like_food_item_pending rufip_check
    WHERE rufip_check.food_item_id = fip.id 
    AND rufip_check.user_id = $1
  ) AS liked,
  u.username
FROM food_items_pending fip
LEFT JOIN rel_user_like_food_item_pending rufip ON rufip.food_item_id = fip.id
LEFT JOIN users u ON u.id = fip.user_id
WHERE fip.user_id = $1
GROUP BY fip.id, u.username
ORDER BY likes DESC
LIMIT $2
OFFSET $3;

-- name: GetFoodItemsPendingByUserTotalPages :one
SELECT COUNT(*) AS total_pages
FROM food_items_pending
WHERE user_id = $1;

-- name: CreateFoodItemPending :one
INSERT INTO food_items_pending (
    name, 
    description, 
    image_url, 
    food_type, 
    calories, 
    fat, 
    protein, 
    carbs,
    user_id
  ) 
VALUES (
  $1, 
  $2, 
  $3, 
  $4, 
  $5, 
  $6, 
  $7, 
  $8,
  $9
) 
RETURNING *;

-- name: GetFoodItemPendingLikeForUser :one
SELECT * FROM rel_user_like_food_item_pending
WHERE user_id = $1
AND food_item_id = $2;

-- name: LikeFoodItemPendingForUser :exec
INSERT INTO rel_user_like_food_item_pending (
    user_id, 
    food_item_id
  ) 
VALUES (
  $1, 
  $2
);

-- name: GetFoodItemPendingOwnerId :one
SELECT u.id as owner_id, fip.name as food_item_pending_name
FROM food_items_pending fip
JOIN users u ON u.id = fip.user_id
WHERE fip.id = $1;


-- name: UnlikeFoodItemPendingForUser :exec
DELETE FROM rel_user_like_food_item_pending
WHERE user_id = $1
AND food_item_id = $2;

-- name: ApproveFoodItemPending :exec
WITH moved_item AS (
    DELETE FROM food_items_pending
    WHERE food_items_pending.id = $1
    RETURNING name, description, image_url, food_type, calories, fat, protein, carbs
)
INSERT INTO food_items (
    name, 
    description, 
    image_url, 
    food_type, 
    calories, 
    fat, 
    protein, 
    carbs
) 
SELECT 
    name, 
    description, 
    image_url, 
    food_type, 
    calories, 
    fat, 
    protein, 
    carbs
FROM moved_item;

-- name: RejectFoodItemPending :exec
DELETE FROM food_items_pending
WHERE food_items_pending.id = $1;