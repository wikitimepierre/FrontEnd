// #region js files import
import {displayFilterButtonsColors,buildFilteredWorks,displayfilteredWorks} from "./works.js";
import {postWork, deleteWork} from "./backend.js";
import {lsWrite,lsRead, lsWriteDebugMode, testMenu, createTestMenu, createInstaListener, displayInsta, switchTestMenu} from "./localStorage.js";
import {createModalPhotoGallery} from "./modalPhotoGallery.js";
import {createModalAddPhoto} from "./modalAddPhoto.js";

// #endregion
// #region initializeVariables
initializeVariables();
async function initializeVariables() {                                              // fetch "works", read from ls "logMode", "debugMode", "token", "activeFilter"

  // TODO 
// quand on delete ou ajoute un work, on relance la page avec un displaymodalphotogallery = true
// à la fin des appels de fonction on met :
// if displaymodalphotogallery = true then 
// displaymodalphotogallery= false
// call modalphotogallery()
//TODO

  let works = window.localStorage.getItem("works")                                  // fetch  "works" in localStorage "works" string
  if (works === null) {                                                             // works don't exist ? fetch from backend (or it was in the localStorage
    const backendWorks = "http://localhost:5678/api/works";
    const response = await fetch(backendWorks);
    works = await response.json();
    lsWrite("works","string",JSON.stringify(works))
    if (lsRead("works", "string") === null || lsRead("works", "string") === undefined || lsRead("works", "string") === "") {
      alert ("DL NOT OK - works: "+works) // CNSL")
    }
  }

  let categories = lsRead("categories", "string");                                  // Fetch categories in localStorage "categories"
  if (categories === null){                                                         // categories don't exist ? fetch from backend (or it was in the localStorage)
    const response = await fetch(backendCategories);
    categories = await response.json();
    lsWrite("categories","string",JSON.stringify(categories))
    console.log("Downloaded 'categories' into localStorage")       // CNSL
  }

  if (lsRead("debugMode","boolean") === null) {                                     // if debugMode doesn't exist, set debugMode=false + activeFilter=0
    lsWrite("debugMode",false)
    lsWrite("activeFilter","integer","0");
  };
  if (lsRead("logMode","boolean") === null)                                         // if logMode doesn't exist, set it to false
  {lsWrite("logMode","boolean", false);}
}
// TODO what do we do with that ?
await new Promise(resolve => setTimeout(resolve, 1000));                            // wait a second because I've had so freaking many bugs there!
// #endregion

testMenu();                                                                         // debug on/off button (on insta)
displayLoginLogout();                                                               // display login/logout button
createSectionProjets();                                                             // create HTML section "projets"
createFilterButtons();                                                              // create filterButtons
createGallery();                                                                    // create gallery of "projets" (works)

// #region displayLoginLogout
function displayLoginLogout() {                                                     // display login/logout button}
  let loginNav = document.getElementById("loginNav");                               // grab loginNav
  deleteLinksAndListeners(loginNav)                                                 // remove listener & href attribute loginNav

  if (lsRead("logMode","boolean") === true) {                                       // if logMode = true, change to logout + modifyButton + filterbuttons + works
    let loginNav = document.getElementById("loginNav");                             // grab loginNav
    loginNav.innerText = "logout";                                                  // write logout
    loginNav.addEventListener("click",function() {                                  // on click = logout, erase lStorage, logMode= false and reload homepage
      window.localStorage.clear();
      lsWrite("logMode","boolean",false);
      window.location.href = "../index.html";
    });
  } else {
    loginNav.innerText = "login";                                                   // then write login
    loginNav.setAttribute("href", "./html/login.html");                             // set href to login.html
  }
}
function deleteLinksAndListeners(button) {
    let clone = button.cloneNode(true);
    button.parentNode.replaceChild(clone, button);
}
// #endregion
// #region HTML Code
//<section id="sectionProjets">

//  <div class="divProjects">
//    <h2 class="h2MesProjets">Mes Projets</h2>
//    <button id="modifyButton"><i class="fa-regular fa-pen-to-square"></i>Modifier</button>
//  </div>
//  <br><br>

//  <div class="filters">
//    <button class="filterButtons">Tous</button>
//    <button class="filterButtons">Objets</button>
//    <button class="filterButtons">Appartements</button>
//    <button class="filterButtons">Hôtels & restaurants</button>
//  </div>

