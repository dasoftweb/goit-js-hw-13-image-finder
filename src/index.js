import './styles.css';
import debounce from 'lodash';
import ImagesApi from './js/api';
import 'material-design-icons/iconfont/material-icons.css';

const imagesSearch = new ImagesApi('.gallery');
const inputRef = document.querySelector('input[name="query"]');
const observerRef = document.querySelector('.gallery-load-observer');
// const loadMoreBtnRef = document.querySelector('#load-more');

inputRef.addEventListener(
  'input',
  _.debounce(() => {
    imagesSearch.search(inputRef.value);
  }, 1000),
);

const observerHandler = _.debounce(() => {
  console.log('Сработал Обс');
  imagesSearch.loadMore();
}, 500);

const observer = new IntersectionObserver(observerHandler);

observer.observe(observerRef);

// loadMoreBtnRef.addEventListener('click', imagesSearch.loadMore);
// imagesSearch.search('kiev') // hardcoded search test
