import React, { Component } from 'react'
import { BackAndroid } from 'react-native'
import {Navigator} from 'react-native-deprecated-custom-components'
import Registration from './registration'
import Login from './login'

export default class Navigation extends Component{
    constructor() {
        super()
        BackAndroid.addEventListener('hardwareBackPress', () => {
            const routes = this._navigator.getCurrentRoutes();
            route = routes[routes.length - 1];

            if(route.id === 'Login') {
                // back android button pressed at login page, exit app
                return false;
            } else {
                // back android button pressed at other than login page, navigate to login page
                this._navigator.replace({
                    title: 'Login',
                    id: 'Login'
                });
                return true;
            }
        })
    }

    renderScene(route, navigator){
        this._navigator = navigator;
        switch (route.id){
            case 'Registration':
                return(<Registration navigator={ navigator } />)
            case 'Login':
                return(<Login navigator={ navigator } />)
        }
    }
    render(){
        return(
            <Navigator 
                initialRoute = {{id: 'Login'}}
                renderScene={this.renderScene.bind(this)}
                configureScene={(route) => {
                    return Navigator.SceneConfigs.FloatFromRight;
                }}
            />
        )
    }
}