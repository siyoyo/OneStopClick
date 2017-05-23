'use strict';

const APIManager = require('./APIManager');
const ErrorMessages = require('../Util/ErrorMessages');
const _ = require("underscore");
const Rx = require('rx');

const HomeService = Object.assign({}, APIManager, {
    getIndex: function () {
        var url = this.constructUrl('home/products');
        const options = this.setupOptionsAuth("get");
        return fetch(url, options)
            .then(this.checkResponse)
            .then(this.json)
            .catch(response => {
                return Promise.reject(ErrorMessages.serverError);
            });
    },

    getCategoryProducts: function (categoryId, pageNumber) {
        var url = this.constructUrl('home/category/') + categoryId + '/' + pageNumber;
        const options = this.setupOptionsAuth("get");
        return fetch(url, options)
            .then(this.checkResponse)
            .then(this.json)
            .catch(response => {
                return Promise.reject(ErrorMessages.serverError);
            });
    }
});

module.exports = HomeService;