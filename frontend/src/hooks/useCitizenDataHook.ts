import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Citizen, CitizenPaginatedData } from "../types/type";
import { useFilterStore } from "../store/filterStore";

const apiUrl = import.meta.env.VITE_API_URL;

export const useFetchCitizen = () => {
        const{currentPage,search,gender,cities}=useFilterStore()

    const fetchCitizen = async (): Promise<CitizenPaginatedData> => {   
        const citiesQueryString = cities.length > 0 ? `&city=${cities.join('&city=')}` : '';

    const response = await axios.get(`${apiUrl}/citizen?limit=4${currentPage ? `&page=${currentPage}` : ''}${search.length > 0 ? `&search=${search}` : ''}${gender.length > 0 ? `&gender=${gender}` : ''}${citiesQueryString}`
    );
    return response.data;
  };

  return useQuery({ queryKey: ["all-citizens",currentPage,search,gender,cities.sort().toString()], queryFn: fetchCitizen });
};

export const useAddCitizen = () => {
        const{currentPage,search,gender,cities}=useFilterStore()


    const addCitizen = async (body: {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  }) => {
    const response = await axios.post(`${apiUrl}/citizen`, body);
    return response.data;
  };
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCitizen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-citizens",currentPage,search,gender,cities.sort().toString()] });
    },
  });
};

export const useDeleteCitizen = () => {
        const{currentPage,search,gender,cities}=useFilterStore()


  const deleteCitizen = async (id: string) => {
    const response = await axios.delete(`${apiUrl}/citizen/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  };

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCitizen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-citizens",currentPage,search,gender,cities.sort().toString()] });
    },
  });
};

export const useEditCitizen = () => {
        const{currentPage,search,gender,cities}=useFilterStore()


  const editCitizen = async (body: Citizen) => {
    const response = await axios.put(`${apiUrl}/citizen/${body.citizen_id}`, body);
    return response.data;
  };
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editCitizen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-citizens",currentPage,search,gender,cities.sort().toString()] });
    },
  });
};
