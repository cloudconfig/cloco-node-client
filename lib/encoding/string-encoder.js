"use strict";
/**
 *   string-encoder.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   Encoding for strings.
 */
const logger_1 = require("../logging/logger");
class StringEncoder {
    /**
     * Encodes the object assuming it can be cast to a string.
     */
    encode(obj) {
        logger_1.Logger.log.debug("StringEncoder.encode: start.");
        return obj.toString();
    }
    /**
     * Decodes the string.  Passthrough.
     * @type {any}
     */
    decode(encoded) {
        logger_1.Logger.log.debug("StringEncoder.decode: start.");
        return encoded;
    }
}
exports.StringEncoder = StringEncoder;
