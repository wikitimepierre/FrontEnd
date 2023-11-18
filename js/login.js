// you only arrive on this page if you are not LOGGED IN
import {lsWrite,lsRead, lsWriteDebugMode, testMenu} from "./localStorage.js";
import {postLoginPassword} from "./backend.js";
import {createInstaListener, displayInsta, switchTestMenu} from "./localStorage.js";

testMenu();                                                      // debug on/off button (on insta)
submitFormListener();                                            // listener on submit button that submits the form

// #region FormListener
function submitFormListener() {                                   // listener on submit button
  let formSubmitButton = document.querySelector("#contact form");
  formSubmitButton.addEventListener("submit", function(event) {
    event.preventDefault();                                     // Prevent the default form submission
    let email = document.querySelector("#email").value;         // Get the value of the email input
    let password = document.querySelector("#password").value;   // Get the value of the password input
    submitForm(email, password);
  });
  console.log("submitFormListener function created listeners"); // CNSL
}
function submitForm(email, password) {                            // post login-password
    console.log("submitForm("+email+","+password+")");          // CNSL
    if (validationEmail(email)=== false) {
      console.log("Email non valide");                          // CNSL
    } else {
      postLoginPassword(email, password);

    }
}
function validationEmail(email) {                                 // check if email is well formatted
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase()); // true if email well formatted
}
// #endregion
