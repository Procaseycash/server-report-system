const {env: ENV} = process;
const fetch = require('cross-fetch');
const {Utils} = require('../utils');
const messages = require('../configs/messages');

const processRequest = async (method = 'POST', url = '', body = {}) => {
   try {
       let secrets = require('../configs/secrets');
       let isTokenExpires = Utils.isTokenExpires();
       if (isTokenExpires) {
           secrets = await ApiHandlerService.getAccessToken();  // this is to generate a new refresh token to use for the next request.
           isTokenExpires = false; // set to false since there is now new token to use.
       }
       const accessToken = url.includes('oauth/token') ? null : secrets.access_token;
       const authorization = !isTokenExpires && accessToken ? `${secrets.token_type} ${accessToken}` : null;
       const config = {
           method: method,
           headers: {
               'Content-Type': 'application/json',
               Accept: 'application/json',
           },
           redirect: 'follow', // manual, *follow, error
           referrerPolicy: 'no-referrer',
       };
       if (authorization) {
           config.headers.Authorization = authorization;
       }
       if (!['GET', 'DELETE'].includes(method)) {
           config.body = JSON.stringify(body);
           console.log('body=', body);
       }
       const res = await fetch(url, config);
       const result = await res.json();
       if (res.status >= 400) {
           throw new Error(result.message);
       }
       return result;
   } catch ( e ) {
       console.log('E=', e.message);
       throw new Error(e.message);
   }
};


class ApiHandlerService {
    static countTrial = 0;
    static async get(url) {
       return processRequest('GET', url);
    }

    static async delete(url) {
        return processRequest('DELETE', url);
    }

    static async put(url, data) {
        return processRequest('PUT', url, data);
    }

    static async post(url, data) {
        return processRequest('POST', url, data);
    }

    static async patch(url, data) {
        return processRequest('PATCH', url, data);
    }

    static async getAccessToken() {
        try {
            const data = {
                grant_type: 'client_credentials',
                client_id: 'coding_test',
                client_secret: ENV.APP_CLIENT_SECRET
            };
            const res = await this.post( ENV.AUTH_API, data );
            console.log('res=', res);
            return res;
        } catch ( e ) {
            if (this.countTrial > 3) {
                this.countTrial = 0;
                throw new Error(messages.accessTokenError);
            }
            this.countTrial++;
            return this.getAccessToken();
        }
    }
}

module.exports = ApiHandlerService;
