//The URIs of the REST endpoint
IUPS = "https://prod-81.eastus.logic.azure.com:443/workflows/a665a760aa4343bbb2b95e923049d3c2/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=nTDxVSZhDRP8XFhogYTo749Yo-tnmka7XjdP4SrjB24";
RAI = "https://prod-18.centralus.logic.azure.com:443/workflows/5b93aed7ade940ba9e83115196d5aeba/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=jY2-ZU7B6REvI5PAwCUt5g3D6c3hO6eB0Ll3N371DQ8";
DAI_start = "https://prod-08.ukwest.logic.azure.com/workflows/441d9fc5acb6485e87776445137eaacf/triggers/manual/paths/invoke/rest/v1/assests/";
DAI_End = "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Cymkyfr4eeVEMcHHCBT4SOP_y1PzuTzuV7FSzAaCwWw";

CreateUserURL = "https://prod-28.ukwest.logic.azure.com/workflows/b12c3e6b6ccc494b8aa330dd631e3cd1/triggers/manual/paths/invoke/rest/v1/assets?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=iKsGtb-X80_1RHc7HaUOGJY8iqv3hWoOB9zIcOcB5O8";
UserCheckStart="https://prod-03.uksouth.logic.azure.com/workflows/fbed9434db034c459d4812d31d677199/triggers/manual/paths/invoke/rest/v1/assests/?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=WOajqr-nTCusNB5iSre90uOd5MXFJA3kYg-7fRNRvoM";
UserCheckEnd = "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=WOajqr-nTCusNB5iSre90uOd5MXFJA3kYg-7fRNRvoM";
CheckUserExitsURL = "https://prod-15.centralus.logic.azure.com:443/workflows/b3a4e28aa0d34b7e8a5c63279fefded7/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=idqwk0_RtWX2UlcBJhGU-zK434GYL9KbG09fiHjpAFQ";
CheckUsernameIsFree = "https://prod-17.centralus.logic.azure.com:443/workflows/68cfac6afa0d4ecaa168fde59ffb4628/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ABbY8hDqsf2cS5Kq2jXliAX5ubiENoRlq77VCPD9kL0";
ChangePasswordURL_start = "https://prod-17.centralus.logic.azure.com/workflows/6d5892483b5c43249fe6f15427d0eeb4/triggers/manual/paths/invoke/rest/v1/assets/";
ChangePasswordUrl_end = "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=YLqf8QLCya8Q7skf8n14noi008XF4hrMQVGuKwxF-2A";


BLOB_ACCOUNT = "https://blobstorageb00808976.blob.core.windows.net";


var userid = "";
var isAdmin = false;
var userName = "";
var userFullName = "";

//Handlers for button clicks
$(document).ready(function() {


  if(sessionStorage.getItem("isAdmin")=="false"){
    $('#AddVideoForm').html('<div style="display:none"></div>');
  }



$("#retVideos").click(function(){

    //Run the get asset list function
    getVideoFiles();

}); 

  //Handler for the new asset submission button
$("#subNewForm").click(function(){

  //Execute the submit new asset function
  submitNewAsset();
  
}); 
});

//A function to submit a new asset to the REST endpoint 
function submitNewAsset(){
//Create a form data object
  submitData = new FormData();
  //Get form variables and append them to the form data object
  submitData.append('FileName', $('#FileName').val());
  submitData.append('userID', $('#userID').val());
  submitData.append('userName', $('#userName').val());
  submitData.append('File', $("#UpFile")[0].files[0]);
  submitData.append('Title', $('#title').val());
  submitData.append('Genre', $('#genre').val());
  submitData.append('Publisher', $('#publisher').val());
  submitData.append('Producer', $('#producer').val());
  submitData.append('AgeRating', $('#ageRating').val());
  

  //Post the form data to the endpoint, note the need to set the content type header
  $.ajax({
  url: IUPS,
  data: submitData,
  cache: false,
  enctype: 'multipart/form-data',
  contentType: false,
  processData: false,
  type: 'POST',
  success: function(data){

  }
  });
}

