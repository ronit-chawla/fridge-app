import env from '../../env';

export const SET_FRIDGE = 'SET_FRIDGE';
export const ADD_ITEM = 'ADD_ITEM';
export const UPDATE_ITEM = 'UPDATE_ITEM';
export const DELETE_ITEM = 'DELETE_ITEM';

export const setFridge = fridge => ({
	type   : SET_FRIDGE,
	fridge
});

export const createFridge = (
	title,
	password
) => async dispatch => {
	const res = await fetch(`${env.API_BASE_URL}/fridge`, {
		method  : 'POST',
		headers : {
			'Content-type' : 'application/json'
		},
		body    : JSON.stringify({ title, password })
	});
	const data = await res.json();
	if (!res.ok) {
		throw new Error(data.message);
	}
	dispatch(setFridge(data.fridge));
};

export const authFridge = (
	title,
	password
) => async dispatch => {
	const res = await fetch(
		`${env.API_BASE_URL}/fridge/auth`,
		{
			method  : 'POST',
			headers : {
				'Content-type' : 'application/json'
			},
			body    : JSON.stringify({ title, password })
		}
	);
	const data = await res.json();
	if (!res.ok) {
		throw new Error(data.message);
	}
	dispatch(setFridge(data.fridge));
};

export const addItem = (title, quantity) => async (
	dispatch,
	getState
) => {
	const id = getState().fridge.id;
	const res = await fetch(
		`${env.API_BASE_URL}/fridge/${id}`,
		{
			method  : 'POST',
			headers : {
				'Content-type' : 'application/json'
			},
			body    : JSON.stringify({ title, quantity })
		}
	);
	const data = await res.json();
	if (!res.ok) {
		throw new Error(data.message);
	}
	dispatch({
		type : ADD_ITEM,
		item : data.item
	});
};

export const updateItem = (
	itemId,
	title,
	quantity
) => async (dispatch, getState) => {
	const id = getState().fridge.id;
	const res = await fetch(
		`${env.API_BASE_URL}/fridge/${id}/item/${itemId}`,
		{
			method  : 'PUT',
			headers : {
				'Content-type' : 'application/json'
			},
			body    : JSON.stringify({ title, quantity })
		}
	);
	const data = await res.json();
	if (!res.ok) {
		throw new Error(data.message);
	}
	dispatch({
		type : UPDATE_ITEM,
		item : data.item
	});
};

export const deleteItem = itemId => async (
	dispatch,
	getState
) => {
	const id = getState().fridge.id;
	const res = await fetch(
		`${env.API_BASE_URL}/fridge/${id}/item/${itemId}`,
		{
			method : 'DELETE'
		}
	);
	const data = await res.json();
	if (!res.ok) {
		throw new Error(data.message);
	}
	dispatch({
		type : DELETE_ITEM,
		id   : itemId
	});
};
