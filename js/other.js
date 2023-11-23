
// #region Works : buildFilteredWorks, displayfilteredWorks, displayFilterButtonsColors
  export function buildFilteredWorks(filter, filteredWorks) {
    if (filter > 0) {                                                            // else nothing changes since filteredWorks = works
      filteredWorks = filteredWorks.filter(work => work.categoryId === filter);  // filter works according to activeFilter
      filteredWorks = [...new Set(filteredWorks)];                                     // remove duplicates in filteredWorks using Set
    }
    return filteredWorks
  }
  export function displayfilteredWorks(filteredWorks) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    for (let i = 0; i < filteredWorks.length; i++) {
      const figure = document.createElement("figure");                         // <figure>

      const img = document.createElement("img");                               // <img src="assets/images/abajour-tahina.png" alt="Abajour Tahina">
      img.setAttribute("src", filteredWorks[i].imageUrl);
      img.setAttribute("alt", filteredWorks[i].title);

      const figcaption = document.createElement("figcaption");                 // <figcaption>Abajour Tahina</figcaption>
      figcaption.textContent = filteredWorks[i].title;

      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    }
  }
  export function displayFilterButtonsColors(activeFilter) { 
    let filterButtons = document.querySelectorAll(".filters button");
    for (let i = 0; i < filterButtons.length; i++) {
      filterButtons[i].className = "";                                          // remove all classes
      {filterButtons[i].classList.add("filterButtons");}                        // add class filterButtons
      if (i === activeFilter)
          {filterButtons[i].classList.add("filterButtonsActive");}              // add class filterButtonsActive
      else{filterButtons[i].classList.add("filterButtonsInactive");}            // add class filterButtonsInactive
    }
  }
// #endregion

// #region Local Storage
  export function lsRead(key, variableType) {                                   // Read in localStorage
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
  export function lsWrite(key, variableType, value) {                           // Write in localStorage
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
  export function lsWriteDebugMode(value) {                                     // Switch debugMode on or off
    lsWrite("debugMode", "boolean", value);
    displayTestMenu()
    displayInsta()
  }
// #endregion

// #region Test Menu
  export function testMenu() {                                                  // initialize insta & testMenu
    createTestMenu();                                                           // create test menu but don't display it
    createInstaListener();                                                      // create instabutton listener
    displayTestMenu()                                                           // display testmenu or not (according to debugMode)
    displayInsta()                                                              // display insta or not (according to debugMode)
  }
  export function createTestMenu() {                                            // create test menu (banner+buttons) ... don't display it yet
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
  export function createTestButton(text, email, password, send) {               // create test buttons needed in test menu
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
          //window.location.href = "../index.html";                             // redirect to homepage
        } else if (text === "ReloadServer") {
          reloadServer();
        } else {
          lsWriteDebugMode(false)
        }
        window.location.reload();
      }
    });
  }
  export function displayTestMenu() {                                            // display debugmenu or not (according to debugMode)
    let testMenu = document.getElementById("testMenu");
    if (lsRead("debugMode", "boolean")===false) {
      testMenu.style.display = "none";
    } else {
      testMenu.style.display = "block";
    }
  }
  export function reloadServer() {
    lsWrite("reloadServer","boolean", true)												               // so that the server is reloaded next time I get back to the homapage
    window.location.reload();																		                 // refresh page that will reload also modalPhotoGallery
  }
