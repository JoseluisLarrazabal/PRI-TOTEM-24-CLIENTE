import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import { useSelector } from "react-redux";
import connectionString from "../../components/connections/connection";
import { useNavigate } from "react-router-dom";
import TotemWebCamera from "./../../components/web_cam/TotemWebCamera.jsx";

function TotemAdvertising() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [publicidades, setPublicidades] = useState([]);
  const totem = useSelector((state) => state.totem);
  const navigate = useNavigate();

  // Función para cargar las publicidades relacionadas al tótem
  const loadPublicidades = () => {
    axios
      .get(connectionString + `/PublicidadT/${totem.idTotem}`)
      .then((response) => {
        setPublicidades(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Detectar gestos para salir de la publicidad
  const handleGestureAction = (status) => {
    if (status > 0) {
      navigate("/Template"); // Redirigir al template principal
    }
  };

  useEffect(() => {
    loadPublicidades();
  }, []);

  // Manejar el cambio automático de imágenes en el carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % publicidades.length);
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, [publicidades.length]);

  // Manejar eventos de clic para reactivar el tótem
  useEffect(() => {
    const handleClick = () => {
      navigate("/Template"); // Redirigir al template principal
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [navigate]);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      {/* Integrar TotemWebCamera */}
      <TotemWebCamera cameraAvailable={handleGestureAction} />

      <Carousel
        className=""
        showThumbs={false}
        showStatus={false}
        showArrows={false} // Oculta los botones de navegación
        showIndicators={false}
        infiniteLoop={true}
        selectedItem={activeIndex}
        onChange={(index) => setActiveIndex(index)}
        autoPlay={false}
        interval={5000}
      >
        {publicidades.map((publicidad, index) => (
          <div key={index}>
            <img
              src={"data:image/png;base64," + publicidad.urlPublicidad}
              alt="Publicidad"
              className="h-screen object-contain" // Evita la distorsión
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default TotemAdvertising;
