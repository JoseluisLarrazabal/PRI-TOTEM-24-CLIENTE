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
<<<<<<< HEAD
import { sendMessageToChatPDF } from "../ChatPDF/SendMessageToChatPDF"
import axios from "axios";
import TotemWebCamera from "../../components/web_cam/TotemWebCamera";

export function Template1() {

  const chatPDFApiKey = "sec_6Iv3eMYHKFN3Qkdwa6rF70GRcAaRgoK6"
=======
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
>>>>>>> AxelJeanAndiaHuaman

  const navigate = useNavigate();
  const location = useLocation();
  const [time, SetTime] = useState(50);
  const [browse, SetBrowse] = useState("");
  const [data, setData] = useState(null);
  const [imagesFinal, setImages] = useState(null);
  const totem = useSelector((state) => state.totem);

<<<<<<< HEAD
  const [loading, setLoading] = useState(true)
=======
  const [loading, setLoading] = useState(true);
>>>>>>> AxelJeanAndiaHuaman

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

<<<<<<< HEAD
  let images
  let sourceID = null
  let id = totem.idTotem
  let keysb = null
  const searchParams = new URLSearchParams(window.location.search)
=======
  let images;
  let sourceID = null;
  let id = totem.idTotem;
  let keysb = null;
  const searchParams = new URLSearchParams(window.location.search);
>>>>>>> AxelJeanAndiaHuaman

  keysb = searchParams.get('keys') == null ? null : searchParams.get('keys').toString();

  useEffect(() => {
    const fetchAndUploadFiles = async () => {
<<<<<<< HEAD
      sourceID = await getPdfFiles(id, chatPDFApiKey)
      setLoading(false)
    };
    fetchAndUploadFiles()
  }, [])
=======
      sourceID = await getPdfFiles(id, chatPDFApiKey);
      setLoading(false);
    };
    fetchAndUploadFiles();
  }, []);
>>>>>>> AxelJeanAndiaHuaman

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
<<<<<<< HEAD
      let responseFromChatPdf = await sendMessageToChatPDF(chatPDFApiKey, sourceID, filteredKeys.toString())
      readResponse(responseFromChatPdf)
    }
    sendMessage()
=======
      let responseFromChatPdf = await sendMessageToChatPDF(chatPDFApiKey, sourceID, filteredKeys.toString());
      readResponse(responseFromChatPdf);
    };
    sendMessage();
>>>>>>> AxelJeanAndiaHuaman
  }

  const handleListener = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

<<<<<<< HEAD
  const handleCameraAvailable = (isAvailable) => {
    axios.get(`${connectionString}/Totems/${id}/GetStatusTotem`)
      .then(res => {
        console.log('Estado del totem ', res.data.estadoActual)
        if (res.data.estadoActual === 0) {
          if (isAvailable > 0) {
            window.speechSynthesis.cancel();
            handleListener()
          }
        }
      })
  }

=======
>>>>>>> AxelJeanAndiaHuaman
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
<<<<<<< HEAD
      fetch(connectionString + '/TotemLocacion?id=' + id + '&keys=' + keysb).then(response => response.json())
=======
      fetch(connectionString + '/TotemLocacion?id=' + id + '&keys=' + keysb)
        .then(response => response.json())
>>>>>>> AxelJeanAndiaHuaman
        .then(result => {
          if (isMounted) {
            setData(result);
            images = result.urlCarruselImagenes.split('|');
<<<<<<< HEAD
            let imagesF = images.map(image => Object.assign({ image }))
            setImages(imagesF);
          }
        })
=======
            let imagesF = images.map(image => Object.assign({ image }));
            setImages(imagesF);
          }
        });
>>>>>>> AxelJeanAndiaHuaman
    }
    return () => {
      isMounted = false;
      window.speechSynthesis.cancel();
    };
<<<<<<< HEAD
  }, [location]); // El array de dependencias vacío asegura que este efecto se ejecute solo una vez

  useEffect(() => {
    speakDescription(); // Llama a la función de síntesis de voz después de cada renderización si los datos cambian
=======
  }, [location]);

  useEffect(() => {
    speakDescription();
>>>>>>> AxelJeanAndiaHuaman
  }, [location, speakDescription]);

  const readResponse = (content) => {
    const valueSpeech = new SpeechSynthesisUtterance(content);
<<<<<<< HEAD
    valueSpeech.onstart = () => updateStatusTotem(true)
    valueSpeech.onend = () => updateStatusTotem(false)
    window.speechSynthesis.speak(valueSpeech);
  }

  const updateStatusTotem = async (available) => {
    if (available) {
      await axios.put(`${connectionString}/Totems/${id}/ModifyStatus`,
        JSON.stringify(1),
        { headers: { 'Content-Type': 'application/json' } })
    } else {
      await axios.put(`${connectionString}/Totems/${id}/ModifyStatus`,
        JSON.stringify(0),
        { headers: { 'Content-Type': 'application/json' } })
    }
  }
