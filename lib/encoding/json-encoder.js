"use strict";
/**
 *   json-encoder.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   Encoding to cast objects to JSON.
 */
const logger_1 = require("../logging/logger");
class JsonEncoder {
    /**
     * Encodes the object as JSON.
     */
    encode(obj) {
        logger_1.Logger.log.debug("JsonEncoder.encode: start.");
        return JSON.stringify(obj);
    }
    /**
     * Decodes the string.  Parses as JSON.
     * @type {any}
     */
    decode(encoded) {
        logger_1.Logger.log.debug("JsonEncoder.decode: start.");
        return JSON.parse(encoded);
    }
}
exports.JsonEncoder = JsonEncoder;
