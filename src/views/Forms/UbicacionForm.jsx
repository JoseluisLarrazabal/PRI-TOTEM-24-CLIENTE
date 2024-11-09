import React, { useState } from "react";
import axios from "axios";
import MapModal from "../../components/ui/MapModal"; // Ajusta la ruta según donde tengas MapModal
import connectionString from "../../components/connections/connection";

const UbicacionForm = () => {
  const [nombre, setNombre] = useState("");
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [direccion, setDireccion] = useState("");
  const [activo, setActivo] = useState(true);
  const [isMapOpen, setIsMapOpen] = useState(false); // Controla la visibilidad del modal

  const handleOpenMap = () => {
    setIsMapOpen(true);
  };

  const handleCloseMap = () => {
    setIsMapOpen(false);
  };

  const handleLocationSelect = (lat, lng) => {
    setLatitud(lat);
    setLongitud(lng);
    handleCloseMap(); // Cierra el modal una vez seleccionada la ubicación
  };

  // Función para limpiar los campos después de guardar
  const clearForm = () => {
    setNombre("");
    setLatitud("");
    setLongitud("");
    setDireccion("");
    setActivo(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Enviar datos a la base de datos
      await axios.post(`${connectionString}/Ubicaciones`, {
        nombre,
        latitud,
        longitud,
        direccion,
        activo,
    });
    

      // Mostrar mensaje de éxito y limpiar el formulario
      alert("Ubicación guardada exitosamente");
      clearForm();
    } catch (error) {
      console.error("Error al guardar la ubicación:", error);
      alert("Error al guardar la ubicación");
    }
  };

  return (
    <div>
      <h2>Agregar Nueva Ubicación</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <label>Latitud</label>
        <input
          type="text"
          value={latitud}
          onClick={handleOpenMap} // Abre el modal al hacer clic
          readOnly
        />

        <label>Longitud</label>
        <input
          type="text"
          value={longitud}
          onClick={handleOpenMap} // Abre el modal al hacer clic
          readOnly
        />

        <label>Dirección</label>
        <input
          type="text"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />

        <label>Activo</label>
        <input
          type="checkbox"
          checked={activo}
          onChange={(e) => setActivo(e.target.checked)}
        />

        <button type="submit">Guardar Ubicación</button>
      </form>

      {/* Modal de Mapa */}
      <MapModal
        isOpen={isMapOpen}
        onClose={handleCloseMap}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
};

export default UbicacionForm;
