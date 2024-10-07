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
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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
  const totem = useSelector((state) => state.totem);

  const [loading, setLoading] = useState(true);
  const [ubicaciones, setUbicaciones] = useState([]); // Estado para almacenar las ubicaciones

  const {
    text,
    startListening,
    stopListening,
    hasRecognitionSupport,
    isListening
  } = useSpeechRecognition(handleSubmit);

  const date = new Date();
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const formattedDate = `${day}/${month}/${year}`;
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  const currentTime = formattedHours + ":" + formattedMinutes;

  let images;
  let sourceID = null;
  let id = totem.idTotem;
  let keysb = null;
  const searchParams = new URLSearchParams(window.location.search);

  keysb = searchParams.get('keys') == null ? null : searchParams.get('keys').toString();

  useEffect(() => {
    const fetchAndUploadFiles = async () => {
      sourceID = await getPdfFiles(id, chatPDFApiKey);
      setLoading(false);
    };
    fetchAndUploadFiles();
  }, []);

  function handleSubmit(textToSearch) {
    SetTime(3000);
    let keys = textToSearch.split(" ");
    SetBrowse("");
    setImages(null);
    setData(null);
    keysb = "";
    images = null;
    let reject = ["la", "las", "el", "los"];
    let signs = ['?', '¿', '.', ','];
    let filteredKeys = keys.filter(item => !reject.includes(item));

    // Eliminar símbolos de las palabras en filteredKeys
    filteredKeys = filteredKeys.map(item => item.replace(new RegExp(`[${signs.join('')}]`, 'g'), ''));
    //navigate('/Template?keys=' + filteredKeys.toString());
    const sendMessage = async () => {
      let responseFromChatPdf = await sendMessageToChatPDF(chatPDFApiKey, sourceID, filteredKeys.toString());
      readResponse(responseFromChatPdf);
    };
    sendMessage();
  }

  const handleListener = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const speakDescription = useCallback(() => {
    if (data && data.descripcion) {
      const valueSpeech = new SpeechSynthesisUtterance(data.descripcion);
      window.speechSynthesis.speak(valueSpeech);
    }
  }, [data]);

  useEffect(() => {
    let isMounted = true;
    if (id != null && keysb != null) {
      keysb = keysb.toLowerCase();
      fetch(connectionString + '/TotemLocacion?id=' + id + '&keys=' + keysb)
        .then(response => response.json())
        .then(result => {
          if (isMounted) {
            setData(result);
            images = result.urlCarruselImagenes.split('|');
            let imagesF = images.map(image => Object.assign({ image }));
            setImages(imagesF);
          }
        });
    }
    return () => {
      isMounted = false;
      window.speechSynthesis.cancel();
    };
  }, [location]);

  useEffect(() => {
    speakDescription();
  }, [location, speakDescription]);

  // Nueva función para obtener las ubicaciones desde la API
  useEffect(() => {
    const fetchUbicaciones = async () => {
      try {
        const response = await axios.get(`https://localhost:5001/api/ubicaciones`);
        setUbicaciones(response.data); // Guardamos las ubicaciones en el estado
      } catch (error) {
        console.error("Error al obtener ubicaciones", error);
      }
    };

    fetchUbicaciones(); // Llamamos a la API al cargar el componente
  }, []);

  const readResponse = (content) => {
    const valueSpeech = new SpeechSynthesisUtterance(content);
    window.speechSynthesis.speak(valueSpeech);
  };

  if (!data && keysb != null) {
    return <div>Loading....</div>;
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  return (
    <>
      <Timer time={3000} route={'/TotemAdvertising'} />
      <TotemWebCamera />
      <section className="relative block h-[50vh] bg-gray-900">
        <div className="bg-profile-background absolute top-0 h-full w-full ">
          <figure className="relative h-full w-full">
            <Carrusel className="carrusel" images={imagesFinal == null ? pics : imagesFinal} data={imagesFinal} />
            <figcaption className="absolute left-5 top-5 flex w-1/8 justify-items-center rounded-xl bg-white/75 p-2 shadow-lg shadow-black/5 saturate-200">
              <p className="text-gray-700">{currentTime}</p>
            </figcaption>
            <figcaption className="absolute right-5 top-5 flex w-1/8 justify-items-center rounded-xl bg-white/75 p-2 shadow-lg shadow-black/5 saturate-200">
              <p className="text-gray-700">{formattedDate}</p>
            </figcaption>
          </figure>
        </div>
      </section>
      <section className="relative translate-y-12 bg-blue-gray-50/50 px-4 py-16">
        <div className="container mx-auto">
          <div className="relative -mt-64 mb-6 flex w-full min-w-0 flex-col break-words rounded-3xl bg-white shadow-xl shadow-gray-500/5">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="flex w-full justify-center px-4 lg:order-2 lg:w-3/12">
                  <div className="relative">
                    <div className="-mt-20 w-32">
                      <Avatar
                        src="/img/logo.png"
                        alt="Profile picture"
                        variant="circular"
                        className="h-full w-full shadow-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="my-8 text-center">
                <Typography variant="h2" color="blue-gray" className="mb-2">
                  {data == null ? 'Bienvenidos' : data['nombre']}
                </Typography>
                <div className="flex items-center justify-center gap-2">
                  <MapPinIcon className="-mt-px h-4 w-4 text-blue-gray-700" />
                  <Typography className="font-medium text-blue-gray-700">
                    Cochabamba, Bolivia
                  </Typography>
                </div>

                <div class="bg-white p-6 d-flex justify-content-start align-items-start rounded shadow-lg border: 4px dashed #28a745; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1)">
                  <div className="text-red-600 font-bold">
                    <p className="leading-none text-lg">Ubicaciones</p>
                    <p className="leading-none text-lg">Disponibles</p>
                  </div>
                  <div className="text-black grid grid-cols-2 gap-x-16 gap-y-4 text-lg">
                    <p>Biblioteca</p>
                    <p>Impresora</p>
                    <p>Coliseo</p>
                    <p>Bloque Tecnología</p>
                    <p>Comedor</p>
                    <p>Bienestar Estudiantil</p>
                  </div>
                </div>

                <div className="w-full h-96 mt-8">
                  <MapContainer center={[-17.3936, -66.1571]} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {/* Iteramos sobre las ubicaciones y creamos un Marker para cada una */}
                    {ubicaciones.map((ubicacion) => (
                      <Marker key={ubicacion.id} position={[ubicacion.latitud, ubicacion.longitud]}>
                        <Popup>{ubicacion.nombre}</Popup>
                      </Marker>
                    ))}
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
