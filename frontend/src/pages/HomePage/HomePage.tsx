import {
  Navbar,
  CitizenBox,
  CitizenFormModal,
  Loader,
} from "../../components/components";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import { IoAdd, IoCaretDownOutline } from "react-icons/io5";
import { useFetchCitizen } from "../../hooks/useCitizenDataHook";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFilterStore } from "../../store/filterStore";
import { famousCities } from "../../utils/utils";
import { MdDelete } from "react-icons/md";

function HomePage() {
  const navigate = useNavigate();
  const { setPage, setSearch, setGender, setCities } = useFilterStore();
  const searchParams = new URLSearchParams(window.location.search);
  const currentPageParam = searchParams.get("page");
  const currPage = currentPageParam ? parseInt(currentPageParam) : 1;
  const { data, isLoading, refetch } = useFetchCitizen();
  const [currsearch, setCurrSearch] = useState("");

  useEffect(() => {
    setPage(currPage);
    refetch();
  }, [currPage]);

  const [isAddCitizenModalOpen, setIsAddCitizenModalOpen] = useState(false);
  const AddCitizenFormCloseBtn = () => {
    setIsAddCitizenModalOpen(false);
  };
  const [isLocationDropDownOpen, setIsLocationDropDownOpen] = useState(false);
  const [searchCities, setSearchCities] = useState("");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const handleSearchCitiyInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchCities(e.target.value);
  };
  const handleCitySelect = (city: string) => {
    if (!selectedCities.includes(city)) {
      setSelectedCities([...selectedCities, city]);
      setSearchCities(""); // Clear the search term after selecting a city
    }
  };

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [timerId, setTimerId] = useState<number | null>(null);
  useEffect(() => {
    if (data && data.total_pages < currPage) {
      navigate("/");
    }
  }, [data]);
  useEffect(() => {
    // This effect will run whenever currsearch changes
    const delay = 500; // Adjust the delay time as needed

    // Clear the previous timer
    if (timerId) {
      clearTimeout(timerId);
    }

    // Set a new timer to update debouncedSearch after the delay
    const id = setTimeout(() => {
      setDebouncedSearch(currsearch);
    }, delay);

    // Save the timer ID for cleanup
    setTimerId(id);

    // Cleanup function to clear the timer on component unmount or when currsearch changes
    return () => {
      clearTimeout(id);
    };
  }, [currsearch]);

  // Use debouncedSearch for actual search operations
  useEffect(() => {
    // Perform search operations using debouncedSearch value
    setSearch(debouncedSearch);
    refetch();
  }, [debouncedSearch]);

  useEffect(() => {
    setGender(
      filterGender == "Male" ? "Male" : filterGender == "Female" ? "Female" : ""
    );
    refetch();
  }, [filterGender]);

  useEffect(() => {
    setCities(selectedCities);
    console.log(selectedCities);
    refetch();
  }, [selectedCities]);

  return (
    <>
      <Navbar></Navbar>
      <div className="home-content w-full max-md:px-[1rem] px-[4rem] py-[2rem] ">
        <div className="search-area flex justify-center  items-center gap-3 ">
          <div className="search-box-container bg-white  max-lg:w-[75%] max-xl:w-[75%] w-[60%]  h-[2.6rem] flex items-center justify-between text-[20px] overflow-hidden rounded-[20px] border-[2px] ">
            <input
              type="text"
              value={currsearch}
              onChange={(e) => {
                const { value } = e.target;
                setCurrSearch(value);
              }}
              name="search"
              className="search w-[95%] h-full outline-none border-none ps-4 cursor-text "
              id=""
              placeholder="Search"
            />
            <IoIosSearch className="pe-2 w-[2rem] text-[1.6rem] cursor-pointer" />
          </div>
          <div className="btns-container flex gap-2">
            <div
              onClick={() => {
                setIsAddCitizenModalOpen(!isAddCitizenModalOpen);
              }}
              className="flex border-[1px] rounded-full bg-white px-4 items-center gap-2 p-1 text-[16px] cursor-pointer hover:text-[var(--font-red-colour)]"
            >
              Citizen
              <IoAdd className="text-[1.1rem]" />
            </div>
            {isAddCitizenModalOpen && (
              <CitizenFormModal action={"ADD"} close={AddCitizenFormCloseBtn} />
            )}
          </div>
        </div>
        <div className="filters-btn flex gap-7  flex-nowrap justify-center mt-3">
          <div className="relative">
            <div
              onClick={() => setIsLocationDropDownOpen(!isLocationDropDownOpen)}
              className="flex border-[1px] rounded-full bg-white px-4 items-center gap-2 p-1 text-[16px] cursor-pointer  hover:text-[var(--font-red-colour)]"
            >
              Location
              <IoCaretDownOutline className="text-[1.1rem]" />
            </div>
            {isLocationDropDownOpen && (
              <div className="absolute z-200 mt-1 left-0 top-[2.1rem] w-[15rem] px-2 h-[max-content] py-2 bg-white shadow-lg rounded-md ">
                <input
                  type="text"
                  value={searchCities}
                  onChange={handleSearchCitiyInputChange}
                  placeholder="Type to search cities"
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none  rounded-md"
                />
                {searchCities && (
                  <div className="absolute z-10 left-0 mt-1 w-full bg-white shadow-lg rounded-md">
                    {famousCities
                      .filter((city) =>
                        city
                          .toLowerCase()
                          .startsWith(searchCities.toLowerCase())
                      )
                      .slice(0, 5)
                      .map((city) =>
                        selectedCities.includes(city) ? (
                          <></>
                        ) : (
                          <div
                            key={city}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleCitySelect(city)}
                          >
                            {city}
                          </div>
                        )
                      )}
                  </div>
                )}
                <div className="mt-2">
                  <ul className="">
                    {selectedCities.map((city, index) => (
                      <div className="flex py-1 px-1 justify-between items-center ">
                        <li key={index} className=" ">
                          {city}
                        </li>
                        <MdDelete
                          className="text-[0.9rem] cursor-pointer"
                          onClick={() => {
                            setSelectedCities(
                              selectedCities.filter((sCity) => city != sCity)
                            );
                          }}
                        ></MdDelete>
                      </div>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          {filterGender.length == 0 ? (
            <select
              id="gender"
              name="gender"
              value={filterGender}
              onChange={(e) => {
                setFilterGender(e.target.value);
              }}
              className="flex border-[1px]  rounded-full bg-white px-4 items-center  p-1 text-[16px] cursor-pointer  hover:text-[var(--font-red-colour)]"
            >
              Gender
              <IoCaretDownOutline className="text-[1.1rem]" />
              <option value="" disabled hidden>
                Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <div
              onClick={() => setFilterGender("")}
              className="flex border-[1px] rounded-full bg-white px-4 items-center gap-2 p-1 text-[16px] cursor-pointer  hover:text-[var(--font-red-colour)]"
            >
              {filterGender} <IoMdClose className="text-[1.1rem]" />
            </div>
          )}
        </div>

        <div className="citizen-grid  mt-10  w-full flex flex-col items-center gap-5">
          {isLoading
            ? <Loader size={"2rem"} mssg="Free Server Might Take Some Time"></Loader>
            : data &&
              data.data &&
              data.data.map((citizen) => (
                <CitizenBox
                  key={citizen.citizen_id}
                  citizen={citizen}
                ></CitizenBox>
              ))}
        </div>
        <div className="flex items-center justify-center mt-8">
          {data && data.total_pages > 1 && (
            <>
              <button
                onClick={() =>
                  currPage == 2
                    ? navigate("/")
                    : navigate(`?page=${currPage - 1}`)
                }
                className={`${
                  data.previous_page != null
                    ? "text-[var(--font-red-colour)]  cursor-pointer"
                    : "text-gray-400 cursor-not-allowed"
                } mr-2`}
                disabled={data.previous_page == null ? true : false}
              >
                Previous
              </button>
              <div className="flex space-x-2">
                {Array.from(
                  { length: data.total_pages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => navigate(`?page=${page}`)}
                    className={`${
                      data.current_page === page
                        ? "bg-[var(--font-red-colour)] hover:bg-[#890d17] text-white font-bold py-2 px-4 rounded"
                        : "text-[var(--font-red-colour)] hover:text-[#890d17]"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => navigate(`?page=${currPage + 1}`)}
                className={`${
                  data.next_page != null
                    ? "text-[var(--font-red-colour)] hover:text-[#890d17] cursor-pointer"
                    : "text-gray-400 cursor-not-allowed"
                } ml-2`}
                disabled={data.next_page == null}
              >
                Next
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage;
