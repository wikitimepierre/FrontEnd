// #region js files import
import {testMenu, postLoginPassword} from "./other.js";
// #endregion

testMenu();                                                      // debug on/off button (on insta)
submitFormListener();                                            // listener on submit button that submits the form

// #region FormListener (for email/password validate button)
function submitFormListener() {                                   // listener on submit button
  let formSubmitButton = document.querySelector("#contact form");
  formSubmitButton.addEventListener("submit", function(event) {
    event.preventDefault();                                     // Prevent the default form submission
    let email = document.querySelector("#email").value;         // Get the value of the email input
    let password = document.querySelector("#password").value;   // Get the value of the password input
    submitForm(email, password);
  });
}
function submitForm(email, password) {                            // post login-password
  if (validationEmail(email)=== false) {
    alert("Email non valide");                                    // CNSL
  } else {
      console.log("I'm submitting ("+email+" - "+password+")");   // CNSL
      postLoginPassword(email, password);

    }
}
function validationEmail(email) {                                 // check if email is well formatted
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase()); // true if email well formatted
}
// #endregion
