import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { deleteLocations } from "../../components/redux/locationSlice";
import { useSelector, useDispatch } from "react-redux";
import connectionString from "../../components/connections/connection";

function EditLocacion() {
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const { id } = useParams();
  const totem = useSelector((state) => state.totem);
  const dispatch = useDispatch();
  const [locacion, setLocacion] = useState({
    nombre: "",
    descripcion: "",
    keywords: [],
    idTotem: null,
    imagenesCarrucel: null,
    imagenMapa: null,
  });

  useEffect(() => {
    axios
      .get(connectionString + `/Locaciones/${id}`)
      .then((response) => {
        setLocacion(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLocacion((prevLocacion) => ({
      ...prevLocacion,
      [name]: value,
    }));
  };

  const handleKeywordsChange = (event) => {
    const { value } = event.target;
    setLocacion((prevLocacion) => ({
      ...prevLocacion,
      keywords: value.split(","),
    }));
  };

  const handleImagenesCarrucelChange = (event) => {
    const { files } = event.target;
    setLocacion((prevLocacion) => ({
      ...prevLocacion,
      imagenesCarrucel: files,
    }));
  };

  const handleImagenMapaChange = (event) => {
    const { files } = event.target;
    setLocacion((prevLocacion) => ({
      ...prevLocacion,
      imagenMapa: files[0],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("nombre", locacion.nombre);
    formData.append("descripcion", locacion.descripcion);
    formData.append("keywords", locacion.keywords);
    formData.append("idTotem", locacion.idTotem);

    // formData.append("imagenesCarrucel", locacion.imagenesCarrucel);

    // formData.append("imagenMapa", locacion.imagenMapa);

    if (locacion.imagenesCarrucel) {
      for (let i = 0; i < locacion.imagenesCarrucel.length; i++) {
        formData.append("imagenesCarrucel", locacion.imagenesCarrucel[i]);
      }
    }

    if (locacion.imagenMapa) {
      formData.append("imagenMapa", locacion.imagenMapa);
    }
    axios
      .put(connectionString + `/Locaciones/${id}`, formData)
      .then((response) => {
        MySwal.fire({
          icon: "success",
          title: "Locación Actializada",
          showConfirmButton: false,
          timer: 1700,
        });
      
        
        dispatch(deleteLocations());
        navigate(`/ListaLocaciones/:${totem.idTotem}`);

        //console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>

          <input
            type="text"
            name="nombre"
            value={locacion.nombre}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Descripción:</label>

          <textarea
            name="descripcion"
            className="border border-gray-300 rounded-lg p-2 w-full"
            value={locacion.descripcion}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Palabras clave:</label>

          <input
            type="text"
            name="keywords"
            value={locacion.keywords}
            onChange={handleKeywordsChange}
          />
        </div>

        <div hidden>
          <label>Id Totem:</label>

          <input
            type="number"
            name="idTotem"
            value={locacion.idTotem}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Imágenes de carrusel:</label>

          <input
            className="border border-gray-300 rounded-lg p-2"
            type="file"
            name="imagenesCarrucel"
            multiple
            onChange={handleImagenesCarrucelChange}
          />
        </div>

        <div>
          <label>Imagen del mapa:</label>

          <input
            className="border border-gray-300 rounded-lg p-2"
            type="file"
            name="imagenMapa"
            onChange={handleImagenMapaChange}
          />
        </div>
        <div className="flex justify-start mt-6">
          <button
            className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
            type="submit"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditLocacion;