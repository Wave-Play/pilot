import { Image, Text, View } from 'react-native'
import { css, sheet } from '@waveplay/snazzy'
import { Link } from '@waveplay/pilot/link'
import { isNative } from '@/utils/utils'
import { Inter } from '@next/font/google'
import slugify from 'slugify'
import { useHover } from '@/utils/use-hover'

const inter = Inter(/*{
	subsets: ['latin'],
	variable: '--font-inter',
}*/)

export const mdxComponents = {
	h1: (props) => <Text {...props} style={[styles.h1.style, inter.style]}/>,
	h2: (props) => {
		const [ref, isHovered] = useHover()
		const slug = slugify(props.children, { lower: true })

		return (
			<Link {...styles.h2Container} href={'#' + slug} ref={ref}>
				<Text {...props} {...h2Style(isHovered)}/>
				<View {...styles.anchor} nativeID={slug} pointerEvents={'none'}/>
			</Link>
		)
	},
	h3: (props) => {
		const [ref, isHovered] = useHover()
		const slug = slugify(props.children, { lower: true })

		return (
			<Link href={'#' + slug} ref={ref}>
				<Text {...props} {...h3Style(isHovered)}/>
				<View {...styles.anchor} nativeID={slug} pointerEvents={'none'}/>
			</Link>
		)
	},
	h4: (props) => <Text {...props} style={{ color: '#fff', fontSize: 14, fontWeight: '600' }} />,
	h5: (props) => <Text {...props} style={{ color: '#fff', fontSize: 12, fontWeight: '600' }} />,
	h6: (props) => <Text {...props} style={{ color: '#fff', fontSize: 10, fontWeight: '600' }} />,
	blockquote: (props) => <View {...props} {...styles.blockquote}/>,
	pre: (props) => {
		const { ...defaultProps } = props
		return <View {...defaultProps} {...styles.pre}/>
	},
	code: (props) => {
		const { children, className, ...defaultProps } = props
		const inline = className === undefined
		return <Text {...defaultProps} {...(inline ? styles.codeInline : styles.code)}>{children}</Text>
	},
	table: (props) => <View {...props} {...styles.table}/>,
	td: (props) => <Text {...props} />,
	th: (props) => <Text {...props} style={{ color: '#fff', fontWeight: '600' }} />,
	tr: (props) => <View {...props} />,
	ul: (props) => <View {...props} />,
	ol: (props) => <View {...props} />,
	li: (props) => <View {...props} />,
	p: (props) => <Text {...props} {...styles.p}/>,
	a: (props) => {
		const { href, ...defaultProps } = props
		return <Link href={href} style={{width: 'fit-content', display: 'inline-flex'}}><Text {...defaultProps} {...styles.a}/></Link>
	},
	img: (props) => <Image {...props} />
}
if (!isNative()) {
	delete mdxComponents.code
	delete mdxComponents.pre
	delete mdxComponents.table
	delete mdxComponents.td
	delete mdxComponents.th
	delete mdxComponents.tr
}

const styles = sheet({
	a: {
		color: '#fff',
		borderBottomColor: 'rgb(250, 250, 250)',
		borderBottomStyle: 'dotted',
		borderBottomWidth: 1,
		fontSize: 16
	},
	anchor: {
		position: 'absolute',
		top: -131,
		left: 0
	},
	blockquote: {
		width: '100%',
		backgroundColor: '#000',
		borderColor: 'rgb(51, 51, 51)',
		borderRadius: 3,
		borderWidth: 1,
		paddingLeft: 20,
		paddingRight: 20,
		marginTop: 24,
		marginBottom: 24
	},
	code: {
		color: '#fff',
		fontFamily: 'monospace'
	},
	codeInline: {
		color: '#fff',
		backgroundColor: 'rgb(51, 51, 51)',
		borderColor: 'rgb(68, 68, 68)',
		borderRadius: 4,
		borderWidth: 1,
		fontSize: 14.4,
		fontFamily: 'monospace',
		paddingTop: 1,
		paddingLeft: 2,
		paddingRight: 2,
		paddingBottom: 1
	},
	h1: {
		color: '#fff',
		fontDisplay: 'optional',
		fontFamily: inter.style.fontFamily + ',Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
		fontSize: 48,
		fontWeight: '700',
		marginTop: 12
	},
	h2Container: {
		marginTop: 36,
		marginBottom: 12
	},
	p: {
		color: '#fff',
		fontSize: 16,
		lineHeight: 26,
		marginTop: 20,
		marginBottom: 20
	},
	pre: {
		backgroundColor: 'rgb(0, 0, 0)',
		borderBottomLeftRadius: 5,
		borderBottomRightRadius: 5,
		padding: 24
	},
	table: {
		width: '100%',
		borderCollapse: 'collapse',
		borderSpacing: 0,
		borderColor: 'rgb(51, 51, 51)',
		borderRadius: 3,
		borderWidth: 1,
		marginTop: 24,
		marginBottom: 24
	}
})

const h2Style = (isHovered: boolean) => css({
	color: '#fff',
	fontSize: 32,
	fontWeight: 600,
	borderBottomColor: isHovered ? 'rgb(250, 250, 250)' : 'transparent',
	borderBottomStyle: 'dotted',
	borderBottomWidth: 1
})

const h3Style = (isHovered: boolean) => css({
	color: '#fff',
	fontSize: 24,
	fontWeight: 600,
	borderBottomColor: isHovered ? 'rgb(250, 250, 250)' : 'transparent',
	borderBottomStyle: 'dotted',
	borderBottomWidth: 1
})
