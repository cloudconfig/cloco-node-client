/**
 *   access-token-response.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */

/**
 *   Represents an access token response.
 */
export class AccessTokenResponse {
    // the linter warnings are disabled as these names are OAuth2 specification defined.

    /**
     * The access token in the form of a Jwt.
     * @type {string}
     */
    // tslint:disable-next-line:variable-name
    public access_token: string;

    /**
     * The type of token, i.e. Bearer.
     * @type {string}
     */
    // tslint:disable-next-line:variable-name
    public token_type: string;

    /**
     * The TTL for the token in seconds.
     * @type {number}
     */
    // tslint:disable-next-line:variable-name
    public expires_in: number;

    /**
     * The refresh token associated with the access token.
     * @type {string}
     */
    // tslint:disable-next-line:variable-name
    public refresh_token: string;
}
