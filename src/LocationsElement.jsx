import { useState, useEffect } from "react";
import config from "../config.js";
import UnitSwitchElement from "./UnitSwitchElement.jsx";
import WeatherMainInfoElement from "./WeatherMainInfoElement.jsx";
import ForecastWeatherMainInfoElement from "./ForecastWeatherMainInfoElement.jsx";
import WeatherDataElement from "./WeatherDataElement.jsx";

let apiKey = config.apiKey;

function LocationsElement() {
    const [cityName, setCityName] = useState("");
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [weather, setWeather] = useState(null);
    const [isSunInfoShown, setIsSunInfoShown] = useState(false);
    const [isWindInfoShown, setIsWindInfoShown] = useState(false);
    const [forecastDates, setForecastDates] = useState(null);
    const [weatherForecast, setWeatherForecast] = useState(null);
    const [showForecastWindInformation, setShowForecastWindInformation] = useState(false);
    const [selectedTempUnit, setSelectedTempUnit] = useState("Celcius");
    const [forecastSelectedTempUnit, setForecastSelectedTempUnit] = useState("Celcius");
    const [favouritesList, setFavouritesList] = useState(JSON.parse(localStorage.getItem("favourites")) || []);
    const [lastLocationsList, setLastLocationsList] = useState(JSON.parse(localStorage.getItem("last")) || []);

    useEffect(() => {
        localStorage.setItem("favourites", JSON.stringify(favouritesList));
    }, [favouritesList]);

    useEffect(() => {
        if (lastLocationsList.length > 5) {
            setLastLocationsList(prevList => prevList.slice(0, -1));
        }
        localStorage.setItem("last", JSON.stringify(lastLocationsList));
    }, [lastLocationsList]);

    async function getWeatherLocations() {
        setLocations([]);
        setErrorMessage("");
        setWeather(null);
        setForecastDates(null);
        setWeatherForecast(null);
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`);
        if (response.ok) {
            setLocations(await response.json());
        } else {
            setErrorMessage("Failed to get locations");
            throw new Error("Failed to fetch locations data");
        }
    }

    function handleLocationInputChange(event) {
        setCityName(event.target.value);
    }

    async function handleLocationButtonClick(location) {
        setCityName("");
        setErrorMessage("");
        setSelectedLocation(location);
        if (!lastLocationsList.some(l => l.name === location.name && l.country === location.country && l.state === location.state)) {
            setLastLocationsList(l => [location, ...l]);
        }
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}`);

        if (response.ok) {
            setWeather(await response.json());
        } else {
            setErrorMessage("Failed to get weather for location");
            throw new Error("Failed to fetch locations data");
        }
    }

    function handleSunButtonClick() {
        setIsSunInfoShown(!isSunInfoShown);
    }

    function handleWindButtonClick() {
        setIsWindInfoShown(!isWindInfoShown);
    }

    async function getForecastDates() {
        setWeatherForecast(null);
        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${weather.coord.lat}&lon=${weather.coord.lon}&appid=${apiKey}`);
        if (response.ok) {
            setForecastDates(await response.json());
        } else {
            setErrorMessage("Couldn't get forecast dates");
            throw new Error("Couldn't get forecast dates");
        }
    }

    function showWeatherForecast(forecast) {
        setWeatherForecast(forecast);
    }

    function toggleShowForecastWindInfo() {
        setShowForecastWindInformation(!showForecastWindInformation);
    }

    function addToFavourites(location) {
        setFavouritesList(f => [...f, location]);
    }

    function removeFromFavourites(location) {
        const filteredFavouritesList = favouritesList.filter(l =>
            l.name !== location.name &&
            l.country !== location.country &&
            l.state !== location.state);
        setFavouritesList(filteredFavouritesList);
    }

    return (
        <>
            <input type="text" placeholder="Enter place name" value={cityName} onChange={(event) => handleLocationInputChange(event)} />
            <button onClick={getWeatherLocations}>Get Current Weather</button>
            <p className="error-message">{errorMessage}</p>

            {
                favouritesList.length !== 0 && !weather &&
                <>
                    <p>Favourite locations:</p>
                    {favouritesList.map((location, index) => 
                        <button key={index}
                                onClick={() => handleLocationButtonClick(location)}>{`${location.name}, ${location.country}, ${location.state}`}</button>
                    )}
                </>
            }

            {
                lastLocationsList.length !== 0 && !weather &&
                <>
                    <p>Last locations:</p>
                    {lastLocationsList.map((location, index) => 
                        <button key={index}
                                onClick={() => handleLocationButtonClick(location)}>{`${location.name}, ${location.country}, ${location.state}`}</button>
                    )}
                </>
            }

            <ul>
                {!weather &&
                    <>
                        {
                            locations.length !== 0 &&
                            <p>Searched locations:</p>
                        }
                        {
                            locations.map((location, index) => 
                                <button key={index}
                                        onClick={() => handleLocationButtonClick(location)}>{`${location.name}, ${location.country}, ${location.state}`}</button>
                            )
                        }
                    </>
                }
            </ul>
            {
                weather && 
                <div className="weather-section">
                    <WeatherMainInfoElement cityDetails={`${selectedLocation.name}, ${selectedLocation.country}, ${selectedLocation.state}`} 
                                            description={weather.weather[0].description} />

                    {
                        favouritesList.some(l => 
                            l.name === selectedLocation.name &&
                            l.country === selectedLocation.country &&
                            l.state === selectedLocation.state) ?
                            <>
                                <p>This is one of your favourite locations</p>
                                <button onClick={() => removeFromFavourites(selectedLocation)}>Remove from favourites</button>
                            </>
                            :
                            <button onClick={() => addToFavourites(selectedLocation)}>Add this location to favourites</button>
                    }

                    <UnitSwitchElement selectedTempUnit={selectedTempUnit} setSelectedTempUnit={setSelectedTempUnit} />
                    <WeatherDataElement unit={selectedTempUnit}
                                        temp={weather.main.temp}
                                        minTemp={weather.main.temp_min}
                                        maxTemp={weather.main.temp_max}
                                        pressure={weather.main.pressure}
                                        humidity={weather.main.humidity} />
                    
                    <button onClick={handleSunButtonClick}>{isSunInfoShown ? "Hide sun information" : "Show sun information"}</button><br />
                    {isSunInfoShown && 
                        <div>
                            <p>Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleString()}</p>
                            <p>Sunset: {new Date(weather.sys.sunset * 1000).toLocaleString()}</p>
                        </div>
                    }
                    <button onClick={handleWindButtonClick}>{isWindInfoShown ? "Hide wind information" : "Show wind information"}</button>
                    {isWindInfoShown &&
                        <div>
                            <p>Speed: {weather.wind.speed}</p> 
                            <p>Deg: {weather.wind.deg}</p>
                            {weather.wind.gust === undefined ? "" : <p>Gust: {weather.wind.gust}</p>}
                        </div>
                    }
                </div>
            }

            {
                weather &&
                <div className="forecast-section">
                    <button onClick={getForecastDates}>Get Forecast</button><br /> 
                    {forecastDates && !weatherForecast && forecastDates.list.map((forecast, index) => 
                        <button key={index} onClick={() => showWeatherForecast(forecast)}>{forecast.dt_txt}</button>
                    )}
                    
                    {
                        weatherForecast &&
                        <div>
                            <ForecastWeatherMainInfoElement date={weatherForecast.dt_txt}
                                                             description={weatherForecast.weather[0].description} />
                            <UnitSwitchElement selectedTempUnit={forecastSelectedTempUnit} setSelectedTempUnit={setForecastSelectedTempUnit} />
                            <WeatherDataElement unit={forecastSelectedTempUnit}
                                                temp={weatherForecast.main.temp}
                                                minTemp={weatherForecast.main.temp_min}
                                                maxTemp={weatherForecast.main.temp_max}
                                                pressure={weatherForecast.main.pressure}
                                                humidity={weatherForecast.main.humidity} />
                            
                            <button onClick={toggleShowForecastWindInfo}>{showForecastWindInformation ? "Hide wind information" : "Show wind information"}</button>
                            {showForecastWindInformation &&
                                <div>
                                    <p>Speed: {weatherForecast.wind.speed}</p>
                                    <p>Deg: {weatherForecast.wind.deg}</p>
                                    {weatherForecast.wind.gust !== undefined && 
                                        <p>Gust: {weatherForecast.wind.gust}</p>
                                    }
                                </div>
                            }
                        </div>
                    }
                </div>
            }
        </>
    );
}

export default LocationsElement;
