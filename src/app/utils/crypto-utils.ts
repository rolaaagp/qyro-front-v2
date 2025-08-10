import CryptoJS from 'crypto-js';

const secret = 'kZ8pA7mXw2NeYq9JrBdLuV6tGcQ1Hs3f';
const key = CryptoJS.enc.Utf8.parse(secret);
const iv = CryptoJS.enc.Utf8.parse(secret.substring(0, 16));

export function encrypt(text: string): string {
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

export function decrypt(encryptedText: string): string {
  const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
