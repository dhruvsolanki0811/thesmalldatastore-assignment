import { create } from "zustand";

// Define the Zustand store type for the state
interface FilterStoreState {
  currentPage: number;
  search: string;
  gender: string;
  cities: string[];

  setCities: (cities: string[]) => void;
  setPage: (page: number) => void;
  setSearch: (page: string) => void;
  setGender: (gender: string) => void;
}

// Create the Zustand store
export const useFilterStore = create<FilterStoreState>((set) => ({
  currentPage: 1,
  search: "",
  gender: "",
  cities: [],
  setCities: (cities: string[]) => set({ cities: cities }),
  setGender: (gender: string) => set({ gender: gender }),
  setSearch: (search) => set({ search: search }),
  setPage: (page) => set({ currentPage: page }),
}));
