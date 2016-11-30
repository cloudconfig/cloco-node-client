/**
 *   token-request.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
/**
 *   Represents an access token request.
 */
export declare class TokenRequest {
    /**
     * The type of grant, i.e. refresh_token.
     * @type {string}
     */
    grant_type: string;
    /**
     * The auth code.
     * @type {string}
     */
    code: string;
    /**
     * The client identifier making the request (ties a refresh token to a client).
     * @type {string}
     */
    client_id: string;
    /**
     * The refresh token associated with the access token.
     * @type {string}
     */
    refresh_token: string;
    /**
     * The scope associated with the request.
     * @type {any}
     */
    scope: any;
}
