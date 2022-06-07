
var api = "d4c9adabf7b5976ac4b9218b7c3b9b66";
var city = "";
var currentcity         = $("#current-city");
var currenttemperature  = $("#temperature");
var currenthumidity     = $("#humidity");
var currentwindspeed    = $("#wind-speed");
var currentUVindex      = $("#uv-index");
var searchcity          = $("#search-city");



const displayweather = (event) => {
    event.preventDefault();
    if(searchcity.val().trim()!==""){
        city=searchcity.val().trim();
        currentweather(city);
    }
}

const currentweather = (city) => {
    var apiquery= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + api + "&units=imperial"
    ; 

    $.ajax({
        url:apiquery,
        method:"get",
    }).then((response) => {

        
        console.log(response);
        
        var today=moment(response)
       
        $(currentcity).html(response.name +"("+today.format("dddd, MMMM Do")+")");

        // .current.weather[0].icon https://openweathermap.org/img/wn/${icon}@2x.png"
        // .daily[0].weather[0].icon
        // https://openweathermap.org/weather-conditions


       
        var temperature = (response.main.temp)
        
        $(currenttemperature).html(temperature);
        
        $(currenthumidity).html(response.main.humidity);
        
        var ws=response.wind.speed;
        
        var wind=(ws)
        
        $(currentwindspeed).html(wind);
        
        UVIndex(response.coord.lon,response.coord.lat);
        

    });
}
    
const UVIndex = (ln,lt) => {
    var UVquery="https://api.openweathermap.org/data/2.5/uvi?appid="+ api +"&lat="+lt+"&lon="+ln;
    $.ajax({
        url:UVquery,
        method:"get"
        }).then((response) => {
            $(currentUVindex).html(response.value);
        });
}
    





$("#search-button").on("click",displayweather);
