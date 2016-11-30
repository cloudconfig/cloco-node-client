"use strict";
const json_encoder_1 = require("./json-encoder");
const string_encoder_1 = require("./string-encoder");
class Encoding {
    /**
     * Returns the correct encoder depending on the config object format.
     * @param  {string}   format The format string.
     * @return {IEncoder}        The encoder.
     */
    static getEncoder(format) {
        switch (format) {
            case "JSON":
                return new json_encoder_1.JsonEncoder();
            default:
                return new string_encoder_1.StringEncoder();
        }
    }
}
exports.Encoding = Encoding;
