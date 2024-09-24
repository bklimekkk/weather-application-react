function WeatherMainInfoElement({cityDetails, description}) {
    return(
        <>
               <h3>Weather for {cityDetails}</h3>
               <h5>{description}</h5>
        </>
    );
}

export default WeatherMainInfoElement; 