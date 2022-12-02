const searchButton = document.getElementById('search-button');
const citiesSearchedUl = document.getElementById('cities-searched-list');
const cityInputField = document.getElementById('destination-city');
const citiesContainer = document.getElementById('selected-city-weather-container');
const fiveDayForecastContainer = document.getElementById('five-day-forecast-container');
const homeCity = document.getElementById('home-city');

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function updateCities() {
  citiesSearchedUl.innerHTML = '';
  const savedCities = localStorage.getItem('cities');
  if (savedCities) {
    const names = JSON.parse(savedCities);
    names.forEach(name => {
      const li = document.createElement('li');
      li.textContent = name;
      citiesSearchedUl.appendChild(li);
      citiesSearchedUl.insertBefore(li, citiesSearchedUl.children[0]);
    })
  }
}
updateCities();

//puts the list into local storage
const saveNewCity = () => {
  const name = cityInputField.value;
  if (!name) {
    return;
  }
  const savedCities = localStorage.getItem('cities');
  if (savedCities) {
    const savedNames = JSON.parse(savedCities);
    savedNames.push(name);
    localStorage.setItem('cities', JSON.stringify(savedNames));
  } else {
    const savedNames = [name];
    localStorage.setItem('cities', JSON.stringify(savedNames));
  }
} 

searchButton.addEventListener('click', saveNewCity);
searchButton.addEventListener('click', lookUpDestinationAirport);

const storedInput = localStorage.getItem('cities');
const listEL = document.getElementsByTagName('li');

if (storedInput) {
  listEL.textContent = storedInput;
}

//displays the last value input into the search field
const destinationCity = document.getElementById('destination-city');
function persistInput(input) {
  let key = "input-" + destinationCity.id; //id of input field
  let storedValue = localStorage.getItem(key);
  if (storedValue)
    input.value = storedValue;
  destinationCity.addEventListener('input', function () {
    localStorage.setItem(key, destinationCity.value);
  })
}
persistInput(destinationCity);

function homeCityPersistInput(input) {
  let key = "input-" + homeCity.id;
  let storedValue = localStorage.getItem(key);
  if (storedValue)
    input.value = storedValue;
  homeCity.addEventListener('input', function () {
    localStorage.setItem(key, homeCity.value);
  })
}
homeCityPersistInput(homeCity);

//set date and grabs the variables need for the weather values
const selectedCity = document.getElementById('selected-city');
let destinationCityName = cityInputField.value;
const now = luxon.DateTime.now().setZone('America/Los_Angeles').toLocaleString();
selectedCity.innerHTML = destinationCityName + " " + now;

const temperature = document.getElementById('temperature');
const wind = document.getElementById('wind');
const humidity = document.getElementById('humidity');
const tomorrowForecastDate = document.getElementById('tomorrow-forecast-date');
const tomorrowTemperature = document.getElementById('tomorrow-temperature');
const tomorowWind = document.getElementById('tomorrow-wind');
const tomorrowHumidity = document.getElementById('tomorrow-humidity');
const day2ForecastDate = document.getElementById('day-2-forecast-date');
const day2Temperature = document.getElementById('day-2-temperature');
const day2Wind = document.getElementById('day-2-wind');
const day2Humidity = document.getElementById('day-2-humidity');
const day3ForecastDate = document.getElementById('day-3-forecast-date');
const day3Temperature = document.getElementById('day-3-temperature');
const day3Wind = document.getElementById('day-3-wind');
const day3Humidity = document.getElementById('day-3-humidity');
const day4ForecastDate = document.getElementById('day-4-forecast-date');
const day4Temperature = document.getElementById('day-4-temperature');
const day4Wind = document.getElementById('day-4-wind');
const day4Humidity = document.getElementById('day-4-humidity');
const day5ForecastDate = document.getElementById('day-5-forecast-date');
const day5Temperature = document.getElementById('day-5-temperature');
const day5Wind = document.getElementById('day-5-wind');
const day5Humidity = document.getElementById('day-5-humidity');
const cityWeatherImg = document.getElementById('city-weather-image');
const day1WeatherImage = document.getElementById('day-1-weather-image');
const day2WeatherImage = document.getElementById('day-2-weather-image');
const day3WeatherImage = document.getElementById('day-3-weather-image');
const day4WeatherImage = document.getElementById('day-4-weather-image');
const day5WeatherImage = document.getElementById('day-5-weather-image');

