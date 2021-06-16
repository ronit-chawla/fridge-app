import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
	createStore,
	applyMiddleware,
	combineReducers
} from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import AppNavigator from './navigation/AppNavigator';
import fridgeReducer from './store/reducers/fridge';

const store = createStore(
	combineReducers({
		fridge : fridgeReducer
	}),
	applyMiddleware(ReduxThunk)
);

export default function App() {
	return (
		<Provider store={store}>
			<AppNavigator />
		</Provider>
	);
}

const styles = StyleSheet.create({
	container : {
		flex            : 1,
		backgroundColor : '#fff',
		alignItems      : 'center',
		justifyContent  : 'center'
	}
});
