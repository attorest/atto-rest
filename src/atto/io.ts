import { send } from 'micro';
import qs from 'qs';
import url from 'url';
import { IncomingMessage, ServerResponse } from 'http';

// --------------------------------------------------------------------------
export type Input = { [key: string]: Input | string | number }
export interface ActionType {
    'l': boolean;
    'c': boolean;
    'r': boolean;
    'u': boolean;
    'd': boolean;
    [key: string]: any;
}
export enum Action {
    LIST = 'l',
    CREATE = 'c',
    READ = 'r',
    UPDATE = 'u',
    DELETE = 'd'
};
export type QueryMethod = 'GET' | 'DELETE' | 'OPTION';
export type BodyMethod = 'POST' | 'PUT' | 'PATCH';
export type MethodHandler = 'read' | 'write';
export type Query = {[key: string]: any};
export type Body = {[key: string]: any};
export type Path<T> = { [key: string]: T };
export type Handler = (input: Input, action: Action) => Promise<Data>;
export type RouteHandler = {[key: string]: Handler} | null;
export { IncomingMessage, ServerResponse };
// --------------------------------------------------------------------------
export interface Route {
    query: Query
    body: Body
}
export interface Data {
    code: number;
    status: 'ok' | 'error';
    message: string;
    data?: any;
}

export const QUERY_METHODS: Array<QueryMethod> = ['GET', 'DELETE', 'OPTION'];
export const BODY_METHODS: Array<BodyMethod> = ['POST', 'PUT', 'PATCH'];

export const codec = (input: string | {[key: string]: any}, decode: boolean = true) => {
    try { 
        return (decode) ? JSON.parse(<string>input) : JSON.stringify(<{[key: string]: any}>input)
    } catch (err) {
        return JSON.stringify(<Data>{
            code: decode ? 400 : 500,
            status: 'error',
            message: 'Invalid JSON'
        });
    }
};

const parseMethod = (req: IncomingMessage): MethodHandler => {
    const method = req.method as MethodHandler;
    if (method in QUERY_METHODS) {
        return 'read' as MethodHandler;
    }
    if (method in BODY_METHODS) {
        return 'write' as MethodHandler;
    }
    console.log(method)
    return 'read';
    // throw new Error(`Wtf? We support only these HTTP methods: ${QUERY_METHODS.join(', ') + BODY_METHODS.join(', ')}`)
}
const aUrl = (req: IncomingMessage): url.UrlWithStringQuery | url.Url => url.parse(req.url || '', false, false);
const parseQuery = (req: IncomingMessage): Query => qs.parse(aUrl(req).search || '', { ignoreQueryPrefix: true });
const parsePath = (req: IncomingMessage): string => (aUrl(req).path || '/').split('?').shift() || '/';

const parseBody = async (req: IncomingMessage): Promise<Body> => {
    let result: Body = codec(req, true);
    return result;
}

export const resolver = async (routes: Path<RouteHandler>, req: IncomingMessage): Promise<{ handler: any, input: Input, action: Action }> => {
    routes = {
        '/': {
            read: (input: Input) => response({ message: 'Not found' }, 404),
            write: (input: Input) => response({ message: 'Not found' }, 404),
        },
        '/400': {
            read: (input: Input) => response({ message: 'Input params error' }, 400),
            write: (input: Input) => response({ message: 'Input params error' }, 400),
        },
        '/404': {
            read: (input: Input) => response({ message: 'Not found' }, 404),
            write: (input: Input) => response({ message: 'Not found' }, 404),
        },
        '/500': {
            read: (input: Input) => response({ message: 'Internal Server Error' }, 500),
            write: (input: Input) => response({ message: 'Internal Server Error' }, 500),
        },
        ...routes,
    };
    if (!('/' in routes)) {
        routes['/'] = routes['/404'];
    }
    const default_handlers: RouteHandler = {
        read: (input: Input) => response({input: input, action: 'read'}, 200),
        write: (input: Input) => response({input: input, action: 'write'}, 200),
    };
    const function_name = parseMethod(req);
    const query = parseQuery(req);
    const path = parsePath(req);
    const handler = path in routes ? routes[path] : routes['/404'];
    const body = "";//await parseBody(req);

    const input = {
        ...query,
        test: 'value'
    };
    
    let id = false;
    if ('id' in input) {
        id = input['id'];
        delete input['id'];
    }
    
    let action = 'default';
    if ('action' in input) {
        action = input['action'];
        delete input['action'];
    }

    const conditions: ActionType = {
        'l': (function_name == 'read' && id === false && action in ['default', 'l', 'list', 'all', 'ls']),
        'c': (function_name == 'write' && id === false && action in ['default', 'c', 'create', 'new', 'write', 'w']),
        'r': (function_name == 'read' && id !== false && action in ['default', 'r', 'read', 'get', 'one']),
        'u': (function_name == 'write' && id !== false && action in ['default', 'u', 'update', 'upd']),
        'd': (function_name == 'read' && id !== false && action in ['d', 'del', 'rm', 'delete', 'remove', 'clear']),
    }

    const action_type = Object.keys(conditions).find((v: Action) => conditions[v]);
    if(!action_type) {
        throw new Error('Cannot resolve CRUD action for entity');
    }
    return Promise.resolve({
        handler: (!!handler && function_name in handler) ? handler[function_name] : default_handlers[function_name],
        input: input,
        action: action_type,
    })
}

export const response = async (data: any, http_code: number = 200) => {
    const message = 'message' in data ? data['message']: 'Internal Server Error';
    delete data['message'];
    return await Promise.resolve(<Data>{
        code: http_code,
        status: (http_code >= 200 && http_code < 400) ? 'ok' : 'error',
        message: (http_code >= 200 && http_code < 400) ? 'success' : message,
        data: !!data ? data : null
    });
}
export const end = (res: ServerResponse, data: Data) => {
    if (!res.getHeader('Content-Type')) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    res.statusCode = data.code;
    res.statusMessage = data.message;
    send(res, res.statusCode, codec(data, false));
}
