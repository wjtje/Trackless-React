export const serverUrl = 'http://localhost:55565';
export const apiKey = localStorage.getItem('apiKey');
export const auth = {
  headers: {
    Authorization: `Bearer ${apiKey}`
  }
}