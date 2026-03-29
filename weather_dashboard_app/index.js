
var cityInput=document.getElementById("search_city")
let head=document.getElementById("city")
cityInput.addEventListener("keydown",function(event){
    if(event.key==="Enter"){
        let city=cityInput.value.trim();
        console.log("heeloo");
        getWeather(city);
        }
    }
)
     const apiKey=API KEY;
      const apiURL= "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
      let weathericon=document.querySelector(".icon img");
    
        
async function getWeather(city){
    try{
    const response=await fetch(apiURL + city +`&appid=${apiKey}`);
        var data=await response.json();
        console.log(data);
        if (data.cod === "404") {
            head.innerText="City not found ❌";
            clearUI();
            return;
        }

            let temperature=Math.round(data.main.temp);
            let humidity=data.main.humidity;
            let wind=Math.round(data.wind.speed*3.6);
            let pressure=data.main.pressure;
            let min_temp=data.main.temp_min;
            let max_temp=data.main.temp_max;
            let sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
            let sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
            let des=data.weather[0].description;
            des = des.charAt(0).toUpperCase() + des.slice(1);
            let icon=data.weather[0].main;
            let precipitation = (data.rain ? data.rain["1h"] : 0);
            let location=data.name;
            head.innerText=location ;
            document.getElementById("humidity").innerText= "Humidity " + humidity +"%";
            document.getElementById("wind").innerText="Wind " + wind +" km/hr";
            document.getElementById("temp").innerText= temperature +"°C";
            document.getElementById("pressure").innerText=" Pressure "+ pressure +" hPa";
            document.getElementById("min_temp").innerText="Lowest Temperature "+ min_temp+" °C";
            document.getElementById("max_temp").innerText="Highest Temperature "+ max_temp+" °C";
            document.getElementById("sunrise").innerText="Sunrise "+sunrise;
            document.getElementById("sunset").innerText="Sunset "+sunset;
            document.getElementById("rain").innerText="Precipitaion "+ precipitation+" mm";
            document.getElementById("des").innerText= des;
           

            let iconCode = data.weather[0].icon;
            document.getElementById("icon").src =
                `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
            let lat=data.coord.lat
            let lon=data.coord.lon
            const dailyData = await get7DayForecast(lat, lon);
            displayForecast(dailyData);

// 👇 ADD THIS
changeBackground(iconCode);
        
    }
    catch(error){
         console.log(error);
        alert("Something went wrong ⚠️");
    }
}



// 🔹 Get 7-day forecast
async function get7DayForecast(lat, lon) {
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );

    const data = await res.json();

    let dailyData = [];

    // take one data per day (every 24 hours)
    for (let i = 0; i < data.list.length; i += 8) {
        dailyData.push(data.list[i]);
    }

    return dailyData;
}
function displayForecast(dailyData) {
    let days = document.querySelectorAll(".day");
    const weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    // ✅ loop only available data
    for (let i = 0; i < days.length; i++) {

        if (!dailyData[i]) {
            days[i].style.display = "none"; // hide extra boxes
            continue;
        }

        let dayData = dailyData[i];
        let date = new Date(dayData.dt * 1000);
        let dayName = weekDays[date.getDay()];

        let temp;
        let condition;

        // ✅ handle BOTH APIs (important)
        if (dayData.main) {
            // 2.5 forecast API
            temp = Math.round(dayData.main.temp);
            condition = dayData.weather[0].main;
        } else {
            // One Call API
            temp = Math.round(dayData.temp.day);
            condition = dayData.weather[0].main;
        }

        let dayDiv = days[i];

        dayDiv.children[0].innerText = dayName;
        dayDiv.children[2].innerText = temp + "°C";
        dayDiv.children[3].innerText = condition;


        let iconCode = dayData.weather[0].icon;
        dayDiv.children[1].src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    }
}

function clearUI() {
    document.getElementById("temp").innerText = "--°C";
    document.getElementById("des").innerText = "--";

    document.getElementById("humidity").innerText = "Humidity --%";
    document.getElementById("wind").innerText = "Wind -- km/hr";
    document.getElementById("pressure").innerText = "Pressure -- hPa";
    document.getElementById("rain").innerText = "Precipitation -- mm";

    document.getElementById("min_temp").innerText = "Lowest Temperature --°C";
    document.getElementById("max_temp").innerText = "Highest Temperature --°C";
    document.getElementById("sunrise").innerText = "Sunrise --";
    document.getElementById("sunset").innerText = "Sunset --";

    document.getElementById("icon").src = "images/cloudy (1).png";

    document.querySelectorAll(".day").forEach(day => {
        day.children[0].innerText = "--";
        day.children[2].innerText = "--°C";
        day.children[3].innerText = "--";
        day.querySelector("img").src = "images/cloudy (1).png";
    });
    document.body.style.backgroundImage = `url("images/backgrnd.png")`;
}
window.onload = function() {
    clearUI();
};

function changeBackground(iconCode) {

    let bgImage = "images/backgrnd.png";

    // Extract main weather code (first 2 digits)
    let code = iconCode.substring(0, 2);
    let isDay = iconCode.includes("d"); 

    if (code === "01") { // clear sky
        bgImage = isDay ? "images/sunny.jpg" : "images/night.jfif";
    }
   else if (code === "02" || code === "03" || code === "04") {
        bgImage = isDay ? "images/cloudy.jpg" : "images/cloudy_night.jpg";
    }
    else if (code === "09" || code === "10") { // rain
        bgImage = "images/thunderstorm.jpg";
    }
    else if (code === "11") { // thunderstorm
        bgImage = "images/thunder.jpg";
    }
    else if (code === "13") { // snow
        bgImage = "images/snow.jfif";
    }
    else if (code === "50") { // fog/mist
        bgImage = "images/fog.jfif";
    }
    else if(code==="60"){
        bgImage="images/backgrnd.png";
    }

    document.body.style.backgroundImage = `url(${bgImage})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
}
