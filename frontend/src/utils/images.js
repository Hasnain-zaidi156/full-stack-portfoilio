/*
  Saari local pictures ek jagah.
  - Pics backend/pictures/ mein rakho, phir frontend mein:  npm run images
    (ye public/images/ mein copy karta hai aur imagesMap.js bana deta hai;
     npm run dev / npm run build se pehle khud bhi chalta hai).

  img('profile')                  -> '/images/profile.jpg'
  img('profile', 'https://...')   -> local pic; key na mile to fallback URL
*/
import { IMAGES } from './imagesMap';

export const img = (key, fallback = '') => IMAGES[key] ?? fallback;

// Loader jaisi jagah par pic pehle se load karne ke liye
export const preload = (key) =>
  new Promise((resolve) => {
    const src = img(key);
    if (!src) return resolve();
    const i = new Image();
    i.onload = i.onerror = resolve;
    i.src = src;
  });
