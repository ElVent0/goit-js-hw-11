import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const KEY = '15486639-fb36d9e164edb7a2c5eb45855';

export default async function fetchImages(input, page, perPage) {
  const completeUrl = `?key=${KEY}&q=${input}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
  const response = await axios.get(completeUrl);
  return response;
}
