import { usePilot } from '@waveplay/pilot'
import { Fragment } from 'react'
import { Text, View } from 'react-native'
import { css } from '@/utils/css'
import HeadingLink from '@/components/shared/sidebar-toc/heading-link'
import { getMetaFromPath } from '@/utils/utils'

const SidebarTableOfContents = () => {
	const pilot = usePilot()
	const meta = getMetaFromPath(pilot.getPath())

	return (
		<View {...rootStyle} pointerEvents={'auto'}>
			<Text {...titleStyle}>On this page</Text>
			{ meta?.tableOfContents?.map((content, index) => {
				return (
					<Fragment key={content.slug}>
						<HeadingLink active={index === 0} slug={content.slug} text={content.text}/>
						{ content.subheadings?.map((subheading) => (
							<HeadingLink active={false} key={subheading.slug} slug={subheading.slug} subheading={true} text={subheading.text}/>
						))}
					</Fragment>
				)
			}) }
		</View>
	)
}
export default SidebarTableOfContents

const rootStyle = css({
	width: 270,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start'
})

const titleStyle = css({
	color: '#ffffff',
	fontSize: 16,
	fontWeight: 600,
	lineHeight: 26.4,
	marginTop: 24,
	marginBottom: 16
})
