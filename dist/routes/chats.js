"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_1 = require("../io");
exports.read = (input) => {
    return io_1.response(Object.assign({ test: 'get' }, input));
};
exports.write = (input) => {
    return io_1.response(Object.assign({ test: 'post' }, input));
};
