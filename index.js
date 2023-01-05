// Globals
const baseUrl = "https://goweather.herokuapp.com/weather/"
const testUrl = "http://localhost:3000/newyork"
const dbjson = 'db.json'
const coldCats = [
    'images/cold1.jpeg',
    'images/cold2.jpg',
    'images/cold3.jpg'
];
const sunnyCats = [
    'images/sunny1.jpg',
    'images/sunny2.jpg',
    'images/sunny3.jpg'
];
const hotCats = [
    'images/hot1.jpg',
    'images/hot2.jpg',
    'images/hot3.jpg'
];
let catArray = [];
let searchedCitiesArray = [];

// DOM Selectors
const currentCityTitle = document.querySelector('#current-city')
const currentCity = document.querySelector('#forecast');
const threeDayForecast = document.querySelector('#threedayforecast');
const catMood = document.querySelector('#cat-pictures');
const catImg = document.querySelector('#cat-image');
const cityForm = document.querySelector('#new-city');
const citySearch = document.querySelector('#city-search');
const commentsForm = document.querySelector('#city-comment');
const commentContainer = document.querySelector('#new-comment-container');

// Fetch Functions
function getOneCityData(url, city) {
    return fetch(`${url}/${city}`)
    .then(res => res.json())
}

// Back-end Fetch Functions

// Render Functions
function renderCityData(data) {
    const cityDesc = document.createElement('h3');
    const cityTemp = document.createElement('h3');
    const cityWind = document.createElement('h3');
    const tempInF = convCtoF(parseInt(data.temperature.substring(0, data.temperature.length-2)));
    const windInMih = convKmhtoMph(parseInt(data.wind.substring(0, data.wind.length-4)));

    cityDesc.textContent = `Today's Forecast: ${data.description}`;
    cityTemp.textContent = `Temperature: ${tempInF}°F`;
    cityWind.textContent = `Wind: ${windInMih} mph`;
    currentCity.append(cityDesc, cityTemp, cityWind);

    renderCatPic(tempInF);
}

function renderForecast(data) {
    data.forEach(element => {
        const temp = document.createElement('h4');
        const wind = document.createElement('h4');
        const tempInF = convCtoF(parseInt(element.temperature.substring(0, element.temperature.length-2)));
        // console.log(tempInF);
        const windInMih = convKmhtoMph(parseInt(element.wind.substring(0, element.wind.length-4)));
        // console.log(windInMih)

        temp.textContent = `${tempInF}°F`;
        wind.textContent = `${windInMih} mph`;
        threeDayForecast.append(temp, wind);
        threeDayForecast.setAttribute('style', 'border: 1px solid');
    })
}

function renderCatPic(temp) {
    if(temp < 45) {
        catArray = coldCats;
    } else if (temp >= 45 && temp <= 90) {
        catArray = sunnyCats;
    } else if (temp > 90) {
        catArray = hotCats;
    }
    catImg.src = catArray[0];
    // catMood.append(catImg);
    cycleCatPics();
}

// function to fetch description, data.description in renderCityData
// String.split(' ');
// Array.find();

function convCtoF(celsius) {
    const fahrenheit = celsius * (9 / 5) + 32;
    return fahrenheit;
}

function convKmhtoMph(kmh) {
    const mph = kmh * 0.6213712;
    return mph;
}

// Event Listeners
cityForm.addEventListener('submit', addCity);
commentsForm.addEventListener('submit', renderComments);

// Event Handlers
function cycleCatPics() {
    let i = 0
    catImg.addEventListener('dblclick', e => {
        if(i < 2) {
            i += 1;
        } else {
            i = 0;
        }
        catImg.src = catArray[i];
    })
}

function addCity(e) {
    e.preventDefault();
    const newCity = document.createElement('li');
    newCity.textContent = e.target['search-city'].value;
    currentCityTitle.textContent = e.target['search-city'].value;
    let changeCity = e.target['search-city'].value;
    citySearch.append(newCity);
    cityForm.reset();

    currentCity.innerHTML = "";
    threeDayForecast.innerHTML = "";
    getOneCityData(baseUrl, changeCity).then(data => {
        renderCityData(data);
        renderForecast(data.forecast);
    })

    newCity.addEventListener('click', newFunction)
}

function newFunction(e) {
    // console.log('newFunction invoked');
    // debugger
    changeCity = e.target.textContent;
    currentCityTitle.textContent = e.target.textContent;
    currentCity.innerHTML = "";
    threeDayForecast.innerHTML = "";
    getOneCityData(baseUrl, changeCity).then(data => {
        renderCityData(data);
        renderForecast(data.forecast);
    })
}

function renderComments (e) {
    e.preventDefault();
    const li = document.createElement('li');
    let comment = e.target['new-comment'].value
    let name = e.target['new-name'].value 
    li.textContent = `${name} said \"${comment}\"`
    commentContainer.appendChild(li)
    commentForm.reset()
}

// Initializers
function gettingWeather () {
    fetch(baseUrl).then((response) => {
            getWeather(response)
        }
    )}
function getWeather (response) {
        if (response.ok === true) {
            getOneCityData(baseUrl, 'New York').then(data => {
            renderCityData(data);
            renderForecast(data.forecast)});
        } else if (response.ok === false) {
            getOneCityData(testUrl, '').then(data => {
                renderCityData(data);
                renderForecast(data.forecast);
            });
        }
    }
gettingWeather()