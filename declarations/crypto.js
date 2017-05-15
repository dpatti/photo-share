// TODO: This exists due to the fact that the built-in flow declarations are
// missing timingSafeEqual as of 0.45, and there is no way to add to a module
// that has been declared already.

declare module "crypto" {
  declare function timingSafeEqual(a: Buffer, b: Buffer): boolean;

  declare var DEFAULT_ENCODING: string;

  declare class Sign extends crypto$Sign {}
  declare class Verify extends crypto$Verify {}

  declare function createCipher(algorithm: string, password: string | Buffer): crypto$Cipher;
  declare function createCipheriv(
    algorithm: string,
    key: string | Buffer,
    iv: string | Buffer
  ): crypto$Cipher;
  declare function createCredentials(
    details?: crypto$createCredentialsDetails
  ): crypto$Credentials
  declare function createDecipher(algorithm: string, password: string | Buffer): crypto$Decipher;
  declare function createDecipheriv(
    algorithm: string,
    key: string | Buffer,
    iv: string | Buffer
  ): crypto$Decipher;
  declare function createDiffieHellman(prime_length: number): crypto$DiffieHellman;
  declare function createDiffieHellman(prime: number, encoding?: string): crypto$DiffieHellman;
  declare function createHash(algorithm: string): crypto$Hash;
  declare function createHmac(algorithm: string, key: string | Buffer): crypto$Hmac;
  declare function createSign(algorithm: string): crypto$Sign;
  declare function createVerify(algorithm: string): crypto$Verify;
  declare function getCiphers(): Array<string>;
  declare function getDiffieHellman(group_name: string): crypto$DiffieHellman;
  declare function getHashes(): Array<string>;
  declare function pbkdf2(
    password: string | Buffer,
    salt: string | Buffer,
    iterations: number,
    keylen: number,
    digestOrCallback: string | ((err: ?Error, derivedKey: Buffer) => void),
    callback?: (err: ?Error, derivedKey: Buffer) => void
  ): void;
  declare function pbkdf2Sync(
    password: string | Buffer,
    salt: string | Buffer,
    iterations: number,
    keylen: number,
    digest?: string
  ): Buffer;
  // `UNUSED` argument strictly enforces arity to enable overloading this
  // function with 1-arg and 2-arg variants.
  declare function pseudoRandomBytes(size: number, UNUSED: void): Buffer;
  declare function pseudoRandomBytes(
    size: number,
    callback: (err: ?Error, buffer: Buffer) => void
  ): void;
  // `UNUSED` argument strictly enforces arity to enable overloading this
  // function with 1-arg and 2-arg variants.
  declare function randomBytes(size: number, UNUSED: void): Buffer;
  declare function randomBytes(
    size: number,
    callback: (err: ?Error, buffer: Buffer) => void
  ): void;
}
