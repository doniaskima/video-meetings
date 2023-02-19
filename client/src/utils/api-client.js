import { server_url } from './server_url'

function client(endpoint, { body, ...customConfig } = {}) {
    const headers = { 'Content-Type': 'application/json' }
    const config = {
        method: body ? 'POST' : 'GET',
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers,
        },
    }

    if (body) {
        config.body = JSON.stringify(body)
    }

    return window
        .fetch(`${server_url}/api/${endpoint}`, config)
        .then(async(response) => {
            const data = await response.json()
            if (response.ok) {
                return data
            } else {
                return Promise.reject(data)
            }
        })
}

export default client