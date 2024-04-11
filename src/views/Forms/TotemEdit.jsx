import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addTotem } from "../../components/redux/totemSlice";
import connectionString from "../../components/connections/connection";

const TotemEdit = () => {
  const dispatch = useDispatch();

  const { id } = useParams();
  const [viewLogo, setViewLogo] = useState([]);
  const [logo, setLogo] = useState(null);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState(null);
  const totemState = useSelector((state) => state.totem);
  let [totem, setTotem] = useState({
    nombre: totemState.nombre || "",
    numeroPlantilla: totemState.numeroPlantilla || "",
  });

  const handleImageChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    setLogo(file);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (totemState.idTotem === null) {
      fetch(connectionString + `/Totems/${id.slice(1)}`)
        .then((response) => response.json())
        .then((data) => {
          const totem = {
            idTotem: data.idTotem,
            nombre: data.nombre,
            numeroPlantilla: data.numeroPlantilla,
            urlLogo: 'data:image/png;base64,' + data.urlLogo,
          };
          setViewLogo(totem.urlLogo);
          dispatch(addTotem(totem));
          setTotem(totem);
        })
        .catch((error) => console.log(error));
    } else {
      setTotem(totemState);
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setTotem((prevState) => ({
      ...prevState,
      [name]: value,
      [event.target.name]:
        event.target.type === "file"
          ? event.target.files[0]
          : event.target.value,
    }));
    
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();
    setLogo(file);
    reader.onloadend = () => {
      setTotem((prevState) => ({
        ...prevState,
        urlLogo: reader.result,
      }));
      
    };


    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let { nombre, numeroPlantilla } = totem;
    
    if (!nombre || !numeroPlantilla) {
      alert("Por favor llene todos los campos del formulario.");
      return;
    }
    console.log(logo);
    const formData = new FormData();
    formData.append("nombre",nombre);
    formData.append("numeroPlantilla",numeroPlantilla);
    if(logo!=null){
      formData.append("imagen",logo);
    }
    axios
      .put(connectionString + `/Totems/${id.slice(1)}`, formData)
      .then((response) => {
        console.log(response);
        setMensajeConfirmacion("El totem se ha modificado correctamente.");
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          // Redirigir a la página de inicio de sesión
          console.log(error);
        } else {
          console.log(error);
        }
      });
  };
  return (
    <div className="flex items-center justify-center">
      <img className="h-60 w-60 rounded-full" src={totem.urlLogo} width="100" height="100" ></img>
      <div className="container mx-auto">
      </div>
      <div className="container mx-auto">
      <p className="text-4xl font-bold inline border-b-4 border-gray-500">
        Editar Totem
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="nombre"
            className="block text-gray-700 font-bold mb-2"
          >
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={totem.nombre || ""}
            onChange={handleChange}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="numeroPlantilla"
            className="block text-gray-700 font-bold mb-2"
          >
            Numero plantilla
          </label>
          <input
            type="number"
            id="numeroPlantilla"
            max={2}
            min={1}
            name="numeroPlantilla"
            value={totem.numeroPlantilla}
            onChange={handleChange}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="imagen"
            className="block text-gray-700 font-bold mb-2"
          >
            Imagen
          </label>
          <input
            type="file"
            id="urlLogo"
            name="urlLogo"
            accept="image/*"
            src={viewLogo}
            onChange={handleFileChange}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Guardar cambios
          </button>
          <br></br>
          <br></br>
          {mensajeConfirmacion && <p>{mensajeConfirmacion}</p>}
        </div>
      </form>
    </div>
    </div>
  );
};
export default TotemEdit;
