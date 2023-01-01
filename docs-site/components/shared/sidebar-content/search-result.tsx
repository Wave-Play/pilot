import { Text, TouchableOpacity, View } from 'react-native'
import { css } from '@/utils/css'
import { useHover } from '@/utils/use-hover'

type MatchesInfoData = Array<{
	length: number
	start: number
}>

export interface SearchResultItem {
	data: {
		content: string
		id: string
		path: string
		title: string
		_formatted: {
			content: string
			title: string
		}
	}
	_matchesInfo: {
		content: MatchesInfoData
		title: MatchesInfoData
	}
}

interface SearchResultProps {
	item: SearchResultItem
	onPress: (item: SearchResultItem) => void
}
const SearchResult = (props: SearchResultProps) => {
	const { item, onPress } = props
	const [ref, isHovered] = useHover()

	return (
		<TouchableOpacity {...rootStyle(isHovered)} onPress={() => onPress(item)}>
			<View {...containerStyle} ref={ref}>
				<Text {...titleStyle}>{highlight({
					formattedText: item.data._formatted.title,
					matches: item._matchesInfo.title,
					style: titleHighlightStyle
				})}</Text>
				<View {...spacerStyle}/>
				<Text {...contentStyle}>{highlight({
					formattedText: item.data._formatted.content,
					matches: item._matchesInfo.content,
					style: contentHighlightStyle,
					text: item.data.content
				})}</Text>
			</View>
		</TouchableOpacity>
	)
}
export default SearchResult

interface HighlightOptions {
	formattedText: string
	matches: MatchesInfoData
	style: any
	text?: string
}
const highlight = (option: HighlightOptions): React.ReactNode[] => {
	const { formattedText, matches, style, text } = option

	// Account for the fact that the text is cropped
	let cropStart = 0
	if (text) {
		cropStart = text.indexOf(formattedText.replace(/…/g, '')) -1
	}

	// Wrap matches in a highlighted Text component
	const parts = []
	let lastMatchEnd = 0
	matches?.forEach((match) => {
		let { start, length } = match
		start = start - cropStart
		const beforeMatch = formattedText.substring(lastMatchEnd, start)
		const matchText = formattedText.substring(start, start + length)
		parts.push(beforeMatch)
		parts.push(<Text {...style}>{matchText}</Text>)
		lastMatchEnd = start + length
	})
	parts.push(formattedText.substring(lastMatchEnd))
	
	// Remove all newlines
	parts.forEach((part, index) => {
		if (typeof part === 'string') {
			parts[index] = part.replace(/\n/g, ' ')
		}
	})
	return parts
}

const rootStyle = (isActive: boolean) => css({
	width: '100%',
	backgroundColor: isActive ? '#000000' : undefined,
	borderColor: isActive ? '#d8d8d8' : 'transparent',
	borderRadius: 4,
	borderWidth: 1
})

const containerStyle = css({
	padding: 12
})

const titleStyle = css({
	color: '#ffffff',
	fontSize: 16,
	fontWeight: 500,
	lineHeight: 26.4
})

const titleHighlightStyle = css({
	color: '#000000',
	backgroundColor: 'yellow',
	fontSize: 16,
	fontWeight: 500,
	lineHeight: 26.4
})

const contentStyle = css({
	color: '#ffffff',
	fontSize: 16,
	fontWeight: 400,
	lineHeight: 26.4
})

const contentHighlightStyle = css({
	color: '#000000',
	backgroundColor: 'yellow',
	fontSize: 16,
	fontWeight: 400,
	lineHeight: 26.4
})

const spacerStyle = css({
	height: 8
})
