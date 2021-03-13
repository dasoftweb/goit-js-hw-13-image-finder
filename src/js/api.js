import setting from '../js/settings';
import imagesListTemplate from '../templates/imagesListTemplate.hbs';

const { BASE_URL, API_KEY } = setting;

class ImagesApi {
  #images = [];
  constructor(selector) {
    this.element = document.querySelector(selector);
    this.currentPage = 1;
    this.totalPages = 0;
    this.#images = [];
    this.query = '';
    this.per_page = 12;
  }

  get images() {
    return this.#images;
  }

  set images(imagesList) {
    this.#images = imagesList;
    this.renderImages();
  }

  search(query) {
    if (!query) {
      return;
    }

    if (this.query != query) {
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
    this.images = [...this.images, ...newImages];
  }

  async fetchImages(searchQuery, page) {
    const url = `${BASE_URL}?image_type=photo&orientation=horizontal&q=${searchQuery}&page=${page}&per_page=${this.per_page}&key=${API_KEY}`;
    const response = await fetch(url);
    const images = response.json();
    return images;
  }

  renderImages() {
    this.element.innerHTML = imagesListTemplate(this.images);
  }
}

export default ImagesApi;
