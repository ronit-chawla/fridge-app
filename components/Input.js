import React, { useReducer, useEffect } from 'react';
import {
	StyleSheet,
	View,
	TextInput,
	Text
} from 'react-native';

import Colors from '../constants/Colors';

const INPUT_CHANGE = 'INPUT_CHANGE';
const INPUT_BLUR = 'INPUT_BLUR';

const inputReducer = (state, action) => {
	switch (action.type) {
		case INPUT_CHANGE:
			return {
				...state,
				value   : action.value,
				isValid : action.isValid
			};
		case INPUT_BLUR:
			return {
				...state,
				touched : true
			};
		default:
			return state;
	}
};

const Input = props => {
	const {
		label,
		errorText,
		initialVal,
		initiallyValid,
		onInputChange,
		id
	} = props;
	const [
		inputState,
		dispatch
	] = useReducer(inputReducer, {
		value   : initialVal ? initialVal : '',
		isValid : initiallyValid,
		touched : false
	});

	useEffect(
		() => {
			if (inputState.touched) {
				onInputChange(
					id,
					inputState.value,
					inputState.isValid
				);
			}
		},
		[
			inputState,
			onInputChange
		]
	);
	const inputChangeHandler = text => {
		let isValid = true;
		if (props.required && text.trim().length === 0) {
			isValid = false;
		}
		if (props.min != null && +text < props.min) {
			isValid = false;
		}
		if (
			props.minLength != null &&
			text.length < props.minLength
		) {
			isValid = false;
		}

		dispatch({
			type    : INPUT_CHANGE,
			value   : text,
			isValid
		});
	};
	const lostFocusHandler = () =>
		dispatch({ type: INPUT_BLUR });

	return (
		<View style={styles.formControl}>
			<Text style={styles.label}>{label}</Text>
			<TextInput
				{...props}
				style={styles.input}
				value={inputState.value}
				onChangeText={inputChangeHandler}
				onBlur={lostFocusHandler}
			/>
			{!inputState.isValid &&
			inputState.touched && (
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>
						{errorText}
					</Text>
				</View>
			)}
		</View>
	);
};

export default Input;

const styles = StyleSheet.create({
	formControl    : {
		width : '100%'
	},
	label          : {
		marginVertical : 8,
		color          : Colors.secondaryLabel,
		fontSize       : 18
	},
	input          : {
		paddingHorizontal : 2,
		paddingVertical   : 5,
		borderBottomColor : '#ccc',
		borderBottomWidth : 2,
		fontSize          : 20,
		color             : Colors.secondaryLabel
	},
	errorContainer : {
		marginVertical : 5
	},
	errorText      : {
		color : 'red'
	}
});
