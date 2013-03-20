var dbShell;
init();
var flagBackIndex = false;
var pageLocation = "";
var siteId = 0;
function doLog(s){
  
    setTimeout(function(){
        console.log(s);
    }, 3000);
    
}

function dbErrorHandler(err){
    alert("DB Error: "+err.message + "\nCode="+err.code);
}

function phoneReady(){
    //alert("phoneReady");
    doLog("phoneReady");
    //First, open our db
    
    dbShell = window.openDatabase("SimpleNotes", 2, "SimpleNotes", 1000000);
 //   alert("db was opened");
    doLog("db was opened");
    //run transaction to create initial tables
    dbShell.transaction(setupTable,dbErrorHandler,getEntries);
  //  alert("table created");
    doLog("ran setup");
}

//I just create our initial table - all one of em
function setupTable(tx){
    doLog("before execute sql...");
 //   alert("before create table...");
    tx.executeSql("CREATE TABLE IF NOT EXISTS Tickets(id INTEGER PRIMARY KEY,title,body,updated,locationLatitude,locationLongitude)");
//    alert("before create table...");
    doLog("after execute sql...");
}   

//I handle getting entries from the db
function getEntries() {
	//alert("do entries");
    doLog("get entries");
    dbShell.transaction(function(tx) {
        tx.executeSql("select id, title, body, updated,locationLatitude,locationLongitude from Tickets order by updated desc",[],renderEntries,dbErrorHandler);
    }, dbErrorHandler);
}

    
function renderEntries(tx,results){
	//alert("render entries");
    doLog("render entries");
    if (results == null || results.rows == null || results.rows.length == 0) {
        $("#mainContent").html("<p style='padding-left: 10px; padding-top: 10px;'>You currently do not have any tickets.</p>");
    } else {
       var s = "";
       for(var i=0; i<results.rows.length; i++) {
         s += "<li style='border-radius: 0px !important'><a onclick='setSiteId("+ results.rows.item(i).id +")' id="+results.rows.item(i).id + " href='AddEditRecord.html?id="+results.rows.item(i).id + "'>" + results.rows.item(i).title + "</a></li>";   
       }
       $("#noteTitleList").html(s);
       $("#noteTitleList").listview("refresh");
    }
}

function saveNote(note, cb) {
    //Sometimes you may want to jot down something quickly....
    if(note.title == "") note.title = "[No Site]";
    dbShell.transaction(function(tx) {
        if(note.id == "") tx.executeSql("insert into Tickets(title,body,updated,locationLatitude,locationLongitude) values(?,?,?,?,?)",[note.title,note.body, new Date() , note.locationLatitude, note.locationLongitude]);
        else tx.executeSql("update Tickets set title=?, body=?, updated=?, locationLatitude=?, locationLongitude= ? where id=?",[note.title,note.body, new Date(),note.locationLatitude, note.locationLongitude,  note.id]);
    }, dbErrorHandler,cb);
}

