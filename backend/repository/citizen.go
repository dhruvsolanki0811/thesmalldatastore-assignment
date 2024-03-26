package repository

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/dhruvsolanki0811/tsds-assgn-backend/model"
	"github.com/globalsign/mgo/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type CitizenRepo struct {
	MongoCollection *mongo.Collection
}

func (r *CitizenRepo) CreateCitizen(citizen *model.Citizen) (interface{}, error) {
	result, err := r.MongoCollection.InsertOne(context.Background(), citizen)
	if err != nil {
		return nil, err
	}
	return result.InsertedID, nil
}

func (r *CitizenRepo) FindCitizenById(citizenId string) (*model.Citizen, error) {
	var citizen model.Citizen
	filter := bson.M{"citizen_id": citizenId} // Assuming citizenId is of type string

	err := r.MongoCollection.FindOne(context.Background(), filter).Decode(&citizen)
	if err != nil {
		return nil, err
	}

	return &citizen, nil
}

func (r *CitizenRepo) FindCitizenAll() ([]model.Citizen, error) {
	results, err := r.MongoCollection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	var citizens []model.Citizen
	err = results.All(context.Background(), &citizens)
	if err != nil {
		return nil, fmt.Errorf("results decode error %s", err.Error())
	}
	return citizens, nil
}

func (r *CitizenRepo) UpdateCitizenByID(citizenID string, updateCitizen *model.Citizen) (int64, error) {
	filter := bson.M{"citizen_id": citizenID}
	update := bson.M{"$set": updateCitizen}

	result, err := r.MongoCollection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return 0, err
	}
	return result.ModifiedCount, nil
}

func (r *CitizenRepo) DeleteCitizenByID(citizenID string) (int64, error) {
	filter := bson.M{"citizen_id": citizenID}

	result, err := r.MongoCollection.DeleteOne(context.Background(), filter)
	if err != nil {
		return 0, err
	}
	return result.DeletedCount, nil
}

func (r *CitizenRepo) FindFilteredCitizenAll(pageNum, pageSize int, searchQuery, state, city, gender string) ([]model.Citizen, int, int, error) {
	// Create a filter based on the search query, state, city, and gender
	filter := bson.M{}
	if searchQuery != "" {
		filter["$or"] = []bson.M{
			{"first_name": bson.M{"$regex": primitive.Regex{Pattern: searchQuery, Options: "i"}}},
			{"last_name": bson.M{"$regex": primitive.Regex{Pattern: searchQuery, Options: "i"}}},
			// Add more fields to search here if needed
		}
	}
	if state != "" {
		filter["state"] = state
	}
	if city != "" {
		filter["city"] = city
	}
	if gender != "" {
		filter["gender"] = gender
	}

	// Count total records based on the filter
	totalRecords, err := r.MongoCollection.CountDocuments(context.Background(), filter)
	if err != nil {
		return nil, 0, 0, err
	}

	// Calculate total pages based on total records and page size
	totalPages := int(totalRecords) / pageSize
	if int(totalRecords)%pageSize != 0 {
		totalPages++
	}

	findOptions := options.Find()
	findOptions.SetSkip(int64((pageNum - 1) * pageSize))
	findOptions.SetLimit(int64(pageSize))

	cursor, err := r.MongoCollection.Find(context.Background(), filter, findOptions)
	if err != nil {
		return nil, 0, 0, err
	}
	defer cursor.Close(context.Background())

	var citizens []model.Citizen
	err = cursor.All(context.Background(), &citizens)
	if err != nil {
		return nil, 0, 0, fmt.Errorf("results decode error %s", err.Error())
	}

	return citizens, totalPages, int(totalRecords), nil
}
