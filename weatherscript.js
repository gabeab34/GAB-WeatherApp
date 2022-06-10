// global variables
var api = "d4c9adabf7b5976ac4b9218b7c3b9b66";
var city = "";
var currentcity         = $("#current-city");
var currenttemperature  = $("#temperature");
var currenthumidity     = $("#humidity");
var currentwindspeed    = $("#wind-speed");
var currentUVindex      = $("#uv-index");
var searchcity          = $("#search-city");
var displaystoredcities = document.querySelector(".stored-cities");
// function that determines the city to be searched by what the user inputs in the search bar
const displayweather = (event) => {
    event.preventDefault();
    if(searchcity.val().trim()!==""){
        city=searchcity.val().trim();
        currentweather(city);
    }
}
// makes the api call using the city the user inputted
const currentweather = (city) => {
    var apiquery= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + api + "&units=imperial"; 
// ajax function that uses "get" to retrieve data from api, then stores that data in "response"
    $.ajax({
        url:apiquery,
        method:"get",
    }).then((response) => {       
// writes the name of the searched city, the current day, the current date and an icon representing the weather conditions to the main container      
        var today=moment(response)
        var icon = response.weather[0].icon
        var iconsrc =  "https://openweathermap.org/img/w/"+ icon +".png";
        $(currentcity).html(response.name + "<img src=" +iconsrc+">" + "<br></br>"  + ""+today.format("dddd, MMMM Do") + "<br></br>" );
// sets the user inputted city to local storage in an array, creates a button with that city's name so it can be searched again by click, then clears local storage if something is in it            
if (localStorage.getItem('cities') == null) {
    localStorage.setItem('cities', '[]')
}
var storedcities = JSON.parse(localStorage.getItem('cities'));
storedcities.push(city);
localStorage.setItem('cities', JSON.stringify(storedcities));                
if(storedcities!=null){
    for(var x =0; x < storedcities.length; x++){
// creates button for previously searched cities, clears local storage to prevent making more buttons than intended  
    displaystoredcities.innerHTML += `<button class= city-button id= city-button href="#" value = "${storedcities[x]}" onclick = "returnweather(this.value)">` + storedcities[x].toUpperCase() +`</button>`;
       if (localStorage.length > 0) {
           localStorage.clear();
       }
  }
}           
// writes the temperature in fahrenheit, the humidity, the windspeed. Then calls for the UVIndex function to run using the latitude and longitude values from the user inputted city
        var temperature = (response.main.temp)
        $(currenttemperature).html(temperature);
        $(currenthumidity).html(response.main.humidity);
        var ws = response.wind.speed;
        var wind=(ws)
        $(currentwindspeed).html(wind);
        UVIndex(response.coord.lon,response.coord.lat);
    });
}
// function that uses the latitude and longitude values from the user inputted city to make another api call to determine the current uv index    
const UVIndex = (ln,lt) => {
    var UVquery="https://api.openweathermap.org/data/2.5/uvi?appid="+ api +"&lat="+lt+"&lon="+ln;
    $.ajax({
        url:UVquery,
        method:"get"
        }).then((response) => {
            $(currentUVindex).html(response.value);
// puts a colored box around the displayed uv index based on that value. Green for favorable conditions, yellow for moderate, red for severe.
                if ((response.value) <= 2 ) {
                document.getElementById("uv-index").style.background = "#00FF00"
                }
                 else if ((response.value) <= 7 ) {
                    document.getElementById("uv-index").style.background = "#FFFF00"
                    }
                 else if ((response.value) > 7  ) {
                    document.getElementById("uv-index").style.background = "#FF0000"
                }
// calls the fiveday function to display the forecast using the lat and lon values collected here
            fiveday(response.id)            
});
// function that displays the five day forecast using the lat and lon values from the previous api call    
    const fiveday = () => {
            var fivedayquery="https://api.openweathermap.org/data/2.5/forecast?lat="+lt+"&lon="+ln+"&appid="+api + "&units=imperial";
            $.ajax({
                url:fivedayquery,
                method:"get"
            }).then((response) => {
//  writes the future dates, an icon that represents the weather conditions, the temperature, the humidity and windspeed to each of the 5 day forcast containers               
                for (i=0;i<5;i++){
                    var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
                    var iconcode= response.list[((i+1)*8)-1].weather[0].icon;
                    var iconurl="https://openweathermap.org/img/w/"+iconcode+".png";
                    var temperature= (response.list[((i+1)*8)-1].main.temp);
                    var humidity= response.list[((i+1)*8)-1].main.humidity;
                    var wind =  response.list[((i+1)*8)-1].wind.speed
                    $("#fiveday"+i).html(date);
                    $("#fiveday"+i).append("<img src="+iconurl+">");
                    $("#fiveday"+i).append(temperature+ "°F");
                    $("#fiveday"+i).append( "<br></br>" + "humidity: " + humidity+"%");
                    $("#fiveday"+i).append( "<br></br>" + "wind speed: "+ wind+ " mph");
                }
                
            });
        }    
}
// simple function that uses the name of the clicked city button to call the currentweather function again using that value
const returnweather = (value) => {
    var searchedcity = value;
    currentweather(searchedcity)
}
//enables click functionality on the search button and calls the displayweather function
$("#search-button").on("click",displayweather);