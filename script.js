
//get serach word
$("#searchButtonGo").on("click", function (event) {
    let city = $("#searchCityInput").val();
    console.log(city);
    // This is our API key. Add your own API key between the ""
    let APIKey = "&appid=82114df2c2bee6b435a6e4366b8f4bdc";
    let NumOfDays = "&cnt=5";

    let baseURL = "https://api.openweathermap.org/data/2.5/weather?q=";//Current Weather Call
    // let baseURL = "https://api.openweathermap.org/data/2.5/forecast?q=";
    // let baseURL = "https://api.openweathermap.org/data/2.5/forecast/daily?id=";

    // Here we are building the URL we need to query the database
    let searchURL = baseURL + city + NumOfDays + APIKey;
    console.log(searchURL);
    SearchWeather(searchURL, city);
});


// We then created an AJAX call

function SearchWeather(queryURL, city) {
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        //https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
        let tempLat = response.coord.lat;
        console.log(tempLat);
        let tempLon = response.coord.lon;
        console.log(tempLon);
        let APIKey = "&appid=82114df2c2bee6b435a6e4366b8f4bdc";
        let CbaseURL = "https://api.openweathermap.org/data/2.5/onecall?lat=";
        let Clon = "&lon=";
        let exclude = "&exclude=minutely,hourly,alert";
        let units = "&units=imperial"
        let CsearchURL = CbaseURL + tempLat + Clon + tempLon+ units+ exclude + APIKey;
        console.log("latLong search " + CsearchURL);

        $.ajax({
            url: CsearchURL,
            method: "GET"

        }).then(function (Cresponse) {
            console.log(Cresponse);
            //render 0 current day data function call 
            $("#today").html("");
            console.log("city "+ city);
            let TodayUnixTime = Cresponse.daily[0].dt;
            let TodaysDate = new Date(TodayUnixTime*1000);
            let cityDate = $("<h3>").addClass("city-date").text(city+" "+ TodaysDate.toLocaleDateString("en-US"));
            let temp =$("<p>").text("Temperature High/Low : "+Cresponse.daily[0].temp.max+"°F / "+Cresponse.daily[0].temp.min+"°F");
            let humidity=$("<p>").text("Humidity: "+Cresponse.daily[0].humidity+"%");
            let windspeed=$("<p>").text("Wind Speed: "+Cresponse.daily[0].wind_speed+"MPH");
            let CUVI=$("<p>").addClass("UV-Index").text(Cresponse.daily[0].uvi);
            $("#today").append(cityDate, temp, humidity, windspeed, CUVI, "<hr>");

            for (let i = 0; i < 8; i++) {
                //render 5 day forcast day by day.. forcast day render call 
                let tempTime = Cresponse.daily[i].dt;//unix time
                let tempDate = new Date(tempTime*1000);
                // let tempTime = Date(Cresponse.daily[i].dt);
                // let tempDate = tempTime.toString();
                console.log(tempDate.toLocaleDateString("en-US") + " UV index " +Cresponse.daily[i].uvi );
            };
            // let degreesC = response.main.temp - 273.15;
            // console.log(degreesC);
            // let degreesF = (response.main.temp - 273.15) * 1.80 + 32
            // console.log(degreesF);

            // $(".temp").html(degreesC.toFixed(2) + "°C / " + degreesF.toFixed(2) + "°F");


            // let windSPD = response.wind.speed.toFixed(2);
            // let windDir = response.wind.deg.toFixed(2);
            // $('.wind').html(windSPD + " Wind Speed / " + windDir + " Direction");

            // let humidity = response.main.humidity;
            // $('.humidity').html(humidity + " %");

        });
    });
};


