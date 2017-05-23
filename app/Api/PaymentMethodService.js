'use strict';

const APIManager = require('./APIManager');
const ErrorMessages = require('../Util/ErrorMessages');
const _ = require("underscore");
const Rx = require('rx');

const PaymentMethodService = Object.assign({}, APIManager, {
    getIndex: function () {
        var url = this.constructUrl('api/paymentmethod');
        const options = this.setupOptionsAuth("get");
        return fetch(url, options)
            .then(this.checkResponse)
            .then(this.json)
            .catch(response => {
                return Promise.reject(ErrorMessages.serverError);
            });
    }
});

module.exports = PaymentMethodService;