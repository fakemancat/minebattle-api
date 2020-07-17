import fetch from 'node-fetch';

import { IGeneralApiParams } from '../declarations';

export async function request(url: string, params: IGeneralApiParams) {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params),
        method: 'POST'
    });

    return response.json();
}