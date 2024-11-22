import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Timer = ({ inactivityTime, route, isListening }) => {
  const [timeLeft, setTimeLeft] = useState(inactivityTime); // Tiempo en segundos
  const navigate = useNavigate();

  const resetTimer = () => {
    setTimeLeft(inactivityTime); // Reinicia el temporizador
  };

  useEffect(() => {
    // Detectar solo clics para reiniciar el temporizador
    const handleClick = () => resetTimer();
    window.addEventListener("click", handleClick);

    return () => {
      // Limpia el evento al desmontar el componente
      window.removeEventListener("click", handleClick);
    };
  }, [inactivityTime]);

  useEffect(() => {
    // Reinicia el temporizador si el micrófono está activo
    if (isListening) {
      resetTimer();
    }
  }, [isListening]);

  useEffect(() => {
    if (timeLeft <= 0) {
      navigate(route); // Redirige si el temporizador llega a 0
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearTimeout(timerId); // Limpia el timeout al desmontar el componente o reiniciar
  }, [timeLeft, navigate, route]);

  return (
    <div>
      {/* Mostrar tiempo restante (opcional, solo para depuración) */}
      <p style={{ color: "white" }}>Inactividad: {timeLeft} segundos</p>
    </div>
  );
};

export default Timer;
