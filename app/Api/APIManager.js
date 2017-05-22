'use strict';

const Config = require('../config');

const APIManager = {
	constructUrl: function(endpoint) {
		const baseUrl = Config.url;
		return (baseUrl + endpoint);
	},

	checkResponse: function(response) {
		if (response.ok) {
			return Promise.resolve(response);
		} else {
			return Promise.reject(response);
		}
	},

	json: function(response) {
		return response.json();
	},

	setupOptions: function(method, body) {
		const header = new Headers();
		header.append('Content-Type', 'application/json');

		var options = {
			method: method,
			headers: header
		};

		if (body) {
			options.body = JSON.stringify(body);
		}

		return options;
	},

	addQueries: function(url, urlParameters) {
		url = url + '?';
		for (var key in urlParameters) {
			if (urlParameters.hasOwnProperty(key)) {
				url = (url + key + '=' + urlParameters[key] + '&');
			}
		}
		url = url.substring(0, url.length - 1); //Remove last '&'
		return url;
	},

	getXMLrequest: function(method, url) {
		const request = new XMLHttpRequest();
		request.open(method, url);
		request.setRequestHeader("Content-type","application/json");
		return request;
	},

	XMLresponseOk: function(req) {
		return req.status >= 200 && req.status < 300;
	},

	XMLParse: function(req) {
		return JSON.parse(req.responseText);
	}
};

module.exports = APIManager;
