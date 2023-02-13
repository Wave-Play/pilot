import { metadata } from '@/utils/metadata'
import { ScrollView, Text, View } from 'react-native'
import { sheet } from '@waveplay/snazzy'
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
		<View {...styles.root} pointerEvents={'auto'}>
			<Search onSearch={onSearch}/>
			<ScrollView {...styles.scroll} contentContainerStyle={styles.scrollContainer.style}>
				{ metadata._contentOrder.map((content) => {
					if (typeof content === 'object') {
						return (
							<>
								<Text {...styles.sectionTitle}>{content.title}</Text>
								{ content.children.map((content) => {
									const page = metadata[content]
									return <ContentLink key={page.path} href={page.path} text={page.title}/>
								})}
							</>
						)
					}
					const page = metadata[content]
					return <ContentLink key={page.path} href={page.path} text={page.title}/>
				})}
			</ScrollView>
			{ showSearch
				? <ScrollView {...styles.searchScroll} contentContainerStyle={styles.searchScrollContainer.style}>
						{ !searchItems?.length
							? <Text {...styles.noResults}>No results for "{searchQuery}".{'\n'}Try again with a different keyword.</Text>
							: searchItems.map((item, index) => (
									<SearchResult index={index} item={item as SearchResultItem} onPress={onPressSearchItem}/>
								))
						}
					</ScrollView>
				: null
			}
		</View>
	)
}
export default SidebarContent

const styles = sheet({
	root: {
		width: 270,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start'
	},
	scroll: {
		width: '100%',
		flex: 1
	},
	scrollContainer: {
		paddingBottom: 24
	},
	searchScroll: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		top: 88,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgb(17, 17, 17)'
	},
	searchScrollContainer: {
		paddingRight: 12,
		paddingBottom: 24
	},
	noResults: {
		width: '100%',
		marginTop: 16,
		color: '#999999',
		textAlign: 'center',
		lineHeight: 24,
		fontSize: 14,
		paddingLeft: 24,
		paddingRight: 24
	},
	sectionTitle: {
		width: '100%',
		marginTop: 2,
		marginBottom: 20,
		color: '#ffffff',
		textAlign: 'left',
		lineHeight: 31.68,
		fontSize: 19.2,
		fontWeight: 600
	}
})
