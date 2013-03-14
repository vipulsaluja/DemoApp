/**
 * cordova is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) Matt Kane 2010
 * Copyright (c) 2011, IBM Corporation
 */

cordova.define("cordova/plugins/barcodescanner", 
  function(require, exports, module) {
    var exec = require("cordova/exec");
    var BarcodeScanner = function() {};
    
    //-------------------------------------------------------------------
    BarcodeScanner.prototype.scan = function(successCallback, errorCallback) {
        if (errorCallback == null) { errorCallback = function() {}}
    
        if (typeof errorCallback != "function")  {
            console.log("BarcodeScanner.scan failure: failure parameter not a function");
            return
        }
    
        if (typeof successCallback != "function") {
            console.log("BarcodeScanner.scan failure: success callback parameter must be a function");
            return
        }
    
        exec(successCallback, errorCallback, 'BarcodeScanner', 'scan', []);
    };
    
    //-------------------------------------------------------------------
    BarcodeScanner.prototype.encode = function(type, data, successCallback, errorCallback, options) {
        if (errorCallback == null) { errorCallback = function() {}}
    
        if (typeof errorCallback != "function")  {
            console.log("BarcodeScanner.scan failure: failure parameter not a function");
            return
        }
    
        if (typeof successCallback != "function") {
            console.log("BarcodeScanner.scan failure: success callback parameter must be a function");
            return
        }
    
        exec(successCallback, errorCallback, 'BarcodeScanner', 'encode', [{"type": type, "data": data, "options": options}]);
    };
    
    var barcodeScanner = new BarcodeScanner();
    module.exports = barcodeScanner;

});

cordova.define("cordova/plugin/BarcodeConstants", 
    function(require, exports, module) {
    module.exports = {
        Encode:{
            TEXT_TYPE: "TEXT_TYPE",
            EMAIL_TYPE: "EMAIL_TYPE",
            PHONE_TYPE: "PHONE_TYPE",
            SMS_TYPE: "SMS_TYPE",
        }
    };        
});
//-------------------------------------------------------------------
var BarcodeScanner = cordova.require('cordova/plugin/BarcodeConstants');

if(!window.plugins) {
    window.plugins = {};
}
if (!window.plugins.barcodeScanner) {
    window.plugins.barcodeScanner = cordova.require("cordova/plugins/barcodescanner");
}



var scanCode = function() {
    window.plugins.barcodeScanner.scan(
        function(result) {
        if (result.text)
        {
	        alert("Scanned Code: " + result.text 
	                + ". Format: " + result.format
	                + ". Cancelled: " + result.cancelled);
        }
    }, function(error) {
        alert("Scan failed: " + error);
    });
}

var encodeText = function() {
    window.plugins.barcodeScanner.encode(
            BarcodeScanner.Encode.TEXT_TYPE,
            "http://www.mobiledevelopersolutions.com", 
            function(success) {
                alert("Encode success: " + success);
            }, function(fail) {
                alert("Encoding failed: " + fail);
            });
}

var encodeEmail = function() {
    window.plugins.barcodeScanner.encode(
        BarcodeScanner.Encode.EMAIL_TYPE,
        "a.name@gmail.com", function(success) {
            alert("Encode success: " + success);
        }, function(fail) {
            alert("Encoding failed: " + fail);
        });
}

var encodePhone = function() {
    window.plugins.barcodeScanner.encode(
        BarcodeScanner.Encode.PHONE_TYPE,
        "555-227-5283", function(success) {
            alert("Encode success: " + success);
        }, function(fail) {
            alert("Encoding failed: " + fail);
        });
}

var encodeSMS = function() {
    window.plugins.barcodeScanner.encode(
        BarcodeScanner.Encode.SMS_TYPE,
        "An important message for someone.", function(success) {
            alert("Encode success: " + success);
        }, function(fail) {
            alert("Encoding failed: " + fail);
        });
}