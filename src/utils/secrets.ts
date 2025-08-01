/**
 * @copyright Deepgram
 * @license MIT
 * @author Naomi Carrigan
 */
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { logger } from "./logger.js";
import type { Iris } from "../interfaces/iris.js";

/**
 * Encrypts a secret using AES-256-GCM encryption. Returns
 * the encrypted secret, initialization vector (IV), and authentication tag.
 * @param iris - Iris's instance.
 * @param secret - The secret to encrypt.
 * @returns An object containing the encrypted secret, IV, and tag, or null if encryption fails.
 * @throws Will throw an error if the encryption key is not set in the environment variables.
 */
const encryptSecret = (
  iris: Iris,
  secret: string | undefined,
): { encrypted: string; iv: string; tag: string } | null => {
  if (process.env.ENCRYPTION_KEY === undefined) {
    void logger(
      iris,
      "Encryption key is not set in the environment variables.",
    );
    return null;
  }
  if (secret === undefined || secret === "") {
    void logger(iris, "No secret provided for encryption.");
    return null;
  }
  const buffer = Buffer.from(secret, "utf-8");
  const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
  const iv = randomBytes(16);

  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encryption = Buffer.concat([ cipher.update(buffer), cipher.final() ]);
  const tag = cipher.getAuthTag();
  return {
    encrypted: encryption.toString("hex"),
    iv:        iv.toString("hex"),
    tag:       tag.toString("hex"),
  };
};

/**
 * Decrypts a secret using AES-256-GCM encryption. Returns the decrypted secret or null if decryption fails.
 * @param iris - Iris's instance.
 * @param encryptedSecret - The encrypted secret object containing the encrypted data, IV, and tag.
 * @param encryptedSecret.encrypted - The encrypted data.
 * @param encryptedSecret.iv - The initialization vector (IV).
 * @param encryptedSecret.tag - The authentication tag.
 * @returns The decrypted secret as a string, or null if decryption fails.
 */
const decryptSecret = (
  iris: Iris,
  encryptedSecret: {
    encrypted: string;
    iv:        string;
    tag:       string;
  } | null,
): string | null => {
  if (process.env.ENCRYPTION_KEY === undefined) {
    void logger(
      iris,
      "Encryption key is not set in the environment variables.",
    );
    return null;
  }
  if (encryptedSecret === null) {
    void logger(iris, "No encrypted secret provided for decryption.");
    return null;
  }
  const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
  const iv = Buffer.from(encryptedSecret.iv, "hex");
  const tag = Buffer.from(encryptedSecret.tag, "hex");
  const encryptedData = Buffer.from(encryptedSecret.encrypted, "hex");

  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ]);
  return decrypted.toString("utf-8");
};

export { encryptSecret, decryptSecret };
