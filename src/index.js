import './css/styles.css';
import fetchImages from './fetchImages';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
let simpleLightBox;

const formEL = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery__container');
const buttonMoreEl = document.querySelector('.button-more');

formEL.addEventListener('submit', onformEL);
buttonMoreEl.addEventListener('click', onButtonMoreEl);

let page = 1;
let input = '';

function onformEL(e) {
  e.preventDefault();

  page = 1;
  input = e.currentTarget.searchQuery.value.trim();
  galleryEl.innerHTML = '';
  if (input === '') {
    Notiflix.Notify.warning('Please, enter something');
    return;
  }
  fetchImages(input, page)
    .then(({ data }) => {
      console.log(data);
      if (data.totalHits === 0) {
        Notiflix.Notify.warning(
          'Sorry, there are no images matching your search input. Please try again'
        );
        buttonMoreEl.classList.add('hidden');
      } else {
        renderItems(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        if (data.totalHits > 40) {
          buttonMoreEl.classList.remove('hidden');
        }
      }
    })
    .catch(() => console.log('Щось не так'));
}

function onButtonMoreEl() {
  page += 1;
  fetchImages(input, page)
    .then(({ data }) => {
      renderItems(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();
      if (page * 40 > data.totalHits) {
        buttonMoreEl.classList.add('hidden');
        Notiflix.Notify.warning(
          'Sorry, but there`s no other search results for now.'
        );
      }
    })
    .catch(() => console.log('Щось не так'));
}

function renderItems(images) {
  const markUp = images
    .map(
      ({
        id,
        likes,
        views,
        comments,
        downloads,
        tags,
        webformatURL,
        largeImageURL,
      }) => {
        return `
        <a class="link" href="${largeImageURL}">
        <div class="photo-card" id="${id}">
        <img class="image" src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes: </b>${likes}
          </p>
          <p class="info-item">
            <b>Views: </b>${views}
          </p>
          <p class="info-item">
            <b>Comments: </b>${comments}
          </p>
          <p class="info-item">
            <b>Downloads: </b>${downloads}
          </p>
        </div>
      </div>
          `;
      }
    )
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', markUp);
}
