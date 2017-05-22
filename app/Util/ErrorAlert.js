'use strict';

const React = require('react-native');
const ErrorMessages = require('./ErrorMessages');

var {
	Alert
} = React;

function getTitle(json) {
	if (json &&
		json.code &&
		ErrorMessages[json.code] &&
		ErrorMessages[json.code].title) {
		return ErrorMessages[json.code].title;
	} else {
		return 'Error';
	}
}

function getBody(json) {
	if (json &&
		json.code &&
		ErrorMessages[json.code] &&
		ErrorMessages[json.code].body) {
		return ErrorMessages[json.code].body;
	} else {
		return 'Sorry a problem occured. Please try again later.';
	}
}

const ErrorAlert = {
	show: function (json, buttons) {
		console.log('error json is');
		console.log(json.Error || json);
		Alert.alert(
			getTitle(json),
			getBody(json),
			buttons
		);
	},

	showUpdateProfile: function (json, buttons) {
		//iterate the json object properties, show the key as title and the value as alert message.
		//Only alert until FloatLabelTextInput can show validation error in the future. 
		console.log("Update profile error: " + JSON.stringify(json));
		let jsonObject = JSON.parse(json);
		if (!!jsonObject.Message) {
			Alert.alert('Error', jsonObject.Message.split('.')[0], buttons);
		} else {
			for (var key in jsonObject) {
				if (jsonObject.hasOwnProperty(key)) {
					Alert.alert('Error', jsonObject[key][0], buttons);
				}
			}
		}
	}
};

module.exports = ErrorAlert;