"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_1 = require("./io");
exports.get = (input) => {
    return io_1.response(Object.assign({ test: 1 }, input));
};
exports.post = (input) => {
    return io_1.response(Object.assign({ test: 1 }, input));
};
