import { useState, useEffect } from "react";

let recognition = null;
if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true; // Sigue escuchando después de reconocer
    recognition.interimResults = false; // Solo devuelve resultados finales
    recognition.lang = "es-ES"; // Establece el idioma a español (España)
}

const useSpeechRecognition = (Search) => {
    const [text, setText] = useState("");
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        if (!recognition) return;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.trim();
            
            // Aquí formateamos el texto para que la primera letra sea mayúscula y el resto minúsculas.
            const formattedTranscript = transcript.charAt(0).toUpperCase() + transcript.slice(1).toLowerCase();
            
            console.log("Texto reconocido y formateado:", formattedTranscript);
            
            setText(formattedTranscript);
            recognition.stop();
            setIsListening(false);
            
            // Llamamos a handleSubmit con el texto ya formateado
            Search(formattedTranscript); // Llamamos con el texto formateado
        };
        

        recognition.onerror = (event) => {
            console.error("Error en el reconocimiento de voz:", event.error);
            setIsListening(false);
            recognition.stop();
        };
        
    }, [Search]);

    const startListening = () => {
        setText(""); // Limpia el texto antes de comenzar
        setIsListening(true);
        recognition.start(); // Inicia el reconocimiento
    };

    const stopListening = () => {
        setIsListening(false);
        recognition.stop(); // Detiene el reconocimiento
    };

    return {
        text,
        isListening,
        startListening,
        stopListening,
        hasRecognitionSupport: !!recognition, // Verifica si el navegador soporta reconocimiento de voz
    };
};

export default useSpeechRecognition;
