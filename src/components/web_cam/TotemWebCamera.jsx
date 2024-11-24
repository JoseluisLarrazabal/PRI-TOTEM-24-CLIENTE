import React, { useEffect, useRef } from "react";
import * as handpose from "@tensorflow-models/handpose";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs";

function TotemWebCamera({ cameraAvailable }) {
  const webCamRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = webCamRef.current;

        video.srcObject = stream;
        video.onloadeddata = () => {
          video.play();
        };
      } catch (e) {
        console.error("Error al acceder a la cámara: ", e);
      }
    };

    setupCamera();

    return () => {
      // Limpiar cámara y detener detección
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

  useEffect(() => {
    const runHandpose = async () => {
      const net = await handpose.load();
      console.log("Modelo Handpose cargado");

      intervalRef.current = setInterval(async () => {
        await detect(net);
      }, 300); // Detectar manos cada 300ms
    };

    const detect = async (net) => {
      if (webCamRef.current && webCamRef.current.readyState === 4) {
        const video = webCamRef.current;

        try {
          const hands = await net.estimateHands(video);

          if (hands.length > 0) {
            console.log("Mano detectada");
            cameraAvailable(1); // Notificar detección de mano
          } else {
            cameraAvailable(0); // Notificar ausencia de mano
          }
        } catch (error) {
          console.error("Error al detectar la mano:", error);
          cameraAvailable(0); // En caso de error, asumir que no hay manos
        }
      }
    };

    runHandpose();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [cameraAvailable]);

  return (
    <div hidden>
      <video ref={webCamRef} style={{ width: "600px", height: "400px" }} />
    </div>
  );
}

export default TotemWebCamera;

