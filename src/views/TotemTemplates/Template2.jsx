import React from "react";
import { Card, CardBody, CardHeader, Typography, IconButton, Avatar, } from "@material-tailwind/react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { ClockIcon } from "@heroicons/react/24/outline";
import { LightBulbIcon } from "@heroicons/react/24/outline";
import Carrusel from "./Carrusel";
import { pics } from "./Data";
import Timer from "../Timer/Timer";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import connectionString from "../../components/connections/connection";
import useSpeechRecognition from "../../components/hooks/useSpeechRecognition";
import { getPdfFiles } from "../ChatPDF/PDFByTotem";
import axios from "axios";
import { sendMessageToChatPDF } from "../ChatPDF/SendMessageToChatPDF";
import TotemWebCamera from "../../components/web_cam/TotemWebCamera";

export function Template2() {

  const chatPDFApiKey = "sec_6Iv3eMYHKFN3Qkdwa6rF70GRcAaRgoK6"

  const navigate = useNavigate();
  const location = useLocation();
  const [time, SetTime] = useState(3000);
  const [browse, SetBrowse] = useState("");
  const [data, setData] = useState(null);
  const [imagesFinal, setImages] = useState(null);
  const totem = useSelector((state) => state.totem);

  const [loading, setLoading] = useState(true)

  const {
    text,
    startListening,
    stopListening,
    hasRecognitionSupport,
    isListening
  } = useSpeechRecognition(handleSubmit);

  const date = new Date();
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const formattedDate = `${day}/${month}/${year}`;

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  const currentTime = formattedHours + ":" + formattedMinutes;

  let images
  let sourceID = null
  let id = totem.idTotem
  let keysb = null

  const searchParams = new URLSearchParams(window.location.search)

  keysb = searchParams.get("keys") == null ? null : searchParams.get("keys").toString();

  useEffect(() => {
    const fetchAndUploadFiles = async () => {
      sourceID = await getPdfFiles(id, chatPDFApiKey)
      setLoading(false)
    }
    fetchAndUploadFiles()
  }, [])

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
    filteredKeys = filteredKeys.map(item => item.replace(new RegExp(`[${signs.join('')}]`, 'g'), ''))
    //navigate('/Template?keys=' + filteredKeys.toString());
    const sendMessage = async () => {
      let responseFromChatPdf = await sendMessageToChatPDF(chatPDFApiKey, sourceID, filteredKeys.toString())
      readResponse(responseFromChatPdf)
    }
    sendMessage()
  }

  const handleListener = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleCameraAvailable = (isAvailable) => {
    axios.get(`${connectionString}/Totems/${id}/GetStatusTotem`)
      .then(res => {
        console.log('Estado del totem ', res.data.estadoActual)
        if (res.data.estadoActual === 0) {
          if (isAvailable > 0) { //si es mayor a cero, detecto la mano
            window.speechSynthesis.cancel();
            handleListener()
          }
        }
      })
  }

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
      fetch(connectionString + "/TotemLocacion?id=" + id + "&keys=" + keysb)
        .then((response) => response.json())
        .then((result) => {
          if (isMounted) {
            setData(result);
            images = result.urlCarruselImagenes.split("|");
            let imagesF = images.map((image) => Object.assign({ image }));
            setImages(imagesF);
          }
        });
    }
    return () => {
      isMounted = false;
      window.speechSynthesis.cancel();
    };
  }, [location]); // El array de dependencias vacío asegura que este efecto se ejecute solo una vez

  useEffect(() => {
    speakDescription(); // Llama a la función de síntesis de voz después de cada renderización si los datos cambian
  }, [location, speakDescription]);

  const readResponse = (content) => {
    const valueSpeech = new SpeechSynthesisUtterance(content);
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

  if (!data && keysb != null) {
    return <div>Loading....</div>;
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  return (
    <>
      <Timer time={time} route={"/TotemAdvertising"} />
      <Card
        shadow={false}
        className="max-full relative grid h-[50rem] w-full items-end justify-center overflow-hidden text-center"
      >
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="absolute inset-0 m-0 h-full w-full rounded-none "
        >
          <Carrusel
            className="carrusel"
            images={imagesFinal == null ? pics : imagesFinal}
            data={imagesFinal}
          />
          <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-t from-black/80 via-black/50" />
        </CardHeader>
        <CardBody className="relative px-6 py-14 md:px-12">
          <Typography
            variant="h2"
            color="white"
            className="mb-6 font-medium leading-[1.5]"
          >
            {data == null ? "Bienvenido" : data["nombre"]}
          </Typography>

          <TotemWebCamera cameraAvailable={handleCameraAvailable} />

          <Typography variant="h5" className="mb-4 text-gray-400">
            Cochabamba, Bolivia
          </Typography>
          <div className="mb-6">
            <label
              for="default-input"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            ></label>
            <input type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Buscar..."
              value={text}
              onChange={(event) => SetBrowse(event.target.value)} />
          </div>
          <Avatar
            size="xl"
            variant="circular"
            alt="candice wu"
            className="border-2 border-white"
            src="/img/logo.png"
          />
        </CardBody>
      </Card>
      <section className="-mt-12 flex h-1/2 flex-col  divide-y px-4 pb-20 pt-4">
        <Card className="h-full w-full flex-row">
          <CardHeader
            shadow={false}
            floated={false}
            className="m-0 h-full w-1/2 shrink-0 rounded-r-none"
          >
            <img
              src={
                data == null
                  ? "https://img.freepik.com/vector-premium/navegacion-aplicacion-hay-destino-llegar-al-mapa-gps-destino_403715-36.jpg"
                  : 'data:image/png;base64,' + data["urlMapa"]
              }
              alt="image"
              className="h-full w-full object-cover"
            />
          </CardHeader>
          <CardBody>
            <IconButton
              variant="gradient"
              size="lg"
              color="green"
              className="pointer-events-none rounded-full"
            >
              <LightBulbIcon className="h-6 w-6 text-white" />
            </IconButton>
            <Typography variant="h4" color="blue-gray" className="mb-2 mt-5">
              Información sobre {data == null ? "Cochabamba" : data["nombre"]}
            </Typography>
            <Typography color="gray" className="mb-8 font-normal">
              {data == null ? "Bienvenido a los Totems" : data["descripcion"]}
            </Typography>
          </CardBody>
        </Card>
      </section>
      <footer className="w-full h-10 bg-gray-900 p-8 inset-x-0 bottom-0">
        <div className="flex flex-row flex-wrap items-center justify-center gap-x-12 gap-y-6 text-center text-white md:justify-between">
          <div className="flex-column flex">
            <Typography color="white" className="mb-8 ml-2 font-normal">
              {currentTime}
            </Typography>
          </div>
          <div className="flex-column flex">
            <Typography color="white" className="mb-8 ml-2 font-normal">
              {formattedDate}
            </Typography>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Template2