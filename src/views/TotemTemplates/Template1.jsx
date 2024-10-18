import { Avatar, Typography } from "@material-tailwind/react";
import { MapPinIcon } from "@heroicons/react/24/solid";
import Carrusel from "./Carrusel";
import { pics } from "./Data";
import Timer from "../Timer/Timer";
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import connectionString from "../../components/connections/connection";
import useSpeechRecognition from "../../components/hooks/useSpeechRecognition";
import { getPdfFiles } from "../ChatPDF/PDFByTotem";
import { sendMessageToChatPDF } from "../ChatPDF/SendMessageToChatPDF";
import axios from "axios";
import TotemWebCamera from "../../components/web_cam/TotemWebCamera";

// Importando Leaflet y el CSS
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

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
  const [time, SetTime] = useState(50);
  const [browse, SetBrowse] = useState("");
  const [data, setData] = useState(null);
  const [imagesFinal, setImages] = useState(null);
  const [highlightedNavItem, setHighlightedNavItem] = useState(""); // Para resaltar el navbar
  const [destination, setDestination] = useState(null); // Para guardar la ubicación de destino
  const [polylinePositions, setPolylinePositions] = useState([]); // Para almacenar las posiciones de la línea
  const totem = useSelector((state) => state.totem);
  const [loading, setLoading] = useState(true);

  const initialLocation = [-17.33084963008385, -66.22597751828793]; // Ubicación inicial de la app

  const keywords = ["Biblioteca", "Impresora", "Coliseo", "Comedor", "Bienestar", "Bloque Tecnología"];
  
  const {
    text,
    startListening,
    stopListening,
    isListening
  } = useSpeechRecognition(handleSubmit);

  useEffect(() => {
    const fetchAndUploadFiles = async () => {
      await getPdfFiles(totem.idTotem, chatPDFApiKey);
      setLoading(false);
    };
    fetchAndUploadFiles();
  }, []);

  function handleSubmit(textToSearch) {
    // Asegurarse de que cada palabra reconocida tenga la primera letra en mayúscula
    let filteredKeys = textToSearch.split(" ").filter(item => keywords.includes(item));

    if (filteredKeys.length > 0) {
      const recognizedLocation = filteredKeys[0];

      // Formatear el nombre correctamente antes de enviarlo
      const formattedLocation = recognizedLocation.charAt(0).toUpperCase() + recognizedLocation.slice(1).toLowerCase();
      console.log("Buscando ubicación:", formattedLocation); // Verificación del formato correcto

      setHighlightedNavItem(formattedLocation); // Resalta la palabra reconocida
      checkLocationInDatabase(formattedLocation); // Verifica si existe en la base de datos
    }
}


const checkLocationInDatabase = async (recognizedLocation) => {
  // Aseguramos que el nombre se formatea correctamente antes de buscar
  const formattedLocation = recognizedLocation.charAt(0).toUpperCase() + recognizedLocation.slice(1).toLowerCase();

  console.log("Buscando ubicación:", formattedLocation); // Log para verificar el formato del nombre

  try {
      const response = await axios.get(`${connectionString}/Ubicaciones/BuscarPorNombre`, {
          params: { nombre: formattedLocation }
      });

      if (response.data) {
          console.log("Ubicación encontrada:", response.data);

          const latitud = response.data.latitud;
          const longitud = response.data.longitud;

          // Verificamos si las coordenadas son válidas
          if (latitud && longitud) {
              console.log("Latitud:", latitud, "Longitud:", longitud);
              setDestination([latitud, longitud]);
              setPolylinePositions([initialLocation, [latitud, longitud]]);
          } else {
              console.error("Latitud o Longitud no válidas:", latitud, longitud);
          }
      } else {
          console.log("Ubicación no encontrada.");
      }
  } catch (error) {
      console.error("Error al verificar la ubicación en la base de datos:", error);
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

                {/* Navbar con opciones y resaltado dinámico */}
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
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {/* Pin Inicial */}
                    <Marker position={initialLocation}>
                      <Popup>Ubicación inicial de la aplicación</Popup>
                    </Marker>
                    {/* Pin Destino, si existe */}
                    {destination && (
                      <Marker position={destination}>
                        <Popup>Destino: {highlightedNavItem}</Popup>
                      </Marker>
                    )}
                    {/* Trazado */}
                    {polylinePositions.length > 0 && (
                      <Polyline positions={polylinePositions} color="blue" />
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
