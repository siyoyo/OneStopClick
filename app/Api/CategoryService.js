'use strict';

const APIManager = require('./APIManager');
const ErrorMessages = require('../Util/ErrorMessages');
const _ = require("underscore");
const Rx = require('rx');
const UserStore = require('../Store/UserStore');

const CategoryService = Object.assign({}, APIManager, {

    getIndex: function () {
        var url = this.constructUrl('api/category');
        const options = this.setupOptionsAuth("get");
        return fetch(url, options)
            .then(this.checkResponse)
            .then(this.json)
            .catch(response => {
                return Promise.reject(ErrorMessages.serverError);
            });
    },
});

module.exports = CategoryService;