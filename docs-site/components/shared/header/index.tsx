import { View } from 'react-native'
import { css } from '@/utils/css'
import Banner from '@/components/shared/header/banner'
import Navigation from '@/components/shared/header/navigation'

const Header = () => {
	return (
		<View {...rootStyle}>
			<Banner/>
			<Navigation/>
		</View>
	)
}
export default Header

const rootStyle = css({
	width: '100%',
	backgroundColor: 'rgb(17, 17, 17)',
	borderBottomColor: 'rgb(51, 51, 51)',
	borderBottomStyle: 'solid',
	borderBottomWidth: 1,
	position: 'fixed',
	top: 0,
	left: 0
})
