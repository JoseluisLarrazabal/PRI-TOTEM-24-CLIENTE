import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Importar SweetAlert para mejores alertas
import "./ubicaciones.css";
import UbicacionForm from "./UbicacionForm";
import UbicacionEditarForm from "./UbicacionEditarForm";
import connectionString from "../../components/connections/connection";

const Ubicaciones = () => {
  const [totems, setTotems] = useState([]); // Lista de tótems
  const [ubicaciones, setUbicaciones] = useState([]); // Ubicaciones
  const [selectedTotem, setSelectedTotem] = useState(null); // ID del tótem seleccionado
  const [isFormOpen, setIsFormOpen] = useState(false); // Modal para crear nueva ubicación
  const [isEditFormOpen, setIsEditFormOpen] = useState(false); // Modal para editar ubicación
  const [editData, setEditData] = useState(null); // Datos de la ubicación a editar

  // Recuperar la lista de tótems al cargar el componente
  useEffect(() => {
    const fetchTotems = async () => {
      try {
        const response = await axios.get(`${connectionString}/Totems`);
        setTotems(response.data);
      } catch (error) {
        console.error("Error fetching totems:", error);
      }
    };
    fetchTotems();
  }, []);

  // Manejar el cambio del tótem seleccionado
  const handleTotemChange = async (e) => {
    const totemId = e.target.value; // Recuperamos el ID del tótem seleccionado
    setSelectedTotem(totemId);

    try {
      // Obtener las ubicaciones usando directamente el ID del tótem
      const ubicacionesResponse = await axios.get(
        `${connectionString}/Ubicaciones`,
        { params: { totemId } } // Enviamos el ID como parámetro
      );

      setUbicaciones(ubicacionesResponse.data); // Actualizamos las ubicaciones en la tabla
    } catch (error) {
      if (error.response) {
        console.error(
          `Error en la API (${error.response.status}): ${error.response.data}`
        );
      } else {
        console.error("Error al recuperar las ubicaciones:", error.message);
      }
      setUbicaciones([]); // Limpiamos las ubicaciones si hay un error
    }
  };

  // Manejar la eliminación de una ubicación
  const handleDelete = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${connectionString}/Ubicaciones/${id}`);
          if (response.status === 204) {
            // Eliminar la ubicación de la lista en el estado local
            setUbicaciones((prevUbicaciones) =>
              prevUbicaciones.filter((ubicacion) => ubicacion.id !== id)
            );
            Swal.fire("¡Eliminado!", "La ubicación ha sido eliminada.", "success");
          } else {
            Swal.fire("Error", "No se pudo eliminar la ubicación.", "error");
          }
        } catch (error) {
          console.error("Error al eliminar la ubicación:", error);
          Swal.fire("Error", "Ocurrió un problema al eliminar la ubicación.", "error");
        }
      }
    });
  };

  // Abrir modal de edición
  const handleEdit = (ubicacion) => {
    setEditData(ubicacion); // Guardar los datos de la ubicación seleccionada
    setIsEditFormOpen(true); // Mostrar modal de edición
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  return (
    <div className="ubicaciones-container">
      <h1>Gestión de Ubicaciones</h1>

      <label htmlFor="totem-select">Seleccione un Tótem:</label>
      <select id="totem-select" onChange={handleTotemChange}>
        <option value="">Seleccione un tótem</option>
        {totems.map((totem) => (
          <option key={totem.idTotem} value={totem.idTotem}>
            {totem.nombre}
          </option>
        ))}
      </select>

      <table className="ubicaciones-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Latitud</th>
            <th>Longitud</th>
            <th>Dirección</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ubicaciones.map((ubicacion) => (
            <tr key={ubicacion.id}>
              <td>{ubicacion.id}</td>
              <td>{ubicacion.nombre}</td>
              <td>{ubicacion.latitud}</td>
              <td>{ubicacion.longitud}</td>
              <td>{ubicacion.direccion}</td>
              <td>{ubicacion.activo ? "Sí" : "No"}</td>
              <td>
                {/* Botón para editar la ubicación */}
                <button
                  className="action-button edit-button"
                  onClick={() => handleEdit(ubicacion)}
                >
                  Editar
                </button>
                {/* Botón para eliminar la ubicación */}
                <button
                  className="action-button delete-button"
                  onClick={() => handleDelete(ubicacion.id)}
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="add-button" onClick={toggleForm}>
        Crear Nueva Ubicación
      </button>

      {/* Modal para agregar nueva ubicación */}
      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <UbicacionForm
              idTotem={selectedTotem}
              onClose={toggleForm}
              onSuccess={() => {
                if (selectedTotem) {
                  handleTotemChange({ target: { value: selectedTotem } });
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Modal para editar ubicación */}
      {isEditFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <UbicacionEditarForm
              idTotem={selectedTotem}
              initialData={editData}
              onClose={() => setIsEditFormOpen(false)}
              onSuccess={() => {
                setIsEditFormOpen(false);
                if (selectedTotem) {
                  handleTotemChange({ target: { value: selectedTotem } });
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Ubicaciones;
