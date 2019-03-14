import { response, Input } from '../atto/io';

export const read = async (input: Input) => {
    return await response({
        handler: 'get',
        ...input
    })
}

export const write =  async (input: Input) => {
    return await response({
        handler: 'post',
        ...input
    })
}