// #endregion
// #region debugMode Insta icon
  export function createInstaListener() {                                        // create insta listener
    let insta= document.querySelector(".insta");
    insta.addEventListener("click", function(){
      switchTestMenu()
    });
  }
  export function switchTestMenu() {                                             // switch debugMode on or off
    if (lsRead("debugMode", "boolean")===true) {
      lsWriteDebugMode(false)
    } else {
      lsWriteDebugMode(true)
    }
  }
  export function displayInsta() {                                               // display insta or not (according to debugMode)
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

// #region Modal PhotoGallery
  export function createModalPhotoGallery() {
  // #region transparent background
    let blackOverlay = document.createElement("div");
    blackOverlay.classList.add("blackOverlay");
    document.body.appendChild(blackOverlay);
    //blackOverlay.addEventListener("click", function() {blackOverlay.style.display = "none"});
  // #endregion
  // #region modal page
    let modalPhotoGallery = document.createElement("div");
    modalPhotoGallery.classList.add("modalPhotoGallery");
    blackOverlay.appendChild(modalPhotoGallery);
  // #endregion
  // #region close button
    let closeButton = document.createElement("button");
    closeButton.classList.add("closeButton","fa-solid","fa-xmark");
    modalPhotoGallery.appendChild(closeButton);
    closeButton.addEventListener("click", function() {
      window.location.reload();
    });
    // TODO : does it read the server ?
  // #endregion
  // #region title "Galerie Photo"
    let titleGaleriePhoto = document.createElement("h3");
    titleGaleriePhoto.innerHTML = "<br><br>Galerie Photo<br><br>";
    titleGaleriePhoto.classList.add("titleGaleriePhoto");
    modalPhotoGallery.appendChild(titleGaleriePhoto);
  // #endregion
  // #region line
    let lineModal = document.createElement("hr");
    lineModal.classList.add("lineModal");
    modalPhotoGallery.appendChild(lineModal);
  // #endregion
  // #region button "Ajouter une Photo"
    let buttonAddPhoto = document.createElement("button");
    buttonAddPhoto.innerHTML = "Ajouter une Photo";
    buttonAddPhoto.classList.add("filterButtons","filterButtonsActive","buttonAddPhoto");
    modalPhotoGallery.appendChild(buttonAddPhoto);
    buttonAddPhoto.addEventListener("click", function() {
      blackOverlay.remove();
      createModalAddPhoto();
    });
  // #endregion
    PhotoGallery();
  }
  export function PhotoGallery() {
  // #region create filteredWorks (works with no duplicates)
    let works = lsRead("works","string"); // read string "works" from localStorage "works"
    let filteredWorks = JSON.parse(works); // convert from string to array
    filteredWorks = [...new Set(filteredWorks)]; // remove duplicates in works using Set
  // #endregion
  // #region create div photocontainer where I will put the thumbnails
    let photoContainer = document.createElement("div");
    photoContainer.classList.add("photoContainer");
    let modalPhotoGallery = document.querySelector(".modalPhotoGallery");
    modalPhotoGallery.appendChild(photoContainer);
  // #endregion
    for (let i = 0; i < (filteredWorks.length); i++) {
    // #region create thumbnailContainer where i will pout picture & trashcan button
      let thumbnailContainer = document.createElement("div");
      thumbnailContainer.classList.add("thumbnailContainer");
      photoContainer.appendChild(thumbnailContainer);
    // #endregion
    // #region thumbnails
      let thumbnail = document.createElement("img");
      thumbnail.src = filteredWorks[i].imageUrl;
      thumbnail.classList.add("thumbnail");
      thumbnailContainer.appendChild(thumbnail);
    // #endregion
    // #region trash button and trashcan inside
      let trashButton = document.createElement("button");
      trashButton.classList.add("trashButton");
      thumbnailContainer.appendChild(trashButton);
      let trashCan = document.createElement("p");
      trashCan.classList.add("trashCan","fa-solid","fa-trash-can");
      trashButton.appendChild(trashCan);
    // #endregion
    // #region event listener on trash button
      trashButton.addEventListener("click", function() {
        deleteWork(i, filteredWorks[i].id, filteredWorks[i].title);       // delete work from server
      });
    // #endregion
    }
  }
// #endregion
// #region Modal AddPhoto
  export function createModalAddPhoto() {

  // #region blackOverlay (translucid background)
    let blackOverlay = document.createElement("div");
    blackOverlay.classList.add("blackOverlay");
    document.body.appendChild(blackOverlay);
    // #endregion

  // #region modal page
    let modalAddPhoto = document.createElement("div");
    modalAddPhoto.classList.add("modalPhotoGallery");
    blackOverlay.appendChild(modalAddPhoto);
    // #endregion

  // #region arrow left button (<-)
    let arrowLeft = document.createElement("button");
    arrowLeft.classList.add("arrowLeft","fa-solid","fa-arrow-left");
    modalAddPhoto.appendChild(arrowLeft);
    arrowLeft.addEventListener("click", function() {
    blackOverlay.remove();
    createModalPhotoGallery();
    });
  // #endregion

  // #region close button (X)
    let closeButton = document.createElement("button");
    closeButton.classList.add("closeButton","fa-solid","fa-xmark");
    modalAddPhoto.appendChild(closeButton);
    closeButton.addEventListener("click", function() {
      window.location.reload();
    });
  // #endregion

  // #region title ("Ajout Photo")
    let titleAjoutPhoto = document.createElement("h3");
    titleAjoutPhoto.innerHTML = "<br><br>Ajout Photo<br><br>";
    titleAjoutPhoto.classList.add("titleGaleriePhoto");
    modalAddPhoto.appendChild(titleAjoutPhoto);
    // #endregion

  // #region blueFrame (where I'll put icon+text+button then photo)
    let blueFrame = document.createElement("div");
    blueFrame.classList.add("blueFrame");
    modalAddPhoto.appendChild(blueFrame);
  // #endregion

  // #region faImage (picture icon)
    let faImage = document.createElement("img");
    faImage.setAttribute('id', 'faImage')
    faImage.src = "./assets/icons/faImage.png";
    faImage.classList.add("faImage");
    blueFrame.appendChild(faImage);
  // #endregion

  // #region textBlueFrame (text "jpg, png : 4mo max")
    let textBlueFrame = document.createElement("p");
    textBlueFrame.innerText = "jpg, png : 4mo max";
    textBlueFrame.classList.add("textBlueFrame");
    blueFrame.appendChild(textBlueFrame);
  // #endregion

  // #region fileInput ("+ Ajouter photo" fileinput)
    let fileInputButton = document.createElement("button");
    fileInputButton.innerHTML = "+ Ajouter photo";
    fileInputButton.classList.add("fileInputButton");
    blueFrame.appendChild(fileInputButton);

    let fileInputInput = document.createElement('input');
    fileInputInput.setAttribute('type', 'file');
    fileInputInput.setAttribute('id', 'fileInput');
    fileInputInput.setAttribute('accept', '.png, .jpg, .jpeg');
    fileInputInput.className = 'fileInputInput';
    blueFrame.appendChild(fileInputInput);

    fileInputInput.addEventListener('change', function() {
      let fileImage = fileInputInput.files[0];
      console.log("submitting "+fileImage.path+"/"+fileImage.name); // CNSL

      var allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];    //png or jpg or jpeg
      if (!allowedTypes.includes(fileImage.type)) {
        alert('Erreur, utilisez une image JPEG ou PNG'); // CNSL
        fileImage="";
      } else if (fileImage.size > 4000000) {      //size < 4mo
        alert('Erreur, image trop lourde'); // CNSL
        fileImage="";
      } else {
        faImage.style.display = "none";
        textBlueFrame.style.display = "none";
        fileInputInput.style.display = "none";
        fileInputButton.style.display = "none";
        let photo = document.createElement("img");
        photo.setAttribute('id', 'photo')
        photo.classList.add("photo");
        photo.src = URL.createObjectURL(fileImage);
        blueFrame.appendChild(photo);
        // if the photo is modified then checkValidatePhoto
        // checkValidatePhoto();
      }
    });
  // #endregion

  // #region FormTitre (titre)
  let FormTitre = document.createElement("h3");
  FormTitre.innerText = "Titre";
  FormTitre.classList.add("dropDown", "FormTitre");
  modalAddPhoto.appendChild(FormTitre);
    // #endregion

  // #region formForm (text input)
    let formForm = document.createElement('input');
    formForm.setAttribute('type', 'text');
    formForm.setAttribute('name', 'name');
    formForm.setAttribute('id', 'formText');
    formForm.classList.add("dropDown", "formForm");
    modalAddPhoto.appendChild(formForm);
    // if the title is modified then checkValidatePhoto
    formForm.addEventListener("change", function() {checkValidatePhoto()});
    // #endregion

  // #region dropDownTextCategories (titre)
  let dropDownTextCategories = document.createElement("h3");
  dropDownTextCategories.innerText = "Catégorie";
  dropDownTextCategories.classList.add("dropDown", "dropDownTextCategories");
  modalAddPhoto.appendChild(dropDownTextCategories);
    // #endregion

  // #region dropDownListCategories (category input)
    // create the dropdownlist
    let select = document.createElement('select');
    select.setAttribute('id', 'dropDownListCategories')
    select.classList.add("dropDown", "dropDownListCategories");
    modalAddPhoto.appendChild(select);

    // create options from categories
    let categories = JSON.parse(lsRead("categories", "string"));
    categories.forEach(function(category) {
      let option = document.createElement('option');
      option.value = category.id;
      option.text = category.name;
      select.appendChild(option);
    });

    // create a blank as firstchild and select it
    let option = document.createElement('option');
    option.value = ""; option.text = "";
    select.insertBefore(option, select.firstChild);
    select.selectedIndex = 0;

    // if the category is modified then checkValidatePhoto
    select.addEventListener("change", function() {checkValidatePhoto()});
    // #endregion

  // #region line
    let lineModal = document.createElement("hr");
    lineModal.classList.add("lineModal");
    modalAddPhoto.appendChild(lineModal);
    // #endregion

  // #region button "Valider"
    let buttonValidatePhoto = document.createElement("button");
    buttonValidatePhoto.innerHTML = "Valider";
    buttonValidatePhoto.classList.add("filterButtons","filterButtonsNotValid","buttonAddPhoto");
    modalAddPhoto.appendChild(buttonValidatePhoto);
    buttonValidatePhoto.addEventListener("click", function() {
      if (checkValidatePhoto()) {
        let title = document.getElementById('formText').value;
        let photo = document.getElementById('photo').src;
        let categoryId = Number(document.getElementById('dropDownListCategories').value);
        postWork (title, photo, categoryId)    // post picture to backend
  }
    });
  // #endregion


  }
  export function checkValidatePhoto() {                                               // returns true if work can be submitted (all conditions met)

    let photo = (document.getElementById('photo'));
    let title = (document.getElementById('formText').value !== "");
    let category = (document.getElementById('dropDownListCategories').value !== "")
    let buttonAddPhoto = document.querySelector('.buttonAddPhoto');
    console.log("checking... photo: "+photo+"- title: "+title+" - category: "+category);
    if (photo && title && category) {
      buttonAddPhoto.classList.add("filterButtonsValid");
      buttonAddPhoto.classList.remove("filterButtonsNotValid");
      return true;
    } else if (buttonAddPhoto.classList.contains("filterButtonsValid")) {
      buttonAddPhoto.classList.add("filterButtonsNotValid");
      buttonAddPhoto.classList.remove("filterButtonsValid");
    }
  }
