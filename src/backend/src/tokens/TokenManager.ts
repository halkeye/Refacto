import crypto, { type KeyLike } from 'node:crypto';
import { promisify } from 'node:util';
import jwt from 'jwt-simple';
import type { JsonData } from '../shared/api-entities';

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

type GenerateKeyPairCallback = (err: Error | null, keyPair: KeyPair) => void;

const generateKeyPair = promisify(
  (
    type: string,
    options: Record<string, unknown>,
    callback: GenerateKeyPairCallback,
  ): void =>
    crypto.generateKeyPair(
      type as any,
      options as any,
      (err: Error | null, publicKey: string, privateKey: string) => {
        callback(err, { publicKey, privateKey });
      },
    ),
);

export class TokenManager {
  private readonly secretPassphrase: string;

  private readonly modulusLength = 2048;

  private readonly algorithm = 'RS256';

  public constructor({ secretPassphrase = '' } = {}) {
    this.secretPassphrase = secretPassphrase;
  }

  public generateKeys(): Promise<KeyPair> {
    const secret = this.secretPassphrase;

    return generateKeyPair('rsa', {
      modulusLength: this.modulusLength,
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: secret ? 'aes-256-cbc' : undefined,
        passphrase: secret || undefined,
      },
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
    });
  }

  public signData(
    data: Readonly<JsonData>,
    privateKey: string | Buffer,
  ): string {
    const key = crypto.createPrivateKey({
      key: privateKey,
      format: 'pem',
      passphrase: this.secretPassphrase,
    });
    // https://github.com/hokaccha/node-jwt-simple/pull/98
    return jwt.encode(data, key as any, this.algorithm);
  }

  public readAndVerifySigned(
    token: string,
    publicKey: KeyLike,
  ): JsonData | null {
    try {
      // https://github.com/hokaccha/node-jwt-simple/pull/98
      return jwt.decode(token, publicKey as any, false, this.algorithm);
    } catch (e) {
      return null;
    }
  }
}
