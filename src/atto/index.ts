import { Path, RouteHandler } from './io';
import { resolver, end } from './io';
import { Route, Data, IncomingMessage, ServerResponse } from './io';
export default function atto(routes: Path<RouteHandler>) {
    return async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
        const { handler, input, action } = await resolver(routes, req);
        const data = await handler(input, action);  
        end(res, data);
    };
}
