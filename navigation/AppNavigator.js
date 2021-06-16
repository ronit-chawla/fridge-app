import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import {
	FridgeNavigator,
	AuthNavigator
} from './FridgeNavigator';

const AppNavigator = () => {
	const isAuth = useSelector(state => !!state.fridge.id);

	return (
		<NavigationContainer>
			{isAuth && <FridgeNavigator />}
			{!isAuth && <AuthNavigator />}
		</NavigationContainer>
	);
};

export default AppNavigator;
