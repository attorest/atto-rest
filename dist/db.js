"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const config_1 = __importDefault(require("config"));
exports.pool = new pg_1.Pool(config_1.default.get('db'));
exports.client = new pg_1.Client(config_1.default.get('db'));
