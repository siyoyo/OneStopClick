'use strict';
import React, { Component } from 'react'
import { NetInfo } from 'react-native'

const Rx = require('rx');
const ErrorMessages = require("./ErrorMessages");

const Reachability = {
	isNetReachable: function () {
		return Rx.Observable.create(observer => {
			NetInfo.isConnected.fetch().done((isConnected) => {
				NetInfo.isConnected.addEventListener('change', function (isConnected) {
					if (isConnected) {
						observer.next(isConnected);
						observer.onCompleted();
					} else {
						observer.error(ErrorMessages.internetNotConnected);
					}
				});
			});
		});
	}
};

module.exports = Reachability;