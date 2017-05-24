'use strict';

const APIManager = require('./APIManager');
const ErrorMessages = require('../Util/ErrorMessages');
const _ = require("underscore");
const Rx = require('rx');

const ProductService = Object.assign({}, APIManager, {
    getIndex: function () {
        var url = this.constructUrl('api/product');
        const options = this.setupOptionsAuth("get");
        return fetch(url, options)
            .then(this.checkResponse)
            .then(this.json)
            .catch(response => {
                return Promise.reject(ErrorMessages.serverError);
            });
    },

    getDetails: function (productId) {
        var url = this.constructUrl('api/product/details/') + productId;
        const options = this.setupOptionsAuth("get");
        return fetch(url, options)
            .then(this.checkResponse)
            .then(this.json)
            .catch(response => {
                return Promise.reject(ErrorMessages.serverError);
            });
    }
});

module.exports = ProductService;