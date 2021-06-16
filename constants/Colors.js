import { Platform } from 'react-native';

export default {
	primary            :
		Platform.OS === 'ios' ? '#000000' : '#121212',
	secondary          :
		Platform.OS === 'ios' ? '#1c1c1e' : '#272727',
	tertiary           : '#767680',
	headerColor        : '#161616',
	borderColor        : '#545458',
	primaryLabel       : '#fff',
	secondaryLabel     : '#ebebf5',
	primaryHighlight   : '#64d2ff',
	secondaryHighlight : '#ff6f22'
};
