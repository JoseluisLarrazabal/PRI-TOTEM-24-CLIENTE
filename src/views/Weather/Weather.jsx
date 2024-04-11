import { useState, useEffect } from 'react';

export function Weather() {
  const [temperature, setTemperature] = useState(null);
    
  useEffect(() => {
    const apiKey = '5b7bff1d0a1595b8731d71b06c23cd2c';
    const city = 'London';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=-17.393973&lon=-66.2050751&appid=${apiKey}`;

    fetch(url)
      .then(response => 
        response.json()
        
      ).then(result => {
        console.log(result)
        const currentTemperature = result['main']['temp'];
        console.log(currentTemperature);
        setTemperature(currentTemperature);
      })
      .catch(error => {
        console.log(error);
      });

      
  }, []);

  return (
    <div>
      {temperature ? (
        <p>{temperature}°C</p>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
}