import React, { useEffect, useState } from "react";
import p2 from "../../assets/p2.png";
import p4 from "../../assets/p3.png";
import { useSelector, useDispatch } from "react-redux";
import { editTemplate } from "../../components/redux/totemSlice";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import connectionString from "../../components/connections/connection";

const SeleccionPlantilla = () => {
  const MySwal = withReactContent(Swal);
  const dispatch = useDispatch();
  const totemState = useSelector((state) => state.totem);

  const [totem, setTotem] = useState([]);
  useEffect(() => {
    setTotem(totemState.numeroPlantilla);
    console.log(totem);
  }, []);

  const handleSelectPlantilla = (plantillaId) => {
    fetch(
      connectionString + `/Totems/${totemState.idTotem}/numero-plantilla`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plantillaId),
      }
    )
      .then((response) => {
        if (response.ok) {
          dispatch(editTemplate(plantillaId));
          setTotem(plantillaId);
          MySwal.fire(
            "Platilla por defecto",
            "La informacion del totem se visualizará en la plantilla",
            "success"
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const port = [
    {
      id: 1,
      src: p4,
    },
    {
      id: 2,
      src: p2,
    },
  ];

  return (
    <div
      name="portfolio"
      className="bg-gradient-to-b from-black to-gray-800 w-full text-white h-full"
    >
      <div className="max-w-screen-lg p-4 mx-auto flex flex-col justify-center w-full h-full">
        <div className="pb-8">
          <p className="text-4xl font-bold inline border-b-4 border-gray-500">
            Plantillas
          </p>
          <p className="py-6">Seleccione la plantilla de su preferencia</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-8 px-12 sm:px-0 flex justify-center items-center">
          {port.map(({ id, src }) => (
            <div key={id} className="shadow-md shadow-gray-600 rounded-lg">
              <img
                src={src}
                alt=""
                className="rounded-md duration-200 hover:scale-105"
                style={{ maxHeight: "400px" }}
              />
              <div
                className={`flex items-center justify-center ${
                  totem == id ? "bg-blue-500" : ""
                }`}
              >
                <button
                  className="w-1/2 px-6 py-3 m-4 duration-200 hover:scale-105"
                  onClick={() => handleSelectPlantilla(id)}
                >
                  {`Plantilla ${id}`}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeleccionPlantilla;
