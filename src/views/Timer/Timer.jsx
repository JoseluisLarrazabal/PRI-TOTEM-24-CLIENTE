import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Timer = ({time,route}) => {
  const [timeLeft, setTimeLeft] = useState(time); // tiempo en segundos
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate(); // obtenemos la función de navegación desde el hook useNavigate

  useEffect(() => {
    if (timeLeft === 0) {
      setRedirect(true);
    } else {
      
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 100);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (redirect) {
      // redireccionar a otra página
      navigate(route);
    }
  }, [redirect, navigate]);

  return (
    <>
    </>
  );
}

export default Timer;