package repository

import (
	"context"
	"fmt"

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