//performs searches on the apis to get lat and lon and then the weather for the city and then the 5 day forecast
function performSearches(search) {
  const baseURL = "https://api.openweathermap.org/geo/1.0/direct?"
  let parameters = "limit=1&appid=203481f675fae76832d631c5ecaa6b09&q=" + encodeURIComponent(destinationCityName);
  const fullURL = baseURL + parameters;
  let lat;
  let lon;
  let weatherParameters;
  fetch(fullURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      lat = data[0].lat;
      lon = data[0].lon;
      const baseWeatherURL = "https://api.openweathermap.org/data/2.5/weather?&appid=203481f675fae76832d631c5ecaa6b09&units=imperial&lang=en"
      weatherParameters = "&lat=" + encodeURIComponent(lat) + "&lon=" + encodeURIComponent(lon);
      //console.log(lat);
      //console.log(lon);
      const fullWeatherURL = baseWeatherURL + weatherParameters;
      return fetch(fullWeatherURL);
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      cityWeatherImg.src = "https://openweathermap.org/img/wn/" + data.weather[0].icon + '.png';
      cityWeatherImg.alt = data.weather[0].description;
      temperature.innerHTML = 'Temperature: ' + data.main.temp + " F";
      wind.innerHTML = 'Wind: ' + data.wind.speed + " MPH";
      humidity.innerHTML = 'Humidity: ' + data.main.humidity + " %";
      const forecastBaseURL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&appid=203481f675fae76832d631c5ecaa6b09&lang=en";
      const forecastFullURL = forecastBaseURL + weatherParameters;
      return fetch(forecastFullURL);
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      tomorrowForecastDate.innerHTML = luxon.DateTime.now().plus({ days: 1 }).setZone('America/Los_Angeles').toLocaleString();
      day1WeatherImage.src = "https://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + '.png';
      day1WeatherImage.alt = data.list[0].weather[0].description;
      tomorrowTemperature.innerHTML = 'Temperature: ' + data.list[0].main.temp + " F";
      tomorowWind.innerHTML = 'Wind: ' + data.list[0].wind.speed + " MPH";
      tomorrowHumidity.innerHTML = 'Humidity: ' + data.list[0].main.humidity + " %";
      day2ForecastDate.innerHTML = luxon.DateTime.now().plus({ days: 2 }).setZone('America/Los_Angeles').toLocaleString();
      day2WeatherImage.src = "https://openweathermap.org/img/wn/" + data.list[1].weather[0].icon + '.png';
      day2WeatherImage.alt = data.list[0].weather[0].description;
      day2Temperature.innerHTML = 'Temperature: ' + data.list[1].main.temp + " F";
      day2Wind.innerHTML = 'Wind: ' + data.list[1].wind.speed + " MPH";
      day2Humidity.innerHTML = 'Humidity: ' + data.list[1].main.humidity + " %";
      day3ForecastDate.innerHTML = luxon.DateTime.now().plus({ days: 3 }).setZone('America/Los_Angeles').toLocaleString();
      day3WeatherImage.src = "https://openweathermap.org/img/wn/" + data.list[2].weather[0].icon + '.png';
      day3WeatherImage.alt = data.list[0].weather[0].description;
      day3Temperature.innerHTML = 'Temperature: ' + data.list[2].main.temp + " F";
      day3Wind.innerHTML = 'Wind: ' + data.list[2].wind.speed + " MPH";
      day3Humidity.innerHTML = 'Humidity: ' + data.list[2].main.humidity + " %";
      day4ForecastDate.innerHTML = luxon.DateTime.now().plus({ days: 4 }).setZone('America/Los_Angeles').toLocaleString();
      day4WeatherImage.src = "https://openweathermap.org/img/wn/" + data.list[3].weather[0].icon + '.png';
      day4WeatherImage.alt = data.list[0].weather[0].description;
      day4Temperature.innerHTML = 'Temperature: ' + data.list[3].main.temp + " F";
      day4Wind.innerHTML = 'Wind: ' + data.list[3].wind.speed + " MPH";
      day4Humidity.innerHTML = 'Humidity: ' + data.list[3].main.humidity + " %";
      day5ForecastDate.innerHTML = luxon.DateTime.now().plus({ days: 5 }).setZone('America/Los_Angeles').toLocaleString();
      day5WeatherImage.src = "https://openweathermap.org/img/wn/" + data.list[4].weather[0].icon + '.png';
      day5WeatherImage.alt = data.list[0].weather[0].description;
      day5Temperature.innerHTML = 'Temperature: ' + data.list[4].main.temp + " F";
      day5Wind.innerHTML = 'Wind: ' + data.list[4].wind.speed + " MPH";
      day5Humidity.innerHTML = 'Humidity: ' + data.list[4].main.humidity + " %";
    })
}
performSearches();

