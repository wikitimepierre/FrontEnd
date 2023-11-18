import {lsWrite,lsRead, lsWriteDebugMode} from "./localStorage.js";
import {createModalPhotoGallery} from "./modalPhotoGallery.js";
import {postWork, deleteWork} from "./backend.js";

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
  closeButton.addEventListener("click", function() {blackOverlay.style.display = "none"});
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
  faImage.setAttribute('id', 'photo')
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
    console.log("yes "+fileImage.name); // CNSL
    console.log("yes "+fileImage.path); // CNSL

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
      checkValidatePhoto();
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
  categories.forEach(function(category)
    {console.log(category.name);
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
    console.log("avant PROBLEME"); // CNSL

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
      blackOverlay.remove();
      createModalPhotoGallery();
    }
  });

  console.log("APRES button vaider"); // CNSL
// #endregion

// TODO AEFF
cheatFast();

}


function checkValidatePhoto() {
  let photo = (document.getElementById('photo').style.display === "none");
  let title = (document.getElementById('formText').value !== "");
  let category = (document.getElementById('dropDownListCategories').value !== "")
  console.log("\nphoto: "+photo+"\ntitle: "+title+"\ncategory: "+category);
  let buttonAddPhoto = document.querySelector('.buttonAddPhoto');
  if (photo && title && category) {
    buttonAddPhoto.classList.add("filterButtonsValid");
    buttonAddPhoto.classList.remove("filterButtonsNotValid");
    return true;
  } else if (buttonAddPhoto.classList.contains("filterButtonsValid")) {
  buttonAddPhoto.classList.add("filterButtonsNotValid");
  buttonAddPhoto.classList.remove("filterButtonsValid");
  }
}
function cheatFast() {
  let photo = document.createElement("img");
  photo.setAttribute('id', 'photo')
  photo.classList.add("photo");
  document.createElement("bleFrame").appendChild(photo);

  document.getElementById('photo').src = "./assets/images/testi.png"
  document.getElementById('formText').value = "a";
  document.getElementById('dropDownListCategories').value = 1;
  let title = document.getElementById('formText').value;
  let imageSrc = document.getElementById('photo').src;
  let categoryId = Number(document.getElementById('dropDownListCategories').value);
  console.log("title: "+title+"\nimageSrc: "+imageSrc+"\ncategoryId: "+categoryId); // CNSL
  postWork (title, imageSrc, categoryId)    // post picture to backend
}