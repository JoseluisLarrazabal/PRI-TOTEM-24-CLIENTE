import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { updateUser } from "../../components/redux/userSlice";
import { Navigate, useNavigate } from "react-router-dom";
import connectionString from "../../components/connections/connection";

function UserUpdateForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [institucion, setInstitucion] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const user = useSelector((state) => state.user);
  useEffect(() => {
    setNombre(user.nombre);
    setApellido(user.apellido);
    setEmail(user.email);
    setInstitucion(user.institucion);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    confirm("entro");
    const response = await fetch(
      connectionString + `/Usuarios/${user.idUsuario}`
    );
    const dataUser = await response.json();

    if (
      dataUser.password !=
        CryptoJS.MD5(oldPassword).toString(CryptoJS.enc.Hex) ||
      newPassword != confirmPassword
    ) {
      return;
    }

    const hashPass = CryptoJS.MD5(newPassword).toString(CryptoJS.enc.Hex);
    dataUser.email = email;
    dataUser.nombre = nombre;
    dataUser.apellido = apellido;
    dataUser.password = hashPass;
    dataUser.institucion = institucion;
    fetch(connectionString + `/Usuarios/${user.idUsuario}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataUser),
    })
      .then((response) => {
        dispatch(updateUser(dataUser));

        navigate("/Panel");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="container mx-auto">
      <div className=" p-4 mx-auto flex flex-col  ">
        <div className="mb-2">
          <p className="text-4xl font-bold inline border-b-4 border-gray-500">
            Actualizar Datos
          </p>
        </div>
      </div>
      {error && <p>{error}</p>}
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Apellido:
          </label>
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Institucion:
          </label>
          <input
            type="text"
            value={institucion}
            onChange={(e) => setInstitucion(e.target.value)}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Contraseña antigua:
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Nueva contraseña:
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Confirmar nueva contraseña:
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Actualizar
        </button>
      </form>
    </div>
  );
}

export default UserUpdateForm;
