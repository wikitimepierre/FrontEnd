import {lsWrite,lsRead, lsWriteDebugMode} from "./localStorage.js";
// all calls for backend are here

const backendWorks =      "http://localhost:5678/api/works";
const backendCategories = "http://localhost:5678/api/categories";
const backendUsers =      "http://localhost:5678/api/users/login";

export async function postLoginPassword (email, password) {        // Post login/password

  window.localStorage.clear();                                     // clear localStorage
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
      lsWrite("logMode","boolean",true)                            // logMode = true
      lsWrite("token","string",data.token)                         // set token in localStorage
      lsWrite("userId","integer",data.userId)                      // set userId in localStorage //TODO l'enlever si j'en ai pas besoin
      //fetchWorks();                                                // fetch works in localStorage "works"
      //fetchCategories();                                           // fetch categories in localStorage "categories" //TODO l'enlever si j'en ai pas besoin
      alert("Welcome");                                            // CNSL
      window.location.href = "../index.html";}                     // redirect to homepage
    }
  )
}

export async function deleteWork(id) {                            // Delete a work with its id
  let token = lsRead("token","string")
  if (token === null || token === undefined || token === "") {
    alert("Pas connecté")
  } else {
    let response = fetch(backendWorks + "/" + (id), {
      method: "DELETE",
      headers: {"Content-Type": "application/json",},
      headers: {Authorization: "Bearer " + token},
    })
    .then (response => {
        console.log("----------------------------------------");         // CNSL
        console.log("deleteWork response.status: "+response.status);     // CNSL
        console.log("deleteWork response: "+response)                    // CNSL
        if (response.status === 204) {                                   // Token good

          //Now that it's remove from server
          //let's remove it from local Storage
          let works = JSON.parse(lsRead("works", "string"));             // Retrieve the array from localStorage
          works.splice(id, 1);                                           // remove 1 element from place #id
          works = JSON.stringify(works)
          lsWrite("works","string",works);                               // Store the updated array back in localStorage

          //let's reload the gallery

          //TODO effacer le work dans la gallery de photos
          //TODO effacer le work dans la modale

          //TODO réécrire la gallery de photos
          //TODO réécrire la modalPhotoGallery

          alert("Projet " + id + " effacé")                              // CNSL
        }
        else if (response.status === 401) {                              // Token PAS good
            alert("Pas d'autorisation")
        }
    })
  }
}

//postWork("Villa Ferneze - Isola d’Elba", "FrontEnd\assets\images\villa-ferneze.png", 1)
export async function postWork (title, imageSrc, categoryId) {     // Post a new work
  let token = lsRead("token","string")
  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", categoryId);
  fetch(imageSrc)                                                   // Fetch the image.src data
    .then(response => response.blob())                              // Convert the image data to a Blob
    .then(blob => {formData.append('image', blob, 'image.jpg');     // Append the Blob
    })
  console.log("--------postWork post: "+formData);                  // CNSL

  let response = await fetch(backendWorks, {
    method: "POST",
    headers: {Authorization: "Bearer " + token},
    body: formData,
  })
  .then (response => {
    console.log("postWork response.status: "+response.status);      // CNSL
    console.log("postWork response: "+response)                     // CNSL
    if (response.status === 201) {
      alert("Projet ajouté")
      //TODO ajouter le work dans le localStorage
      //TODO ajouter le work dans la gallery de photos
      // TODO pour ces deux trucs là, je peux effacer le localstorage etv ça va tout recharger, non ?
      //TODO ajouter le work dans la modale
    }
    else if (response.status === 400) {alert("formulaire invalide")}  // CNSL
    else if (response.status === 500) {alert("Erreur serveur")}       // CNSL
    else if (response.status === 401) {alert("Pas d'autorisation")}   // CNSL
    else {alert("Erreur inconnue : "+ response.status)}               // CNSL
  })
}
