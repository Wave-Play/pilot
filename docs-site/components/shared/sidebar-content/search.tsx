import { useState } from 'react'
import { TextInput, TouchableOpacity, View } from 'react-native'
import { css } from '@/utils/css'
import Icon from '@mdi/react'
import { mdiClose } from '@mdi/js'

// Temporarily disable type checking for this component
const FixedIcon: any = Icon

interface SearchProps {
	onSearch: (text: string) => void
}
const Search = (props: SearchProps) => {
	const { onSearch } = props

	// Keep track of whether the search input is focused
	const [isFocused, setFocused] = useState(false)
	const onBlur = () => setFocused(false)
	const onFocus = () => setFocused(true)

	// Keep track of the search input's text
	const [text, setText] = useState('')
	const onChangeText = (text: string) => {
		onSearch(text)
		setText(text)
	}

	// Reset text when the close button is pressed
	const onClear = () => {
		onSearch('')
		setText('')
	}

	return (
		<View {...rootStyle(isFocused)}>
			{/* @ts-ignore */}
			<FixedIcon
				color={'white'}
				path={'M8.87 8.16l3.25 3.25-.7.71-3.26-3.25a5 5 0 1 1 .7-.7zM5 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'}
				size={'13px'}
				viewBox={'0 0 13 13'}/>
			<TextInput
				{...inputStyle}
				accessibilityRole={'search'}
				onBlur={onBlur}
				onChangeText={onChangeText}
				onFocus={onFocus}
				placeholder={'Search...'}
				placeholderTextColor={'#666'}
				value={text}/>
			{ text.trim().length > 0
				? <TouchableOpacity {...closeButtonStyle} onPress={onClear}>
						<FixedIcon
							color={'white'}
							path={mdiClose}
							size={'13px'}/>
					</TouchableOpacity>
				: null
			}
		</View>
	)
}
export default Search

const rootStyle = (isFocused: boolean) => css({
	width: '100%',
	height: 40,
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	backgroundColor: '#000000',
	borderColor: isFocused ? '#888888' : '#666',
	borderRadius: 5,
	borderWidth: 1,
	transition: 'border-color 0.2s ease',
	paddingLeft: 8,
	marginTop: 24,
	marginBottom: 24
})

const inputStyle = css({
	width: '100%',
	height: '100%',
	fontFamily: 'Arial',
	fontSize: 14,
	outlineStyle: 'none',
	position: 'absolute',
	top: 0,
	left: 0,
	paddingLeft: 29
})

const closeButtonStyle = css({
	width: 40,
	height: 40,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	position: 'absolute',
	right: 0
})
