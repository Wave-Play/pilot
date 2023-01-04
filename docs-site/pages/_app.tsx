import type { AppProps } from 'next/app'
import { ScrollView, View } from 'react-native'
import { MDXProvider } from '@mdx-js/react'
import { css, cssWeb } from 'utils/css'
import Header from '@/components/shared/header'
import { getMetaFromPath, isNative } from '@/utils/utils'
import { Inter } from '@next/font/google'
import '@/styles/globals.css'
import SidebarContent from '@/components/shared/sidebar-content'
import SidebarTableOfContents from '@/components/shared/sidebar-toc'
import { mdxComponents } from '@/components/shared/mdx'
import PageNavigation from '@/components/shared/page-navigation'
import Footer from '@/components/shared/footer'
import { usePilot } from '@waveplay/pilot'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useMediaQuery } from 'react-responsive'

const inter = Inter()

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
	const pilot = usePilot()
	const meta = getMetaFromPath(pilot.getPath())
	const isMobile = useMediaQuery({ query: '(max-width: 640px)' })
	const showSidebarLeft = useMediaQuery({ query: '(min-width: 921px)' })
	const showSidebarRight = useMediaQuery({ query: '(min-width: 1281px)' })

	let paddingLeft = 32
	let paddingRight = 32
	if (showSidebarLeft) {
		paddingLeft += 272
	}
	if (showSidebarRight) {
		paddingRight += 272
	}
	if (!showSidebarLeft && !showSidebarRight) {
		paddingLeft = 0
		paddingRight = 0
	}

	return (
		<QueryClientProvider client={queryClient}>
			<MDXProvider components={mdxComponents}>
				<main {...bodyStyle} className={`${inter.className} font-sans`}>
					{ !isNative()
						? <style jsx global>{`
								:root {
									color-scheme: dark;
								}
							`}</style>
						: null
					}
					<ScrollView {...scrollStyle} contentContainerStyle={scrollContainerStyle.style}>
						{ isMobile ? <Header position={'absolute'}/> : null }
						<View {...contentContainerStyle(paddingLeft, paddingRight)}>
							<Component {...pageProps} />
							<PageNavigation previous={meta?.previous} next={meta?.next}/>
							<Footer/>
						</View>
					</ScrollView>
					<View {...sideContainerStyle} pointerEvents={'none'}>
						<View {...sideContentContainerStyle}>
							{ showSidebarLeft ? <SidebarContent/> : <View/> }
							{ showSidebarRight ? <SidebarTableOfContents/> : <View/> }
						</View>
					</View>
					{ !isMobile ? <Header position={'fixed'}/> : null }
				</main>
			</MDXProvider>
		</QueryClientProvider>
	)
}

const bodyStyle = cssWeb({
	width: '100%',
	height: '100vh',
	backgroundColor: 'rgb(17, 17, 17)'
})

const scrollStyle = css({
	width: '100%',
	flex: 1
})

const scrollContainerStyle = css({
	width: '100%',
	maxWidth: 1440,
	display: 'flex',
	alignItems: 'center',
	alignSelf: 'center',
	justifySelf: 'center'
})

const contentContainerStyle = (paddingLeft: number, paddingRight: number) => css({
	width: '100%',
	maxWidth: 836 + paddingLeft + paddingRight,
	display: 'flex',
	alignItems: 'flex-start',
	paddingTop: 130 + 16,
	paddingLeft: 32 + paddingLeft,
	paddingRight: 32 + paddingRight
})

const sideContainerStyle = css({
	width: '100%',
	height: 'calc(100% - 147px)',
	display: 'flex',
	alignItems: 'center',
	position: 'fixed',
	top: 147
})

const sideContentContainerStyle = css({
	width: '100%',
	maxWidth: 1440,
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
	paddingLeft: 32,
	paddingRight: 32
})
