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
	ActivityIndicator,
	Text
} from 'react-native';
import { useDispatch } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';

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
		showDatePicker,
		setShowDatePicker
	] = useState(false);
	const [
		formState,
		dispatchFormState
	] = useReducer(formReducer, {
		inputValues     : {
			title    : title ? title : '',
			quantity : title ? quantity : 0,
			date     : new Date()
		},
		inputValidities : {
			title    : !!title,
			quantity : !!title,
			date     : true
		},
		formIsValid     : !!title
	});
	const editItemHandler = useCallback(
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
				await dispatch(
					updateItem(
						id,
						formState.inputValues.title,
						parseInt(
							formState.inputValues.quantity
						)
					)
				);
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
	const addItemHandler = async type => {
		try {
			if (showDatePicker) {
				await dispatch(
					addItem(
						formState.inputValues.title,
						parseInt(
							formState.inputValues.quantity
						),
						type,
						formState.inputValues.date
					)
				);
			} else {
				await dispatch(
					addItem(
						formState.inputValues.title,
						parseInt(
							formState.inputValues.quantity
						),
						type
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
	};
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
	const submitBtn = title ? (
		<Button
			title={`Edit ${title}`}
			color={Colors.secondaryHighlight}
			onPress={editItemHandler}
		/>
	) : (
		<View
			style={{
				flexDirection  : 'row',
				justifyContent : 'space-between'
			}}
		>
			<Button
				title="Add Item Fridge"
				color={Colors.primaryHighlight}
				onPress={() => addItemHandler('fridge')}
			/>
			<Button
				title="Add Item Freezer"
				color={Colors.secondaryHighlight}
				onPress={() => addItemHandler('freezer')}
			/>
		</View>
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
			style={{
				flex            : 1,
				backgroundColor : Colors.primary
			}}
		>
			<View style={styles.screen}>
				<Card style={styles.container}>
					<Input
						label="Title*"
						errorText="Title is required."
						onInputChange={inputChangeHandler}
						autoCapitalize="none"
						id="title"
						required
						initialVal={title && title}
						initiallyValid={!!title}
					/>
					<Input
						label="Quantity*"
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
					{!title &&
					showDatePicker && (
						<Text
							style={{
								color    :
									Colors.secondaryLabel,
								fontSize : 18
							}}
						>
							Expiry Date
						</Text>
					)}
					{!title &&
					!showDatePicker && (
						<Button
							title="Choose expiry date"
							onPress={() =>
								setShowDatePicker(true)}
						/>
					)}
					{!title &&
					showDatePicker && (
						<DateTimePicker
							style={{
								height : 75
							}}
							value={
								formState.inputValues.date
							}
							mode="date"
							display="calendar"
							onChange={(e, selectedDate) =>
								inputChangeHandler(
									'date',
									selectedDate ||
										formState
											.inputValues
											.date,
									true
								)}
						/>
					)}
					<View style={styles.btn}>
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
							submitBtn
						)}
					</View>
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
	},
	btn       : {
		marginVertical : 25
	}
});
