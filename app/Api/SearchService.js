'use strict';

const APIManager = require('./APIManager');
const ErrorMessages = require('../Util/ErrorMessages');
const _ = require("underscore");
const Rx = require('rx');

const SearchService = Object.assign({}, APIManager, {
    searchProduct: function (categoryId, searchText) {
        var url = this.constructUrl('search?category_id=') + categoryId + '&keywords=' + searchText;
        const options = this.setupOptionsAuth("get");
        return fetch(url, options)
            .then(this.checkResponse)
            .then(this.json)
            .catch(response => {
                return Promise.reject(ErrorMessages.serverError);
            });
    }
});

module.exports = SearchService;