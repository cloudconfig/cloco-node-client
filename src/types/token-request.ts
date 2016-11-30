/**
 *   token-request.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */

/**
 *   Represents an access token request.
 */
export class TokenRequest {
    // the linter warnings are disabled as these names are OAuth2 specification defined.

    /**
     * The type of grant, i.e. refresh_token.
     * @type {string}
     */
    // tslint:disable-next-line:variable-name
    public grant_type: string;

    /**
     * The auth code.
     * @type {string}
     */
    // tslint:disable-next-line:variable-name
    public code: string;

    /**
     * The client identifier making the request (ties a refresh token to a client).
     * @type {string}
     */
    // tslint:disable-next-line:variable-name
    public client_id: string;

    /**
     * The refresh token associated with the access token.
     * @type {string}
     */
    // tslint:disable-next-line:variable-name
    public refresh_token: string;

    /**
     * The scope associated with the request.
     * @type {any}
     */
    public scope: any;
}
