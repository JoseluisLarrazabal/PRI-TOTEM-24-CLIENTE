import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { deleteLocations } from "../../components/redux/locationSlice";
import connectionString from "../../components/connections/connection";

function Locacion() {
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [keywords, setKeywords] = useState('');
  const [imagenMapa, setImagenMapa] = useState(null);
  const [imagenesCarrucel, setImagenesCarrucel] = useState(null);
  const totem = useSelector((state) => state.totem);
    let idTotem = totem.idTotem;

    const handleSubmit = async (event) => {
      event.preventDefault();
    
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('descripcion', descripcion);
      formData.append('keywords', keywords);
      formData.append('idTotem', idTotem);
      formData.append('imagenMapa', imagenMapa);
    
      // Agregar imágenes de carrusel individualmente
      if (imagenesCarrucel && imagenesCarrucel.length > 0) {
        for (let i = 0; i < imagenesCarrucel.length; i++) {
          formData.append('imagenesCarrucel', imagenesCarrucel[i]);
        }
      }
    
      try {
        const response = await axios.post(connectionString + '/Locaciones', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        //console.log(response.data);
        MySwal.fire({
          icon: 'success',
          title: 'Locación registrada',
          showConfirmButton: false,
          timer: 1700
        });
        dispatch(deleteLocations());
        navigate(`/ListaLocaciones/:${idTotem}`);
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <form onSubmit={handleSubmit}>
      {/* <a
        href={`/ListaLocaciones/:${totem}`}
        className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-5"
      >
        Lista Locaciones
      </a> */}
      <label>
        Nombre:
        <input required type="text" value={nombre} onChange={(event) => setNombre(event.target.value)} />
      </label>
      <br />
      <label htmlFor="descripcion" className="block mb-2">
        Descripción:
        <textarea
          required
          id="descripcion"
          name="descripcion"
          value={descripcion}
          maxLength={249}
          onChange={(event) => setDescripcion(event.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full"
        ></textarea>
      </label>

      <br />
      <label>
        Palabras clave:
        <input required type="text" value={keywords} onChange={(event) => setKeywords(event.target.value)} />
      </label>
      <br />
      <label htmlFor="imagenMapa" className="block mb-2">
        Imagen de mapa:
        <input
          required
          type="file"
          id="imagenMapa"
          name="imagenMapa"
          onChange={(event) => setImagenMapa(event.target.files[0])}
          accept="image/*"
          className="border border-gray-300 rounded-lg p-2"
        />
      </label>

      <br />
      <label>
        Imágenes de carrusel:
        <input
          required
          type="file"
          className="border border-gray-300 rounded-lg p-2"
          multiple
          accept="image/*"
          onChange={(event) => setImagenesCarrucel(event.target.files)}
        />
      </label>
      <br />

      <div className="flex justify-start mt-6">
        <button
          className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
          type="submit"
        >
          Guardar
        </button>
      </div>
      <br></br>
    </form>
  );
}

export default Locacion;