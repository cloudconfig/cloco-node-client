import { IEncryptor } from "./iencryptor";
export declare class PassthroughEncryptor implements IEncryptor {
    /**
     * JSON serializing the input.
     */
    encrypt(data: string): string;
    /**
     * Parses the input as JSON.
     */
    decrypt(encrypted: string): string;
}
