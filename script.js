
//get serach word
$("#searchButtonGo").on("click", function (event) {
    let city = $("#searchCityInput").val();
    console.log(city);
    SearchWeather(city);
});


// We then created an AJAX call

function SearchWeather(city) {
    // This is our API key. Add your own API key between the ""
    let APIKey = "&appid=82114df2c2bee6b435a6e4366b8f4bdc";
    let NumOfDays = "&cnt=5";

    let baseURL = "https://api.openweathermap.org/data/2.5/weather?q=";//Current Weather Call
    // let baseURL = "https://api.openweathermap.org/data/2.5/forecast?q=";
    // let baseURL = "https://api.openweathermap.org/data/2.5/forecast/daily?id=";

    // Here we are building the URL we need to query the database
    let searchURL = baseURL + city + NumOfDays + APIKey;

    $.ajax({
        url: searchURL,
        method: "GET"
    }).then(function (response) {

        //https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
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
            //render 0 current day data function call 
            $("#today").html("");
            console.log("city " + city);
            let TodayUnixTime = Cresponse.daily[0].dt;
            let TodaysDate = new Date(TodayUnixTime * 1000);

            let tempDailyHTML = $(`
                <div class="col-lg-9" id="WeatherDisplay">
                    <h3 class="city-date">${city} ${TodaysDate.toLocaleDateString("en-US")} <img src="http://openweathermap.org/img/wn/${Cresponse.daily[0].weather[0].icon}@2x.png"></h3>
                    <p>Temp High/Low: ${Cresponse.daily[0].temp.max}°F / ${Cresponse.daily[0].temp.min}°F</p>
                    <p>Humidity: ${Cresponse.daily[0].humidity}%</p>
                    <p>Wind Speed: ${Cresponse.daily[0].wind_speed}MPH</p>
                    <p id="UV-Index">UV Index: ${Cresponse.daily[0].uvi}</p>
                </div>
            `);
            $("#today").append(tempDailyHTML);
            let UVI = Cresponse.daily[0].uvi

            if(UVI < 3){
                console.log("make UVI color green");
            }else if(UVI>=3 && UVI<=5){
                console.log("make UVI color yellow");
            }else if(UVI >= 6 && UVI <=7){
                console.log("make UVI color orange");
            }else if(UVI >= 8 && UVI <= 10){
                console.log("make UVI color red");
            }else if(UVI >= 11){
                console.log("make UVI color purple");
            }

            // let cityDate = $("<h3>").addClass("city-date").text(city + " " + TodaysDate.toLocaleDateString("en-US"));
            // let temp = $("<p>").text("Temperature High/Low : " + Cresponse.daily[0].temp.max + "°F / " + Cresponse.daily[0].temp.min + "°F");
            // let humidity = $("<p>").text("Humidity: " + Cresponse.daily[0].humidity + "%");
            // let windspeed = $("<p>").text("Wind Speed: " + Cresponse.daily[0].wind_speed + "MPH");
            // let CUVI = $("<p>").addClass("UV-Index").text("UV Index: " + Cresponse.daily[0].uvi);
            // $("#today").append(cityDate, temp, humidity, windspeed, CUVI);//, "<hr>"

            // $("#5day").append('<div class="row forecast h5"></div>');//, "<hr>"
            // $(".forecast").html("");
            // $("#5day").empty();
            $("#5day").html("").text("5-Day Forecast:");
            $("#5day").append('<div class="row forecast h5"></div>');//, "<hr>"

            for (let i = 1; i < 6; i++) {
                //render 5 day forcast day by day.. forcast day render call 

                let CTodayUnixTime = Cresponse.daily[i].dt;
                let CTodaysDate = new Date(CTodayUnixTime * 1000);

                //"http://openweathermap.org/img/wn/" + fiveDayWeatherIcon + "@2x.png"

                // $(".forecast").append(' <div class="col-md-2 fday h6">' + CTodaysDate.toLocaleDateString("en-US") + '<p class="h6">icon</p><p>' + "Temp: " + Cresponse.daily[i].temp.max + "°F"+ '</p><p class="h6">' + Cresponse.daily[i].humidity + "%" + '</p></div>');//, "<hr>"
                let tempHTML = $(`
                    <div class="col-md-2 fday h6">${CTodaysDate.toLocaleDateString("en-US")} 
                        <img src="http://openweathermap.org/img/wn/${Cresponse.daily[i].weather[0].icon}@2x.png"></img>
                        <p>Temp: ${Cresponse.daily[i].temp.max}°F</p>
                        <p class="h6">${Cresponse.daily[i].humidity}%</p>
                    </div>
                    `);
                $(".forecast").append(tempHTML);

                // let CcityDate = $("<h5>").addClass("col-md-2 fday").text(CTodaysDate.toLocaleDateString("en-US"));
                // $("#5day").append(CcityDate);//, "<hr>"
                // let Ctemp = $("<p>").text("Temperature High/Low : " + Cresponse.daily[i].temp.max + "°F / " + Cresponse.daily[i].temp.min + "°F");
                // let Chumidity = $("<p>").text("Humidity: " + Cresponse.daily[i].humidity + "%");



                // let CTodayUnixTime = Cresponse.daily[i].dt;
                // let CTodaysDate = new Date(CTodayUnixTime * 1000);

                // let CcityDate = $("<h5>").addClass("col-md-2 fday").text(CTodaysDate.toLocaleDateString("en-US"));
                // $("#5day").append(CcityDate);//, "<hr>"
                // let Ctemp = $("<p>").text("Temperature High/Low : " + Cresponse.daily[i].temp.max + "°F / " + Cresponse.daily[i].temp.min + "°F");
                // let Chumidity = $("<p>").text("Humidity: " + Cresponse.daily[i].humidity + "%");

                // $(".fday").append(Ctemp, Chumidity);//, "<hr>"



            };


        });
    });
};


