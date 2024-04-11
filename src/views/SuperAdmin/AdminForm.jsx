import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import "./AdminForm.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CryptoJS from "crypto-js";
import emailjs from "@emailjs/browser";
import connectionString from "../../components/connections/connection";
//npm install crypto-js
//npm install --save sweetalert2 sweetalert2-react-content
//npm install @emailjs/browser --save
//npm install email-validator

function AdminRegistrationForm() {
  const MySwal = withReactContent(Swal);

  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    rol: 1,
    email: "",
    institucion: "",
  });
  const sendData = async (event) => {
    event.preventDefault();
    // Verificar si el correo electrónico ya está registrado
    const response = await fetch(
      connectionString + "/Usuarios"
    );
    const data = await response.json();
    const emailAlreadyExists = data.some(
      (user) => user.email === usuario.email
    );

    // Generar contraseña aleatoria
    const pass = Math.random().toString(36).substring(7);
    const hashPass = CryptoJS.MD5(pass).toString(CryptoJS.enc.Hex);

    // Crear objeto de usuario con la contraseña generada
    const nuevoUsuario = {
      ...usuario,
      password: hashPass,
    };

    try {
      if (emailAlreadyExists) {
        MySwal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ya existe un usuario con ese email.",
        });
      } else {
        // Enviar solicitud POST a la API
        await fetch(connectionString + "/Usuarios", {
          method: "POST",
          body: JSON.stringify(nuevoUsuario),
          headers: {
            "Content-Type": "application/json",
          },
        });
        var templateParams = {
          from_name: "Totem",
          user_name: usuario.nombre,
          message: pass,
          user_email: usuario.email,
        };

        emailjs
          .send(
            "service_5pvdx8k",
            "template_i2a10th",
            templateParams,
            "MJXFKLxwKRB54fkot"
          )
          .then(
            (result) => {
              console.log(result.text);
            },
            (error) => {
              console.log(error.text);
            }
          );

        setUsuario({
          nombre: "",
          apellido: "",
          email: "",
          contraseña: "",
          rol: 1,
          institucion: "",
        });

        MySwal.fire({
          icon: "success",
          title: "Usuario registrado exitosamente",
          showConfirmButton: false,
          timer: 2000,
        });
        loadUsuarios();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const manejarCambios = (event) => {
    setUsuario({
      ...usuario,
      [event.target.name]: event.target.value,
    });
  };

  //Tabla-------------------------------------------------------------------
  const [usuariosT, setUsuariosT] = useState([]);

  const loadUsuarios = () => {
    axios
      .get(connectionString + "/Usuarios")
      .then((response) => {
        setUsuariosT(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    loadUsuarios();
  }, []);

  const eliminarUsuario = (id) => {
    MySwal.fire({
      title: "¿Estas segur@ de eliminar a este usuario?",
      text: "Los Totems que pertenecen a este usuario tambien se eliminaran. No podras revertir este cambio",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          fetch(connectionString + `/Usuarios/${id}`, {
            method: "DELETE",
            //body: JSON.stringify(id),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Error al eliminar el usuario");
              }
              // Aquí puedes actualizar la lista de usuarios
              loadUsuarios();
            })
            .catch((error) => {
              console.error("Error:", error);
            });
          MySwal.fire({
            icon: "success",
            title: "Usuario eliminado exitosamente.",

            timer: 2000,
          });
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  return (
    <>
      <div className="pb-8">
        <p className="text-4xl font-bold inline border-b-4 border-gray-500">
          Registrar Usuario
        </p>
      </div>
      <form onSubmit={sendData}>
        <div>
          <div>
            <label
              className="text-gray-700 dark:text-gray-200"
              htmlFor="firstName"
            >
              Nombres
            </label>
            <input
              required
              type="text"
              value={usuario.nombre}
              name="nombre"
              onChange={manejarCambios}
              id="firstName"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
            />
          </div>

          <div>
            <label
              className="text-gray-700 dark:text-gray-200"
              htmlFor="lastName"
            >
              Apellidos
            </label>
            <input
              required
              type="text"
              value={usuario.apellido}
              name="apellido"
              onChange={manejarCambios}
              id="lastName"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
            />
          </div>
          <div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="email">
              Email:
            </label>
            <input
              required
              type="email"
              value={usuario.email}
              name="email"
              onChange={manejarCambios}
              id="email"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
            />
          </div>

          <div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="email">
              Institución:
            </label>
            <input
              required
              type="text"
              value={usuario.institucion}
              name="institucion"
              onChange={manejarCambios}
              id="institucion"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
            />
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              name="btnRegister"
              className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
            >
              Registrar
            </button>
          </div>
        </div>
      </form>
      {/* Tabla */}
      <div className="flex items-center w-full">
        <div className="w-full">
          <div className="overflow-auto lg:overflow-visible w-full">
            <table className="table text-gray-300 border-separate space-y-6 text-sm w-full">
              <thead
                align="center"
                className="bg-gray-900 text-gray-500 w-full "
              >
                <tr>
                  <th className="p-3 text-center">Nombres</th>
                  <th className="p-3 text-center">Apellidos</th>
                  <th className="p-3 text-center">Email</th>
                  <th className="p-3 text-center">Institución</th>
                  <th className="p-3 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {usuariosT
                  .filter((usuario) => usuario.rol != 0)
                  .map((usuario) => (
                    <tr key={usuario.idUsuario} className="bg-gray-800">
                      <td className="p-3 text-center">
                        <div className="flex align-items-center">
                          <div className="ml-3 text-center">
                            {usuario.nombre}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-center">{usuario.apellido}</td>
                      <td className="p-3 font-bold text-center">
                        {usuario.email}
                      </td>
                      <td className="p-3 font-bold text-center">
                        <span className="bg-blue-500 text-center text-gray-50 rounded-md px-2">
                          {usuario.institucion}
                        </span>
                      </td>
                      <td className="p-3 ">
                        <button
                          className="text-gray-400 transform hover:scale-110"
                          onClick={() => eliminarUsuario(usuario.idUsuario)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="white"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminRegistrationForm;
