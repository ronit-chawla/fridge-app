import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	Alert,
	TextInput,
	Button as Btn
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import {
	HeaderButtons,
	Item
} from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderBtn from '../../components/HeaderBtn';
import Colors from '../../constants/Colors';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { deleteItem } from '../../store/actions/fridge';

const FridgeItem = ({
	id,
	title,
	quantity,
	deleteItem,
	navigation
}) => (
	<Card style={styles.item}>
		<View>
			<Text style={styles.text}>{title}</Text>
			<Text style={styles.qty}>
				{quantity} {quantity > 1 ? 'items' : 'item'}
			</Text>
		</View>
		<View style={styles.btnGrp}>
			<Button
				onPress={() =>
					navigation.navigate('EditItem', {
						id,
						title,
						quantity
					})}
			>
				<AntDesign
					name="edit"
					size={26}
					color={Colors.primaryHighlight}
				/>
			</Button>
			<Button onPress={deleteItem}>
				<AntDesign
					name="delete"
					size={26}
					color="red"
				/>
			</Button>
		</View>
	</Card>
);

const FridgeOverview = ({ navigation }) => {
	const dispatch = useDispatch();
	const fridge = useSelector(state => state.fridge);
	const [
		searchTerm,
		setSearchTerm
	] = useState('');
	const [
		items,
		setItems
	] = useState([
		...fridge.items
	]);
	const totalNumItems = fridge.items.length;
	const totalQty = fridge.items.reduce(
		(acc, cur) => acc + cur.quantity,
		0
	);
	useEffect(() => {
		navigation.setOptions({
			headerTitle : fridge.title,
			headerRight : () => (
				<HeaderButtons
					HeaderButtonComponent={HeaderBtn}
				>
					<Item
						title="New Fridge"
						iconName="pluscircle"
						onPress={() =>
							navigation.navigate('EditItem')}
					/>
				</HeaderButtons>
			)
		});
	}, []);
	useEffect(
		() => {
			setItems(
				fridge.items.filter(i =>
					i.title
						.toLowerCase()
						.includes(searchTerm.toLowerCase())
				)
			);
		},
		[
			searchTerm
		]
	);
	return (
		<View style={styles.screen}>
			<View style={styles.searchBox}>
				<TextInput
					placeholder="Search..."
					placeholderTextColor={
						Colors.secondaryLabel
					}
					value={searchTerm}
					onChangeText={setSearchTerm}
					style={styles.searchInput}
				/>
				<Btn
					title="Reset"
					color={Colors.secondaryHighlight}
					onPress={() => {
						setSearchTerm('');
						setItems([
							...fridge.items
						]);
					}}
				/>
			</View>
			<View style={styles.details}>
				<Text style={styles.secondaryText}>
					{totalNumItems} Items
				</Text>
				<Text style={styles.secondaryText}>
					{totalQty} Quantity
				</Text>
			</View>
			{totalNumItems ? (
				<FlatList
					data={items}
					renderItem={data => (
						<FridgeItem
							{...data.item}
							navigation={navigation}
							deleteItem={() =>
								Alert.alert(
									'Are you sure?',
									`Do you want to delete ${data
										.item.title}?`,
									[
										{
											text  : 'No',
											style :
												'default'
										},
										{
											text    : 'Yes',
											style   :
												'destructive',
											onPress : () =>
												dispatch(
													deleteItem(
														data
															.item
															.id
													)
												)
										}
									]
								)}
						/>
					)}
				/>
			) : (
				<View style={styles.container}>
					<Text style={styles.text}>
						No Items
					</Text>
				</View>
			)}
		</View>
	);
};

export default FridgeOverview;

const styles = StyleSheet.create({
	screen        : {
		backgroundColor : Colors.primary,
		flex            : 1,
		padding         : 25
	},
	details       : {
		flexDirection  : 'row',
		justifyContent : 'space-between',
		alignItems     : 'center',
		marginTop      : 10,
		marginBottom   : 25
	},
	secondaryText : {
		color    : Colors.secondaryLabel,
		fontSize : 20
	},
	container     : {
		justifyContent : 'center',
		alignItems     : 'center'
	},
	text          : {
		color    : Colors.primaryLabel,
		fontSize : 24
	},
	item          : {
		backgroundColor : Colors.secondary,
		borderColor     : Colors.tertiary,
		borderWidth     : 1,
		marginVertical  : 10,
		flexDirection   : 'row',
		justifyContent  : 'space-around',
		paddingVertical : 10
	},
	btnGrp        : {
		flexDirection  : 'row',
		alignItems     : 'center',
		justifyContent : 'space-between'
	},
	qty           : {
		color : '#ccc'
	},
	searchBox     : {
		flexDirection  : 'row',
		alignItems     : 'center',
		justifyContent : 'space-between'
	},
	searchInput   : {
		width             : '75%',
		marginVertical    : 20,
		fontSize          : 20,
		color             : Colors.secondaryHighlight,
		borderBottomColor : Colors.secondaryHighlight,
		borderBottomWidth : 1,
		paddingHorizontal : 2,
		paddingVertical   : 10
	}
});
