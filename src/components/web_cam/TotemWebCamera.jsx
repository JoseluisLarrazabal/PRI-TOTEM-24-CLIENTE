import { useEffect, useRef } from "react";
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
        console.error("Error accessing webcam: ", e);
      }
    };
    setupCamera();

    return () => {
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

  const detectGestures = async (net) => {
    if (webCamRef.current && webCamRef.current.readyState === 4) {
      const video = webCamRef.current;

      try {
        const hands = await net.estimateHands(video);

        if (hands.length > 0) {
          // Obtenemos los landmarks de la primera mano detectada
          const landmarks = hands[0].landmarks;

          // Coordenadas relevantes
          const thumbTip = landmarks[4]; // Punta del pulgar
          const thumbBase = landmarks[1]; // Base del pulgar
          const indexTip = landmarks[8]; // Punta del índice

          // Lógica para "pulgar hacia arriba"
          if (
            thumbTip[1] < indexTip[1] && // Pulgar más alto que el índice
            Math.abs(thumbTip[0] - thumbBase[0]) < 50 // Pulgar más vertical que horizontal
          ) {
            console.log("Gesto detectado: Pulgar hacia arriba 👍");
            cameraAvailable(1); // Activa acción si el gesto se detecta
          } else {
            cameraAvailable(0); // No detecta el gesto
          }
        } else {
          cameraAvailable(0); // No se detecta ninguna mano
        }
      } catch (error) {
        console.error("Error al detectar gestos:", error);
        cameraAvailable(0); // Manejo de errores
      }
    }
  };

  useEffect(() => {
    const runHandpose = async () => {
      const net = await handpose.load();
      console.log("Handpose model loaded");

      // Intervalo para detección cada 1.5 segundos
      intervalRef.current = setInterval(async () => {
        await detectGestures(net);
      }, 1500);
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
