/**
 *   jwt-generator.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
import * as JsonWebToken from "jsonwebtoken";

/**
 *   class JwtGenerator
 *   Generates signed Jwts.
 */
export class JwtGenerator {

    // the algorithm used to sign the Jwt.
    public algorithm: string = "HS256";

    // the secret used to sign the Jwt.
    public secret: string = "jwt-signing-secret-for-testing";

    // the issuer of the Jwt.
    public issuer: string = "https://api.cloco.io/v1/cloco-node-client/testing";

    /**
     * The number of minutes before the token expires.
     * @type {number}
     */
    public expiresInMinutes: number = 60;

    /**
     * generates a Jwt from the user context, wrapped in an Access Token Response.
     * @param  {string}          accountIdentifier The account identifier.
     * @param  {string}          username          The username.
     * @return {Promise<string>}                   A promise of the jwt.
     */
    public generateJwt(accountIdentifier: string, username: string): Promise<string> {

        // define the function wrapping the promise which will be returned.
        let promiseFunction: (
            resolve: (value: string) => void,
            reject: (reason: Error) => void) => void
            = (
                resolve: (value: string) => void,
                reject: (reason: Error) => void): void => {

                // set the signing options.
                let signOptions: JsonWebToken.SignOptions = {
                    algorithm: this.algorithm,
                    expiresIn: this.expiresInMinutes + "m",
                };

                // create and sign the jwt.
                JsonWebToken.sign(
                    this.getClaims(accountIdentifier, username, this.issuer), this.secret, signOptions,
                    function(err: Error, token: string): void {
                        if (err) {
                            // failed to sign reject the error to the middleware.
                            reject(err);
                        } else {
                            // resolve the bearer token response to the caller.
                            resolve(token);
                        }
                    });
            };

        return new Promise(promiseFunction);
    }

    /**
     * gets the claims using the supplied user context.
     * @param  {string} accountIdentifier The account identifier.
     * @param  {string} username          The username.
     * @param  {string} issuer            The issuer.
     * @return {any}                      The claims.
     */
    private getClaims(accountIdentifier: string, username: string, issuer: string): any {
        // create the claims from the user context.
        let claims: any = {};

        // assign the unique id for the account identifier.
        claims.sub = accountIdentifier;
        claims.username = username;

        // set the issuer.
        claims.iss = issuer;

        return claims;
    }
}
