import {lsWrite,lsRead, lsWriteDebugMode} from "./localStorage.js";
import {createModalAddPhoto} from "./modalAddPhoto.js";
import {postWork, deleteWork} from "./backend.js";

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