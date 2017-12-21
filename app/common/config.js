'use strict'

module.exports = {
    postHeaders: {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    },
    api: {
        base: 'http://www.missxiaolin.com/',
        getDiscList: 'api/getDiscList',
        getSongList: 'api/getSongList'
    }
}