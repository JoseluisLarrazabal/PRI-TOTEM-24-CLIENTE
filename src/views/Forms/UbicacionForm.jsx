import React, { useState } from "react";
import axios from "axios";
import connectionString from "../../components/connections/connection";

function UbicacionForm() {
  const [nombre, setNombre] = useState("");
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [direccion, setDireccion] = useState("");
  const [activo, setActivo] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const nuevaUbicacion = {
        nombre,
        latitud: parseFloat(latitud),
        longitud: parseFloat(longitud),
        direccion,
        activo,
      };

      await axios.post(`${connectionString}/Ubicaciones`, nuevaUbicacion);
      alert("Ubicación agregada exitosamente");
      // Limpiar el formulario después de enviar
      setNombre("");
      setLatitud("");
      setLongitud("");
      setDireccion("");
      setActivo(true);
    } catch (error) {
      console.error("Error al agregar la ubicación:", error);
      alert("Hubo un error al agregar la ubicación");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Agregar Nueva Ubicación</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Latitud</label>
          <input
            type="number"
            value={latitud}
            onChange={(e) => setLatitud(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Longitud</label>
          <input
            type="number"
            value={longitud}
            onChange={(e) => setLongitud(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Dirección</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Activo</label>
          <input
            type="checkbox"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Guardar Ubicación
        </button>
      </form>
    </div>
  );
}

export default UbicacionForm;
