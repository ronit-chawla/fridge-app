import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Colors from '../constants/Colors';
import AuthFridge, {
	authFridgeScreenOptions
} from '../screens/auth/AuthFridge';
import NewFridge, {
	newFridgeScreenOptions
} from '../screens/auth/NewFridge';
import FridgeOverview from '../screens/fridge/FridgeOverview';
import EditItem from '../screens/fridge/EditItem';

const defaultNavigationOptions = {
	headerStyle          : {
		backgroundColor : Colors.headerColor
	},
	headerTintColor      : Colors.primaryLabel,
	headerBackTitleStyle : {
		color : Colors.primaryHighlight
	}
};

const AuthStack = createStackNavigator();

export const AuthNavigator = () => (
	<AuthStack.Navigator
		screenOptions={defaultNavigationOptions}
	>
		<AuthStack.Screen
			name="AuthFridge"
			component={AuthFridge}
			options={authFridgeScreenOptions}
		/>
		<AuthStack.Screen
			name="NewFridge"
			component={NewFridge}
			options={newFridgeScreenOptions}
		/>
	</AuthStack.Navigator>
);

const FridgeStack = createStackNavigator();

export const FridgeNavigator = () => (
	<FridgeStack.Navigator
		screenOptions={defaultNavigationOptions}
	>
		<FridgeStack.Screen
			name="FridgeOverview"
			component={FridgeOverview}
		/>
		<FridgeStack.Screen
			name="EditItem"
			component={EditItem}
		/>
	</FridgeStack.Navigator>
);
