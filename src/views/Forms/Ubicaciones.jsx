import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // SweetAlert para alertas
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
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar el bloqueo de botones

  // Recuperar la lista de tótems al cargar el componente
  useEffect(() => {
    const fetchTotems = async () => {
      try {
        setIsLoading(true); // Bloquear mientras se cargan datos
        const response = await axios.get(`${connectionString}/Totems`);
        setTotems(response.data);
      } catch (error) {
        Swal.fire("Error", "No se pudieron cargar los tótems.", "error");
        console.error("Error fetching totems:", error);
      } finally {
        setIsLoading(false); // Liberar bloqueo
      }
    };
    fetchTotems();
  }, []);

  const handleTotemChange = async (e) => {
    const totemId = e.target.value;
    setSelectedTotem(totemId);

    try {
      setIsLoading(true); // Bloquear mientras se cargan ubicaciones
      const response = await axios.get(`${connectionString}/Ubicaciones`, {
        params: { totemId },
      });
      setUbicaciones(response.data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar las ubicaciones.", "error");
      console.error("Error al recuperar las ubicaciones:", error.message);
      setUbicaciones([]);
    } finally {
      setIsLoading(false); // Liberar bloqueo
    }
  };

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
          setIsLoading(true); // Bloquear botones durante la operación
          const response = await axios.delete(
            `${connectionString}/Ubicaciones/${id}`
          );
          if (response.status === 204) {
            setUbicaciones((prevUbicaciones) =>
              prevUbicaciones.filter((ubicacion) => ubicacion.id !== id)
            );
            Swal.fire("Eliminado", "La ubicación ha sido eliminada.", "success");
          } else {
            Swal.fire(
              "Error",
              "El servidor devolvió un estado inesperado.",
              "error"
            );
          }
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar la ubicación.", "error");
          console.error("Error al eliminar la ubicación:", error);
        } finally {
          setIsLoading(false); // Liberar bloqueo
        }
      }
    });
  };

  const handleEdit = (ubicacion) => {
    setEditData(ubicacion);
    setIsEditFormOpen(true);
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  return (
    <div className="ubicaciones-container">
      <h1>Gestión de Ubicaciones</h1>

      <label htmlFor="totem-select">Seleccione un Tótem:</label>
      <select
        id="totem-select"
        onChange={handleTotemChange}
        disabled={isLoading} // Bloquear durante carga
      >
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
                <button
                  className="action-button edit-button"
                  onClick={() => handleEdit(ubicacion)}
                  disabled={isLoading} // Bloquear durante operación
                >
                  Editar
                </button>
                <button
                  className="action-button delete-button"
                  onClick={() => handleDelete(ubicacion.id)}
                  disabled={isLoading} // Bloquear durante operación
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="add-button"
        onClick={toggleForm}
        disabled={isLoading} // Bloquear durante operación
      >
        Crear Nueva Ubicación
      </button>

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
