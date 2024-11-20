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

  // Limpieza inicial del estado global
  useEffect(() => {
    dispatch(deleteTotem());
    dispatch(deleteLocations());
    dispatch(deletePublicidades());
  }, [dispatch]);

  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [totems, setTotems] = useState([]);

  // Manejo de eliminación de tótems
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${connectionString}/Totems/${id}`);
      dispatch(deleteTotem());
      MySwal.fire("Eliminado", "Se eliminó el tótem correctamente", "success");
      navigate("/Panel");
    } catch (error) {
      console.error("Error al eliminar el tótem:", error);
    }
  };

  // Manejo de carga de archivo
  const handleUploadFile = (id, file) => {
    const formData = new FormData();
    formData.append("file", file);

    MySwal.fire({
      title: "Subiendo archivo...",
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
        axios
          .post(`${connectionString}/Archivo/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              const progressBar = document.getElementById("progress-bar");
              if (progressBar) {
                progressBar.style.width = `${progress}%`;
              }
            },
          })
          .then((res) => {
            if (res.status === 201) {
              MySwal.fire({
                icon: "success",
                title: "Éxito",
                text: "Archivo subido exitosamente",
                confirmButtonColor: "#3085d6",
              });
            } else {
              MySwal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo subir el archivo",
                confirmButtonColor: "#d33",
              });
            }
          })
          .catch((err) => {
            console.error("Error al subir archivo:", err);
            MySwal.fire({
              icon: "error",
              title: "Error",
              text: "Ocurrió un error al subir el archivo",
              confirmButtonColor: "#d33",
            });
          });
      },
    });
  };

  // Carga inicial de tótems
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${connectionString}/TotemU/${user.idUsuario}`);
        setTotems(response.data);
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
      }
    };
    fetchData();
  }, [location, user.idUsuario]);

  // Manejo de datos del tótem
  const chargeDataTotem = async (id) => {
    try {
      const response = await axios.get(`${connectionString}/Totems/${id}`);
      const data = response.data;
      const totem = {
        idTotem: data.idTotem,
        nombre: data.nombre,
        numeroPlantilla: data.numeroPlantilla,
        urlLogo: data.urlLogo,
      };
      dispatch(addTotem(totem));
    } catch (error) {
      console.error("Error al cargar datos del tótem:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      {user.loginMode === "admin" && (
        <button
          className="text-white text-sm font-bold rounded-lg bg-green-500 mt-4 mb-10 py-2 px-4"
          onClick={() => navigate(`/TotemNew`)}
        >
          Nuevo Tótem
        </button>
      )}
      <div className="flex flex-wrap justify-center items-center gap-4">
        {totems.map(({ idTotem, urlLogo, nombre }) => (
          <div key={idTotem} className="card hover:bg-gray-200 shadow-2xl rounded-lg p-4">
            {user.loginMode === "admin" && (
              <div className="flex justify-between mb-2">
                <button
                  className="text-white text-xs font-bold bg-blue-500 py-1 px-3 rounded-lg"
                  onClick={() =>
                    MySwal.fire({
                      title: "Subir archivo PDF",
                      html: `<input type="file" id="pdfFile" class="swal2-input" accept=".pdf" />`,
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Subir",
                      preConfirm: () => {
                        const fileInput = document.getElementById("pdfFile");
                        if (!fileInput.files.length) {
                          Swal.showValidationMessage("Por favor, selecciona un archivo PDF");
                          return false;
                        }
                        return fileInput.files[0];
                      },
                    }).then((result) => {
                      if (result.isConfirmed) handleUploadFile(idTotem, result.value);
                    })
                  }
                >
                  Subir PDF
                </button>
                <button
                  className="text-white text-xs font-bold bg-red-500 py-1 px-3 rounded-lg"
                  onClick={() =>
                    MySwal.fire({
                      title: "¿Deseas eliminar este tótem?",
                      text: "Todas sus locaciones y publicidades serán eliminadas también",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Eliminar",
                    }).then((result) => {
                      if (result.isConfirmed) handleDelete(idTotem);
                    })
                  }
                >
                  Eliminar
                </button>
              </div>
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
              <div className="flex items-center">
                <img className="w-40 rounded-lg" src={`data:image/png;base64,${urlLogo}`} alt={`Logo de ${nombre}`} />
                <div className="ml-4">
                  <div className="text-xl font-bold">{user.institucion}</div>
                  <div className="text-md">{nombre}</div>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PanelTotem;