//  <div class="gallery">
//  </div>
//</section>
// #endregion
// #region createSectionProjets
function createSectionProjets() {
  // "sectionProjets" section element
  let sectionProjets = document.querySelector("#sectionProjets");

    // "divProjets" div element
    let divProjets = document.createElement("div");
    divProjets.className = "divProjets";
    sectionProjets.appendChild(divProjets);
    createH2Element(divProjets);

    // 2 lines
    sectionProjets.appendChild(document.createElement("br")); //TODO verify if I need this
    sectionProjets.appendChild(document.createElement("br")); //TODO verify if I need this

    // "filters" div element
    let filters = document.createElement("div");
    filters.className = "filters";
    sectionProjets.appendChild(filters);

    // "gallery" div element
    let gallery = document.createElement("div");
    gallery.className = "gallery";
    sectionProjets.appendChild(gallery);
}
function createH2Element(divProjets) {                                              // create h2 "Mes projets" + button "Modifier" (if logMode=true)
  // "Mes Projets" h2 element
  let h2 = document.createElement("h2");
  h2.className = "h2MesProjets";
  h2.textContent = "Mes Projets";
  divProjets.appendChild(h2);

  // "Modifier" button element
  let button = document.createElement("button");
  button.className = "modifyButton";
  
  let i = document.createElement("i");
  i.className = "fa-regular fa-pen-to-square";
  button.appendChild(i);

  let span = document.createElement("span");
  span.textContent = " Modifier";
  button.appendChild(span);
  
  if (lsRead("logMode","boolean") === true)
  {button.style.display = "block";}
  else {button.style.display = "none";}
  
  h2.appendChild(button);

  button.addEventListener("click", async function () {
    createModalPhotoGallery();
  });
}
// #endregion
// #region createFilterButtons
function createFilterButtons() {                                                    // filterButtons
  let buttonNames = ["Tous", "Objets", "Appartements", "Hôtels restaurants"];
  let works = lsRead("works","string");
  works = JSON.parse(works);
  
  let filters = document.querySelector(".filters");
  let activeFilter = lsRead("activeFilter","integer");

  for (let i = 0; i < buttonNames.length; i++) {
    let button = document.createElement("button");
    button.textContent = buttonNames[i];

    button.className = "";                                                          // remove all classes
    button.className = "filterButtons";
    if (i === activeFilter) {
      button.classList.add("filterButtonsActive");                                  // add class filterButtonsActive
    }else{
      button.classList.add("filterButtonsInactive");                                // add class filterButtonsInactive
    }
    button.addEventListener("click", async function () {                            // listener on each filterButton 
      let filteredWorks = buildFilteredWorks(i, works);                             // create filteredWorks according to filter
      lsWrite("activeFilter","integer", String(i));
      displayfilteredWorks(filteredWorks);                                          // display this filteredWorks
      displayFilterButtonsColors(i);                                                // change filterbuttons colors
    });
    filters.appendChild(button);
  }
}
// #endregion
// #region createGallery
  function createGallery() {                                                          // gallery
    let works = lsRead("works","string");
    works = JSON.parse(works);
    let gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    for (let i = 0; i < works.length; i++) {
      const figure = document.createElement("figure");                                // <figure>

      const img = document.createElement("img");                                      // <img src="assets/images/abajour-tahina.png" alt="Abajour Tahina">
      img.setAttribute("src", works[i].imageUrl);
      img.setAttribute("alt", works[i].title);

      const figcaption = document.createElement("figcaption");                        // <figcaption>Abajour Tahina</figcaption>
      figcaption.textContent = works[i].title;

      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    }
  }
// #endregion

// #region // TODO List
// xx redirect to homepage automatically if login done (window.location.href = "../index.html";)
// TODO flash the input in red if error in login/pwd
// TODO create modalAddPhoto
// TODO function: delete work in works if user clicks on trash button
// TODO centrer ma page (un espace à gauche, pas à droite)
// TODO remove all console.logs ?
// TODO repasser par tous les modules et verif les modules pas nécessaires à importer et les variables pas utilisées
//HELP ' or " ?

// Reminders for extension todo tree
// TODO
// xx 
// BUG has to be solved
// HELP needs research/help
// CNSL console.log to be removed ?
// IDEA I have an idea I should consider
// #endregion