//if a city in the list is clicked this run the searches again based on the city that was clicked
function handleClick(e) {
  destinationCityName = e.target.textContent;
  performSearches();
  lookUpDestinationAirport();
  lookUpHomeAirport();

  selectedCity.innerHTML = capitalizeFirstLetter(destinationCityName) + " " + now;
}
for (i = 0; i < listEL.length; i++) {
  listEL[i].addEventListener('click', handleClick);
}
let iata_code;
let dl; //destionation airport code
let ol; //original location airport code
// https://airlabs.co/api/v9/nearby?lat=-6.1744&lng=106.8294&distance=20&api_key=2de51778-e1e8-44b5-9373-5466068521b1
function lookUpDestinationAirport(search) {
  const baseURL = "https://api.openweathermap.org/geo/1.0/direct?"
  let parameters = "limit=1&appid=203481f675fae76832d631c5ecaa6b09&q=" + encodeURIComponent(destinationCityName);
  const fullURL = baseURL + parameters;
  let lat;
  let lon;
  let latAndLong;
  fetch(fullURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      lat = data[0].lat;
      lon = data[0].lon;
      const baseAirportURL = "https://airlabs.co/api/v9/nearby?SameSite=Strict&distance=100&api_key=5ba5c48a-3d78-4f3e-a93b-598bc845d7de";
      latAndLong = "&lat=" + encodeURIComponent(lat) + "&lng=" + encodeURIComponent(lon);
      const fullAirportCodeURL = baseAirportURL + latAndLong;
      return fetch(fullAirportCodeURL)
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      data.response.airports.sort((a, b) => b.popularity - a.popularity);
      dl = data.response.airports[0].iata_code;
      console.log(dl);
    })
}

lookUpDestinationAirport();
const homeCityInputField = document.getElementById('home-city');
let homeCityName = homeCityInputField.value;
let destinationCityMessage = document.getElementById("destination-city-message");
let destinationFlightMessage = document.getElementById("flight-message");
let noDestinationCityMessage = document.getElementById("no-destination-city");

function lookUpHomeAirport(search) {
  const baseURL = "https://api.openweathermap.org/geo/1.0/direct?"
  let parameters = "limit=1&appid=203481f675fae76832d631c5ecaa6b09&q=" + encodeURIComponent(homeCityName);
  const fullURL = baseURL + parameters;
  let lat;
  let lon;
  let latAndLong;
  fetch(fullURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      lat = data[0].lat;
      lon = data[0].lon;
      const baseAirportURL = "https://airlabs.co/api/v9/nearby?SameSite=Strict&distance=100&api_key=5ba5c48a-3d78-4f3e-a93b-598bc845d7de";
      latAndLong = "&lat=" + encodeURIComponent(lat) + "&lng=" + encodeURIComponent(lon);
      const fullAirportCodeURL = baseAirportURL + latAndLong;
      return fetch(fullAirportCodeURL)
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      data.response.airports.sort((a, b) => b.popularity - a.popularity);
      ol = data.response.airports[0].iata_code;
      console.log(ol);
      const scheduleBaseURL = "https://airlabs.co/api/v9/routes?";
      let scheduleParameters = "dep_iata=" + encodeURIComponent(ol) + "&api_key=5ba5c48a-3d78-4f3e-a93b-598bc845d7de" + "&arr_iata=" + encodeURIComponent(dl);
      fullScheduleURL = scheduleBaseURL + scheduleParameters;
      return(fetch(fullScheduleURL))
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data.response);
      for (let i =0; i< data.response.length; i++){
        if (dl !== data.response[i].arr_iata){
          noDestinationCityMessage.innerHTML = "Try clicking on the city " + capitalizeFirstLetter(destinationCityName) + " again";
        }  
        else{
          destinationCityMessage.innerHTML = "Pack your bags you are going to " + capitalizeFirstLetter(destinationCityName) + " !!!";
          destinationFlightMessage.innerHTML = "There is a flight departing from " + ol + " to "+ data.response[i].arr_iata + " is " + data.response[i].airline_icao +" "+ data.response[i].flight_number + " which departs at " + data.response[i].dep_time;
          console.log("Pack your bags you are going to " + destinationCityName + " !!!" )
          console.log("The next flight departing from " + ol + " to "+ data.response[i].arr_iata + " is " + data.response[i].airline_icao +" "+ data.response[i].flight_number + " which departs at " + data.response[i].dep_time);
          noDestinationCityMessage.style.display = "none";
        }
    }   
    })
}
lookUpHomeAirport();
lookUpDestinationAirport();

