import { useState, useEffect } from "react";

let recognition = null;
if("webkitSpeechRecognition" in window){
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "es-ES"
}

const useSpeechRecognition = (Search) => {
    const[text, setText] = useState("");
    const[isListening, setIsListening] = useState(false);

    useEffect(()=>{
        if(!recognition) return;

        recognition.onresult = (event = SpeechRecognitionEvent)=>{
            console.log("onresult event:", event);
            setText(event.results[0][0].transcript)
            recognition.stop();
            setIsListening(false);
            Search(event.results[0][0].transcript);
        }
    }, [])

    const startListening = () => {
        setText("");
        setIsListening(true);
        recognition.start();
    }

    const stopListening = () => {
        setIsListening(false);
        recognition.stop();
    }

    return {
        text,
        isListening,
        startListening,
        stopListening,
        hasRecognitionSupport: !!recognition,
    }
}

export default useSpeechRecognition;

