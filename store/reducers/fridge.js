import {
	ADD_ITEM,
	DELETE_ITEM,
	SET_FRIDGE,
	UPDATE_ITEM
} from '../actions/fridge';
import Item from '../../models/Item';

const initialState = {
	id    : null,
	title : null,
	items : []
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_FRIDGE:
			const items = action.fridge.items.map(
				i => new Item(i.id, i.title, i.quantity)
			);
			return {
				id    : action.fridge.id,
				title : action.fridge.title,
				items
			};
		case ADD_ITEM:
			return {
				...state,
				items : [
					...state.items,
					new Item(
						action.item.id,
						action.item.title,
						action.item.quantity
					)
				]
			};
		case UPDATE_ITEM:
			const updatedItems = state.items.map(item => {
				if (item.id !== action.item.id) {
					return item;
				}
				return new Item(
					item.id,
					action.item.title,
					action.item.quantity
				);
			});
			return {
				...state,
				items : updatedItems
			};
		case DELETE_ITEM:
			return {
				...state,
				items : state.items.filter(
					i => i.id !== action.id
				)
			};
		default:
			return state;
	}
};
