import { metadata } from '@/utils/metadata'
import { ScrollView, Text, View } from 'react-native'
import { css } from '@/utils/css'
import Search from '@/components/shared/sidebar-content/search'
import ContentLink from '@/components/shared/sidebar-content/content-link'
import { useSearch } from '@/utils/search'
import { useEffect, useState } from 'react'
import SearchResult, { SearchResultItem } from './search-result'
import { usePilot } from '@waveplay/pilot'

const SidebarContent = () => {
	const pilot = usePilot()
	const [searchQuery, setSearchQuery] = useState('')
	const { searchItems } = useSearch(searchQuery)
	const onSearch = (query: string) => setSearchQuery(query)

	// Show search results when there is a search query, even if there are no results
	// This gives us more control over the visibility of the search results
	const [showSearch, setShowSearch] = useState(false)
	useEffect(() => {
		setShowSearch(searchQuery.length > 0)
	}, [searchQuery])

	const onPressSearchItem = (item: SearchResultItem) => {
		pilot.fly(item.data.path)
		setShowSearch(false)
	}

	return (
		<View {...rootStyle} pointerEvents={'auto'}>
			<Search onSearch={onSearch}/>
			<ScrollView {...scrollStyle} contentContainerStyle={scrollContainerStyle.style}>
				{ metadata._contentOrder.map((content) => {
					const page = metadata[content]
					return <ContentLink key={page.path} href={page.path} text={page.title}/>
				})}
			</ScrollView>
			{ showSearch
				? <ScrollView {...searchScrollStyle} contentContainerStyle={searchScrollContainerStyle.style}>
						{ !searchItems?.length
							? <Text {...noResultsStyle}>No results for "{searchQuery}".{'\n'}Try again with a different keyword.</Text>
							: searchItems.map((item) => (
									<SearchResult item={item as SearchResultItem} onPress={onPressSearchItem}/>
								))
						}
					</ScrollView>
				: null
			}
		</View>
	)
}
export default SidebarContent

const rootStyle = css({
	width: 270,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start'
})

const scrollStyle = css({
	width: '100%',
	flex: 1
})

const scrollContainerStyle = css({
	paddingBottom: 24
})

const searchScrollStyle = css({
	width: '100%',
	flex: 1,
	position: 'absolute',
	top: 88,
	left: 0,
	right: 0,
	bottom: 0,
	backgroundColor: 'rgb(17, 17, 17)'
})

const searchScrollContainerStyle = css({
	paddingRight: 12,
	paddingBottom: 24
})

const noResultsStyle = css({
	width: '100%',
	marginTop: 16,
	color: '#999999',
	textAlign: 'center',
	lineHeight: 24,
	fontSize: 14,
	paddingLeft: 24,
	paddingRight: 24
})
