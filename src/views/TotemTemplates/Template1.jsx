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

// Tu clave de API de Mapbox
const MAPBOX_API_KEY = 'pk.eyJ1IjoiYm9qamkwMCIsImEiOiJjbTJpY3EzeHIwbmFhMmlvbjV2NTVuejlwIn0.zvtpq8yNQYuUdEBUkYSUvw';

// Configurando el icono de Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

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
  const chatPDFApiKey = "sec_6Iv3eMYHKFN3Qkdwa6rF70GRcAaRgoK6";
  const navigate = useNavigate();
  const location = useLocation();
  const [browse, SetBrowse] = useState("");
  const [imagesFinal, setImages] = useState(null);
  const [highlightedNavItem, setHighlightedNavItem] = useState(""); // Para resaltar el navbar
  const [destination, setDestination] = useState(null); // Para guardar la ubicación de destino
  const totem = useSelector((state) => state.totem);
  const [loading, setLoading] = useState(true);
  const [routeCoords, setRouteCoords] = useState([]); // Coordenadas de la ruta
  const [keywords, setKeywords] = useState([]); // Ubicaciones dinámicas del navbar

  const initialLocation = [-17.332983, -66.226246]; // Ubicación inicial de la app

  const { startListening, stopListening, isListening } = useSpeechRecognition(handleSubmit);

  useEffect(() => {
    const fetchAndUploadFiles = async () => {
      await getPdfFiles(totem.idTotem, chatPDFApiKey);
      setLoading(false);
    };
    fetchAndUploadFiles();

    // Nueva función para recuperar ubicaciones de la base de datos
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

  function handleSubmit(textToSearch) {
    let filteredKeys = textToSearch.split(" ").filter(item => keywords.includes(item));

    if (filteredKeys.length > 0) {
      const recognizedLocation = filteredKeys[0];
      const formattedLocation = recognizedLocation.charAt(0).toUpperCase() + recognizedLocation.slice(1).toLowerCase();
      console.log("Buscando ubicación:", formattedLocation);
      setHighlightedNavItem(formattedLocation);
      checkLocationInDatabase(formattedLocation);
    }
  }

  const checkLocationInDatabase = async (recognizedLocation) => {
    const formattedLocation = recognizedLocation.charAt(0).toUpperCase() + recognizedLocation.slice(1).toLowerCase();

    try {
      const response = await axios.get(`${connectionString}/Ubicaciones/BuscarPorNombre`, {
        params: { nombre: formattedLocation }
      });

      if (response.data) {
        console.log("Ubicación encontrada:", response.data); // Aquí se muestra la ubicación encontrada

        const latitud = response.data.latitud;
        const longitud = response.data.longitud;

        if (latitud && longitud) {
          setDestination([latitud, longitud]);
          drawRoute([latitud, longitud]); // Llamar para dibujar la ruta detallada
        }
      }
    } catch (error) {
      console.error("Error al verificar la ubicación en la base de datos:", error);
    }
  };

  const drawRoute = async (destinationCoords) => {
    try {
      // Solicitud a la API de Mapbox para obtener la ruta para caminantes
      const response = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/walking/${initialLocation[1]},${initialLocation[0]};${destinationCoords[1]},${destinationCoords[0]}`, {
        params: {
          access_token: MAPBOX_API_KEY,
          geometries: 'geojson',
        },
      });
  
      const route = response.data.routes[0].geometry.coordinates;
      const coordinates = route.map(coord => [coord[1], coord[0]]); // Cambiar de [lng, lat] a [lat, lng]
  
      setRouteCoords(coordinates); // Almacenar la ruta para dibujarla en el mapa
    } catch (error) {
      console.error("Error al obtener la ruta de Mapbox Directions API:", error);
    }
  };
  

  const handleListener = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <>
      <Timer time={3000} route={'/TotemAdvertising'} />
      <TotemWebCamera />
      <section className="relative block h-[50vh] bg-gray-900">
        <div className="bg-profile-background absolute top-0 h-full w-full">
          <figure className="relative h-full w-full">
            <Carrusel className="carrusel" images={imagesFinal == null ? pics : imagesFinal} data={imagesFinal} />
          </figure>
        </div>
      </section>

      <section className="relative translate-y-12 bg-blue-gray-50/50 px-4 py-16">
        <div className="container mx-auto">
          <div className="relative -mt-64 mb-6 flex w-full min-w-0 flex-col break-words rounded-3xl bg-white shadow-xl shadow-gray-500/5">
            <div className="px-6">
              <div className="my-8 text-center">
                <Typography variant="h2" color="blue-gray" className="mb-2">Bienvenidos</Typography>

                <div className="flex items-center justify-center gap-2">
                  <MapPinIcon className="-mt-px h-4 w-4 text-blue-gray-700" />
                  <Typography className="font-medium text-blue-gray-700">Cochabamba, Bolivia</Typography>
                </div>

                <div className="flex justify-center space-x-4 mt-4">
                  {keywords.map((item) => (
                    <button
                      key={item}
                      className={`px-4 py-2 font-medium ${highlightedNavItem === item ? 'bg-green-500 text-white' : ''}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="w-full h-96 mt-8">
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

                <div className="mb-6">
                  <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900">
                    Presiona el micrófono y di a dónde te gustaría ir...
                  </label>
                  <button onClick={handleListener} className="bg-green-500 text-white font-bold py-2 px-4 rounded">
                    {isListening ? 'Escuchando...' : 'Iniciar'}
                  </button>
                  {browse && <div>{browse}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Template1;
