import { response, Handler, Action } from '../atto/io';

export const read: Handler = (input, action) => {
    const model = { id: 1, name: '', type: 'chat', created: '2019-03-05 11:22:43' };
    const responses: { [key: string]: any[] } = {
        [Action.LIST]: [200, [
            { ...model, id: 31, name: 'Chat #31' },
            { ...model, id: 122, name: 'Chat #112' },
            { ...model, id: 94, name: 'Chat #94' }
        ]],
        [Action.READ]: [200, {  ...model, id: input['id'], name: `Chat #${input['id']}` }],
        [Action.DELETE]: [200, 'deleted'],
    };
    const [code, data] = action in responses ? responses[action] : [400, null];
    return response(data, code);
}

export const write: Handler = (input, action) => {
    const responses: { [key: string]: any[] } = {
        [Action.CREATE]: [201, 'created'],
        [Action.UPDATE]: [200, 'updated'],
    };
    const [code, data] = action in responses ? responses[action] : [400, null];
    return response(data, code);
}
