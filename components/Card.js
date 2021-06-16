import React from 'react';
import { StyleSheet, View } from 'react-native';

import Colors from '../constants/Colors';

const Card = props => {
	return (
		<View style={{ ...styles.card, ...props.style }}>
			{props.children}
		</View>
	);
};

export default Card;

const styles = StyleSheet.create({
	card : {
		shadowColor   : Colors.primaryLabel,
		shadowOpacity : 0.26,
		shadowOffset  : {
			width  : 0,
			height : 2
		},
		shadowRadius  : 8,
		elevation     : 5
	}
});
