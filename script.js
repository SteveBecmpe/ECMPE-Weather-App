$(document).ready(function () {//START JS Script after document load and ready----START 
    let citySearchHistory = [];

    function LSAD() {//Load Saved Array Data
        let SavedArrayData = JSON.parse(localStorage.getItem("SavedWorkArray"));
        if ((SavedArrayData !== null)) {//if saved data is NOT emptly load into working array
            if (SavedArrayData.length !== 0) {
                citySearchHistory = SavedArrayData;
                let lastIndex = citySearchHistory.length - 1;
                let lastCity = citySearchHistory[lastIndex];
                console.log(citySearchHistory.length);
                console.log("lastCity " + lastCity);
                console.log(SavedArrayData);
                SearchWeather(lastCity);
                if (citySearchHistory.length > 0) {
                    $("#StartSearchHistory").html("");
                    for (let i = 0; i < citySearchHistory.length; i++) {
                        let CurrentSearchHistory = $(`
                     <ul class="btn block cap">${citySearchHistory[i]}</ul>
                     `);
                        $("#StartSearchHistory").append(CurrentSearchHistory);
                    }
                }
            }
        } else {
        }
    };
    LSAD();//Load Saved Array Data

    function SADL() {//Save Array Data Locally
        localStorage.setItem("SavedWorkArray", JSON.stringify(citySearchHistory));
    }

    let input = document.getElementById("searchCityInput");//press enter is the same as clicking artist button
    // Execute a function when the user releases a key on the keyboard
    input.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById("searchButtonGo").click();//click the artist button when enter is press while in the input box
        }
    });


    $("#searchButtonGo").on("click", function (event) {
        let city = $("#searchCityInput").val().trim();
        if (city != "") {
            city = city[0].toUpperCase() + city.substr(1);
            console.log(citySearchHistory.length);
            if (citySearchHistory.length === 0) {
                citySearchHistory.push(city);
                SADL();
                console.log(citySearchHistory.length);
                console.log(citySearchHistory);
            } else {
                for (let i = 0; i < citySearchHistory.length; i++) {
                    if (city === citySearchHistory[i]) {
                        console.log("break");
                        break;
                    } else if (i === (citySearchHistory.length - 1)) {
                        citySearchHistory.push(city);
                        console.log(citySearchHistory);
                        SADL();
                    }
                }
            }
            if (citySearchHistory.length > 0) {
                $("#StartSearchHistory").html("");
                for (let i = 0; i < citySearchHistory.length; i++) {
                    let CurrentSearchHistory = $(`
                     <ul class="btn block">${citySearchHistory[i]}</ul>
                     `);
                    $("#StartSearchHistory").append(CurrentSearchHistory);
                }
            }
            $("#searchCityInput").val("");
            SearchWeather(city);
        }
    });

    $("#StartSearchHistory").on("click", "ul", function () {
        SearchWeather($(this).text());
    });

    $("#ClearSearchHistory").on("click", function (event) {
        event.preventDefault();
        $("#StartSearchHistory").html("");
        citySearchHistory = [];
        SADL();
    });

    function SearchWeather(city) {
        let APIKey = "&appid=82114df2c2bee6b435a6e4366b8f4bdc";
        let wildCard = "%";
        let state = "michigan";
        let country = "us"
        let NumOfDays = "&cnt=5";
        // let baseURL = "https://api.openweathermap.org/data/2.5/weather?q=";//Current Weather Call CITY
        let baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";//Current Weather Call ZIP CODE
        let searchURL = baseURL + city + "," + country + NumOfDays + APIKey;
        $.ajax({
            url: searchURL,
            method: "GET"
        }).then(function (response) {
            console.log("first response");
            console.log(response);
            let tempLat = response.coord.lat;
            let tempLon = response.coord.lon;
            let APIKey = "&appid=82114df2c2bee6b435a6e4366b8f4bdc";
            let CbaseURL = "https://api.openweathermap.org/data/2.5/onecall?lat=";
            let Clon = "&lon=";
            let exclude = "&exclude=minutely,hourly,alert";
            let units = "&units=imperial"
            let CsearchURL = CbaseURL + tempLat + Clon + tempLon + units + exclude + APIKey;
            $.ajax({
                url: CsearchURL,
                method: "GET"
            }).then(function (Cresponse) {
                console.log(Cresponse);
                $("#today").html("");
                console.log("city " + city);
                let TodayUnixTime = Cresponse.daily[0].dt;
                let TodaysDate = new Date(TodayUnixTime * 1000);
                let tempDailyHTML = $(`
                <div class="col-lg-9" id="WeatherDisplay">
                    <h3 class="city-date cap">${city} ${TodaysDate.toLocaleDateString("en-US")} <img src="http://openweathermap.org/img/wn/${Cresponse.daily[0].weather[0].icon}@2x.png"></h3>
                    <p>Temp High/Low: ${Cresponse.daily[0].temp.max}°F / ${Cresponse.daily[0].temp.min}°F</p>
                    <p>Humidity: ${Cresponse.daily[0].humidity}%</p>
                    <p>Wind Speed: ${Cresponse.daily[0].wind_speed}MPH</p>
                    <p id="UV-Index">UV Index: <span id="uvic">${Cresponse.daily[0].uvi}</span></p>
                </div>
            `);
                $("#today").append(tempDailyHTML);
                let UVI = Cresponse.daily[0].uvi;
                $("#5day").html("").text("5-Day Forecast:");
                $("#5day").append('<div class="row forecast"></div>');//, "<hr>"

                for (let i = 1; i < 6; i++) {
                    let CTodayUnixTime = Cresponse.daily[i].dt;
                    let CTodaysDate = new Date(CTodayUnixTime * 1000);
                    let tempHTML = $(`
                    <div class="col-md-2 fday">${CTodaysDate.toLocaleDateString("en-US")} 
                        <img class="pfday" src="http://openweathermap.org/img/wn/${Cresponse.daily[i].weather[0].icon}@2x.png"></img>
                        <p class="pfday">Temp: ${Cresponse.daily[i].temp.max}°F</p>
                        <p class="pfday">Humidity: ${Cresponse.daily[i].humidity}%</p>
                    </div>
                    `);
                    $(".forecast").append(tempHTML);
                };

                if (UVI < 3) {
                    console.log("make UVI color green");
                    $("#uvic").addClass("uvGreen");
                } else if (UVI >= 3 && UVI <= 5) {
                    console.log("make UVI color yellow");
                    $("#uvic").addClass("uvYellow");
                } else if (UVI >= 6 && UVI <= 7) {
                    console.log("make UVI color orange");
                    $("#uvic").addClass("uvOrange");
                } else if (UVI >= 8 && UVI <= 10) {
                    console.log("make UVI color red");
                    $("#uvic").addClass("uvRed");
                } else if (UVI >= 11) {
                    console.log("make UVI color purple");
                    $("#uvic").addClass("uvPurple");
                }
            });
        });
    };

});//END JS Script after document load and ready