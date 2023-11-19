import {lsWrite,lsRead, lsWriteDebugMode} from "./localStorage.js";
// all calls for backend are here

const backendWorks =      "http://localhost:5678/api/works";
const backendCategories = "http://localhost:5678/api/categories";
const backendUsers =      "http://localhost:5678/api/users/login";

export async function postLoginPassword (email, password) {              // Post login/password

  let post = JSON.stringify({ email: email, password: password })
  console.log("----------------------------------------");         // CNSL
  console.log(post);                                               // CNSL
  fetch(backendUsers, {
    method: "POST",
    headers: {"Content-Type": "application/json",},
    body: post,
  })
  .then(response => response.json())
  .then(data => {
    console.log("data.userId: " + data.userId);                    // CNSL
    console.log("data.token: " + data.token);                      // CNSL
    if (data.token === undefined || data.token === "") {
      fetch(backendUsers, {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: post,
      })
      .then(data => {
        if(data.status === 404) {
          alert("user not found");
        } else if (data.status === 401) {
          alert("wrong password");
        }})
    } else {
      let activeFilter = lsRead("activeFilter","integer");         // save activeFilter from localStorage
      let debugMode = lsRead("debugMode","boolean");               // save debugMode from localStorage
      window.localStorage.clear();                                 // clear localStorage
      lsWrite("activeFilter","integer",activeFilter)               // re-set activeFilter in localStorage
      lsWrite("debugMode","boolean",debugMode)                     // re-set debugMode in localStorage
      lsWrite("logMode","boolean",true)                            // logMode = true
      lsWrite("token","string",data.token)                         // set token in localStorage
      lsWrite("userId","integer",data.userId)                      // set userId in localStorage //TODO l'enlever si j'en ai pas besoin
      alert("User '"+data.userId+"'... welcome !");                               // CNSL
      window.location.href = "../index.html";}                     // redirect to homepage
    }
  )
}

export async function deleteWork(index, id, title) {                                   // Delete a work
  let token = lsRead("token","string")
  if (token === null || token === undefined || token === "") {
    alert("Pas connecté")
  } else {
    await fetch(backendWorks + "/" + index, 
      {method: "DELETE",
        headers: {"Content-Type": "application/json", 
        Authorization: "Bearer " + token}
      })
    .then (
      response => {
        console.log("----------------------------------------");         // CNSL
        console.log("deleteWork:" + index);                              // CNSL
        console.log("response.status: "+response.status);                // CNSL
        console.log("response: "+response)                               // CNSL
        if (response.status === 204) {                                   // Token good
          // Now that it's removed from server, 
          alert("effacé du serveur : n°"+index+", id:"+id+" - "+title);  // CNSL

          // let's remove it from local Storage
          let works = JSON.parse(lsRead("works", "string"));             // Retrieve the array from localStorage
          works.splice(index, 1);                                           // remove 1 element from place #index
          works = JSON.stringify(works)
          lsWrite("works","string",works);                               // Store the updated array back in localStorage

          //let's reload the gallery & the modal
          lsWrite("displaymodalphotogallery","boolean", true)
          window.location.reload();
        }
        else if (response.status === 401) {                              // Token PAS good
            alert("Pas d'autorisation")
        }
      }
    )
  }
}

export async function postWork (title, imageSrc, categoryId) {           // Post a new work
  const backendWorks =      "http://localhost:5678/api/works";
  let token = lsRead("token","string")

  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", categoryId);
  await fetch(imageSrc)                                                  // Fetch the image in imageSrc
    .then(response => response.blob())                                   // Convert the image data to a Blob
    .then(blob => {formData.append('image', blob, 'image.jpg');          // Append the Blob
    })

  await fetch(backendWorks, {
    method: "POST",
    headers: {Authorization: "Bearer " + token},
    body: formData,
  })
  .then (response => {
    console.log("postWork response.status: "+response.status);           // CNSL
    console.log("postWork response: "+response)                          // CNSL
    if (response.status === 201) {
      alert("Projet ajouté");

      let works = JSON.parse(lsRead("works", "string"));                 // Retrieve the array from localStorage
      let work = {title:title, imageUrl:imageSrc, categoryId:categoryId};
      works.push(work);                                                  // Push the new work
      lsWrite("works","string",works);                                   // Store the updated array back in localStorage

      lsWrite("displaymodalphotogallery","boolean", true)                // so that the modal is displayed when I get back to the homapage
      window.location.href = "../index.html";                            // redirect to homepage
    }
    else if (response.status === 400) {alert("formulaire invalide")}     // CNSL
    else if (response.status === 500) {alert("Erreur serveur")}          // CNSL
    else if (response.status === 401) {alert("Pas d'autorisation")}      // CNSL
    else {alert("Erreur inconnue : "+ response.status)}                  // CNSL
  })
}
