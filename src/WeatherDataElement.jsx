function WeatherDataElement({unit, temp, minTemp, maxTemp, pressure, humidity}) {

    function convertToCelcius(temp) {
        return (temp - 273.15).toFixed(2);
    }

    function convertToFahrenheit(temp) {
       return ((((temp - 273.15) * 9) / 5) + 32).toFixed(2);
    }
    
    function getTemperature(unit, number) {
        return unit === "Celcius" ? convertToCelcius(number) :
        unit === "Fahrenheit" ? convertToFahrenheit(number) :
        number
    }

    return(
        <>
        <p>Temperature: { getTemperature(unit, temp) }</p>
            <p>Minimal temperature: { getTemperature(unit, minTemp) }</p>
            <p>Maximal temperature: { getTemperature(unit, maxTemp) }</p>
            <p>Pressure: {pressure}</p>
            <p>Humidity: {humidity}</p>
        </>
    );
}

export default WeatherDataElement