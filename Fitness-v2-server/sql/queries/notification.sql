-- name: CreateNotification :exec
INSERT INTO notifications (
  type, 
  data, 
  user_id
) 
VALUES (
  $1, 
  $2, 
  $3
);

-- name: GetNewUserNotifications :many
SELECT * FROM notifications
WHERE user_id = $1
AND is_new = TRUE
ORDER BY created_at DESC;

-- name: MarkNotificationAsRead :exec
UPDATE notifications
SET is_new = FALSE
WHERE id = $1
AND user_id = $2;