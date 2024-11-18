import React, { useState, useEffect } from "react";
import axios from "axios";
import MapModal from "../../components/ui/MapModal";
import Swal from "sweetalert2";
import connectionString from "../../components/connections/connection";
import "./ubicacionForm.css";

const UbicacionEditarForm = ({ idTotem, initialData, onClose, onSuccess }) => {
  const [nombre, setNombre] = useState("");
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [direccion, setDireccion] = useState("");
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para bloquear botón durante la operación

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
      Swal.fire("Error", "No se ha seleccionado un tótem válido.", "error");
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
      setIsSubmitting(true); // Bloquear el botón mientras se envían los datos
      const response = await axios.put(
        `${connectionString}/Ubicaciones/${initialData.id}`,
        updatedData
      );
      if (response.status === 204) {
        Swal.fire("Éxito", "Los cambios han sido guardados correctamente.", "success");
        if (onSuccess) onSuccess();
      } else {
        Swal.fire("Error", "No se pudieron guardar los cambios.", "error");
      }
    } catch (error) {
      console.error("Error al actualizar la ubicación:", error.response?.data || error.message);
      Swal.fire("Error", "Ocurrió un problema al guardar los cambios.", "error");
    } finally {
      setIsSubmitting(false); // Liberar el bloqueo del botón
      onClose();
    }
  };

  return (
    <div>
      <button className="close-button" onClick={onClose} disabled={isSubmitting}>
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
          disabled={isSubmitting} // Bloquear mientras se envían los datos
        />

        <label>Latitud</label>
        <input
          type="text"
          value={latitud}
          onClick={handleOpenMap}
          readOnly
          placeholder="Seleccione en el mapa"
          disabled={isSubmitting} // Bloquear mientras se envían los datos
        />

        <label>Longitud</label>
        <input
          type="text"
          value={longitud}
          onClick={handleOpenMap}
          readOnly
          placeholder="Seleccione en el mapa"
          disabled={isSubmitting} // Bloquear mientras se envían los datos
        />

        <label>Dirección</label>
        <input
          type="text"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Ingrese la dirección"
          disabled={isSubmitting} // Bloquear mientras se envían los datos
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Confirmar Cambios"}
        </button>
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
