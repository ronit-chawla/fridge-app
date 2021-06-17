export default class Item {
	constructor(
		id,
		title,
		quantity,
		type,
		expiryDate = null
	) {
		this.id = id;
		this.title = title;
		this.quantity = quantity;
		this.type = type;
		this.expiryDate = expiryDate;
	}
	get readableDate() {
		return moment(this.date).format(
			'Do MMMM YYYY, hh:mm'
		);
	}
}
