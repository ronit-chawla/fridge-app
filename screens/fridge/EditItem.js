import React, {
	useEffect,
	useReducer,
	useCallback,
	useState
} from 'react';
import {
	StyleSheet,
	Button,
	View,
	Alert,
	KeyboardAvoidingView,
	ActivityIndicator
} from 'react-native';
import { useDispatch } from 'react-redux';
import Input from '../../components/Input';
import Card from '../../components/Card';
import Colors from '../../constants/Colors';
import {
	addItem,
	updateItem
} from '../../store/actions/fridge';

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
const EditItem = ({ navigation, route }) => {
	const dispatch = useDispatch();
	let id;
	let title;
	let quantity;
	if (route.params) {
		id = route.params.id;
		title = route.params.title;
		quantity = route.params.quantity;
	}
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
			title    : title ? title : '',
			quantity : title ? quantity : 0
		},
		inputValidities : {
			title    : !!title,
			quantity : !!title
		},
		formIsValid     : !!title
	});
	const submitHandler = useCallback(
		async () => {
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
			try {
				if (id) {
					await dispatch(
						updateItem(
							id,
							formState.inputValues.title,
							parseInt(
								formState.inputValues
									.quantity
							)
						)
					);
				} else {
					await dispatch(
						addItem(
							formState.inputValues.title,
							parseInt(
								formState.inputValues
									.quantity
							)
						)
					);
				}
			} catch (err) {
				setError(err.message);
				setIsLoading(false);
				return;
			}
			setIsLoading(false);
			navigation.navigate('FridgeOverview');
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
	useEffect(() => {
		navigation.setOptions({
			headerTitle : title
				? `Edit ${title}`
				: 'Create new Item'
		});
	}, []);
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
		<KeyboardAvoidingView
			behavior="height"
			keyboardVerticalOffset={50}
			style={{ flex: 1 }}
		>
			<View style={styles.screen}>
				<Card style={styles.container}>
					<Input
						label="Title"
						errorText="Title is required."
						onInputChange={inputChangeHandler}
						autoCapitalize="none"
						id="title"
						required
						initialVal={title && title}
						initiallyValid={!!title}
					/>
					<Input
						label="Quantity"
						errorText="Quantity is required."
						onInputChange={inputChangeHandler}
						id="quantity"
						required
						min={1}
						keyboardType="number-pad"
						initialVal={
							quantity && `${quantity}`
						}
						initiallyValid={!!title}
					/>
					{isLoading ? (
						<ActivityIndicator
							color={
								id ? (
									Colors.secondaryHighlight
								) : (
									Colors.primaryHighlight
								)
							}
							size="small"
						/>
					) : (
						<Button
							title={
								id ? (
									`Edit ${title}`
								) : (
									'Add Item'
								)
							}
							color={
								id ? (
									Colors.secondaryHighlight
								) : (
									Colors.primaryHighlight
								)
							}
							onPress={submitHandler}
						/>
					)}
				</Card>
			</View>
		</KeyboardAvoidingView>
	);
};

export default EditItem;

const styles = StyleSheet.create({
	screen    : {
		backgroundColor : Colors.primary,
		flex            : 1,
		justifyContent  : 'center',
		alignItems      : 'center'
	},
	container : {
		backgroundColor : Colors.secondary,
		padding         : 30,
		width           : '80%',
		borderRadius    : 15
	}
});
