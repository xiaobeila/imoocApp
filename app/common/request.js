'use stricct'

import queryString from 'query-string';
import _ from 'lodash';
import config from './config';

const request = {};

request.get = function (url, params) {
    let options = _.extend({
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        format: 'json'
    }, params)

    url += '?' + queryString.stringify(options)

    return fetch(url, options)
        .then((response) => response.json())
}

request.post = function (url, body) {
    let options = _.extend(config.postHeader, {
        body: JSON.stringify(body)
    })

    return fetch(url, options)
        .then((response) => response.json())
}

module.exports = request;