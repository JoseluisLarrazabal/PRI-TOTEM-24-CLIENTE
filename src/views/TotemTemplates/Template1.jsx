import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import { MapPinIcon } from "@heroicons/react/24/solid";
import Carrusel from "./Carrusel";
import { pics } from "./Data";
import Timer from "../Timer/Timer";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import connectionString from "../../components/connections/connection";
import useSpeechRecognition from "../../components/hooks/useSpeechRecognition";
import axios from "axios";
import TotemWebCamera from "./../../components/web_cam/TotemWebCamera.jsx";

// Importando Leaflet y el CSS
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const MAPBOX_API_KEY = "pk.eyJ1IjoiYm9qamkwMCIsImEiOiJjbTJpY3EzeHIwbmFhMmlvbjV2NTVuejlwIn0.zvtpq8yNQYuUdEBUkYSUvw";

// Configurando el icono de Leaflet
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Componente para centrar el mapa dinámicamente
const DynamicCenter = ({ routeCoords, destination }) => {
  const map = useMap();
  useEffect(() => {
    if (routeCoords.length > 0) {
      const bounds = L.latLngBounds(routeCoords);
      map.fitBounds(bounds);
    } else if (destination) {
      map.setView(destination, 13);
    }
  }, [routeCoords, destination, map]);
  return null;
};

