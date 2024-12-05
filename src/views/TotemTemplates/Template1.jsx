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
  const [isSpeaking, setIsSpeaking] = useState(false); // Estado para saber si está hablando

  

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
    if (status > 0) {
      if (isSpeaking) {
        console.log("El micrófono no se activa porque isSpeaking es true.");
        return; // No activa el micrófono si está hablando
      }
  
      if (!gestureDetected) {
        console.log("Gesto detectado, iniciando reconocimiento de voz...");
        setGestureDetected(true);
        setShowAd(false); // Ocultar publicidad al detectar el gesto
        startListening(); // Activar el micrófono
  
        // Detener automáticamente el micrófono tras 10 segundos
        setTimeout(() => {
          stopListening();
          setGestureDetected(false);
        }, 10000);
      }
    }
  };
  



  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' && !isSpeaking) { // Solo si no está hablando
        startListening(); // Activa el micrófono
      }
    };

    // Escuchar el evento de la tecla
    window.addEventListener('keydown', handleKeyPress);

    // Limpiar el evento cuando el componente se desmonte
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isSpeaking]); // Dependencia de isSpeaking para evitar que se active cuando está hablando



  useEffect(() => {
    if (gestureDetected) {
      console.log("Gesto detectado. Iniciando reconocimiento de voz...");
    }
  }, [gestureDetected]);


  const speakMessage = (message) => {
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      const utteranceQueue = [];

      // Dividir el mensaje en fragmentos (máximo 200 caracteres para evitar errores)
      const chunks = message.match(/.{1,200}(\s|$)/g);

      // Crear objetos `SpeechSynthesisUtterance` para cada fragmento
      chunks.forEach((chunk) => {
        const utterance = new SpeechSynthesisUtterance(chunk);
        utterance.lang = "es-ES"; // Idioma español
        utterance.rate = 1; // Velocidad de la voz
        utterance.pitch = 1; // Tono de la voz

        // Eventos para controlar el estado de reproducción
        utterance.onstart = () => {
          console.log(`Reproduciendo fragmento: "${chunk}"`);
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          console.log(`Fragmento terminado: "${chunk}"`);
          speakNext(); // Reproducir el siguiente fragmento en la cola
        };

        utterance.onerror = (e) => {
          console.error("Error al reproducir el mensaje:", e);
          setIsSpeaking(false);
        };

        utteranceQueue.push(utterance);
      });

      // Reproducir los fragmentos secuencialmente
      const speakNext = () => {
        if (utteranceQueue.length > 0) {
          const utterance = utteranceQueue.shift();
          synth.speak(utterance); // Reproducir el siguiente fragmento
        } else {
          console.log("Todos los fragmentos han sido reproducidos.");
          setIsSpeaking(false); // Cambiar el estado cuando termina todo el mensaje
        }
      };

      speakNext(); // Inicia la reproducción
    } else {
      console.error("El navegador no soporta SpeechSynthesis.");
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
      // Flujo A: Procesar ubicación
      setHighlightedNavItem(recognizedLocation);
      checkLocationInDatabase(recognizedLocation);
    } else {
      // Flujo B: Procesar consulta de texto en el archivo asociado
      setIsSpeaking(true); // Indica que el sistema está ocupado
      handlePdfQuery(textToSearch)
        .then(() => {
          // El estado `isSpeaking` volverá a false automáticamente dentro de `speakMessage`
        })
        .catch((error) => {
          console.error("Error al manejar la consulta de texto:", error);
          setIsSpeaking(false); // Reinicia el estado en caso de error
        });
    }
  }

  const handlePdfQuery = async (query) => {
    if (!totem?.idTotem) {
        console.error("No hay un tótem seleccionado.");
        return;
    }

    try {
        // Establece isSpeaking en true para bloquear cualquier activación de micrófono
        setIsSpeaking(true);

        // Recuperar los archivos asociados al tótem
        const archivosResponse = await axios.get(
            `${connectionString}/Archivo/Totem/${totem.idTotem}`
        );

        if (!archivosResponse.data || archivosResponse.data.length === 0) {
            console.warn("No se encontraron archivos asociados al tótem.");
            setIsSpeaking(false); // Reinicia el estado si no hay archivos
            return;
        }

        // Tomar el primer archivo como ejemplo
        const archivoId = archivosResponse.data[0].id;

        // Enviar la pregunta al archivo
        const preguntaResponse = await axios.post(
            `${connectionString}/Archivo/Pregunta/${archivoId}`,
            { pregunta: query }
        );

        if (preguntaResponse.data) {
            console.log("Respuesta de Claude:", preguntaResponse.data);

            // Habla la respuesta (gestiona automáticamente isSpeaking dentro de speakMessage)
            speakMessage(preguntaResponse.data);
        } else {
            console.warn("Claude no devolvió una respuesta válida.");
            setIsSpeaking(false); // Reinicia el estado si no hay respuesta
        }
    } catch (error) {
        console.error("Error al procesar la consulta al archivo:", error);
        setIsSpeaking(false); // Reinicia el estado en caso de error
    }
};




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
      }
    } catch (error) {
      console.error("Error al verificar la ubicación en la base de datos:", error)
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
      setIsSpeaking(true); // Marca como hablando antes de iniciar `speakMessage`
      speakMessage("Perfecto!. Muchas gracias y suerte en su aventura!");
      resetMap();
    } else if (lowerResponse.includes("no")) {
      setIsSpeaking(true); // Marca como hablando antes de iniciar `speakMessage`
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
      <TotemWebCamera
        cameraAvailable={(status) => {
          console.log("Estado del gesto detectado:", status);
          handleGestureAction(status);
        }}
      />


      {/* Carrusel de fondo */}
      <Carrusel className="absolute inset-0 h-full w-full z-0" images={pics} />

      <div className="absolute inset-0 bg-opacity-50 z-10 flex flex-col items-center justify-center">
        {/* Temporizador ajustado (oculto) */}
        <div style={{ display: "none" }}>
          <Timer inactivityTime={60} route={"/TotemAdvertising"} isListening={isListening} />
        </div>

        <Typography variant="h2" color="white" className="        mb-4">
          Bienvenidos
        </Typography>

        <div className="flex items-center justify-center gap-2 mb-4">
          <MapPinIcon className="h-6 w-6 text-white" />
          <Typography className="font-medium text-white">Cochabamba, Bolivia</Typography>
        </div>

        {/* Navbar de palabras clave (oculto) */}
        <div
          style={{ display: "none" }} // Oculta el navbar
        >
          {keywords.map((item) => (
            <span
              key={item}
              className={`px-4 py-2 font-medium ${highlightedNavItem === item ? "bg-green-500 text-white" : ""}`}
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
            onClick={() => !isSpeaking && startListening()} // Bloquea si está hablando
            className={`bg-green-500 text-white font-bold py-2 px-4 rounded ${isSpeaking ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={isSpeaking} // Desactiva el botón mientras se habla
          >
            {isListening ? "Escuchando..." : "Iniciar"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default Template1;
