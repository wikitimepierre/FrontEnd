import {lsWrite,lsRead, lsWriteDebugMode} from "./localStorage.js";

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