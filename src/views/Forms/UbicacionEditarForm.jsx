import React, { useState, useEffect } from "react";
import axios from "axios";
import MapModal from "../../components/ui/MapModal";
import connectionString from "../../components/connections/connection";
import "./ubicacionForm.css";

const UbicacionEditarForm = ({ idTotem, initialData, onClose, onSuccess }) => {
  const [nombre, setNombre] = useState("");
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [direccion, setDireccion] = useState("");
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Prellenar los datos con initialData si existe
  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre || "");
      setLatitud(initialData.latitud || "");
      setLongitud(initialData.longitud || "");
      setDireccion(initialData.direccion || "");
    }
  }, [initialData]);

  const handleOpenMap = () => setIsMapOpen(true);

  const handleCloseMap = () => setIsMapOpen(false);

  const handleLocationSelect = (lat, lng) => {
    setLatitud(lat);
    setLongitud(lng);
    handleCloseMap();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idTotem) {
      alert("Error: No se ha seleccionado un Tótem válido.");
      return;
    }

    const updatedData = {
      nombre,
      latitud,
      longitud,
      direccion,
      idTotem,
    };

    console.log("Datos enviados al backend para edición:", updatedData);

    try {
      await axios.put(`${connectionString}/Ubicaciones/${initialData.id}`, updatedData);
      alert("Cambios confirmados exitosamente");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error al actualizar la ubicación:", error.response?.data || error.message);
      alert("Error al confirmar los cambios");
    } finally {
      onClose();
    }
  };

  return (
    <div>
      <button className="close-button" onClick={onClose}>
        Cerrar
      </button>

      <h2>Editar Ubicación</h2>
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

        <button type="submit">Confirmar Cambios</button>
      </form>

      <MapModal
        isOpen={isMapOpen}
        onClose={handleCloseMap}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
};

export default UbicacionEditarForm;
