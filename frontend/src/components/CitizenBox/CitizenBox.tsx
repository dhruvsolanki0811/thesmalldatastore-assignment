import { IoIosFemale, IoIosMale } from "react-icons/io";
import { Citizen } from "../../types/type";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useDeleteCitizen } from "../../hooks/useCitizenDataHook";
import { CitizenFormModal, Loader } from "../components";
import { useState } from "react";

function CitizenBox({ citizen }: { citizen: Citizen }) {
  const { mutate: deleteCitizen, isPending } = useDeleteCitizen();
  const [isEditCitizenModalOpen,setIsEditCitizenModalOpen]=useState(false)
  const EditCitizenFormCloseBtn=()=>{
    setIsEditCitizenModalOpen(false)
  }
  return (
    <>
      <div className="citizen-box cursor-default w-full flex flex-col border-[1px] px-2 py-2  overflow-hidden overflow-y-auto shadow-md">
        <div className="name-section flex gap-2 items-center justify-between ">
          <div className="name-container flex gap-1 text-[20px] font-medium  text-[var(--font-red-colour)]">
            <div className="first-name">{citizen.first_name}</div>
            <div className="LAST-name">{citizen.last_name}</div>
          </div>
          <div className="btn-container flex gap-[2rem]">
            {
            isPending
             ?
                <Loader size="15px"></Loader>
             : (
              <MdDelete
                onClick={() => {
                  deleteCitizen(citizen.citizen_id);
                }}
                className="text-[22px] cursor-pointer  hover:text-[var(--font-red-colour)] "
              />
            )}
            <FaEdit onClick={()=>{setIsEditCitizenModalOpen(true)}}className="text-[22px] cursor-pointer  hover:text-[var(--font-red-colour)] " />
            {isEditCitizenModalOpen&& <><CitizenFormModal action={"EDIT"} close={EditCitizenFormCloseBtn} editData={citizen}/></>}

          </div>
        </div>
        <div className="age-section flex gap-2 items-center  text-[18px]">
          <div className="gender-container flex items-center gap-1">
            {citizen.gender.toLowerCase() === "male" ? (
              <IoIosMale className="text-[18px] " />
            ) : (
              <IoIosFemale className="text-[18px] " />
            )}
            <span className="gender">{citizen.gender}</span>
          </div>
          <div className="age">DOB-{citizen.date_of_birth} </div>
        </div>
        <div className="city-container flex mt-[2px] gap-2">
          <div className="city">
            {citizen.city},{citizen.state}{" "}
          </div>
          <div className="pincode">Pincode-{citizen.pincode}</div>
        </div>
        <div className="address-container flex mt-[2px] gap-2">
          <p className="address">{citizen.address}</p>
        </div>
      </div>
    </>
  );
}

export default CitizenBox;