function init(){
	//alert("Init called");
     phoneReady();
    
  //  openDB();
    $("#editPage").live("pageshow", function() {
    //	alert("Before submit");
    	$("#editFormSubmitButton").click(function() { 
    		if($("#noteTitle").val() != "") {
    	        var data = {title:$("#noteTitle").val(), 
    	                    body:$("#noteBody").val(),
    	                    id:$("#noteId").val(),
    	                    locationLatitude : $("#locationLatitude").val(),
    	                    locationLongitude : $("#locationLongitude").val()
    	                    
    	        };
    		        saveNote(data,function() {
    		            $.mobile.changePage("AddDisplay1.html",{ reverse:true,  changeHash: false});
    		        });
    	        e.preventDefault();
    		//	$("#editNoteForm").submit();  
    		}
            else
        	{
        	  alert("Site is required field.");
        	  $("#noteTitle").focus()
        	}
    	 });
    //	alert("After submit");
        //get the location - it is a hash - got to be a better way
        var loc = window.location.hash;
        if(loc.indexOf("?") >= 0 || siteId != 0) {
            var qs = loc.substr(loc.indexOf("?")+1,loc.length);
            var noteId = qs.split("=")[1];
            //load the values
           // alert(siteId);
            if(siteId != 0) 
            	{
            	  noteId = siteId;
            	}
            $("#location").attr("disabled","disabled"); 
       //     $('#location').disable('input');
            $("#editFormSubmitButton").attr("disabled","disabled"); 
            dbShell.transaction(
                function(tx) {
                    tx.executeSql("select id,title,body,locationLatitude,locationLongitude from Tickets where id=?",[noteId],function(tx,results) {
                       // alert(results.rows.item(0).id);
                    	$("#noteId").val(results.rows.item(0).id);
                        $("#noteTitle").val(results.rows.item(0).title);
                        $("#noteBody").val(results.rows.item(0).body);   
                        $("#locationLatitude").val(results.rows.item(0).locationLatitude);
                        $("#locationLongitude").val(results.rows.item(0).locationLongitude);
                        var location = document.getElementById("location");
                        $("#location").val("");
                      //  alert(results.rows.item(0).locationLatitude + results.rows.item(0).locationLongitude);
                        location.innerHTML = "";
                        if(!isNaN(results.rows.item(0).locationLatitude) || !isNaN(results.rows.item(0).locationLatitude)) {
                        	$("#location").val('Latitude: ' + results.rows.item(0).locationLatitude + "\n"+ 'Longitude: ' + results.rows.item(0).locationLongitude);
                        }
                        $("#editFormSubmitButton").removeAttr("disabled");   
                    });
                }, dbErrorHandler);
            
        }       
        else {
        	//alert("else");
         $("#editFormSubmitButton").removeAttr("disabled");   
        }
    });
      
    //will run after initial show - handles regetting the list
    $("#displayPage1").live("pageshow", function() {
    //	alert("Display page loaded");
/*		var loc = window.location.hash;
        if(loc.indexOf("?") >= 0) {
        	if( !flagBackIndex) {
            var qs = loc.substr(loc.indexOf("?")+1,loc.length);
            var backId = qs.split("=")[1];
        //    alert(backId);
            if(backId == "index") {
            	pageLocation = "index.html";	    	
            }
            else
            	{
            	pageLocation= "IconsTools.html";
            	}
        	}
        	flagBackIndex = true;
        }
        $("#backId").href = pageLocation ;*/
        getEntries(); 
    });
    $("#locationPage").live("pageshow", function() {
        //	alert("Display page loaded");
    	getLocation();
        });

    $("#signaturePage").live("pageshow", function() {
        //	alert("Display page loaded");
    	var signature = $("#signature");
    	var canvasContainer = $("#canvasContainer");
		var imageSignature = $("#imageSignature");
    	var signatureHeader = $("#signatureHeader");
    	var footerSignature = $("#footerSignature");
    		var windowH = $(window).height();
    		var windowW = $(window).width();
    		signature.css({
    		 height : windowH - signatureHeader.height() - footerSignature.height(),
    		})
    		canvasContainer.css({
    		 height : windowH - signatureHeader.height() - footerSignature.height(),
    		 width : signature.width(),
    		})
    		imageSignature.css({
    		 height : windowH - signatureHeader.height() - footerSignature.height(),
    		})    	    
        });
    
    //edit page logic needs to know to get old record (possible)
   //  getEntries();
    
}


function getAndDisplayLocation()
{
	navigator.geolocation.getCurrentPosition(onSuccessDisplay, onError,{enableHighAccuracy:true});
}

function onSuccessDisplay(position)
{
	//alert(position.coords.latitude + "   " + position.coords.latitude);
	var lat = document.getElementById("locationLatitude");
	var lon = document.getElementById("locationLongitude");
	var location = document.getElementById("location");
	//alert(location);
        lat.value = position.coords.latitude;
        lon.value = position.coords.longitude;
      //  alert(lat.value);
        location.innerHTML = 'Latitude: ' + position.coords.latitude.toFixed(8) + "\n" + 'Longitude: '+ position.coords.longitude.toFixed(8) ;       
}


function toFixed(value, precision) {
	value = parseInt(value); 
    var precision = precision || 0,
    neg = value < 0,
    power = Math.pow(10, precision),
    value = Math.round(value * power),
    integral = String((neg ? Math.ceil : Math.floor)(value / power)),
    fraction = String((neg ? -value : value) % power),
    padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');

    return precision ? integral + '.' +  padding + fraction : integral;
}

function setSiteId(valSiteId)
{
	siteId = valSiteId;
}