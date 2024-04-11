import React from "react";
import { useState } from "react";
import CryptoJS from "crypto-js";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import connectionString from "../../components/connections/connection";
//npm install crypto-js
//npm install --save sweetalert2 sweetalert2-react-content
//npm install @emailjs/browser --save

const ForgotPassword = () => {
  const MySwal = withReactContent(Swal);
  const [email, setEmail] = useState("");

  const ResetPass = async (event) => {
    event.preventDefault();

    const response = await fetch(connectionString + "/Usuarios");
    const data = await response.json();
    const matchingUser = data.find((user) => user.email === email);
    var userId;
    if (matchingUser) {
      userId = matchingUser.idUsuario;
      const pass = Math.random().toString(36).substring(7);
      const hashPass = CryptoJS.MD5(pass).toString(CryptoJS.enc.Hex);
      console.log(pass);
      console.log(hashPass);
      matchingUser.Password = hashPass;
      try {
        const response = await fetch(
          connectionString + `/Usuarios/${userId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(matchingUser)
            }
          );

          var templateParams = {
              from_name: "Totem",
              message: pass,
              user_email: email,
            };
            emailjs
              .send(
                "service_5pvdx8k",
                "template_umjsi0m",
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
              MySwal.fire({
                icon: "success",
                title: "Contraseña cambiada",
                text:"Revisa tu email para encontrar tu nueva contraseña",
                showConfirmButton: true
              });
            
        const resp = await response.json();
        console.log(resp);
      } catch (error) {
        console.error(error);
      }
    }
    else{
      MySwal.fire({
        icon: "error",
        title: "Este usuario no existe"
      });
    }
  };

  return (
    <>
      <div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              ¿Olvidaste tu contraseña?
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Ingresa tu correo electronico y te enviaremos tu nueva contraseña
              por correo.
            </p>
          </div>
          <form onSubmit={ResetPass} className="mt-8 space-y-6">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Correo Electronico"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Resetear Contraseña
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
