import {lsWrite,lsRead, lsWriteDebugMode} from "./localStorage.js";
import {createModalPhotoGallery,PhotoGallery} from "./modalPhotoGallery.js";

const backendCategories = "http://localhost:5678/api/categories";

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
