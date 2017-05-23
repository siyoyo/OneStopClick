'use strict';

const APIManager = require('./APIManager');
const ErrorMessages = require('../Util/ErrorMessages');
const _ = require("underscore");
const Rx = require('rx');

const RegistrationService = Object.assign({}, APIManager, {
    register: function (query) {
        var url = this.constructUrl('api/auth/register');
        const options = this.setupOptions("post", query);
        return fetch(url, options)
            .then(this.checkResponse)
            .then(this.json)
            .catch(response => {
                return Promise.reject(ErrorMessages.serverError);
            });
    }

});

module.exports = RegistrationService;