//A function to get a list of all the assets and write them to the Div with the AssetList Div
function getVideoFiles(){

  console.log("");

  //Replace the current HTML in that div with a loading message
  $('#videoList').html('<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>');
  $.getJSON(RAI, function( data ) {
    //Create an array to hold all the retrieved assets
    var items = [];

    console.log("userid: " + userid);
    //Iterate through the returned records and build HTML, incorporating the key values of the record in the data
    $.each( data, function( key, val ) {
    items.push( "<hr />");
    items.push("<video controls width='320' height='auto' controls autoplay muted src='" + BLOB_ACCOUNT + val["filePath"] + "'type='video/mp4'/></video><br />");
    items.push( "Title : " + val["title"] + "<br />");
    items.push( "Genre: " + val["genre"] + " (Age Rating: "+val["ageRating"]+")<br />");
    if(sessionStorage.getItem("isAdmin")=="true"){
      items.push('<button type="button" onclick=\"deleteFunction(\'' +val["id"]+'\')">Delete</button>');
    }
    items.push( "<hr />");
    });
    //Clear the assetlist div
    $('#videoList').empty();
    //Append the contents of the items array to the ImageList Div
    $( "<ul/>", {
    "class": "my-new-list",
    html: items.join( "" )
    }).appendTo( "#videoList" );
  });

}

function deleteFunction(id){
  $.ajax({
    type:"DELETE",
    url: DAI_start + id + DAI_End,
  }).done(function(){
    getVideoFiles();
  })
}


function validateLogin(){
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  submitUserData = new FormData();

  submitUserData.append('userName', username);
  submitUserData.append('userPassword', password);

  $.ajax({
    url: CheckUserExitsURL,
    type:"POST",
    data: submitUserData,
    cache: false,
    contentType: false,
    processData: false,
    success: function(userData){
      console.log(userData)
      console.log(userData[0])

      sessionStorage.setItem("userId", userData[0].userId)
      sessionStorage.setItem("userName", userData[0].userName)
      sessionStorage.setItem("isAdmin", userData[0].isAdmin)
      sessionStorage.setItem("userFullName", userData[0].userFullName)

      isAdmin = userData[0].isAdmin;

      console.log(userid);
      
      if(userData[0].userName){
        alert ("Login successful");
        window.location = "./home.html"; // Redirecting to other page.
      } else{
        alert ("Login Failed");
      }
      return false;
    }
  })
}

function createUser(){
  var username = document.getElementById("createUsername").value;
  var fullname = document.getElementById("createFullName").value;
  var password = document.getElementById("createPassword").value;
  var passwordConfirm = document.getElementById("createConfirmPassword").value;

  if(password==passwordConfirm){
    
  checkUsernameData = new FormData();
  checkUsernameData.append('userName', username)

    $.ajax({
      url: CheckUsernameIsFree,
      type:"POST",
      data: checkUsernameData,
      cache: false,
      contentType: false,
      processData: false,
      success: function(response){
        console.log(response)
        if(!response){
          console.log("works")

          createUserData = new FormData();
          createUserData.append('userName', username)
          createUserData.append('userFullName', fullname)
          createUserData.append('userPassword', password)

          $.ajax({
            url: CreateUserURL,
            type:"POST",
            data: createUserData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(response){
              console.log(response)

            }
          })
        } else{
          alert("Username Taken");
        }
      }
    })
  } else{
    alert("Passwords do not match")
  }


}


function createNewPassword(){
  console.log("hello there");
  var newPassword = document.getElementById("newPassword").value;
  var confirmNewPassword = document.getElementById("confirmNewPassword").value;
  var userId = sessionStorage.getItem("userId");

  if(newPassword == confirmNewPassword){

    changePasswordInfo = new FormData();
    changePasswordInfo.append('userPassword', newPassword);

    $.ajax({
      url: ChangePasswordURL_start + userId + ChangePasswordURL_end,
      type:"PUT",
      data: changePasswordInfo,
      cache: false,
      contentType: false,
      processData: false,
      success: function(success){
        console.log(success)
        
        if(newPassword == success){
          alert ("Successful");
        } else{
          alert ("Failed");
        }
      }
    })

  }else{
    alert("passwords do not match");
  }

}
