import { Avatar, Typography } from "@material-tailwind/react";
import { MapPinIcon } from "@heroicons/react/24/solid";
import Carrusel from "./Carrusel";
import { pics } from "./Data";
import Timer from "../Timer/Timer";
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import connectionString from "../../components/connections/connection";
import useSpeechRecognition from "../../components/hooks/useSpeechRecognition";
import { getPdfFiles } from "../ChatPDF/PDFByTotem";
import axios from "axios";
import TotemWebCamera from "../../components/web_cam/TotemWebCamera";

// Importando Leaflet y el CSS
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Tu clave de API de Mapbox
const MAPBOX_API_KEY = 'pk.eyJ1IjoiYm9qamkwMCIsImEiOiJjbTJpY3EzeHIwbmFhMmlvbjV2NTVuejlwIn0.zvtpq8yNQYuUdEBUkYSUvw';

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

export function Template1() {
  const chatPDFApiKey = "sec_6Iv3eMYHKFN3Qkdwa6rF70GRcAaRgoK6"; // Clave de API para el chat de PDF
  const navigate = useNavigate();
  const location = useLocation();
  const [browse, setBrowse] = useState("");
  const [imagesFinal, setImages] = useState(null);
  const [highlightedNavItem, setHighlightedNavItem] = useState(""); // Para resaltar el navbar
  const [destination, setDestination] = useState(null); // Para guardar la ubicación de destino
  const totem = useSelector((state) => state.totem);
  const [loading, setLoading] = useState(true);
  const [routeCoords, setRouteCoords] = useState([]); // Coordenadas de la ruta
  const [keywords, setKeywords] = useState([]); // Ubicaciones dinámicas del navbar
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false); // Controla la confirmación de ubicación

  const initialLocation = [-17.332983, -66.226246]; // Ubicación inicial de la app

  const { startListening, stopListening, isListening } = useSpeechRecognition(handleSubmit);

  useEffect(() => {
    // Cargar archivos PDF y ubicaciones de la base de datos
    const fetchAndUploadFiles = async () => {
      await getPdfFiles(totem.idTotem, chatPDFApiKey);
      setLoading(false);
    };
    fetchAndUploadFiles();

    // Recuperar ubicaciones de la base de datos
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${connectionString}/Ubicaciones`);
        const locationNames = response.data.map((loc) => loc.nombre);
        setKeywords(locationNames); // Actualiza keywords con las ubicaciones desde la base de datos
      } catch (error) {
        console.error("Error al recuperar ubicaciones:", error);
      }
    };

    fetchLocations(); // Llama a la función para recuperar ubicaciones
  }, [totem.idTotem, chatPDFApiKey]);

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

    let filteredKeys = textToSearch.split(" ").filter(item => keywords.includes(item));

    if (filteredKeys.length > 0) {
      const recognizedLocation = filteredKeys[0];
      const formattedLocation = recognizedLocation.charAt(0).toUpperCase() + recognizedLocation.slice(1).toLowerCase();
      console.log("Buscando ubicación:", formattedLocation);
      setHighlightedNavItem(formattedLocation);
      checkLocationInDatabase(formattedLocation);
    }
  }

  // Verifica si la ubicación reconocida está en la base de datos
  const checkLocationInDatabase = async (recognizedLocation) => {
    const formattedLocation = recognizedLocation.charAt(0).toUpperCase() + recognizedLocation.slice(1).toLowerCase();

    try {
      const response = await axios.get(`${connectionString}/Ubicaciones/BuscarPorNombre`, {
        params: { nombre: formattedLocation }
      });

      if (response.data) {
        const latitud = response.data.latitud;
        const longitud = response.data.longitud;

        if (latitud && longitud) {
          setDestination([latitud, longitud]);
          drawRoute([latitud, longitud]); // Llama para dibujar la ruta detallada
        }
      }
    } catch (error) {
      console.error("Error al verificar la ubicación en la base de datos:", error);
    }
  };

  // Dibuja la ruta en el mapa
  const drawRoute = async (destinationCoords) => {
    try {
      const response = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/walking/${initialLocation[1]},${initialLocation[0]};${destinationCoords[1]},${destinationCoords[0]}`, {
        params: {
          access_token: MAPBOX_API_KEY,
          geometries: 'geojson',
        },
      });

      const route = response.data.routes[0].geometry.coordinates;
      const coordinates = route.map(coord => [coord[1], coord[0]]);

      setRouteCoords(coordinates); // Almacenar la ruta para dibujarla en el mapa
      setAwaitingConfirmation(true); // Inicia la espera de confirmación al llegar al destino
      speakMessage("La ubicación es correcta? Responda con 'Sí es correcta' o 'No es correcta' para continuar.");
    } catch (error) {
      console.error("Error al obtener la ruta de Mapbox Directions API:", error);
    }
  };

  // Maneja la respuesta de confirmación del usuario
  const handleConfirmationResponse = (response) => {
    const lowerResponse = response.toLowerCase();

    if (lowerResponse.includes("sí es correcta")) {
      speakMessage("Perfecto!. Muchas gracias y suerte en su aventura!");
      resetMap();
    } else if (lowerResponse.includes("no es correcta")) {
      speakMessage("Lo siento, intentemos de nuevo. Por favor, indique otra ubicación.");
      resetMap();
    }
  };

  // Resetea el mapa al estado inicial
  const resetMap = () => {
    setDestination(null);
    setRouteCoords([]);
    setHighlightedNavItem("");
    setAwaitingConfirmation(false);
  };

  // Activa o desactiva la escucha por voz
  const handleListener = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <>
      <div className="relative h-screen w-screen">
        {/* Carrusel de fondo */}
        <Carrusel className="absolute inset-0 h-full w-full z-0" images={imagesFinal == null ? pics : imagesFinal} data={imagesFinal} />

        <div className="absolute inset-0 bg-opacity-50 z-10 flex flex-col items-center justify-center">
          <Timer time={3000} route={'/TotemAdvertising'} />
          <TotemWebCamera />

          <Typography variant="h2" color="white" className="mb-4">Bienvenidos</Typography>

          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPinIcon className="h-6 w-6 text-white" />
            <Typography className="font-medium text-white">Cochabamba, Bolivia</Typography>
          </div>

          {/* Navbar de palabras clave, resaltado según búsqueda por voz */}
          <div className="flex justify-center space-x-4 mt-4">
            {keywords.map((item) => (
              <span
                key={item}
                className={`px-4 py-2 font-medium ${highlightedNavItem === item ? 'bg-green-500 text-white' : ''}`}
              >
                {item}
              </span>
            ))}
          </div>

          {/* Contenedor del Mapa */}
          <div className="w-4/5 h-2/3 mt-6">
            <MapContainer center={initialLocation} zoom={13} style={{ height: "100%", width: "100%" }}>
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
              {/* Dibujar la ruta si existe */}
              {routeCoords.length > 0 && (
                <Polyline positions={routeCoords} color="blue" />
              )}
            </MapContainer>
          </div>

          {/* Botón para iniciar la escucha por voz */}
          <div className="mt-6">
            <button onClick={handleListener} className="bg-green-500 text-white font-bold py-2 px-4 rounded">
              {isListening ? 'Escuchando...' : 'Iniciar'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Template1;
