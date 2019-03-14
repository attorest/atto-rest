"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qs_1 = __importDefault(require("qs"));
const url_1 = __importDefault(require("url"));
function parseRequestQuery(req) {
    return qs_1.default.parse(url_1.default.parse(req.url || '').search || '', { ignoreQueryPrefix: true });
}
exports.parseRequestQuery = parseRequestQuery;
exports.default = parseRequestQuery;
