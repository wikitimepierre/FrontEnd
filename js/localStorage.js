
// #region Local Storage
export function lsRead(key, variableType) {                        // Read in localStorage
  let value = window.localStorage.getItem(key)
  switch(variableType) {
    case "boolean":
      return JSON.parse(value);
    case "integer":
      return parseInt(value);
    case "string":
      return value;
    default:
      alert('lsRead Error');
      return null;
  }
}
export function lsWrite(key, variableType, value) {                // Write in localStorage
  switch(variableType) {
    case "boolean":
      window.localStorage.setItem(key, JSON.stringify(value));
      break;
    case "integer":
      window.localStorage.setItem(key, value.toString());
      break;
    case "string":
      window.localStorage.setItem(key, value);
      break;
    default:
      alert('lsWrite Error- KEY: '+key+' TYPE: '+variableType+' VALUE: '+value);
  }
}
export function lsWriteDebugMode(value) {                                       // Switch debugMode on or off
  lsWrite("debugMode", "boolean", value);
  displayTestMenu()
  displayInsta()
}
// #endregion

// #region Test Menu
export function testMenu() {                                            // initialize insta & testMenu
  createTestMenu();                                                     // create test menu but don't display it
  createInstaListener();                                                // create instabutton listener
  displayTestMenu()                                                      // display testmenu or not (according to debugMode)
  displayInsta()                                                         // display insta or not (according to debugMode)
}
export function createTestMenu() {                                       // create test menu (banner+buttons) ... don't display it yet
  let testMenu = document.getElementById("testMenu");
  testMenu.style.display = "none";

  let img = document.createElement('img');
  let path = pointPath() + "./assets/ArchiwebOS/ArchiwebosBanner.png";
  img.setAttribute('src', path);
  img.setAttribute('class', 'archiwebosBanner');
  img.style.position = "absolute";
  let a = ((window.innerWidth-620)/2)-30;
  a = a + "px"
  img.style.top = "10px";
  img.style.left = a;
  img.style.width = "620px";
  img.style.height = "93px";

  testMenu.appendChild(img);

  createTestButton("Effacer", "", "", false);
  createTestButton("wrong pwd", "sophie.bluel@test.tld", "S", false);
  createTestButton("wrong email", "sophie.blue@ltest.com", "S0phie", false);
  createTestButton("Good", "sophie.bluel@test.tld", "S0phie", false);
  createTestButton("LS Erase", "", "", true);
  createTestButton("ReloadServer", "", "", true);
}
export function createTestButton(text, email, password, send) {          // create test buttons needed in test menu
  let testMenu = document.getElementById("testMenu");
  let testButton = document.createElement("button");
  testButton.textContent = text;
  testButton.style.position = "relative";
  testButton.style.top = "-70px"; testButton.style.left = "165px";
  if (send === false) {testButton.style.top = "-100px"; testButton.style.left = "385px";}
  testMenu.appendChild(testButton);
  testButton.addEventListener("click", function(){
    if (send === false) {
      document.querySelector("#email").value = email;
      document.querySelector("#password").value = password;
    } else  {
      if (text === "LS Erase")
      {
        window.localStorage.clear();
        console.log("Local Storage Erased");                                  // CNSL
        lsWriteDebugMode(true);
        alert("localStorage cleared");
        //window.location.href = "../index.html";       // redirect to homepage
      } else if (text === "ReloadServer") {
        reloadServer();
      } else {
        lsWriteDebugMode(false)
      }
      window.location.reload();
    }
  });
}
export function displayTestMenu() {                                      // display debugmenu or not (according to debugMode)
  let testMenu = document.getElementById("testMenu");
  if (lsRead("debugMode", "boolean")===false) {
    testMenu.style.display = "none";
  } else {
    testMenu.style.display = "block";
  }
}
// #endregion

// #region debugMode Insta icon
export function createInstaListener() {                                  // create insta listener
  let insta= document.querySelector(".insta");
  insta.addEventListener("click", function(){
    switchTestMenu()
  });
}
export function switchTestMenu() {                                       // switch debugMode on or off
  if (lsRead("debugMode", "boolean")===true) {
    lsWriteDebugMode(false)
  } else {
    lsWriteDebugMode(true)
  }
}
export function displayInsta() {                                         // display insta or not (according to debugMode)
  let insta= document.querySelector(".insta");
  if (lsRead("debugMode", "boolean")===true)
    {insta.src = pointPath() + "./assets/icons/instagramdebug.png"}
    else {insta.src = pointPath() + "./assets/icons/instagram.png"}
}
export function pointPath() {                                                  // return "" or "." if function comes from login.js
  if (window.location.pathname.split('/').pop() === "login.html")
  {return "."}
  else
  {return ""}
}
// #endregion
function reloadServer() {
	lsWrite("reloadServer","boolean", true)												// so that the server is reloaded next time I get back to the homapage
	window.location.reload();																		// refresh page that will reload also modalPhotoGallery
}