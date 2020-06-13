import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './pages/Home/index';
import Point from './pages/Points/index';
import Deitail from './pages/Detail/index';


const Stack = createStackNavigator();


const Routes = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                headerMode="none"
                screenOptions={{
                    cardStyle: {
                        backgroundColor: "#f0f0f5"
                    }
                }}
            >
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Points" component={Point} />
                <Stack.Screen name="Detail" component={Deitail} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Routes;