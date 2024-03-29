import React, { useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { famousCities, famousStates } from "../../utils/utils";
import { useAddCitizen, useEditCitizen } from "../../hooks/useCitizenDataHook";
import { Citizen } from "../../types/type";
import { Loader } from "../components";

interface FormData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}
interface AddCitizenFormProps {
  close: () => void;
  action: "EDIT" | "ADD";
  editData?: Citizen;
}

const CitizenFormModal: React.FC<AddCitizenFormProps> = ({
  close,
  action,
  editData,
}) => {
  const modalContainer = useRef<HTMLDivElement>(null);
  const [isCityInputFocused, setIsCityInputFocused] = useState(false);
  const [isStateInputFocused, setIsStateInputFocused] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    first_name: editData && editData.first_name ? editData.first_name : "",
    last_name: editData && editData.last_name ? editData.last_name : "",
    date_of_birth:
      editData && editData.date_of_birth ? editData.date_of_birth : "",
    gender: editData && editData.gender ? editData.gender : "",
    address: editData && editData.address ? editData.address : "",
    city: editData && editData.city ? editData.city : "",
    state: editData && editData.state ? editData.state : "",
    pincode: editData && editData.pincode ? editData.pincode : "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      modalContainer.current &&
      !modalContainer.current.contains(e.target as Node)
    ) {
      close();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.body.style.overflow = "auto";
    };
  }, [close]);
  const { mutate: addCitizen, isPending: isAddLoading } = useAddCitizen();
  const { mutate: editCitizen, isPending: isEditLoading } = useEditCitizen();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (action === "ADD") {
      addCitizen(formData);
      setFormData({} as FormData);
    } else if (action === "EDIT" && editData) {
      editCitizen({ citizen_id: editData.citizen_id, ...formData });
    }
    // Prevent default form submission
    // console.log("Form Data:", formData); // Log the form data (you can replace this with your actual submission logic)
  };
  return (
    <>
      <div className="overlay fixed bottom-0 left-0 z-50 h-[100vh] w-[100vw] bg-black bg-opacity-40 flex items-center justify-center"></div>
      <div className="fixed bottom-0 left-0 z-50 h-full w-full flex items-center justify-center">
        <div
          ref={modalContainer}
          className="form-container bg-white rounded-md shadow-lg p-8 w-[50vw] max-sm:w-[100vw] max-xl:w-[70vw] "
        >
          <div className="flex justify-between items-center mb-2">
            <div className="text-[20px] font-semibold">Add Citizen</div>
            <IoMdClose
              className="text-gray-500 text-[25px] cursor-pointer hover:text-red-500"
              onClick={close}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1 mb-2">
              <label
                htmlFor="first_name"
                className="block text-[17px] font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="Enter your first name"
                required
                className="input-field outline-none w-full border-[2px] rounded-[10px] px-3 py-[6px] py-[3px] py-[1px] h-[2.1rem] "
              />
            </div>
            <div className="flex flex-col gap-1 mb-2">
              <label
                htmlFor="last_name"
                className="block text-[17px] font-medium text-gray-700"
              >
                Last Name:
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Enter your last name"
                required
                className="input-field outline-none w-full border-[2px] rounded-[10px] px-3 py-[6px] py-[3px] py-[1px] h-[2.1rem]"
              />
            </div>
            <div className="flex flex-col gap-1 mb-2">
              <label
                htmlFor="date_of_birth"
                className="block text-[17px] font-medium text-gray-700"
              >
                Date of Birth:
              </label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                placeholder="Select your date of birth"
                required
                className="input-field outline-none w-full border-[2px] rounded-[10px] px-3 py-[6px] py-[3px] py-[1px] h-[2.1rem]"
              />
            </div>
            <div className="flex flex-col gap-1 mb-2">
              <label
                htmlFor="gender"
                className="block text-[17px] font-medium text-gray-700"
              >
                Gender:
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="input-field outline-none w-full border-[2px] rounded-[10px] px-3 py-[6px] py-[3px] py-[1px] h-[2.1rem] outline-none"
                required
              >
                <option value="" disabled hidden>
                  Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 mb-2">
              <label
                htmlFor="address"
                className="block text-[17px] font-medium text-gray-700"
              >
                Address:
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
                required
                className="input-field outline-none w-full border-[2px] rounded-[10px] px-3 py-[6px] py-[3px] py-[1px] h-[2.1rem]"
              />
            </div>
            <div className="flex flex-col gap-1 mb-2 relative">
              <label
                htmlFor="city"
                className="block text-[17px] font-medium text-gray-700"
              >
                City:
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter your city"
                onClick={() => setIsCityInputFocused(true)}
                required
                className="input-field outline-none w-full border-[2px] rounded-[10px] px-3 py-[6px] py-[3px] py-[1px] h-[2.1rem]"
              />
              {isCityInputFocused && formData.city.length > 0 && (
                <ul className="absolute top-[3.7rem] left-0 z-10 mt-1 py-1 bg-white border border-gray-300 w-full shadow-md rounded-md">
                  {famousCities
                    .filter((city) =>
                      city.toLowerCase().startsWith(formData.city.toLowerCase())
                    )
                    .slice(0, 5)
                    .map((city) => (
                      <li
                        key={city}
                        className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setFormData({ ...formData, city: city });
                          setIsCityInputFocused(false);
                        }}
                      >
                        {city}
                      </li>
                    ))}
                  {/* Check if entered city is not in the list */}
                  {famousCities.filter((city) =>
                    city.toLowerCase().startsWith(formData.city.toLowerCase())
                  ).length === 0 && (
                    <li
                      className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setFormData({ ...formData, city: formData.city }); // Set the typed city as is
                        setIsCityInputFocused(false);
                      }}
                    >
                      {formData.city}
                    </li>
                  )}
                </ul>
              )}
            </div>
            <div className="flex flex-col gap-1 mb-2 relative">
              <label
                htmlFor="state"
                className="block text-[17px] font-medium text-gray-700"
              >
                State:
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                onClick={() => setIsStateInputFocused(true)}
                required
                placeholder="Enter the States"
                className="input-field outline-none w-full border-[2px] rounded-[10px] px-3 py-[6px] py-[3px] py-[1px] h-[2.1rem]"
              />
              {isStateInputFocused && formData.state.length > 0 && (
                <ul className="absolute top-[3.7rem] left-0 z-10 mt-1 py-1 bg-white border border-gray-300 w-full shadow-md rounded-md">
                  {famousStates
                    .filter((state) =>
                      state
                        .toLowerCase()
                        .startsWith(formData.state.toLowerCase())
                    )
                    .slice(0, 5)
                    .map((state) => (
                      <li
                        key={state}
                        className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setFormData({ ...formData, state: state });
                          setIsStateInputFocused(false);
                        }}
                      >
                        {state}
                      </li>
                    ))}
                  {/* Check if entered state is not in the list */}
                  {famousStates.filter((state) =>
                    state.toLowerCase().startsWith(formData.state.toLowerCase())
                  ).length === 0 && (
                    <li
                      className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setFormData({ ...formData, state: formData.state }); // Set the typed state as is
                        setIsStateInputFocused(false);
                      }}
                    >
                      {formData.state}
                    </li>
                  )}
                </ul>
              )}
            </div>
            <div className="flex flex-col gap-1 mb-2">
              <label
                htmlFor="pincode"
                className="block text-[17px] font-medium text-gray-700"
              >
                Pincode:
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                required
                placeholder="Enter the Pincode"
                className="input-field outline-none w-full border-[2px] rounded-[10px] px-3 py-[6px] py-[3px] py-[1px] h-[2.1rem]"
              />
            </div>
            <div className="flex justify-center mt-6">
              {isAddLoading || isEditLoading ? (
                <Loader size=""></Loader>
              ) : (
                <button
                  type="submit"
                  className="btn bg-[var(--font-red-colour)] text-white px-4 py-2 rounded-md hover:bg-[#890d17]"
                >
                  {action == "ADD" ? "Add Citizen" : "Edit Citizen"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CitizenFormModal;
