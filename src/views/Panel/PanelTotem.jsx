import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate, useLocation } from "react-router-dom";
import "tailwindcss/tailwind.css";
import connectionString from "../../components/connections/connection";

import { useSelector, useDispatch } from "react-redux";
import { addTotem, deleteTotem } from "../../components/redux/totemSlice";
import { deleteLocations } from "../../components/redux/locationSlice";
import { deletePublicidades } from "../../components/redux/publicidadSlice";

const PanelTotem = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const MySwal = withReactContent(Swal);
  dispatch(deleteTotem());
  dispatch(deleteLocations());
  dispatch(deletePublicidades());

  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [totems, setTotems] = useState([]);

  const handleDelete = (id) => {
    console.log(id);
    fetch(connectionString + `/Totems/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        dispatch(deleteTotem());
        MySwal.fire("Eliminado", "YSe elimino el totem correctamente", "success");
        navigate("/Panel");
      })
      .then((data) => { })
      .catch((error) => console.log(error));
  };

  const handleUploadFile = (id, file) => {
    const formData = new FormData()
    formData.append("file", file)
    MySwal.fire({
      title: 'Subiendo archivo...',
      html: `
        <div class="progress-bar-wrapper">
          <div id="progress-bar" class="progress-bar" style="width: 0%; height: 20px; background-color: #3085d6;"></div>
        </div>
      `,
      showCancelButton: false,
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        MySwal.showLoading();
        axios.post(`${connectionString}/Archivo/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            const progressBar = document.getElementById('progress-bar');
            if (progressBar) {
              progressBar.style.width = `${progress}%`;
            }
          }
        })
          .then(res => {
            if (res.status === 201) {
              MySwal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Archivo subido exitosamente',
                confirmButtonColor: "#3085d6"
              });
            } else {
              MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo subir el archivo',
                confirmButtonColor: "#d33"
              });
            }
          })
          .catch(err => {
            console.error(err);
            MySwal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al subir el archivo',
              confirmButtonColor: "#d33"
            });
          });
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          connectionString + `/TotemU/${user.idUsuario}`
        );
        setTotems(response.data);
      } catch (error) {
        setError("Error al cargar los datos del usuario: " + error.message);
        console.log(error);
      }
    };
    fetchData();
  }, [location]);

  function chargeDataTotem(id) {
    fetch(connectionString + `/Totems/${id}`)
      .then((response) => response.json())
      .then((data) => {
        const totem = {
          idTotem: data.idTotem,
          nombre: data.nombre,
          numeroPlantilla: data.numeroPlantilla,
          urlLogo: data.urlLogo,
        };
        dispatch(addTotem(totem));
      })
      .catch((error) => console.log(error));
  }

  return (
    <>
      <div className="flex-1 flex flex-col justify-center items-center">
        {user.loginMode === "admin" && (
          <button
            className="text-white text-xm font-bold rounded-lg bg-green-500 inline-block mt-4 mb-10 ml-10 mr-auto py-5 px-10 cursor-pointer"
            name="btnNew"
            onClick={() => {
              navigate(`/TotemNew`);
            }}
          >
            Nuevo Totem
          </button>
        )}
        <div className="flex flex-wrap justify-center items-center">
          {totems.map(({ idTotem, urlLogo, nombre }) => (
            <div>
              {user.loginMode === "admin" && (
                <>
                  <button
                    onClick={() =>
                      MySwal.fire({
                        title: "Subir archivo PDF",
                        text: "Elija un archivo PDF",
                        html: `<div class="flex justify-center items-center">
                                <input type="file" id="pdfFile" class="swal2-input" accept=".pdf" />
                              </div>`,
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Subir",
                        preConfirm: () => {
                          const fileInput = document.getElementById('pdfFile');
                          if (fileInput.files.length === 0) {
                            Swal.showValidationMessage('Por favor, selecciona un archivo PDF');
                            return false;
                          }
                          return fileInput.files[0];
                        }
                      }).then((result) => {
                        if (result.isConfirmed) {
                          const file = result.value;
                          handleUploadFile(idTotem, file)
                        }
                      })
                    }
                    className="text-white text-xs font-bold rounded-t-lg bg-blue-500 inline-block mt--4 ml-80 py-3 px-7 cursor-pointer"
                  >
                    Subir PDF
                  </button>
                  <button
                    onClick={() =>
                      MySwal.fire({
                        title: "¿Deseas eliminar este totem?",
                        text: "Todas sus locaciónes y publicidades seran eliminadas tambien",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Eliminar",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          handleDelete(idTotem);
                        }
                      })
                    }
                    className="text-white text-xs font-bold rounded-t-lg bg-red-500 inline-block mt--4 ml-1 py-3 px-7 cursor-pointer"
                  >
                    Eliminar
                  </button>
                </>

              )}
              <a
                onClick={() => {
                  if (user.loginMode === "admin") {
                    navigate(`/TotemEdit/:${idTotem}`);
                  } else {
                    chargeDataTotem(idTotem);
                    navigate(`/Template`);
                  }
                }}
              >
                <div className="card hover:bg-gray-200 shadow-2xl rounded-lg transition delay-300 duration-300 ease-in-out cursor-pointer p-4">
                  <div className="flex flex-row justify-center">
                    <img className="w-40 image rounded-lg" src={'data:image/png;base64,' + urlLogo} />

                    <div className="mx-6 content px-5 flex flex-col justify-center">
                      <div className="text-xl">{user.institucion}</div>
                      <div className="text-md">{nombre}</div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default PanelTotem;
