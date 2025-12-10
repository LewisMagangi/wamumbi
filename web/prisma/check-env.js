require('dotenv').config({ path: '.env.local' });
const url = process.env.DATABASE_URL;
console.log('First char:', url?.[0]);
console.log('Last char:', url?.slice(-1));
console.log('Includes quotes:', url?.includes('"'));
console.log('Full value:', url);
