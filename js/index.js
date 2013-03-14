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
        //document.addEventListener("online", onOnline, false);
        //document.addEventListener("offline", onOffline, false);
        //document.addEventListener("startcallbutton", onStartCallKeyDown, false);
        //document.addEventListener("endcallbutton", onEndCallKeyDown, false);
        //db.transaction(populateDB, errorCB, successCB);
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
    
};

//        var db = window.openDatabase("Dummy_DB", "1.0", "Just a Dummy DB", 200000);

	function getLocation()
	{
		var element = document.getElementById('geolocation');
		element.innerHTML = 'Finding Location...'
		navigator.geolocation.getCurrentPosition(onSuccess, onError,{enableHighAccuracy:true});
	}
	
	function onSuccess(position)
	{
		var element = document.getElementById('geolocation');
		element.innerHTML = 'Latitude: '           + position.coords.latitude              + '<br />' +
	    		            'Longitude: '          + position.coords.longitude             + '<br />' +
	            		    'Altitude: '           + position.coords.altitude              + '<br />' +
	                		'Accuracy: '           + position.coords.accuracy              + '<br />' +
	    		            'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
	                		'Heading: '            + position.coords.heading               + '<br />' +
	                		'Speed: '              + position.coords.speed                 + '<br />' +
	                		'Timestamp: '          + position.timestamp          		   + '<br />';
	}
	
	// onError Callback receives a PositionError object
	//
	function onError(error) {
	    alert('code: '    + error.code    + '\n' +
	          'message: ' + error.message + '\n');
	}
	
	
	function onStartCallKeyDown() 
	{
		alert("Call Button" ); 
	}
	
	function onEndCallKeyDown() 
	{
		alert("End Call Button" ); 
	}
	
	function onOnline() 
	{
		alert("Internet Available" );
	}
	
	function onOffline() 
	{
		alert("Internet Not Available");
	}
	
	function onBatteryLow(info) 
	{
		alert("Battery Level Low " + info.level + "%"); 
	}
	
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
			
			
	function populateDB(tx) {
		//tx.executeSql('CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT NOT NULL, Project TEXT NOT NULL)');
	}
	
    // Transaction success callback
    //
    function successCB() {
        //db.transaction(queryDB,errorCB);
    }
    
    	function queryDB(tx) {
        //tx.executeSql('SELECT * FROM SoccerPlayer',[],querySuccess,errorCB);      
    }
    
        function querySuccess(tx, results) { 
    	var element = document.getElementById('Users');
    	alert(element);
    	var innerString = '';
    	for (var i=0;i<results.rows.length;i++)
		{
			var row = results.rows.item(i);
			innerString = innerString + '<li><a href="#"><h3 class="ui-li-heading">'+row['Name']+'</h3><p class="ui-li-desc">Club '+row['Club']+'</p></a></li>';
		}
		element.innerHTML = innerString;
	}
    
    // Transaction error callback
    //
    function errorCB(tx, err) {
        alert("Error processing SQL: "+err);
    }
    
    function addNewRecord(form) {
    	alert(form);
    	db.transaction(addRecordDB(form),errorCB);

    }
    
    function addRecordDB(form) {
		//tx.executeSql('INSERT INTO Users(Name,Project) VALUES ('+form.name+','+form.project+')');
		//tx.executeSql('SELECT * FROM Users',[],querySuccess,errorCB);  
    }
