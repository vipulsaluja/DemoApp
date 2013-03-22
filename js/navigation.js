navigateInit();
var backButtonText = '';
var pageStack = [];
var isBackPressed = false;
var isDonePressed = false;
var stackTop = -1;

function updatePageStack(pageName)
{
	 if(isBackPressed)
	{
		isBackPressed = false;
		stackTop--;
		backButtonText = pageStack[stackTop];
		
	}
else
	{
	pageStack.push(pageName);
	stackTop++;
		backButtonText = pageStack[stackTop];
		
		
	}
}

function updateBackFlag() {
	isBackPressed = true;
}

function updateDoneFlag() {
	isBackPressed = true;
}

function navigateInit() { 
    $('#page1').live('pagebeforeshow',function(event){

    	updatePageStack(backButtonText);
    	
        });    
    $('#capturedImagePage').live('pagebeforeshow',function(event){    	
    	updatePageStack(backButtonText);
    	setTextOnPage("backCamera");
        });
    $('#locationPage').live('pagebeforeshow',function(event){
    	updatePageStack(backButtonText);
    	setTextOnPage("backLocation");
  });
    $('#displayPage1').live('pagebeforeshow',function(event){
    	updatePageStack(backButtonText);
    	setTextOnPage("backRecords");
  });
    $('#morePage').live('pagebeforeshow',function(event){
    	updatePageStack(backButtonText);
    	setTextOnPage("backMore");
  });
    $('#signaturePage').live('pagebeforeshow',function(event){
    	updatePageStack(backButtonText);
    	setTextOnPage("backSignature");
  });
    $('#editPage').live('pagebeforeshow',function(event){
    	updatePageStack(backButtonText);
    	setTextOnPage("backEditRecord");
  });    
}

function setTextOnPage(element) {
//    $("#"+element).html("");
//    $("#"+element).html(backButtonText);
}

function setBackButtonText(text){
	backButtonText = text;
}