package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/dhruvsolanki0811/tsds-assgn-backend/usecase"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

var mongoClient *mongo.Client

func init() {
	err := godotenv.Load()

	if err != nil {
		log.Fatal("Env load error")
	}
	mongoClient, err = mongo.Connect(context.Background(), options.Client().ApplyURI(os.Getenv("MONGO_URI")))
	if err != nil {
		log.Fatal("Connection Error", err)
	}

	err = mongoClient.Ping(context.Background(), readpref.Primary())

	if err != nil {
		log.Fatal("Ping Failed!!", err)
	}
	log.Println("Mongo Client Connected")
}

func main() {
	defer mongoClient.Disconnect(context.Background())
	coll := mongoClient.Database(os.Getenv("DB_NAME")).Collection(os.Getenv("COLLECTION_NAME"))

	citizenService := usecase.CitizenService{MongoCollection: coll}

	r := mux.NewRouter()
	r.HandleFunc("/health", healthHandler).Methods(http.MethodGet)

	r.HandleFunc("/citizen", citizenService.CreateCitizenHandler).Methods(http.MethodPost)
	r.HandleFunc("/citizen", citizenService.FindFilteredCitizenHandler).Methods(http.MethodGet)

	r.HandleFunc("/citizen/{id}", citizenService.UpdateCitizenByIDHandler).Methods(http.MethodPut)
	r.HandleFunc("/citizen/{id}", citizenService.DeleteCitizenByIDHandler).Methods(http.MethodDelete)
	r.HandleFunc("/citizen/{id}", citizenService.FindCitizenByIdHandler).Methods(http.MethodGet)

	log.Println("Server is running 4444")
	http.ListenAndServe(":4444", r)

}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Running"))
}
