import React, {
	useCallback,
	useReducer,
	useState,
	useEffect
} from 'react';
import {
	StyleSheet,
	View,
	Button,
	Alert,
	ActivityIndicator
} from 'react-native';
import {
	HeaderButtons,
	Item
} from 'react-navigation-header-buttons';
import { useDispatch } from 'react-redux';

import HeaderBtn from '../../components/HeaderBtn';
import Input from '../../components/Input';
import Card from '../../components/Card';
import Colors from '../../constants/Colors';
import { authFridge } from '../../store/actions/fridge';

const FORM_UPDATE = 'UPDATE';
const formReducer = (state, action) => {
	switch (action.type) {
		case FORM_UPDATE:
			const updatedValues = {
				...state.inputValues,
				[action.input]: action.value
			};
			const updatedValidities = {
				...state.inputValidities,
				[action.input]: action.isValid
			};
			console.log(
				Object.values(updatedValidities).every(
					val => val
				)
			);
			return {
				inputValues     : updatedValues,
				inputValidities : updatedValidities,
				formIsValid     : Object.values(
					updatedValidities
				).every(val => val)
			};
		default:
			return state;
	}
};

const AuthFridge = () => {
	const dispatch = useDispatch();
	const [
		isLoading,
		setIsLoading
	] = useState(false);
	const [
		error,
		setError
	] = useState(null);
	const [
		formState,
		dispatchFormState
	] = useReducer(formReducer, {
		inputValues     : {
			title    : '',
			password : ''
		},
		inputValidities : {
			title    : false,
			password : false
		},
		formIsValid     : false
	});

	const submitHandler = useCallback(
		() => {
			if (!formState.formIsValid) {
				Alert.alert(
					'Invalid Input',
					'Please check the validity of the inputs in the form.',
					[
						{ text: 'Okay' }
					]
				);
				return;
			}
			setIsLoading(true);
			setError(null);
			dispatch(
				authFridge(
					formState.inputValues.title,
					formState.inputValues.password
				)
			).catch(err => {
				setError(err.message);
				setIsLoading(false);
			});
		},
		[
			dispatch,
			formState
		]
	);

	const inputChangeHandler = useCallback(
		(input, value, isValid) => {
			dispatchFormState({
				type    : FORM_UPDATE,
				value,
				input,
				isValid
			});
		},
		[
			dispatchFormState
		]
	);
	useEffect(
		() => {
			if (error) {
				Alert.alert('Error!', error, [
					{ text: 'Okay' }
				]);
			}
		},
		[
			error
		]
	);
	return (
		<View style={styles.screen}>
			<Card style={styles.container}>
				<Input
					label="Title"
					errorText="Title is required."
					onInputChange={inputChangeHandler}
					autoCapitalize="none"
					id="title"
					required
				/>
				<Input
					label="Password"
					errorText="Password must be atleast 6 characters."
					onInputChange={inputChangeHandler}
					secureTextEntry
					autoCapitalize="none"
					id="password"
					required
					minLength={6}
				/>
				<View style={styles.btn}>
					{isLoading ? (
						<ActivityIndicator
							color={Colors.primaryHighlight}
							size="small"
						/>
					) : (
						<Button
							title="Login to Fridge"
							color={Colors.primaryHighlight}
							onPress={submitHandler}
						/>
					)}
				</View>
			</Card>
		</View>
	);
};

export const authFridgeScreenOptions = ({
	navigation
}) => ({
	headerTitle : 'Login to Fridge',
	headerRight : () => (
		<HeaderButtons HeaderButtonComponent={HeaderBtn}>
			<Item
				title="New Fridge"
				iconName="pluscircle"
				onPress={() =>
					navigation.navigate('NewFridge')}
			/>
		</HeaderButtons>
	)
});

export default AuthFridge;

const styles = StyleSheet.create({
	screen    : {
		backgroundColor : Colors.primary,
		flex            : 1,
		justifyContent  : 'center',
		alignItems      : 'center'
	},
	container : {
		backgroundColor : Colors.secondary,
		width           : '80%',
		maxWidth        : 450,
		maxHeight       : 450,
		padding         : 30,
		borderRadius    : 25
	},
	btn       : {
		marginVertical : 15
	}
});
