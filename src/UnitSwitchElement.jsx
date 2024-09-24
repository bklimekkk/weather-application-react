function UnitSwitchElement({selectedTempUnit, setSelectedTempUnit}) {

    function setToCelcius() {
        setSelectedTempUnit("Celcius");
    }

    function setToFahrenheit() {
        setSelectedTempUnit("Fahrenheit");
    }

    function setToKelvin() {
        setSelectedTempUnit("Kelvin");
    }
    return(
        <div>
                <button className={selectedTempUnit === "Celcius" ? "selected-unit" : ""} onClick={setToCelcius}>Celcius</button>
                <button className={selectedTempUnit === "Fahrenheit" ? "selected-unit" : ""} onClick={setToFahrenheit}>Fahrenheit</button>
                <button className={selectedTempUnit === "Kelvin" ? "selected-unit" : ""} onClick={setToKelvin}>Kelvin</button>
            </div>
    );
}

export default UnitSwitchElement;