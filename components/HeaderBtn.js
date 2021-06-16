import React from 'react';
import { HeaderButton } from 'react-navigation-header-buttons';
import { AntDesign } from '@expo/vector-icons';

import Colors from '../constants/Colors';

const HeaderBtn = props => {
	return (
		<HeaderButton
			{...props}
			IconComponent={AntDesign}
			iconSize={24}
			color={Colors.primaryLabel}
		/>
	);
};

export default HeaderBtn;
