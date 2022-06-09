
var api = "d4c9adabf7b5976ac4b9218b7c3b9b66";
var city = "";
var currentcity         = $("#current-city");
var currenttemperature  = $("#temperature");
var currenthumidity     = $("#humidity");
var currentwindspeed    = $("#wind-speed");
var currentUVindex      = $("#uv-index");
var searchcity          = $("#search-city");
var displaystoredcities = document.querySelector(".stored-cities");

const displayweather = (event) => {
    event.preventDefault();
    if(searchcity.val().trim()!==""){
        city=searchcity.val().trim();
        currentweather(city);
    }
}



const currentweather = (city) => {
    var apiquery= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + api + "&units=imperial"; 

    $.ajax({
        url:apiquery,
        method:"get",
    }).then((response) => {

        
        
        var today=moment(response)
        
        var icon = response.weather[0].icon

        var iconsrc =  "https://openweathermap.org/img/w/"+ icon +".png";

        $(currentcity).html(response.name + "<img src=" +iconsrc+">" + "<br></br>"  + ""+today.format("dddd, MMMM Do") + "<br></br>" );
            
if (localStorage.getItem('cities') == null) {
    localStorage.setItem('cities', '[]')
 }
  
var storedcities = JSON.parse(localStorage.getItem('cities'));
storedcities.push(city);
localStorage.setItem('cities', JSON.stringify(storedcities));                
if(storedcities!=null){
    for(var x =0; x < storedcities.length; x++){
  
    displaystoredcities.innerHTML += `<button class= city-button id= city-button href="#" value = "${storedcities[x]}" onclick = "returnweather(this.value)">` + storedcities[x].toUpperCase() +`</button>`;
       if (localStorage.length > 0) {
           localStorage.clear();
       }
  
  }
  }           


                              
                    
                    
        
        
            
                    
        // .current.weather[0].icon https://openweathermap.org/img/wn/${icon}@2x.png"
        // .daily[0].weather[0].icon
        // https://openweathermap.org/weather-conditions


       
        var temperature = (response.main.temp)
        
        $(currenttemperature).html(temperature);
        
        $(currenthumidity).html(response.main.humidity);
        
        var ws = response.wind.speed;
        
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
            fiveday(response.id)
            
        });
        


    const fiveday = () => {
            var fivedayquery="https://api.openweathermap.org/data/2.5/forecast?lat="+lt+"&lon="+ln+"&appid="+api + "&units=imperial";
            $.ajax({
                url:fivedayquery,
                method:"get"
            }).then((response) => {
                
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

const returnweather = (value) => {

    var searchedcity = value;
    currentweather(searchedcity)
    

    

}


$("#search-button").on("click",displayweather);