=======
    window.speechSynthesis.speak(valueSpeech);
  };
>>>>>>> AxelJeanAndiaHuaman

  if (!data && keysb != null) {
    return <div>Loading....</div>;
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  return (
    <>
      <Timer time={3000} route={'/TotemAdvertising'} />
<<<<<<< HEAD
      <TotemWebCamera cameraAvailable={handleCameraAvailable} />
=======
      <TotemWebCamera />
>>>>>>> AxelJeanAndiaHuaman
      <section className="relative block h-[50vh] bg-gray-900">
        <div className="bg-profile-background absolute top-0 h-full w-full ">
          <figure className="relative h-full w-full">
            <Carrusel className="carrusel" images={imagesFinal == null ? pics : imagesFinal} data={imagesFinal} />
<<<<<<< HEAD
            <figcaption className="absolute left-5 top-5 flex w-1/8  justify-items-center rounded-xl  bg-white/75 p-2 shadow-lg shadow-black/5 saturate-200">
              <p className="text-gray-700">{currentTime}</p>
            </figcaption>
            <figcaption className="absolute right-5 top-5 flex w-1/8  justify-items-center rounded-xl  bg-white/75 p-2 shadow-lg shadow-black/5 saturate-200">
=======
            <figcaption className="absolute left-5 top-5 flex w-1/8 justify-items-center rounded-xl bg-white/75 p-2 shadow-lg shadow-black/5 saturate-200">
              <p className="text-gray-700">{currentTime}</p>
            </figcaption>
            <figcaption className="absolute right-5 top-5 flex w-1/8 justify-items-center rounded-xl bg-white/75 p-2 shadow-lg shadow-black/5 saturate-200">
>>>>>>> AxelJeanAndiaHuaman
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
<<<<<<< HEAD

                <div className=" flex items-center justify-center gap-2">
=======
                <div className="flex items-center justify-center gap-2">
>>>>>>> AxelJeanAndiaHuaman
                  <MapPinIcon className="-mt-px h-4 w-4 text-blue-gray-700" />
                  <Typography className="font-medium text-blue-gray-700">
                    Cochabamba, Bolivia
                  </Typography>
                </div>
<<<<<<< HEAD
                <div class="mb-6">
                  <label for="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"></label>
                  <input type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Buscar..."
                    value={text}
                    onChange={(event) => SetBrowse(event.target.value)} />
                </div>
              </div>

              <div className="mb-10 border-t border-blue-gray-50 py-6 text-center">
                <div className=" flex flex-wrap justify-center">
                  <div className="flex w-full flex-col items-center px-4 lg:w-9/12">
                    <Typography className="mb-8 font-normal text-blue-gray-500">
                      {data == null ? "Bienvenido a los Totems" : data['descripcion']}
                    </Typography>
                    <div className="mt-8">
                      <figure className="relative h-full w-full">
                        <img
                          className="h-full w-full rounded-xl"
                          src={data == null ? "https://img.freepik.com/vector-premium/navegacion-aplicacion-hay-destino-llegar-al-mapa-gps-destino_403715-36.jpg" : 'data:image/png;base64,' + data['urlMapa']}
                          alt="nature image"
                        />
                        <figcaption className="absolute -top-12 left-2/4 flex w-[calc(100%-4rem)] -translate-x-2/4 justify-between rounded-xl border border-white bg-white/75 px-6 py-4 shadow-lg shadow-black/5 saturate-200">
                          <div>
                            <Typography variant="h5" color="Light-Blue">
                              ¿Cómo puedo llegar?
                            </Typography>
                          </div>
                        </figcaption>
                      </figure>
                    </div>
                  </div>
=======
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
                    <Marker position={[-17.3936, -66.1571]}>
                      <Popup>Tu destino: Biblioteca</Popup>
                    </Marker>
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
>>>>>>> AxelJeanAndiaHuaman
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