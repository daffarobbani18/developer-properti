import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

const ENCRYPTION_KEY = "simdp-encryption-key-v1";

async function deriveKey(secret: string): Promise<string> {
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    secret + ENCRYPTION_KEY,
    { encoding: Crypto.CryptoEncoding.HEX }
  );
  return hash.slice(0, 32);
}

function simpleXorEncrypt(text: string, key: string): string {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result);
}

function simpleXorDecrypt(encrypted: string, key: string): string {
  const decoded = atob(encrypted);
  let result = "";
  for (let i = 0; i < decoded.length; i++) {
    result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

export async function encryptAndStore(key: string, value: string): Promise<void> {
  const encryptionKey = await deriveKey(key);
  const encrypted = simpleXorEncrypt(value, encryptionKey);
  await AsyncStorage.setItem(key, encrypted);
}

export async function retrieveAndDecrypt(key: string): Promise<string | null> {
  const encrypted = await AsyncStorage.getItem(key);
  if (!encrypted) {
    return null;
  }

  try {
    const encryptionKey = await deriveKey(key);
    return simpleXorDecrypt(encrypted, encryptionKey);
  } catch {
    await AsyncStorage.removeItem(key);
    return null;
  }
}

export async function removeFromStorage(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export async function encryptJson<T>(data: T, key: string): Promise<string> {
  const jsonString = JSON.stringify(data);
  const encryptionKey = await deriveKey(key);
  return simpleXorEncrypt(jsonString, encryptionKey);
}

export async function decryptJson<T>(encrypted: string, key: string): Promise<T | null> {
  try {
    const encryptionKey = await deriveKey(key);
    const decrypted = simpleXorDecrypt(encrypted, encryptionKey);
    return JSON.parse(decrypted) as T;
  } catch {
    return null;
  }
}