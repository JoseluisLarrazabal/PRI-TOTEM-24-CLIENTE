import { useEffect, useRef } from "react";
// Comentar la importación de handpose si no lo necesitas temporalmente
// import * as handpose from '@tensorflow-models/handpose';
// import '@tensorflow/tfjs-backend-webgl';
// import '@tensorflow/tfjs';

function TotemWebCamera({ cameraAvailable }) {

    const webCamRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        // Comentar temporalmente la configuración de la cámara
        /*
        const setupCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true })
                const video = webCamRef.current

                video.srcObject = stream
                video.onloadeddata = () => {
                    video.play()
                }

            } catch (e) {
                console.error('Error accessing webcam: ', e)
            }
        }
        setupCamera();
        */

        return () => { // Limpia el stream y los intervalos cuando se desmonte el componente
            if (webCamRef.current && webCamRef.current.srcObject) {
                const stream = webCamRef.current.srcObject;
                const tracks = stream.getTracks();

                tracks.forEach(track => track.stop());
                webCamRef.current.srcObject = null;
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const getStatusCamera = (status) => {
        cameraAvailable(status); // Retornamos el valor del detector de mano, 1 para detectado, 0 para no detectado
    };

    useEffect(() => {
        // Comentar la carga del modelo de Handpose y la detección
        /*
        const runHandpose = async () => {
            const net = await handpose.load();
            console.log('Handpose model loaded');

            intervalRef.current = setInterval(async () => {
                await detect(net);
            }, 1000);
        }

        const detect = async (net) => {
            if (webCamRef.current && webCamRef.current.readyState === 4) {
                const video = webCamRef.current;
                const videoWidth = video.videoWidth;
                const videoHeight = video.videoHeight;

                video.width = videoWidth;
                video.height = videoHeight;

                const hand = await net.estimateHands(video);
                if (hand.length > 0) {
                    console.log('Mano detectada');
                    getStatusCamera(hand.length); // Si hand.length es mayor a 0, detecto la mano
                } else {
                    getStatusCamera(0); // Si hand es 0, no detecto nada
                }
            }
        };
        runHandpose();
        */

        return () => {  // Limpiar detección
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <div hidden>
            <video ref={webCamRef} style={{ width: '600px', height: '400px' }} />
        </div>
    );
}

export default TotemWebCamera;
