"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const micro_1 = require("micro");
const qs_1 = __importDefault(require("qs"));
const url_1 = __importDefault(require("url"));
const http_1 = require("http");
exports.IncomingMessage = http_1.IncomingMessage;
exports.ServerResponse = http_1.ServerResponse;
exports.QUERY_METHODS = ['GET', 'DELETE', 'OPTION'];
exports.BODY_METHODS = ['POST', 'PUT', 'PATCH'];
exports.codec = (input, decode = true) => {
    try {
        return (decode) ? JSON.parse(input) : JSON.stringify(input);
    }
    catch (err) {
        return JSON.stringify({
            code: decode ? 400 : 500,
            status: 'error',
            message: 'Invalid JSON'
        });
    }
};
const parseMethod = (req) => {
    const method = req.method;
    if (method in exports.QUERY_METHODS) {
        return 'read';
    }
    if (method in exports.BODY_METHODS) {
        return 'write';
    }
    console.log(method);
    return 'read';
    // throw new Error(`Wtf? We support only these HTTP methods: ${QUERY_METHODS.join(', ') + BODY_METHODS.join(', ')}`)
};
const aUrl = (req) => url_1.default.parse(req.url || '', false, false);
const parseQuery = (req) => qs_1.default.parse(aUrl(req).search || '', { ignoreQueryPrefix: true });
const parsePath = (req) => (aUrl(req).path || '/').split('?').shift() || '/';
const parseBody = (req) => __awaiter(this, void 0, void 0, function* () {
    let result = exports.codec(req, true);
    return result;
});
exports.resolver = (routes, req) => __awaiter(this, void 0, void 0, function* () {
    routes = Object.assign({ '/': {
            read: (input) => exports.response({ message: 'Not found' }, 404),
            write: (input) => exports.response({ message: 'Not found' }, 404),
        }, '/400': {
            read: (input) => exports.response({ message: 'Input params error' }, 400),
            write: (input) => exports.response({ message: 'Input params error' }, 400),
        }, '/404': {
            read: (input) => exports.response({ message: 'Not found' }, 404),
            write: (input) => exports.response({ message: 'Not found' }, 404),
        }, '/500': {
            read: (input) => exports.response({ message: 'Internal Server Error' }, 500),
            write: (input) => exports.response({ message: 'Internal Server Error' }, 500),
        } }, routes);
    if (!('/' in routes)) {
        routes['/'] = routes['/404'];
    }
    const default_handlers = {
        read: (input) => exports.response({ input: input, action: 'read' }, 200),
        write: (input) => exports.response({ input: input, action: 'write' }, 200),
    };
    const function_name = parseMethod(req);
    const query = parseQuery(req);
    const path = parsePath(req);
    console.log(path);
    const handler = path in routes ? routes[path] : routes['/404'];
    const body = ""; //await parseBody(req);
    const input = Object.assign({}, query, { testparam: 'testvalue' });
    return Promise.resolve({
        handler: (!!handler && function_name in handler) ? handler[function_name] : default_handlers[function_name],
        input: input,
    });
});
exports.response = (data, http_code = 200) => __awaiter(this, void 0, void 0, function* () {
    const message = 'message' in data ? data['message'] : 'Internal Server Error';
    delete data['message'];
    return yield Promise.resolve({
        code: http_code,
        status: (http_code >= 200 && http_code < 400) ? 'ok' : 'error',
        message: (http_code >= 200 && http_code < 400) ? 'success' : message,
        data: !!data ? data : null
    });
});
exports.end = (res, data) => {
    if (!res.getHeader('Content-Type')) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    res.statusCode = data.code;
    res.statusMessage = data.message;
    micro_1.send(res, res.statusCode, exports.codec(data, false));
};
