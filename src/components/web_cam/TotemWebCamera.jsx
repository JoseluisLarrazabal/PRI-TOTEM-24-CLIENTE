import React, { useEffect, useRef } from "react";
import * as handpose from "@tensorflow-models/handpose";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs";

function TotemWebCamera({ cameraAvailable }) {
  const webCamRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Configuración de la cámara
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = webCamRef.current;

        video.srcObject = stream;
        video.onloadeddata = () => {
          video.play();
        };
      } catch (e) {
        console.error("Error accessing webcam: ", e);
      }
    };
    setupCamera();

    return () => {
      // Limpia el stream y los intervalos al desmontar el componente
      if (webCamRef.current && webCamRef.current.srcObject) {
        const stream = webCamRef.current.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach((track) => track.stop());
        webCamRef.current.srcObject = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getStatusCamera = (status) => {
    cameraAvailable(status); // Enviar 1 si el gesto se detecta, 0 si no
  };

  useEffect(() => {
    // Carga del modelo Handpose y detección
    const runHandpose = async () => {
      const net = await handpose.load();
      console.log("Handpose model loaded");

      intervalRef.current = setInterval(async () => {
        await detect(net);
      }, 1000); // Detectar gestos cada segundo
    };

    const detect = async (net) => {
      if (webCamRef.current && webCamRef.current.readyState === 4) {
        const video = webCamRef.current;

        try {
          const hands = await net.estimateHands(video);

          if (hands.length > 0) {
            console.log("Mano detectada");
            const landmarks = hands[0].landmarks;

            // Detectar "pulgar hacia arriba"
            const isThumbUp = detectThumbsUp(landmarks);

            if (isThumbUp) {
              console.log("Gesto detectado: Pulgar hacia arriba 👍");
              getStatusCamera(1); // Activar acción para el gesto
            } else {
              getStatusCamera(0); // Sin gesto detectado
            }
          } else {
            getStatusCamera(0); // No hay manos detectadas
          }
        } catch (error) {
          console.error("Error al detectar gestos:", error);
          getStatusCamera(0);
        }
      }
    };

    const detectThumbsUp = (landmarks) => {
      // Coordenadas clave
      const thumbTip = landmarks[4]; // Punta del pulgar
      const thumbBase = landmarks[1]; // Base del pulgar
      const indexTip = landmarks[8]; // Punta del índice

      // Lógica para "pulgar hacia arriba"
      const isThumbHigher = thumbTip[1] < indexTip[1]; // El pulgar está más arriba que el índice
      const isThumbVertical = Math.abs(thumbTip[0] - thumbBase[0]) < 50; // El pulgar está alineado verticalmente

      return isThumbHigher && isThumbVertical;
    };

    runHandpose();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div hidden>
      <video ref={webCamRef} style={{ width: "600px", height: "400px" }} />
    </div>
  );
}

export default TotemWebCamera;
