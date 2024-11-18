import React, { useState } from "react";
import axios from "axios";
import MapModal from "../../components/ui/MapModal";
import Swal from "sweetalert2"; // Importar SweetAlert
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

  // Validar que cada palabra comience con mayúscula y no tenga espacios extra
  const validateInput = (input) => {
    const trimmed = input.trim(); // Elimina espacios al inicio y al final
    const isValid = /^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/.test(trimmed); // Valida formato de palabras
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idTotem) {
      Swal.fire("Error", "No se ha seleccionado un Tótem válido.", "error");
      return;
    }

    // Validar los campos 'nombre' y 'dirección'
    if (!validateInput(nombre)) {
      Swal.fire(
        "Error en Nombre",
        "El campo 'Nombre' debe comenzar cada palabra con mayúscula y no contener espacios innecesarios.",
        "error"
      );
      return;
    }

    if (!validateInput(direccion)) {
      Swal.fire(
        "Error en Dirección",
        "El campo 'Dirección' debe comenzar cada palabra con mayúscula y no contener espacios innecesarios.",
        "error"
      );
      return;
    }

    const ubicacionData = {
      nombre: nombre.trim(),
      latitud: latitud,
      longitud: longitud,
      direccion: direccion.trim(),
      idTotem,
    };

    console.log("Datos enviados al backend:", ubicacionData);

    try {
      await axios.post(`${connectionString}/Ubicaciones`, ubicacionData);
      Swal.fire("Éxito", "Ubicación guardada exitosamente.", "success");
      clearForm();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(
        "Error al guardar la ubicación:",
        error.response?.data || error.message
      );
      Swal.fire(
        "Error",
        "Ocurrió un problema al guardar la ubicación. Por favor, inténtelo de nuevo.",
        "error"
      );
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
          required
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
