/**
 *   access-token-response.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
/**
 *   Represents an access token response.
 */
export declare class AccessTokenResponse {
    /**
     * The access token in the form of a Jwt.
     * @type {string}
     */
    access_token: string;
    /**
     * The type of token, i.e. Bearer.
     * @type {string}
     */
    token_type: string;
    /**
     * The TTL for the token in seconds.
     * @type {number}
     */
    expires_in: number;
    /**
     * The refresh token associated with the access token.
     * @type {string}
     */
    refresh_token: string;
}
