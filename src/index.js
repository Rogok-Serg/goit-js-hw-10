import fetchCountries from './fetchCountries.js'
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
var debounce = require('lodash.debounce');


const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.getElementById('search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
}

refs.inputEl.addEventListener('input', debounce(onInputValue, DEBOUNCE_DELAY));

function onInputValue() {
  if (refs.inputEl.value.trim() === '') {
    refs.countryListEl.innerHTML = '';
    refs.countryInfoEl.innerHTML = '';
  }
  onShowData ()
}

function onShowData() {
  fetchCountries(refs.inputEl.value.trim())
    .then(data => {
     if (data.length > 10) {
      Notify.info("Too many matches found. Please enter a more specific name.")
    } else if (data.length >= 2 && data.length < 10) {
      createMarkupList(data);      
    } else if (data.length === 1) {
      createMarkupInfo(data);
    } else 
       Notify.failure("Oops, there is no country with that name");     
  })
  .catch(error => Notify.failure("Oops, there is no country with that name")); 
}

function createMarkupList(data) {
  refs.countryInfoEl.innerHTML = '';
  refs.countryListEl.innerHTML = data.reduce((item, { flags, name }) =>
   item + `<li>
        <img src="${flags.svg}" alt="${flags.alt}" class="item-img" width="50">
        <h2>
          ${name.official}
        </h2>
      </li>`, '')
   refs.countryInfoEl.innerHTML = '';
}

function createMarkupInfo(data) {
      refs.countryListEl.innerHTML = '';
  refs.countryInfoEl.innerHTML = data.reduce((item, { name, capital, population, flags, languages }) =>
    item +`
      <ul>
        <li class="item-card">
          <img src="${flags.svg}" alt="${flags.alt}" width="50">
          <h2>${name.official}</h2>
        </li>  
        <li>
            <h3>Capital:</h3>
            <p>${capital}</p>
        </li>
        <li>
            <h3>Population:</h3>
            <p>${population}</p>
        </li>
        <li>
          <h3>Languages:</h3>
          <p>${Object.values(languages)}</p>
        </li>
      </ul>`
    // `<li>
    //     <img src="${flags.svg}" alt="${flags.alt}" class="" width="50">
    //     <h2>
    //       ${name.official}
    //     </h2>
    //     <p>Capital: ${capital}</p>
    //     <p>Population: ${population}</p>
    //     <p>Languages: ${Object.values(languages)}</p>
    //   </li>`
    , '')
  refs.countryListEl.innerHTML = '';
  
}