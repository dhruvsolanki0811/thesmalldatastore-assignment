export interface Citizen {
    citizen_id: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
}
export interface CitizenPaginatedData {
    current_page: number;
    data: Citizen[];
    limit: number;
    next_page: number | null;
    previous_page: number | null;
    records_current_page: number;
    total_pages: number;
    total_records: number;
}
  