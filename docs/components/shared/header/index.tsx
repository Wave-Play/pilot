import { View } from 'react-native'
import { css } from '@waveplay/snazzy'
import Banner from '@/components/shared/header/banner'
import Navigation from '@/components/shared/header/navigation'

interface HeaderProps {
	position: 'absolute' | 'fixed'
}
const Header = (props: HeaderProps) => {
	const { position } = props

	return (
		<View {...rootStyle(position)}>
			<Banner/>
			<Navigation/>
		</View>
	)
}
export default Header

const rootStyle = (position: string) => css({
	width: '100%',
	backgroundColor: 'rgb(17, 17, 17)',
	borderBottomColor: 'rgb(51, 51, 51)',
	borderBottomStyle: 'solid',
	borderBottomWidth: 1,
	position: position,
	top: 0,
	left: 0
})
