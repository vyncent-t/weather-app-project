// api key
const weatherAPIKey = "de2fecd7d3126aceecf5a1045323ae35";
let currentDate = moment().format("M/D/YYYY");

let currentCityTime = $("#currentcitytime");
let currentCityName = $("#currentcityname");
let currentCityTemp = $("#currentcitytemp");
let currentCityHumid = $("#currentcityhumid");
let currentCityWind = $("#currentcitywind");
let currentCityUltra = $("#currentcityultra");

let previouscities = $("#previouscity");

let cardBody = document.querySelectorAll(".card-body");
let cardTemp = document.querySelectorAll(".cardtemp");
let cardMid = document.querySelectorAll(".cardmid");
let cardWeek = document.querySelectorAll(".cardweek");

let userInputCity = $("#usersearch");
let citybutton = $("#citybutton");
citybutton.on("click", citySearch);
previouscities.on("click", "button", oldCityData);
function restoreHistory() {
	let cities = Object.keys(localStorage);
	cities.forEach((city) => {
		let data = JSON.parse(localStorage.getItem(city));
		oldCityButton(data, city);
	});
}

restoreHistory();

function getCityInformation(locationdata) {
	// using this api to return the data for the main card
	let nextRequestURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${locationdata.citylat}&lon=${locationdata.citylon}&units=imperial&appid=${weatherAPIKey}`;

	fetch(nextRequestURL)
		.then((citydata) => {
			return citydata.json();
		})
		.then((citydata) => {
			console.log(citydata);
			// logic to add name next to date
			console.log(`data retrieved for ${locationdata.cityLocationname}`);
			currentCityName.text(locationdata.cityLocationname);
			currentCityTime.text(currentDate);
			console.log(`${locationdata.cityLocationname} current temp: ${citydata.current.temp}`);
			currentCityTemp.text(`${Math.floor(citydata.current.temp)} F`);
			console.log(`${locationdata.cityLocationname} current humid: ${citydata.current.humidity}`);
			currentCityHumid.text(`${citydata.current.humidity} %`);
			console.log(
				`${locationdata.cityLocationname} current wind_speed: ${citydata.current.wind_speed}`
			);
			currentCityWind.text(`${citydata.current.wind_speed} MPH`);
			console.log(`${locationdata.cityLocationname} current ultra violet: ${citydata.current.uvi}`);
			currentCityUltra.text(citydata.current.uvi);

			// logic to add data to cards
			for (let i = 0; i < cardBody.length; i++) {
				console.log(cardBody[i]);
				cardTemp[i].innerText = `Temp: ${Math.floor(citydata.daily[i].temp.day)} F`;
				cardMid[i].innerText = `Humidity: ${Math.floor(citydata.daily[i].humidity)} %`;
				cardWeek[i].innerText = `${moment()
					.add(i + 1, "days")
					.format("M/D/YYYY")}`;
			}
		});


if (!currentCityUltra.text()) {
console.log('ye')
}
else if (currentCityUltra.text() <= 2) {
	currentCityUltra.addClass('bg-success p-2 rounded')
} else if (currentCityUltra.text() >= 8) {
	currentCityUltra.addClass('bg-danger p-2 rounded')
} else if (currentCityUltra.text() >= 2 && currentCityUltra.text() <= 8) {currentCityUltra.addClass('bg-light p-2 rounded')}
console.log(currentCityUltra.text())
}
// user search function
function citySearch(event) {
	// using this api to return the name and location
	let userCityName = userInputCity.val();

	let requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${userCityName}&appid=${weatherAPIKey}`;
	console.log(requestURL);

	fetch(requestURL)
		.then((response) => {
			return response.json();
		})
		.then((cityObj) => {
			let cityLocation = {
				cityLocationname: cityObj.name,
				citylat: cityObj.coord.lat,
				citylon: cityObj.coord.lon,
			};
			console.log(cityObj);
			console.log(cityLocation);
			console.log(`user search: ${userCityName}`);
			console.log(`${userCityName} lat: ${cityObj.coord.lat}`);
			console.log(`${userCityName} lon: ${cityObj.coord.lon}`);
			oldCityButton(cityLocation, userCityName);
			localStorage.setItem(userCityName, JSON.stringify(cityLocation));
			return cityLocation;
		})
		.then(getCityInformation)
		.catch((error) => {
			console.log(`${error} error in retrieval`);
		});
}

// I am trying to make it so that when I press search, it clears the search bar, adds the city to the list as a button, when I click the button, the value is pulled from local storage and runs the function with the city name, no repeating city names

function oldCityData(event) {
	let pastcity = $(event.target).data().city;
	console.log(`DATAPULL`);
	console.log(pastcity);
	getCityInformation(pastcity);
	// citySearch(pastcity);
}

function oldCityButton(cityLocation, name) {
	let cityButton = $("<button>");
	cityButton.addClass("btn btn-outline-dark backCity");
	cityButton.data("city", cityLocation);
	cityButton.text(name);
	cityButton.appendTo(previouscities);
}