// #endregion

// #region Backend functions postLoginPassword, postWork, deleteWork
  export async function postLoginPassword (email, password) {							// Post login/password
    const backendUsers =			"http://localhost:5678/api/users/login";
    let post = JSON.stringify({ email: email, password: password })
    console.log("----------------------------------------");				 // CNSL
    console.log(post);																							 // CNSL
    fetch(backendUsers, {
      method: "POST",
      headers: {"Content-Type": "application/json",},
      body: post,
    })
    .then(response => response.json())
    .then(data => {
      console.log("data.userId: " + data.userId);										// CNSL
      console.log("data.token: " + data.token);											// CNSL
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
        let activeFilter = lsRead("activeFilter","integer");				 // save activeFilter from localStorage
        let debugMode = lsRead("debugMode","boolean");							 // save debugMode from localStorage
        window.localStorage.clear();																 // clear localStorage
        lsWrite("activeFilter","integer",activeFilter)							 // re-set activeFilter in localStorage
        lsWrite("debugMode","boolean",debugMode)										 // re-set debugMode in localStorage
        lsWrite("logMode","boolean",true)														// logMode = true
        lsWrite("token","string",data.token)												 // set token in localStorage
        lsWrite("userId","integer",data.userId)											// set userId in localStorage //TODO l'enlever si j'en ai pas besoin
        alert("User '"+data.userId+"'... welcome !");															 // CNSL
        window.location.href = "../index.html";}										 // redirect to homepage
      }
    )
  }
  export async function postWork(title, imageSrc, categoryId) {					 // Post a new work
    const backendWorks = "http://localhost:5678/api/works";
    let token = lsRead("token","string")

    // #region Create a new FormData object to store image, title & category
    const formData = new FormData();																			// Create a new FormData object to store image, title & category
    formData.append("title", title);
    formData.append("category", categoryId);
    await fetch(imageSrc)																									// Fetch the image in imageSrc
      .then(response => response.blob())																	// Convert the image data to a Blob
      .then(blob => {formData.append('image', blob, 'image.jpg');					// Append the Blob
      })
    // #endregion

    await fetch(backendWorks, {
      method: "POST",
      headers: {Authorization: "Bearer " + token},
      body: formData,
    })
    .then (response => {
      console.log("postWork response.status: "+response.status);					// CNSL
      if (response.status === 201) {																			// Server updated
        console.log("Projet "+title+" ajouté au serveur");

        let works = JSON.parse(lsRead("works", "string"));								// Retrieve the array from localStorage
        let work = {title:title, imageUrl:imageSrc, categoryId:categoryId};
        works.push(work);																									// Push the new work
        lsWrite("works","string",JSON.stringify(works));									// Save "works" in localStorage

        //update photogallery
        let blackOverlay = document.querySelector(".blackOverlay");
        blackOverlay.remove();
        createModalPhotoGallery();


        lsWrite("reloadServer","boolean", true)														// so that the server is reloaded next time I get back to the homapage
      }
      else if (response.status === 400) {alert("formulaire invalide")}		// CNSL
      else if (response.status === 500) {alert("Erreur serveur")}					// CNSL
      else if (response.status === 401) {alert("Pas d'autorisation")}			// CNSL
      else {alert("Erreur inconnue : "+ response.status)}									// CNSL
    })
  }
  export async function deleteWork(i, id, title) {																	 // Delete a work
    const backendWorks = "http://localhost:5678/api/works";
    const token = lsRead("token","string")
    if (token === null || token === undefined || token === "") {
      alert("Pas connecté")
    } else {
      await fetch(backendWorks + "/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      })
      .then (
        response => {
          console.log("----------------------------------------");				// CNSL
          console.log("deleteWork: n°" + i);																	// CNSL
          console.log("response.status: "+response.status);								// CNSL
          if (response.status === 204) {																	// Token good

            // Now that it's removed from server,
            console.log("effacé du serveur : n°"+i+", id:"+id+" - "+title);	// CNSL

            // let's remove it from local Storage
            let works = JSON.parse(lsRead("works", "string"));						// Retrieve the array from localStorage
            works.splice(i, 1);																					 	// remove 1 element from place #index
            works = JSON.stringify(works)
            lsWrite("works","string",works);															// Store the updated array back in localStorage

            document.querySelector(".photoContainer").remove();					// rebuild photoContainer (to redisplay the works thumbnails)
            PhotoGallery();

  //					reloadServer();																								// so that the server is reloaded next time I get back to the homapage

  //					lsWrite("displaymodalPhotoGallery", "boolean", true);					// so that the modalPhotoGallery is displayed next time I get back to the homapage
  //					window.location.reload();																			// refresh page that will reload also modalPhotoGallery

          }
          else if (response.status === 401) {alert("Pas d'autorisation")} // Token NOT good
          else {alert("Erreur "+response.status)}													// I don't know what's NOT good
        }
      )
    }
  }
// #endregion
