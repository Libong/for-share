import CryptoJS from 'crypto-js';
import {PublicKey} from "@/config/localStorage/publicKey";
import forge from 'node-forge';
import {envConfig} from "@/config/env/envConfig";

function extractBase64FromPEM(pemString: string): string {
    const lines = pemString.split('\n');
    const base64Lines = lines.filter(line => !line.startsWith('-----'));
    return base64Lines.join('');
}

/*-----------RSA----------*/
export function encryptRSA(data: string): string {
    // const pubKeyObj = jsrsasign.KEYUTIL.getKey(PublicKey2);
    // if (!(pubKeyObj instanceof jsrsasign.RSAKey)) {
    //     throw new Error('Invalid public key');
    // }
    // return jsrsasign.KJUR.crypto.Cipher.encrypt(data, pubKeyObj, 'RSA');
    // 加密（PKCS#1 v1.5）或 OAEP
    const publicKey = forge.pki.publicKeyFromPem(PublicKey);
    const encrypted = publicKey.encrypt(data, 'RSA-OAEP', {
        md: forge.md.sha256.create(),
        mgf1: forge.mgf.mgf1.create(forge.md.sha256.create())
    });
    return forge.util.encode64(encrypted);
}

async function decryptRSA(encryptedData: string, privateKey: string) {
    const privateKeyArray = new Uint8Array(atob(privateKey).split('').map(char => char.charCodeAt(0)));
    const privateKeyImported = await window.crypto.subtle.importKey(
        'pkcs8',
        privateKeyArray,
        {name: 'RSA-OAEP', hash: 'SHA-256'},
        false,
        ['decrypt']
    );

    const encryptedDataArray = new Uint8Array(atob(encryptedData).split('').map(char => char.charCodeAt(0)));
    const decrypted = await window.crypto.subtle.decrypt(
        {name: 'RSA-OAEP'},
        privateKeyImported,
        encryptedDataArray
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
}

/*-----------AES----------*/

// 生成密钥
export function generateAESKey(): string {
    return CryptoJS.lib.WordArray.random(32).toString(); // 32 字节，对应 AES-256
}

// 生成 IV
function generateIV(): string {
    return CryptoJS.lib.WordArray.random(16).toString(); // 16 字节，对应 128 位
}

// 加密数据AES
export function encryptAES(data: string, key: string): { ciphertext: string; iv: string } {
    const iv = generateIV();
    const keyWordArray = CryptoJS.enc.Hex.parse(key);
    const ivWordArray = CryptoJS.enc.Hex.parse(iv);
    const encrypted = CryptoJS.AES.encrypt(data, keyWordArray, {
        iv: ivWordArray,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return {ciphertext: encrypted.toString(), iv};
}

// 解密数据AES
export function decryptAES(encryptText: string, customKey?: string): string {
    const iv = encryptText.slice(-32);
    const ciphertext = encryptText.slice(0, -32);
    let aesKey: string
    if (customKey) {
        aesKey = customKey;
    } else {
        aesKey = envConfig.CRYPT_KEY
    }
    const keyWordArray = CryptoJS.enc.Hex.parse(aesKey);
    const ivWordArray = CryptoJS.enc.Hex.parse(iv);
    const decrypted = CryptoJS.AES.decrypt(ciphertext, keyWordArray, {
        iv: ivWordArray,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

//TODO 不支持使用window.crypto.subtle.generateKey
// export async function generateKey() {
//     const keyData = JSON.parse(localStorage.getItem(localStorage_cryptKey_label)!);
//     if (keyData) {
//         return;
//     }
//     if (window.crypto && window.crypto.subtle) {
//         console.log('Web Crypto API is supported')
//     } else {
//         return Promise.reject('Web Crypto API is not supported');
//     }
//     const key = await window.crypto.subtle.generateKey(
//         {
//             name: "AES-GCM",
//             length: 256,
//         },
//         true,
//         ["encrypt", "decrypt"]
//     );
//     const webKey = await window.crypto.subtle.exportKey("jwk", key);
//     localStorage.setItem(localStorage_cryptKey_label, JSON.stringify(webKey));
// }
//
// async function loadKey(): Promise<CryptoKey> {
//     const keyData = JSON.parse(localStorage.getItem(localStorage_cryptKey_label)!);
//     return await window.crypto.subtle.importKey(
//         "jwk",
//         keyData,
//         {name: "AES-GCM"},
//         true,
//         ["encrypt", "decrypt"]
//     );
// }
//
// export async function encryptData(data: string): Promise<string> {
//     let encryptedData = ''
//     try {
//         const key = await loadKey();
//         const encoder = new TextEncoder();
//         const dataBuffer = encoder.encode(data);
//         const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 生成随机IV
//         const encrypted = await window.crypto.subtle.encrypt(
//             {
//                 name: 'AES-GCM',
//                 iv: iv,
//             },
//             key,
//             dataBuffer
//         );
//         const combined = new Uint8Array(iv.length + encrypted.byteLength);
//         combined.set(iv, 0);
//         combined.set(new Uint8Array(encrypted), iv.length);
//         encryptedData = btoa(String.fromCharCode(...combined));
//     } catch (error) {
//         console.error('加密失败:', error);
//     }
//     return encryptedData;
// }
//
// // 解密数据
// export async function decryptData(data: string): Promise<string> {
//     let decryptedData = ''
//     try {
//         const key = await loadKey();
//         // 将 Base64 字符串转换为 Uint8Array
//         const combined = new Uint8Array(
//             atob(data).split('').map((char) => char.charCodeAt(0))
//         );
//
//         const iv = combined.slice(0, 12);
//         const encrypted = combined.slice(12);
//
//         const decrypted = await window.crypto.subtle.decrypt(
//             {
//                 name: 'AES-GCM',
//                 iv: iv,
//             },
//             key,
//             encrypted
//         );
//
//         const decoder = new TextDecoder();
//         decryptedData = decoder.decode(decrypted); // 将 Uint8Array 转换为字符串
//     } catch (error) {
//         console.error('解密失败:', error);
//     }
//     return decryptedData;
// }