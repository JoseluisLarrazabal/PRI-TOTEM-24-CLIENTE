import React, { useState, useEffect } from "react";
import axios from "axios";
import MapModal from "../../components/ui/MapModal";
import connectionString from "../../components/connections/connection";
import "./ubicacionForm.css";

const UbicacionForm = ({ idTotem, onClose, onSuccess }) => {
  const [nombre, setNombre] = useState("");
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [direccion, setDireccion] = useState("");
  const [isMapOpen, setIsMapOpen] = useState(false);

  const handleOpenMap = () => setIsMapOpen(true);

  const handleCloseMap = () => setIsMapOpen(false);

  const handleLocationSelect = (lat, lng) => {
    setLatitud(lat);
    setLongitud(lng);
    handleCloseMap();
  };

  const clearForm = () => {
    setNombre("");
    setLatitud("");
    setLongitud("");
    setDireccion("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idTotem) {
      alert("Error: No se ha seleccionado un Tótem válido.");
      return;
    }

    const ubicacionData = {
      nombre,
      latitud,
      longitud,
      direccion,
      idTotem,
    };

    console.log("Datos enviados al backend:", ubicacionData);

    try {
      await axios.post(`${connectionString}/Ubicaciones`, ubicacionData);
      alert("Ubicación guardada exitosamente");
      clearForm();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error al guardar la ubicación:", error.response?.data || error.message);
      alert("Error al guardar la ubicación");
    }
  };

  return (
    <div>
      <button className="close-button" onClick={onClose}>
        Cerrar
      </button>

      <h2>Agregar Nueva Ubicación</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ingrese el nombre de la ubicación"
          required
        />

        <label>Latitud</label>
        <input
          type="text"
          value={latitud}
          onClick={handleOpenMap}
          readOnly
          placeholder="Seleccione en el mapa"
        />

        <label>Longitud</label>
        <input
          type="text"
          value={longitud}
          onClick={handleOpenMap}
          readOnly
          placeholder="Seleccione en el mapa"
        />

        <label>Dirección</label>
        <input
          type="text"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Ingrese la dirección"
        />

        <button type="submit">Guardar Ubicación</button>
      </form>

      <MapModal
        isOpen={isMapOpen}
        onClose={handleCloseMap}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
};

export default UbicacionForm;
