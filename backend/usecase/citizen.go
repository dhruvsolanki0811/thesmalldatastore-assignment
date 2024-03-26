package usecase

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

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
func (svc *CitizenService) FindFilteredCitizenHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	response := make(map[string]interface{})

	queryParams := r.URL.Query()
	pageStr := queryParams.Get("page")
	limitStr := queryParams.Get("limit")
	searchQuery := queryParams.Get("search")
	state := queryParams.Get("state")
	city := queryParams.Get("city")
	gender := queryParams.Get("gender")

	page, err := strconv.Atoi(pageStr)
	if err != nil || page <= 0 {
		page = 1
	}

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 2 // default limit
	}

	repo := repository.CitizenRepo{MongoCollection: svc.MongoCollection}
	citizens, totalPages, totalRecords, err := repo.FindFilteredCitizenAll(page, limit, searchQuery, state, city, gender)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		log.Println("Error:", err)
		response["error"] = err.Error()
		json.NewEncoder(w).Encode(response)
		return
	}

	response["data"] = citizens
	response["total_pages"] = totalPages
	response["current_page"] = page
	response["total_records"] = totalRecords
	response["records_current_page"] = len(citizens)
	response["limit"] = limit

	if page*limit < totalRecords {
		response["next_page"] = page + 1
	} else {
		response["next_page"] = nil
	}

	if page > 1 {
		response["previous_page"] = page - 1
	} else {
		response["previous_page"] = nil
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
