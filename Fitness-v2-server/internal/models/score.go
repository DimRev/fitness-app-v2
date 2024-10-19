package models

type Score struct {
	TotalScore    int `json:"total_score"`
	PendingScore  int `json:"pending_score"`
	ApprovedScore int `json:"approved_score"`
}
