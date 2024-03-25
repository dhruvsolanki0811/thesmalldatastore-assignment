package model

type Citizen struct {
	ID          string `json:"citizen_id,omitempty" bson:"citizen_id"`
	FirstName   string `json:"first_name,omitempty" bson:"first_name"`
	LastName    string `json:"last_name,omitempty" bson:"last_name"`
	DateOfBirth string `json:"date_of_birth,omitempty" bson:"date_of_birth"`
	Gender      string `json:"gender,omitempty" bson:"gender"`
	Address     string `json:"address,omitempty" bson:"address"`
	City        string `json:"city,omitempty" bson:"city"`
	State       string `json:"state,omitempty" bson:"state"`
	Pincode     string `json:"pincode,omitempty" bson:"pincode"`
}
