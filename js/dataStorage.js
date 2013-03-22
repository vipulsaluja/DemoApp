var dbShell;
init();
var flagBackIndex = false;
var pageLocation = "";
var siteId = 0;
var timesClicked = 0;
var deleteSelectedFlag = false;
var deleteFlag = false;


//Logging is done.
function doLog(s){
    setTimeout(function(){
        console.log(s);
    }, 3000);    
}

function dbErrorHandler(err){
  //  alert("DB Error: "+err.message + "\nCode="+err.code);
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
        $("#mainContent").html("<p id='noRecords' style='text-align:center; width:100%; padding-top: 180px;'>You currently do not have any tickets.</p>");
      //  centerHorizontallyRecords('mainContent');
        $('#cancelDelete').hide();
        $('#deleteSelectedButton').hide();
    } else {
       var s = "";
       for(var i=0; i<results.rows.length; i++) {
         s += "<li style='border-radius: 0px !important;' onclick='recordLiClick(this);' class='listDisplayRecord'>" +
         		"<input onclick='recordCheckboxClick(this);' class='siteCheckbox' type='checkbox' id='chkSiteId_"+results.rows.item(i).id +"' style='display:none !important; padding-left: 5px; width: 30px;' />" +
         		"<a style='display:inline-block !important;' onclick='setSiteId("+ results.rows.item(i).id +")' id='"+results.rows.item(i).id + "'>" + results.rows.item(i).title + "</a></li>";   
       }
       $("#noteTitleList").html(s);
       $("#noteTitleList").listview("refresh");
       $('#deleteSelectedButton').show();
       $('#cancelDelete').hide();
    }
}

function recordClick(id) {
	setBackButtonText("Tickets");
	if(!deleteSelectedFlag)
		{
		$('#addEditTicketText').html("Edit Ticket");	
	    siteId = results.rows.item(i).id;
		deleteFlag = true;
		$.mobile.changePage("AddEditRecord.html?id="+results.rows.item(i).id);
	   
		}
	else
		{
		var element = $("#chkSiteId_"+id);
		if (element.checked == true)  {
			element.checked = false ;			
		  }
		else {
		     element.checked = true;
		}
	}
}

function recordLiClick(liObject) {
	setBackButtonText("Tickets");
	if(!deleteSelectedFlag)
	{
		$('#addEditTicketText').html("Edit Ticket");	
	    siteId = liObject.getElementsByTagName("a")[0].id;
		deleteFlag = true;
		$.mobile.changePage("AddEditRecord.html?id="+liObject.getElementsByTagName("a")[0].id);
	}
else
	{
	   var element = liObject.getElementsByClassName("siteCheckbox")[0];
	 if (element.checked == true)  {
			element.checked = false ;			
		  }
		else {
		     element.checked = true;
		}
	}
}

