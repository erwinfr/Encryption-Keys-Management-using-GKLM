import CryptoJS from "crypto-js";
let obj = {
  id: "TXN-639743283",
  time: "2024-9-13  7:44:49 PM",
};

let enc = CryptoJS.AES.encrypt(
  JSON.stringify(obj),
  "KEY-086edb0-351b2f4d-87e8-4296-a553-379dfce44967"
);
let data =
  "U2FsdGVkX1+k8quGTjoVTrgb56xnydBGUybX1kx7S6GweXGbCmE8nqfY4Uh6u1CkXjDFFXKPn9iX3EMulC6Mdsjh/m45hX+nCEiFioLrSHhhA81N6lX7KxaywwjRpgD+";
let key = "KEY-086edb0-351b2f4d-87e8-4296-a553-379dfce44967";
let resp = CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
let resp1 = CryptoJS.AES.decrypt(enc, key).toString(CryptoJS.enc.Utf8);

console.log(resp, resp1, enc.toString(), data);
let encJson = CryptoJS.AES.encrypt(JSON.stringify(obj), key).toString();
let encData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encJson));
console.log(encData);

let decData = CryptoJS.enc.Base64.parse(encData).toString(CryptoJS.enc.Utf8);
let bytes = CryptoJS.AES.decrypt(decData, key).toString(CryptoJS.enc.Utf8);
console.log(JSON.parse(bytes));
