import { View } from 'react-native'
import { css } from '@waveplay/snazzy'

const Footer = () => {
	return (
		<View {...rootStyle}/>
	)
}
export default Footer

const rootStyle = css({
	width: '100%',
	height: 1,
	backgroundColor: '#333',
	marginTop: 32,
	marginBottom: 80
})
