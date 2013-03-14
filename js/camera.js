            
			// Called when a photo is successfully retrieved   
			//  
			function onPhotoURISuccess(imageURI)
			{      
				// Uncomment to view the image file URI    
				// console.log(imageURI);      
				// Get image handle     
				//     
				var largeImage = document.getElementById('largeImage'); 
				// Unhide image elements     
				//     
				largeImage.style.display = 'block'; 
				// Show the captured photo    
				// The inline CSS rules are used to resize the image      
				//      
				largeImage.src = imageURI;   
			}
			// A button will call this function   
			//  
			function capturePhotoEdit()
			{      
				// Take picture using device camera, allow edit, and retrieve image as base64-encoded string       
				navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true });    
			}   
			// A button will call this function    
			//    
			function getPhoto(source) 
			{     
				// Retrieve image file location from specified source    
				navigator.camera.getPicture(onPhotoURISuccess, onFail,
				{ 
					quality: 20,         
					destinationType: destinationType.FILE_URI,        
					sourceType: source 
				});   
			}   
