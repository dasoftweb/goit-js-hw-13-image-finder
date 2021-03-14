import setting from '../js/settings';
import imagesListTemplate from '../templates/imagesListTemplate.hbs';

const { BASE_URL, API_KEY } = setting;

class ImagesApi {
  #images = [];
  constructor(selector) {
    this.galleryRef = document.querySelector(selector);
    this.lightboxRef = document.querySelector('.js-lightbox');
    this.lightboxImageRef = document.querySelector('.lightbox__image');
    this.lightboxOverlayRef = document.querySelector('.lightbox__overlay');
    this.lightboxCloseRef = document.querySelector(
      'button[data-action="close-lightbox"]',
    );
    this.currentPage = 1;
    this.totalPages = 0;
    this.#images = [];
    this.query = '';
    this.per_page = 12;
    this.loadMore = this.loadMore.bind(this);
  }

  get images() {
    return this.#images;
  }

  set images(imagesList) {
    this.#images = imagesList;
    this.renderImages();
    // render lightbox stuff
    this.galleryRef.addEventListener('click', this.onGalleryClick.bind(this));
    this.lightboxOverlayRef.addEventListener(
      'click',
      this.closeModal.bind(this),
    );
    this.lightboxCloseRef.addEventListener('click', this.closeModal.bind(this));
  }

  onGalleryClick(event) {
    event.preventDefault();
    if (event.target.nodeName !== 'IMG') {
      return;
    }
    console.log('Click on gallery');
    const imageRef = event.target;
    const largeImageURL = imageRef.dataset.source;
    const largeImageALT = imageRef.alt;
    console.log(largeImageURL);
    this.setLightboxImage(largeImageURL, largeImageALT);
    this.openModal();
  }

  openModal() {
    this.lightboxRef.classList.add('is-open');
  }

  closeModal() {
    this.lightboxRef.classList.remove('is-open');
    this.removeLightboxImage();
  }

  setLightboxImage(url, alt) {
    this.lightboxImageRef.src = url;
    this.lightboxImageRef.alt = alt;
  }

  removeLightboxImage() {
    this.lightboxImageRef.src = '';
    this.lightboxImageRef.alt = '';
  }

  search(query) {
    if (!query) {
      return; //no query
    }

    if (this.query != query) {
      //new quert = reset contants
      this.query = query;
      this.currentPage = 1;
      this.totalPages = 0;
    }
    console.log(`NEW QUERY`);
    console.log(`Load Page: ${this.currentPage}`);

    this.fetchImages(query, this.currentPage).then(results => {
      this.images = results.hits;
      this.totalPages = results.totalHits / this.per_page;
      //   console.log(results);
      //   console.log(this.totalPages);
    });
  }

  loadMore() {
    if (!this.query) {
      return;
    }

    if (this.totalPages <= this.currentPage) {
      return;
    }

    this.currentPage += 1;
    console.log(`Load Page: ${this.currentPage}`);

    this.fetchImages(this.query, this.currentPage).then(results => {
      this.addImages(results.hits);
    });
  }

  addImages(newImages) {
    // add new images to old images
    this.images = [...this.images, ...newImages];
  }

  async fetchImages(searchQuery, page) {
    const url = `${BASE_URL}?image_type=photo&orientation=horizontal&q=${searchQuery}&page=${page}&per_page=${this.per_page}&key=${API_KEY}`;
    const response = await fetch(url);
    const images = response.json();
    return images;
  }

  renderImages() {
    this.galleryRef.innerHTML = imagesListTemplate(this.images);
  }
}

export default ImagesApi;
