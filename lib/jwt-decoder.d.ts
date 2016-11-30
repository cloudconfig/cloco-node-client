/**
 *   class JwtDecoder
 *   A class for decoding a JWT.
 */
export declare class JwtDecoder {
    isValid: boolean;
    expiryDate: Date;
    isExpired: boolean;
    claims: any;
    private jwt;
    /**
     * Indicates whether the bearer token has expired.
     * @param  {string}  token The bearer token.
     * @return {boolean}       A value indicating that the token has expired.
     */
    static bearerTokenExpired(token: string): boolean;
    constructor(jwt: string);
    /**
     * Decodes the token into the constituent claims.
     */
    private decodeToken();
    /**
     * Sets the expiry date based on the expiration in the JWT.
     */
    private readTokenExpirationDate();
    /**
     * Checks the token for expiry.
     * @param {number} offsetSeconds A number of seconds to use as an offset.
     */
    private isTokenExpired(offsetSeconds?);
}
