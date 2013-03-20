/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
var pictureSource;   // picture source
var destinationType;
function checkConnection() 
{
    var networkState = navigator.network.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';

    alert('Connection type: ' + states[networkState]);
}

function getLocation()
{
	//var element = document.getElementById('geolocation');
	//element.innerHTML = 'Finding Location...'
	$.mobile.changePage("geoLocation.html");
	navigator.geolocation.getCurrentPosition(onSuccess, onError,{enableHighAccuracy:true});
}

function onSuccess(position)
{
	//var element = document.getElementById('geolocation');
	
	//element.innerHTML
	var alertMessage = 'Latitude: '           + position.coords.latitude              + '\n' +
    'Longitude: '          + position.coords.longitude             + '\n' +
    'Altitude: '           + position.coords.altitude              + '\n' +
	'Accuracy: '           + position.coords.accuracy              + '\n' +
    'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '\n' +
	'Heading: '            + position.coords.heading               + '\n' +
	'Speed: '              + position.coords.speed                 + '\n' +
	'Timestamp: '          + position.timestamp          		   + '\n';

	var mapCanvas = $("#map-canvas");
	var locationHeader = $("#headerLocation");
		var windowH = $(window).height();
		var windowW = $(window).width();
		mapCanvas.css({
		 height : windowH - locationHeader.height(),
		})
		//var mapType = new google.maps.ImageMapType({
        //        tileSize: new google.maps.Size(256,256),
        //        getTileUrl: function(coord,zoom) {
        //            return 'img/tiles/'+zoom+'/'+coord.x+'/'+coord.y+'.png';
        //        }
        //    });
		var geocoder = new google.maps.Geocoder();
		var address = '';
    			var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    		    geocoder.geocode({'latLng': latlng}, function(results, status) {
    		      if (status == google.maps.GeocoderStatus.OK) {
    		        if (results[1]) {
    		          address = results[1].formatted_address
    		        }
    		      } else {
    		        alert("Geocoder failed due to: " + status);
    		      }
    		    });
    	var infoWindow = new google.maps.InfoWindow();
    	var mapOptions = {
    	          center: latlng,
    	          zoom: 11,
    	          mapTypeId: google.maps.MapTypeId.ROADMAP
    	        };
    	var map = new google.maps.Map(document.getElementById("map-canvas"),
    	            mapOptions);
    	var marker = new google.maps.Marker({
    	        	position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
    	        	map: map,
    	        	animation: google.maps.Animation.DROP
    	      		});
    	//map.overlayMapTypes.insertAt(0, mapType);
    	//google.maps.addListenerOnce(map, 'idle', function() { document.getElementById("map_canvas").style.visibility = "visible";});
    	      	google.maps.event.addListener(marker, 'click', (function(marker) {
    	        return function() {
    	        	 if (marker.getAnimation() != null) {
    	        		    marker.setAnimation(null);
    	        		  } else {
    	        		    marker.setAnimation(google.maps.Animation.BOUNCE);
    	        		  }
    	          infoWindow.setContent(address);
    	          infoWindow.open(map, marker);
    	        }
    	      })(marker)); 
}

// onError Callback receives a PositionError object
//
function onError(error) {
	$.mobile.changePage("index.html");
    alert('Unable to retrieve Location \n Error Code: '    + error.code    + '\n' +
          'Message: ' + error.message + '\n');
}

function capturePhoto()
{      
	$.mobile.changePage("CapturedImage.html");
	pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
	// Take picture using device camera and retrieve image as base64-encoded string
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, 
	{ 
		quality: 50,
		destinationType: Camera.DestinationType.FILE_URI,
    });
	
}

function getPhoto(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: source });
  }

function onPhotoDataSuccess(imageURI)
{     
	//alert(imageURI);
	var element = document.getElementById('capturedImage');
	
	element.src = imageURI
}

function onFail(message)
{      
	$.mobile.changePage("index.html");
	alert('Failed because: ' + message);  
	
}

function onPhotoURISuccess(imageURI) {
    // Uncomment to view the image file URI 
    // console.log(imageURI);

    // Get image handle
    //
    var largeImage = document.getElementById('capturedImage');

    // Unhide image elements
    //
    largeImage.style.display = 'block';

    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    largeImage.src = imageURI;
  }
