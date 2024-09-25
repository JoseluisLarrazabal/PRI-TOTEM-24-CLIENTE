import axios from "axios";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useParams } from "react-router-dom"
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import connectionString from "../../components/connections/connection";

function ArchivosTotem() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [archivos, setArchivos] = useState([])
    const MySwal = withReactContent(Swal)

    useEffect(() => {
        axios.get(`${connectionString}/Archivo/${id.slice(1)}`)
            .then(res => {
                setArchivos(res.data)
            })
            .catch(err => console.log(err))
    }, [id])

    const handleDeleteFile = (fileId) => {
        axios.delete(`${connectionString}/Archivo/${fileId}`)
            .then(res => {
                if (res.status === 204) {
                    MySwal.fire({
                        icon: "success",
                        title: "Eliminado",
                        text: "Archivo eliminado correctamente",
                        confirmButtonColor: "#3085d6"
                    })
                    navigate("/Panel")
                } else {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo eliminar el archivo',
                        confirmButtonColor: "#d33"
                    })
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <div className="items-center justify-center">
            <div className="container mx-auto">
            </div>
            <div className="container mx-auto">
                <p className="text-4xl font-bold inline border-b-4 border-gray-500">
                    Lista de archivos
                </p>
            </div>
            <div className="container mx-auto mt-4">
                <table className="min-w-max w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Nombre del archivo</th>
                            <th className="py-3 px-6 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-bold">
                        {archivos.map((archivo, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 border-b">{archivo.nombreArchivo}</td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => {
                                            MySwal.fire({
                                                title: "¿Deseas eliminar este archivo?",
                                                text: "El archivo se eliminará permanentemente",
                                                icon: "warning",
                                                showCancelButton: true,
                                                confirmButtonColor: "#3085d6",
                                                cancelButtonColor: "#d33",
                                                confirmButtonText: "Eliminar",
                                            }).then(result => {
                                                if (result.isConfirmed) {
                                                    handleDeleteFile(archivo.id)
                                                }
                                            })
                                        }}
                                        className="bg-red-500 text-white px-4 py-2 rounded">
                                        <MdDelete className="mr-2 ml-2 text-2xl"></MdDelete>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ArchivosTotem