function recordCheckboxClick(chkObj)
{
	setBackButtonText("Tickets");
	 if (chkObj.checked == true)  {
		     chkObj.checked = false ;			
	}
		else {
			chkObj.checked = true;
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

//Delete single record

function deleteNote(siteId, cb) {
    //Sometimes you may want to jot down something quickly....
	//dblog(siteId);
    dbShell.transaction(function(tx) {
      tx.executeSql("delete from Tickets  where id=?",[siteId]);
    }, dbErrorHandler,cb);
}

//Delete Multiple Records
function deleteMultiple(ids, cb) {
    //Sometimes you may want to jot down something quickly....
	//dblog(siteId);
	var query = "delete from Tickets  where id in ("+ids+")";
    dbShell.transaction(function(tx) {
      tx.executeSql(query);
    }, dbErrorHandler,getEntries);
}

function init(){
	//alert("Init called");
     phoneReady();
    $("#editPage").live("pageshow", function() {
    	$("#noteTitle").focus();
    	 
       //When we save the records
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
    		    //Hide delete Button
    		        $('deleteButton').hide();
    	        e.preventDefault();
    		//	$("#editNoteForm").submit();  
    		}
            else
        	{
        	  alert("Site is required field.");
        	  $("#noteTitle").focus()
        	}
    	 });
    	
    	//Click on delete button on edit page.
    	$("#deleteButton").click(function() { 
    		if(siteId != "") {
    		        deleteNote(siteId,function() {
    		            $.mobile.changePage("AddDisplay1.html",{ reverse:true,  changeHash: false});
    		        });
    	        e.preventDefault();  
    		}
    	 });

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
     
    $("#editPage").live("pagebeforeshow", function() {
    	//toshow delete button or not.
   	 if(deleteFlag == true) {
   		// alert(deleteFlag);
   		 $("#deleteButton").show();
   		 $('#addEditTicketText').html("Edit Ticket");
   	 }
   	 else {
   		 $("#deleteButton").hide();
   		 $('#addEditTicketText').html("Add Ticket");
   	  }
    });
    
    //will run after initial show - handles regetting the list
    $("#displayPage1").live("pageshow", function() {
    	$("#addRecordId").click(function() { 
    		deleteFlag = false;
    		siteId = 0;
    		$('#cancelDelete').hide();
    	 });  	
    	$("#cancelDelete").click(function() { 
    		siteId = 0;
    		deleteSelectedFlag = false;
    		hideAllCheckboxes();
			ShowRightIcon();
    		$('#cancelDelete').hide();
    	 }); 
    	
    	
    	hideAllCheckboxes();
    	ShowRightIcon()
    	$("#deleteSelectedButton").click(function() { 
    		if(!deleteSelectedFlag) {
    			//User is shown checkbox to select the record
	    		deleteSelectedFlag = true;
	    		$('#cancelDelete').show();
		    		$('.siteCheckbox').each(function () {
		    			// doLog("Show");
		    			var element = document.getElementById(this.id);
		    			element.style.display = '';
		    			element.checked = false;
		     	  });
		    	HideRightIcon();
    		 }
    		else {
    			deleteSelectedFlag = false;
    			ShowRightIcon();
    			var idList="";
    			//Permanently delete the selected records  			 
    			 $(".siteCheckbox:checked").each(function() {
    				 idList = idList + this.id.substring(10, this.id.length) + "," ; 
    			  });
    			 if(idList != "") {
    				 idList = idList.substring(0, idList.length - 1);
    				 deleteMultiple(idList);
    				 $('#cancelDelete').hide();
    			 }
    			 else 
    				 {
    				      hideAllCheckboxes();
    				      $('#cancelDelete').hide();
    				 }
    		}
    	 });
    	   	 
        getEntries(); 
    });
    //edit page logic needs to know to get old record (possible)
   //  getEntries();
    $("#locationPage").live("pageshow", function() {
        //	alert("Display page loaded");
    	getLocationn();
        });

    $("#signaturePage").live("pageshow", function() {
        //	alert("Display page loaded");
    	var signature = $("#signature");
    	var canvasContainer = $("#canvasContainer");
		var imageSignature = $("#imageSignature");
    	var footerSignature = $("#footerSignature");
    		var windowH = $(window).height();
    		var windowW = $(window).width();
    		signature.css({
    		 height : windowH - footerSignature.height(),
    		})
    		canvasContainer.css({
    		 height : windowH - footerSignature.height(),
    		 width : signature.width(),
    		})
    		imageSignature.css({
    		 height : windowH - footerSignature.height(),
    		})    	    
        });  


    
    
	 
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
	//alert("setSite");
	deleteFlag = true;
	recordClick(valSiteId);
}

function centerEmptyText(objectID) 
{
    var thisObj = document.getElementById(objectID);
    var width = (window.innerWidth) ? window.innerWidth :   document.body.clientWidth;
	var height = (window.innerHeight) ? window.innerHeight :   document.body.clientHeight;
	//alert("clientHeight   " + document.body.clientHeight);
	
    var objectWidth = parseInt(thisObj.style.width);
    var objectHeight = parseInt(thisObj.style.height);
	//alert(objectHeight);
	

    var newLocation = (width - objectWidth) / 2;
	var newLocationH = (height - objectHeight) / 2;
	
	//alert( newLocationH);
	newLocation=newLocation+10;
	//newLocationH=newLocationH+550;
    //thisObj.style.left = newLocation +'px';
	doLog(LocationH);
    thisObj.style.top = (newLocationH - 10) +'px';
   // thisObj.style.left = (newLocation - 10) +'px';
	
}

function hideAllCheckboxes() {
	$('.siteCheckbox').each(function () {
		var element = document.getElementById(this.id);
		element.style.display = 'none';
	  });
} 

function HideRightIcon()
{
	
	   $(".listDisplayRecord").each( function() {
			  $(this).removeClass('ui-btn-icon-right');
		});
}

function ShowRightIcon()
{
	
	   $(".listDisplayRecord").each( function() {
			  $(this).addClass('ui-btn-icon-right');
		});
}

function centerHorizontallyRecords(objectID) 
{
    var thisObj = document.getElementById(objectID);
    var width = (window.innerWidth) ? window.innerWidth :   document.body.clientWidth;
	var height = (window.innerHeight) ? window.innerHeight :   document.body.clientHeight;
	//alert("clientHeight   " + document.body.clientHeight);
	
    var objectWidth = parseInt(thisObj.style.width);
    var objectHeight = parseInt(thisObj.style.height);
	//alert(objectHeight);
	

    var newLocation = (width - objectWidth) / 2;
	var newLocationH = (height - objectHeight) / 2;

    thisObj.style.top = newLocationH + 15 + 'px';
    thisObj.style.left = (newLocation - 70) +'px';
    alert(newLocationH+ "   " + this.id);

}