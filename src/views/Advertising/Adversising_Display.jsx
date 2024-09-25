import "./styleCard.css";
import Advertising from "./Advertising";
import Modal from "./form_Advertising/FormAdd";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { addPublicidades } from "../../components/redux/publicidadSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import connectionString from "../../components/connections/connection";

export function AdvertisingDisplay() {
  const dispatch = useDispatch();
  const publicidadesState = useSelector((state) => state.publicidad);
  const [state, changeModalState] = useState(false);
  const [publicidades, setPublicidad] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    if(publicidadesState.publicidades === null){
      fetch(connectionString + `/PublicidadT/${id.slice(1)}`)
      .then((response) => response.json())
      .then((data) => {
        dispatch(addPublicidades(data));
        setPublicidad(data);
      })
      .catch((error) => console.log(error));
    } else {
      setPublicidad(publicidadesState.publicidades);
    }
  }, [publicidadesState.publicidades]);
  console.log(publicidades);
  return (
    <>
      <Modal state={state} changeState={changeModalState}></Modal>
      <div class="background overflow-y-auto">
        <button
          class="rounded-full bg-blue-500 px-5 py-3 text-base mb-3 font-medium text-white transition duration-200 hover:bg-blue-600 active:bg-blue-700 mt-10 ml-10"
          onClick={() => changeModalState(!state)}
        >
          Nueva Publicidad
        </button>
        <div class="flex flex-wrap justify-center items-center">
          {publicidades.map((publicidad) => (
            <Advertising
              date={publicidad.fechaFin}
              src={'' + publicidad.urlPublicidad}
              idPublicidad={publicidad.idPublicidad}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default AdvertisingDisplay;