// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0

package database

import (
	"database/sql"
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
)

type FoodItemType string

const (
	FoodItemTypeVegetable FoodItemType = "vegetable"
	FoodItemTypeFruit     FoodItemType = "fruit"
	FoodItemTypeGrain     FoodItemType = "grain"
	FoodItemTypeProtein   FoodItemType = "protein"
	FoodItemTypeDairy     FoodItemType = "dairy"
)

func (e *FoodItemType) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = FoodItemType(s)
	case string:
		*e = FoodItemType(s)
	default:
		return fmt.Errorf("unsupported scan type for FoodItemType: %T", src)
	}
	return nil
}

type NullFoodItemType struct {
	FoodItemType FoodItemType
	Valid        bool // Valid is true if FoodItemType is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullFoodItemType) Scan(value interface{}) error {
	if value == nil {
		ns.FoodItemType, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.FoodItemType.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullFoodItemType) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.FoodItemType), nil
}

type NotificationType string

const (
	NotificationTypeUserLikeFoodItemPending NotificationType = "user-like-food-item-pending"
)

func (e *NotificationType) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = NotificationType(s)
	case string:
		*e = NotificationType(s)
	default:
		return fmt.Errorf("unsupported scan type for NotificationType: %T", src)
	}
	return nil
}

type NullNotificationType struct {
	NotificationType NotificationType
	Valid            bool // Valid is true if NotificationType is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullNotificationType) Scan(value interface{}) error {
	if value == nil {
		ns.NotificationType, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.NotificationType.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullNotificationType) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.NotificationType), nil
}

type UserRole string

const (
	UserRoleAdmin UserRole = "admin"
	UserRoleUser  UserRole = "user"
)

func (e *UserRole) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = UserRole(s)
	case string:
		*e = UserRole(s)
	default:
		return fmt.Errorf("unsupported scan type for UserRole: %T", src)
	}
	return nil
}

type NullUserRole struct {
	UserRole UserRole
	Valid    bool // Valid is true if UserRole is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullUserRole) Scan(value interface{}) error {
	if value == nil {
		ns.UserRole, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.UserRole.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullUserRole) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.UserRole), nil
}

type FoodItem struct {
	ID          uuid.UUID
	Name        string
	Description sql.NullString
	ImageUrl    sql.NullString
	FoodType    FoodItemType
	Calories    string
	Fat         string
	Protein     string
	Carbs       string
	CreatedAt   sql.NullTime
	UpdatedAt   sql.NullTime
}

type FoodItemsPending struct {
	ID          uuid.UUID
	Name        string
	Description sql.NullString
	ImageUrl    sql.NullString
	FoodType    FoodItemType
	Calories    string
	Fat         string
	Protein     string
	Carbs       string
	CreatedAt   sql.NullTime
	UpdatedAt   sql.NullTime
	UserID      uuid.UUID
}

type Meal struct {
	ID          uuid.UUID
	Name        string
	Description sql.NullString
	ImageUrl    sql.NullString
	CreatedAt   sql.NullTime
	UpdatedAt   sql.NullTime
	UserID      uuid.UUID
}

type MealConsumed struct {
	UserID    uuid.UUID
	MealID    uuid.UUID
	Date      time.Time
	CreatedAt time.Time
	UpdatedAt time.Time
}

type Notification struct {
	ID        uuid.UUID
	Type      NotificationType
	Data      json.RawMessage
	IsNew     bool
	CreatedAt sql.NullTime
	UpdatedAt sql.NullTime
	UserID    uuid.UUID
}

type RelMealFood struct {
	MealID     uuid.UUID
	FoodItemID uuid.UUID
	UserID     uuid.UUID
	Amount     sql.NullInt32
}

type RelUserLikeFoodItemPending struct {
	UserID     uuid.UUID
	FoodItemID uuid.UUID
}

type Session struct {
	ID           uuid.UUID
	UserID       uuid.UUID
	CreatedAt    sql.NullTime
	UpdatedAt    sql.NullTime
	ExpiresAt    sql.NullTime
	SessionToken string
	SessionData  json.RawMessage
}

type User struct {
	ID           uuid.UUID
	Email        string
	PasswordHash []byte
	Username     string
	ImageUrl     sql.NullString
	CreatedAt    sql.NullTime
	UpdatedAt    sql.NullTime
	Role         UserRole
}
