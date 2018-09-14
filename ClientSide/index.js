import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay.js';
import Point from 'ol/geom/Point.js';
import {transform} from 'ol/proj.js';
import Projection from 'ol/Coordinate.js';
//import cloud from 'ol/Popup/FramedCloud.js';
//import {fromLonLat} from 'ol/proj'
import {fromLonLat, toLonLat} from 'ol/proj.js'; //location için ekledim

//Creating Map
window.map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    projection: 'EPSG:4326',
    minZoom: 6,
    maxZoom: 8,
    center: [35.866287,37.925533],
    extent: [20.034447643954827, 31.026513073642256, 50.04909608145483, 45.462548229892256],
    zoom: 7
  })
});

  var cityCount;
  $(document).ready(function(){ 
    map.getView().fit([20.034447643954827, 31.026513073642256, 50.04909608145483, 45.462548229892256], map.getSize());

    getCities();


  });

  //Returns the number of the cities in the collection
  function getCityCount(callback)
  {
    var xhttp = new XMLHttpRequest(); 
    
    xhttp.addEventListener('load', callback);
    xhttp.addEventListener('error', () => console.log("Request failed"));
    
    xhttp.open("GET", "http://localhost:3000/map/citiesNumber", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
  }  getCityCount( function() {
    //console.log(this.responseText);
    cityCount = parseInt(this.responseText);
    
  });

  //Returns the names and locations of the cities from the server, then calls the function reuqesting the temparature from a webservice
  function getCities(callback) {
 
    var xhttp = new XMLHttpRequest(); 
    
    xhttp.addEventListener('load', callback);
    xhttp.addEventListener('error', () => console.log("Request failed"));
    
    xhttp.open("GET", "http://localhost:3000/map/cities", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
  }
  getCities( function() {
    //console.log(this.responseText);
    var text = JSON.parse(this.responseText);

   // console.log("floattt" +parseFloat(text[0].longitude));
    var i;
    for(i = 0; i < cityCount; i++)
    {
   
      getTemperature(text[i].name,parseFloat(text[i].latitude),parseFloat(text[i].longitude));
    }
  });

//Gets temperatures of the cities
function getTemperature(cityName, la, lo)
{

  $.ajax({
   //The request below gets the weather conditions considering the locations of the cities
   url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + parseInt(la) +'&lon='+parseInt(lo)+'&units=metric'+ '&APPID=e528fd2aa75bf2209fd9cb4fb5240172',

   //The request below gets the weather conditions considerint the name of the city and the country codr
   //I do not use it, since OpenW. does not includes the names of some cities in their database
   // url: 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName +',tr'+'&units=metric'+'&APPID=e528fd2aa75bf2209fd9cb4fb5240172',

    type: "GET",
    dataType:"jsonp",
    success: function (data) {
      console.log(data);
      //console.log(data.weather["0"].description);
      showPopup(cityName, la,lo, parseInt(data.main.temp, 10), data.weather["0"].description);
    }
    });
 
}

//Shows the temperatures at the map
function showPopup(cityName, lon, lat, temp, description )
{
      var newElement = document.createElement('div');
      newElement.id = cityName;
      newElement.className = "cities";
      document.body.appendChild(newElement); ///aşagı mı yukarı mı ?
    //  console.log('city ' + cityName + ' lon ' + lon + ' lat ' + lat + ' temp' + temp);
      
      var element2 = document.getElementById(cityName); 

      var popup2 = new Overlay({
        element: element2,
        position: fromLonLat([lon,lat],'EPSG:4326'), //bunu ekledim location için
        positioning: 'top-top',
        stopEvent: true,
        // offset: [0, -50]
      });
      map.addOverlay(popup2);
      

      var length  = cityName.length;
      //console.log("uzunlukk " + length);
      
      if(length > 10)
      {
        element2.style.width = "160px";
      }
      else if(length>8 && length<=10)
      {
        element2.style.width = "130px";
      }
      else if(length >=6 && length <= 8)
      {
        element2.style.width = "110px";
      } 
      else if(length >4 && length <6)
      {
        element2.style.width = "90px";
      } 
      else
      {
         element2.style.width = "75px";
      }
      
      //element2.style.width = "110px";
      element2.style.height = "7px";
      
      
      element2.style.visibility = "visible";
      element2.innerHTML =   cityName + ' ' +checkWeatherDescription(description) +  temp;
      element2.style.color = "white";
      element2.style.font = "italic bold 13px arial,serif";


    /* 
      $(element2).popover({
       'placement': 'center',
        'html': true,
        'content':  cityName + ' ' + temp,

      });
    
      $(element2).popover('show');
      */
    

      //element.style.width = (x.lenght*2).toString+'px';

}

//It checks the weather condition then returns an emoji accordingly
function checkWeatherDescription(wDescription)
{
    if(wDescription == "clear sky")
        return "☀️";
    else if(wDescription == "few clouds")
        return "⛅";
    else if(wDescription == "scattered clouds")
        return "☁️";
    else if(wDescription == "broken clouds")
        return "☁️";
    else if(wDescription == "shower rain")
        return "🌨️";
    else if(wDescription == "rain")
        return "🌨️";
    else if(wDescription == "thunderstorm")
         return "🌩️";
    else if(wDescription == "snow")
         return "☃️";
    else
      return "☀️"; /////??????????? One of the emojies is missing
      
}

////////////////////////////////////////////////////////////
//Çalışan pop-up
/*
var element = document.getElementById('popup');

var popup = new Overlay({
  element: element,
  position: fromLonLat([ 32.866287,39.925533],'EPSG:4326'), //bunu ekledim location için
  positioning: 'center-center',
  stopEvent: false,
 // offset: [0, -50]
});
map.addOverlay(popup);

//element.style.height = "60px;"
//popup.style.height = "45px";

//popup.innerHTML = "Hello World";
//popup.setPosition( transform([10.286398, 10.157639,11], 'EPSG:4326', 'EPSG:3857'));

var x = 'Ankara 33';
$(element).popover({
  'placement': 'top',
  'html': true,
  'content': x
});
$(element).popover('show');

//element.style.width = (x.lenght*2).toString+'px';
*/


////////////////////////////////////////////////
/*
//Çalışan Hava durumu alma
$(document).ready(function(){
  
  $.ajax({
  url: 'http://api.openweathermap.org/data/2.5/weather?q=canakkale,tr'+'&units=metric'+'&APPID=e528fd2aa75bf2209fd9cb4fb5240172',
  type: "GET",
  dataType:"jsonp",
  success: function (data) {
    console.log(data.main.temp);
  }
  
  });
});
*/
////////////