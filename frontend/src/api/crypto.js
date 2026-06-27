import CryptoJS from "crypto-js";
 
const SHA_KEY = import.meta.env.VITE_SHA_KEY;
 
const IV_KEY = import.meta.env.VITE_IV_KEY;
 
const key = CryptoJS.enc.Utf8.parse(SHA_KEY);
const iv = CryptoJS.enc.Utf8.parse(IV_KEY);
 
export const encryptData = (data) => {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
 
  return {
    data: encrypted,
  };
};
 
export const decryptData = (encrypted) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
 
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
 
    return JSON.parse(decrypted);
  } catch (err) {
    console.log("Decrypt error", err);
 
    return encrypted;
  }
};
 
 