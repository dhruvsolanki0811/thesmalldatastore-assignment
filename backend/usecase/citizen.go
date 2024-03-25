package usecase

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/dhruvsolanki0811/tsds-assgn-backend/model"
	"github.com/dhruvsolanki0811/tsds-assgn-backend/repository"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
)

type CitizenService struct {
	MongoCollection *mongo.Collection
}

type Response struct {
	Data  interface{} `json:"data,omitempty"`
	Error string      `json:"error,omitempty"`
}

func (svc *CitizenService) CreateCitizenHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	res := &Response{}
	defer json.NewEncoder(w).Encode(res)
	var citizen model.Citizen
	err := json.NewDecoder(r.Body).Decode(&citizen)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		log.Println("Invalid Body", err)
		res.Error = err.Error()
		return
	}
	//assign new citizen Id
	citizen.ID = uuid.NewString()
	repo := repository.CitizenRepo{MongoCollection: svc.MongoCollection}
	insertId, err := repo.CreateCitizen(&citizen)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		log.Println("Insert Error")
		res.Error = err.Error()
	}
	res.Data = citizen.ID
	w.WriteHeader(http.StatusOK)
	log.Println("Citizen inserted with Id", insertId, citizen)

}

func (svc *CitizenService) FindCitizenByIdHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	res := &Response{}
	defer json.NewEncoder(w).Encode(res)
	citizenId := mux.Vars(r)["id"]
	log.Println("Citizen ID", citizenId)
	if citizenId == "" {
		w.WriteHeader(http.StatusBadRequest)
		log.Println("Invalid Citizen Id")
		res.Error = "Invalid Citizen Id"
		return
	}
	repo := repository.CitizenRepo{MongoCollection: svc.MongoCollection}
	citizen, err := repo.FindCitizenById(citizenId)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		log.Println("Error:", err)
		res.Error = err.Error()
		return
	}
	res.Data = citizen
	w.WriteHeader(http.StatusOK)

}
func (svc *CitizenService) FindCitizenAllHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	res := &Response{}
	defer json.NewEncoder(w).Encode(res)

	repo := repository.CitizenRepo{MongoCollection: svc.MongoCollection}
	citizens, err := repo.FindCitizenAll()
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		log.Println("Error:", err)
		res.Error = err.Error()
		return
	}
	res.Data = citizens
	w.WriteHeader(http.StatusOK)
}
func (svc *CitizenService) UpdateCitizenByIDHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	res := &Response{}
	defer json.NewEncoder(w).Encode(res)
	citizenId := mux.Vars(r)["id"]
	log.Println("Citizen Id", citizenId)
	if citizenId == "" {
		w.WriteHeader(http.StatusBadRequest)
		log.Println("Invalid Citizen Id")
		res.Error = "Invalid Citizen Id"
		return
	}
	var citizen model.Citizen

	err := json.NewDecoder(r.Body).Decode(&citizen)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		log.Println("Invalid Body", err)
		res.Error = err.Error()
		return
	}
	citizen.ID = citizenId
	repo := repository.CitizenRepo{MongoCollection: svc.MongoCollection}
	count, err := repo.UpdateCitizenByID(citizenId, &citizen)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		log.Println("Error:", err)
		res.Error = err.Error()
		return
	}
	res.Data = count
	w.WriteHeader(http.StatusOK)
}
func (svc *CitizenService) DeleteCitizenByIDHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	res := &Response{}
	defer json.NewEncoder(w).Encode(res)
	citizenId := mux.Vars(r)["id"]
	repo := repository.CitizenRepo{MongoCollection: svc.MongoCollection}
	count, err := repo.DeleteCitizenByID(citizenId)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		log.Println("Error:", err)
		res.Error = err.Error()
		return
	}
	res.Data = count
	w.WriteHeader(http.StatusOK)

}
