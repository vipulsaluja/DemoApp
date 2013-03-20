
// JavaScript Document
var sigCapture = null;

$("#signaturePage").live("pageshow", function() {
	sigCapture = new SignatureCapture( "signature" );	
	$("#submit").click( onSubmitClick );
	$("#cancel").click( onCancelClick );
	$("#new").click( onNewClick );
});


function onSubmitClick( event ) {
		var sig = sigCapture.toString();
		var capturedSignature = document.getElementById('capturedSignature');
		var element = document.getElementById('imageSignature');
		var canvasContainer = document.getElementById('canvasContainer');
		var canvas = document.getElementById("signature");
		var img    = canvas.toDataURL("image/png");
		element.src = img;
		canvasContainer.style.display = "none";
		capturedSignature.style.display = "block";
		var submit = document.getElementById('submit');
		submit.style.display = "none";
		var cancel = document.getElementById('cancel');
		cancel.style.display = "none";
		var cancel = document.getElementById('new');
		cancel.style.display = "block";
}

function onNewClick( event) {
	clearForm();
	var submit = document.getElementById('submit');
	submit.style.display = "block";
	var cancel = document.getElementById('cancel');
	cancel.style.display = "block";
	var canvasContainer = document.getElementById('canvasContainer');
	canvasContainer.style.display = "block";
	var cancel = document.getElementById('new');
	cancel.style.display = "none";
	var capturedSignature = document.getElementById('capturedSignature');
	capturedSignature.style.display = "none";
}

function onCancelClick( event ) {
	clearForm();
}

function clearForm() {
	$("#email").val( "" );
	sigCapture.clear();
	$("#feedback").html( "" );
}

function requestSuccess( data, textStatus, jqXHR ) {
	clearForm();
	$("#feedback").html( "Thank you." );
}

function requestError( jqXHR, textStatus, errorThrown ) {
	$("#feedback").html( "Error: " + errorThrown );
}

function verifyEmail() {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test( $("#email").val() );
}


function SignatureCapture( canvasID ) {
	this.touchSupported = Modernizr.touch;
	this.canvasID = canvasID;
	this.canvas = $("#"+canvasID);
	this.context = this.canvas.get(0).getContext("2d");	
	this.context.strokeStyle = "#000000";
	this.context.lineWidth = 1;
	this.lastMousePoint = {x:0, y:0};
	this.canvas[0].width = this.canvas.parent().innerWidth();
    
	if (this.touchSupported) {
		this.mouseDownEvent = "touchstart";
		this.mouseMoveEvent = "touchmove";
		this.mouseUpEvent = "touchend";
	}
	else {
		this.mouseDownEvent = "mousedown";
		this.mouseMoveEvent = "mousemove";
		this.mouseUpEvent = "mouseup";
	}
	
	this.canvas.bind( this.mouseDownEvent, this.onCanvasMouseDown() );
}

SignatureCapture.prototype.onCanvasMouseDown = function () {
	var self = this;
	return function(event) {
		self.mouseMoveHandler = self.onCanvasMouseMove()
		self.mouseUpHandler = self.onCanvasMouseUp()

		$(document).bind( self.mouseMoveEvent, self.mouseMoveHandler );
		$(document).bind( self.mouseUpEvent, self.mouseUpHandler );
		
		self.updateMousePosition( event );
		self.updateCanvas( event );
	}
}

SignatureCapture.prototype.onCanvasMouseMove = function () {
	var self = this;
	return function(event) {

		self.updateCanvas( event );
     	event.preventDefault();
    	return false;
	}
}

SignatureCapture.prototype.onCanvasMouseUp = function (event) {
	var self = this;
	return function(event) {

		$(document).unbind( self.mouseMoveEvent, self.mouseMoveHandler );
		$(document).unbind( self.mouseUpEvent, self.mouseUpHandler );
		
		self.mouseMoveHandler = null;
		self.mouseUpHandler = null;
	}
}

SignatureCapture.prototype.updateMousePosition = function (event) {
 	var target;
	if (this.touchSupported) {
		target = event.originalEvent.touches[0]
	}
	else {
		target = event;
	}

	var offset = this.canvas.offset();
if(this.canvas[0].height != this.canvas.parent().innerHeight())
	{
	this.canvas[0].height = this.canvas.parent().innerHeight()
	}
	this.lastMousePoint.x = target.pageX - offset.left;
	this.lastMousePoint.y = target.pageY - offset.top;

}

SignatureCapture.prototype.updateCanvas = function (event) {

	this.context.beginPath();
	this.context.moveTo( this.lastMousePoint.x, this.lastMousePoint.y );
	this.updateMousePosition( event );
	this.context.lineTo( this.lastMousePoint.x, this.lastMousePoint.y );
	this.context.stroke();
}

SignatureCapture.prototype.toString = function () {

	var dataString = this.canvas.get(0).toDataURL("image/png");
	var index = dataString.indexOf( "," )+1;
	dataString = dataString.substring( index );
	
	return dataString;
}

SignatureCapture.prototype.clear = function () {

	var c = this.canvas[0];
	this.context.clearRect( 0, 0, c.width, c.height );
}
			