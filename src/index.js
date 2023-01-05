import './css/styles.css';
import { fetchCountries } from "./fetchCountries";
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';


const DEBOUNCE_DELAY = 300;
const search = document.querySelector("#search-box");
const countryList = document.querySelector(".country-list")
const counrtyInfo = document.querySelector(".country-info");


search.addEventListener("input", debounce(onSearchInput, DEBOUNCE_DELAY));

function onSearchInput(evt) {
    const inputValue = evt.target.value.trim();
    if (!inputValue) { 
        counrtyInfo.innerHTML = null;
        countryList.innerHTML = null;
        return;
    }
     fetchCountries(inputValue).then(data => {
            createMarkup(data)
     })
         .catch(err => {counrtyInfo.innerHTML = null;
        countryList.innerHTML = null;
             return Notify.failure("Oops, there is no country with that name")
             
         });
}


function createMarkup(arr) {
    if (arr.length > 10) { Notify.info("Too many matches found. Please enter a more specific name.") }
    else if (arr.length > 1) {
        const markupList = arr.map(({ flags, name }) => 
            `<li class = "name-wrapper">
                <img src="${flags.svg}" alt="Flag of ${name.official}">
                <h3>${name.official}</h3>
            </li>`
        ).join('')
        countryList.innerHTML = markupList;
        counrtyInfo.innerHTML = null;
    }
    else {
        const markupInfo = arr.map(({ flags, name, capital, languages, population }) => 
    `<div class = "name-wrapper">
        <img src=${flags.svg} alt="Flag of ${name.official}">
<h3 class = "name">${name.official}</h3>
</div>
<ul>
  <li><p><span class = "info-title">Capital:</span> ${capital[0]}</p></li>
  <li><p><span class = "info-title">Population:</span> ${population}</p></li>
  <li><p><span class = "info-title">Languages:</span> ${Object.values(languages)}</p></li>
</ul>`
    ).join("");
        counrtyInfo.innerHTML = markupInfo;
        countryList.innerHTML = null;
    }
    }