"use strict";
/**
 *   jwt-decoder.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
const logger_1 = require("./logging/logger");
/**
 *   class JwtDecoder
 *   A class for decoding a JWT.
 */
class JwtDecoder {
    constructor(jwt) {
        this.isValid = true;
        this.jwt = jwt;
        this.decodeToken();
        if (this.isValid) {
            this.readTokenExpirationDate();
        }
        if (this.isValid) {
            this.isTokenExpired();
        }
    }
    /**
     * Indicates whether the bearer token has expired.
     * @param  {string}  token The bearer token.
     * @return {boolean}       A value indicating that the token has expired.
     */
    static bearerTokenExpired(token) {
        logger_1.Logger.log.debug("JwtDecoder.bearerTokenExpired: start");
        logger_1.Logger.log.debug("JwtDecoder.bearerTokenExpired: Checking bearer token for expiry.");
        let decoder = new JwtDecoder(token);
        if (!decoder.isValid) {
            logger_1.Logger.log.error("JwtDecoder.bearerTokenExpired: Bearer token invalid.");
            throw new Error("Bearer token invalid.");
        }
        else {
            logger_1.Logger.log.debug(`JwtDecoder.bearerTokenExpired: Bearer token expiry: ${decoder.isExpired}`);
            return decoder.isExpired;
        }
    }
    /**
     * Decodes the token into the constituent claims.
     */
    decodeToken() {
        logger_1.Logger.log.debug("JwtDecoder.decodeToken: start");
        // check for the jwt
        logger_1.Logger.log.debug("JwtDecoder.decodeToken: Checking that there is a JWT.");
        if (!this.jwt || this.jwt.length === 0) {
            logger_1.Logger.log.error("JwtDecoder.decodeToken: No JWT provided.");
            this.isValid = false;
            return;
        }
        let parts = this.jwt.split(".");
        logger_1.Logger.log.debug("JwtDecoder.decodeToken: Checking that the JWT has 3 parts.");
        if (parts.length !== 3) {
            logger_1.Logger.log.error("JwtDecoder.decodeToken: JWT must have 3 parts. Token invalid.");
            this.isValid = false;
            return;
        }
        // base64 decode the second part of the bearer token to get the JSON string of claims.
        logger_1.Logger.log.debug("JwtDecoder.decodeToken: Decoding the claims.");
        let decodedClaims = new Buffer(parts[1], "base64").toString();
        logger_1.Logger.log.debug("JwtDecoder.decodeToken: The JWT claims: ", { data: decodedClaims });
        // cast the claims as an object.
        try {
            this.claims = JSON.parse(decodedClaims);
        }
        catch (e) {
            logger_1.Logger.log.error(e.message, "JwtDecoder.decodeToken");
            this.isValid = false;
        }
    }
    /**
     * Sets the expiry date based on the expiration in the JWT.
     */
    readTokenExpirationDate() {
        logger_1.Logger.log.debug("JwtDecoder.readTokenExpirationDate: start");
        if (typeof this.claims.exp === "undefined") {
            logger_1.Logger.log.error("JwtDecoder.readTokenExpirationDate: No token expiration date provided.");
            this.isValid = false;
            return;
        }
        // create the expiration date from the value in the JWT.
        try {
            let date = new Date(0); // the 0 here is the key, which sets the date to the epoch
            date.setUTCSeconds(this.claims.exp);
            this.expiryDate = date;
            logger_1.Logger.log.debug(`JwtDecoder.readTokenExpirationDate: Bearer token expiry: ${date}`);
        }
        catch (e) {
            logger_1.Logger.log.error(e.message, "JwtDecoder.readTokenExpirationDate");
            this.isValid = false;
        }
    }
    /**
     * Checks the token for expiry.
     * @param {number} offsetSeconds A number of seconds to use as an offset.
     */
    isTokenExpired(offsetSeconds) {
        logger_1.Logger.log.debug("JwtDecoder.isTokenExpired: start");
        offsetSeconds = offsetSeconds || 0;
        if (this.expiryDate === undefined) {
            return;
        }
        // token expired?
        this.isExpired = !(this.expiryDate.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
    }
}
exports.JwtDecoder = JwtDecoder;
