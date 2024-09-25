import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import connectionString from "../../components/connections/connection";
import 'tailwindcss/tailwind.css';

export default function SelectTotem() {
  
    const [totems, setTotems] = useState([]);
    
    const userL = JSON.parse(localStorage.getItem("user"));
    console.log(userL.idUsuario);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            connectionString + `/TotemU/${userL.idUsuario}`
          );
          setTotems(response.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }, []);

  return (
    <>
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="flex flex-col sm:flex-row justify-end gap-4">
          {totems.map(({ idTotem, urlLogo, nombre }) => (
            <a href={`TotemEdit/:${idTotem}`} onClick={() => localStorage.setItem("totem", JSON.stringify({ idTotem, urlLogo }))}>
              <div className="card hover:bg-gray-200 shadow-2xl rounded-lg transition delay-300 duration-300 ease-in-out cursor-pointer p-4">
                <div className="flex flex-row justify-center">
                  <img className="w-40 image rounded-lg" src={'data:image/png;base64,' + urlLogo} />

                  <div className="mx-6 content px-5 flex flex-col justify-center">
                    <div className="text-xl">{userL.institucion}</div>
                    <div className="text-md">{nombre}</div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