export function Template1() {
  const navigate = useNavigate();
  const totem = useSelector((state) => state.totem); // Obtener tótem seleccionado
  const [keywords, setKeywords] = useState([]); // Ubicaciones dinámicas del navbar
  const [highlightedNavItem, setHighlightedNavItem] = useState(""); // Para resaltar el navbar
  const [destination, setDestination] = useState(null); // Para guardar la ubicación de destino
  const [routeCoords, setRouteCoords] = useState([]); // Coordenadas de la ruta
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false); // Controla la confirmación de ubicación
  const [gestureDetected, setGestureDetected] = useState(false); // Estado para gestos detectados
  const [showAd, setShowAd] = useState(false); // La publicidad empieza inactiva
  const { startListening, stopListening, isListening } = useSpeechRecognition(handleSubmit);

  const initialLocation = [-17.332983, -66.226246]; // Ubicación inicial de la app

  useEffect(() => {
    // Recuperar ubicaciones filtradas por tótem
    const fetchLocations = async () => {
      if (!totem?.idTotem) {
        console.error("No hay un tótem seleccionado.");
        return;
      }
      try {
        const response = await axios.get(`${connectionString}/Ubicaciones`, {
          params: { totemId: totem.idTotem }, // Filtro por tótem
        });
        const locationNames = response.data
          ?.filter((loc) => loc.nombre && loc.latitud && loc.longitud)
          .map((loc) => loc.nombre.trim());
        setKeywords([...new Set(locationNames)]); // Elimina duplicados
      } catch (error) {
        console.error("Error al recuperar ubicaciones:", error);
      }
    };

    fetchLocations(); // Llama a la función para recuperar ubicaciones
  }, [totem]);

  // Función para manejar la acción cuando se detecta un gesto
  const handleGestureAction = (status) => {
  if (status > 0 && !gestureDetected) {
    setGestureDetected(true);
    setShowAd(false); // Ocultar publicidad al detectar el gesto
    startListening(); // Activar el micrófono

    // Detener automáticamente el micrófono tras 5 segundos
    setTimeout(() => {
      stopListening();
      setGestureDetected(false);
    }, 5000);
  }
};

  

  useEffect(() => {
    if (gestureDetected) {
      console.log("Gesto detectado. Iniciando reconocimiento de voz...");
    }
  }, [gestureDetected]);

  // Función para usar ResponsiveVoice
  const speakMessage = (message) => {
    if (typeof responsiveVoice !== "undefined") {
      responsiveVoice.speak(message, "Spanish Latin American Female");
    } else {
      console.error("ResponsiveVoice no está disponible.");
    }
  };

  // Función para manejar la búsqueda por voz
  function handleSubmit(textToSearch) {
    if (awaitingConfirmation) {
      handleConfirmationResponse(textToSearch);
      return;
    }

    const normalizedText = textToSearch.toLowerCase();
    const recognizedLocation = keywords.find(
      (keyword) => keyword.toLowerCase() === normalizedText
    );

    if (recognizedLocation) {
      setHighlightedNavItem(recognizedLocation);
      checkLocationInDatabase(recognizedLocation);
    } else {
      speakMessage("No encontré la ubicación. Por favor, inténtelo de nuevo.");
    }
  }

  // Verifica si la ubicación reconocida está en la base de datos
  const checkLocationInDatabase = async (recognizedLocation) => {
    try {
      const response = await axios.get(`${connectionString}/Ubicaciones/BuscarPorNombre`, {
        params: { nombre: recognizedLocation },
      });

      const { latitud, longitud } = response.data;

      if (latitud && longitud) {
        setDestination([latitud, longitud]);
        drawRoute([latitud, longitud]);
      } else {
        speakMessage("No se encontró una ubicación válida en la base de datos.");
      }
    } catch (error) {
      console.error("Error al verificar la ubicación en la base de datos:", error);
      speakMessage("Ocurrió un error al buscar la ubicación.");
    }
  };

  // Dibuja la ruta en el mapa
  const drawRoute = async (destinationCoords) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${initialLocation[1]},${initialLocation[0]};${destinationCoords[1]},${destinationCoords[0]}`,
        {
          params: {
            access_token: MAPBOX_API_KEY,
            geometries: "geojson",
          },
        }
      );

      const route = response.data.routes[0]?.geometry.coordinates;
      if (route) {
        const coordinates = route.map((coord) => [coord[1], coord[0]]);
        setRouteCoords([initialLocation, ...coordinates]); // Asegura que la ruta comience desde la ubicación inicial
        setAwaitingConfirmation(true);
        speakMessage(
          "La ubicación es correcta? Responda con 'Sí' o 'No' para continuar."
        );
      } else {
        speakMessage("No se encontró una ruta viable. Intente otra ubicación.");
      }
    } catch (error) {
      console.error("Error al obtener la ruta de Mapbox Directions API:", error);
      speakMessage("Ocurrió un error al calcular la ruta.");
    }
  };

  // Resetea el mapa al estado inicial
  const resetMap = () => {
    setDestination(null);
    setRouteCoords([]);
    setHighlightedNavItem("");
    setAwaitingConfirmation(false);
  };

  // Maneja la respuesta de confirmación del usuario
  const handleConfirmationResponse = (response) => {
    const lowerResponse = response.toLowerCase();

    if (lowerResponse.includes("sí")) {
      speakMessage("Perfecto!. Muchas gracias y suerte en su aventura!");
      resetMap();
    } else if (lowerResponse.includes("no")) {
      speakMessage("Lo siento, intentemos de nuevo. Por favor, indique otra ubicación.");
      resetMap();
    }
  };

  return (
    <div className="relative h-screen w-screen">
      {/* Publicidad */}
      {showAd && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-50 pointer-events-none">
          <Typography variant="h4" color="white">
            Publicidad Activa
          </Typography>
        </div>
      )}


      {/* Incorporamos TotemWebCamera */}
      <TotemWebCamera cameraAvailable={handleGestureAction} />

      {/* Carrusel de fondo */}
      <Carrusel className="absolute inset-0 h-full w-full z-0" images={pics} />

      <div className="absolute inset-0 bg-opacity-50 z-10 flex flex-col items-center justify-center">
        {/* Temporizador ajustado */}
        <Timer inactivityTime={25} route={"/TotemAdvertising"} isListening={isListening} />

        <Typography variant="h2" color="white" className="        mb-4">
          Bienvenidos
        </Typography>

        <div className="flex items-center justify-center gap-2 mb-4">
          <MapPinIcon className="h-6 w-6 text-white" />
          <Typography className="font-medium text-white">Cochabamba, Bolivia</Typography>
        </div>

        {/* Navbar de palabras clave */}
        <div className="flex justify-center space-x-4 mt-4">
          {keywords.map((item) => (
            <span
              key={item}
              className={`px-4 py-2 font-medium ${highlightedNavItem === item ? "bg-green-500 text-white" : ""
                }`}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Contenedor del Mapa */}
        <div className="w-4/5 h-2/3 mt-6">
          <MapContainer
            center={initialLocation}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            <Marker position={initialLocation}>
              <Popup>Ubicación inicial de la aplicación</Popup>
            </Marker>
            {destination && (
              <Marker position={destination}>
                <Popup>Destino: {highlightedNavItem}</Popup>
              </Marker>
            )}
            {routeCoords.length > 0 && (
              <Polyline positions={routeCoords} color="blue" />
            )}

            {/* Componente para centrar dinámicamente */}
            <DynamicCenter routeCoords={routeCoords} destination={destination} />
          </MapContainer>
        </div>

        {/* Botón para iniciar la escucha por voz */}
        <div className="mt-6">
          <button
            onClick={startListening}
            className="bg-green-500 text-white font-bold py-2 px-4 rounded"
          >
            {isListening ? "Escuchando..." : "Iniciar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Template1;
