"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const micro_router_wrapper_1 = __importDefault(require("./micro-router-wrapper"));
const index = __importStar(require("./routes/index"));
const chats = __importStar(require("./routes/chats"));
exports.default = micro_router_wrapper_1.default({
    '/': index,
    '/chat': chats,
    '/template': null,
});
