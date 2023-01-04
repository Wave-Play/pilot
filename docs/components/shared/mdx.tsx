import { Image, Text, View } from 'react-native'
import { css } from 'utils/css'
import { Link } from '@waveplay/pilot/ui'
import { isNative } from '@/utils/utils'
import { Inter } from '@next/font/google'
import slugify from 'slugify'

const inter = Inter(/*{
	subsets: ['latin'],
	variable: '--font-inter',
}*/)

export const mdxComponents = {
	h1: (props) => <Text {...props} style={[h1Style.style, inter.style]}/>,
	h2: (props) => {
		return <Text {...props} nativeID={slugify(props.children, { lower: true })} {...h2Style}/>
	},
	h3: (props) => <Text {...props} nativeID={slugify(props.children, { lower: true })} style={{ color: '#fff', fontSize: 24, fontWeight: '600' }} />,
	h4: (props) => <Text {...props} style={{ color: '#fff', fontSize: 14, fontWeight: '600' }} />,
	h5: (props) => <Text {...props} style={{ color: '#fff', fontSize: 12, fontWeight: '600' }} />,
	h6: (props) => <Text {...props} style={{ color: '#fff', fontSize: 10, fontWeight: '600' }} />,
	blockquote: (props) => <View {...props} {...blockquoteStyle}/>,
	pre: (props) => {
		const { ...defaultProps } = props
		return <View {...defaultProps} {...preStyle}/>
	},
	code: (props) => {
		const { children, className, ...defaultProps } = props
		const inline = className === undefined
		return <Text {...defaultProps} {...(inline ? codeInlineStyle : codeStyle)}>{children}</Text>
	},
	table: (props) => <View {...props} />,
	th: (props) => <Text {...props} style={{ color: '#fff', fontWeight: '600' }} />,
	td: (props) => <Text {...props} />,
	tr: (props) => <View {...props} />,
	ul: (props) => <View {...props} />,
	ol: (props) => <View {...props} />,
	li: (props) => <View {...props} />,
	p: (props) => <Text {...props} {...pStyle}/>,
	a: (props) => {
		const { href, ...defaultProps } = props
		return <Link href={href} style={{width: 'fit-content', display: 'inline-flex'}}><Text {...defaultProps} {...aStyle}/></Link>
	},
	img: (props) => <Image {...props} />
}
if (!isNative()) {
	delete mdxComponents.pre
	delete mdxComponents.code
}

const aStyle = css({
	color: '#fff',
	borderBottomColor: 'rgb(250, 250, 250)',
	borderBottomStyle: 'dotted',
	borderBottomWidth: 1
})

const blockquoteStyle = css({
	width: '100%',
	backgroundColor: '#000',
	borderColor: 'rgb(51, 51, 51)',
	borderRadius: 3,
	borderWidth: 1,
	paddingLeft: 20,
	paddingRight: 20,
	marginTop: 24,
	marginBottom: 24
})

const codeStyle = css({
	color: '#fff',
	fontFamily: 'monospace'
})

const codeInlineStyle = css({
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
})

const h1Style = css({
	color: '#fff',
	fontDisplay: 'optional',
	fontFamily: inter.style.fontFamily + ',Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
	fontSize: 48,
	fontWeight: '700',
	marginTop: 12
})

const h2Style = css({
	color: '#fff',
	fontSize: 32,
	fontWeight: '600',
	marginTop: 36,
	marginBottom: 12
})

const pStyle = css({
	color: '#fff',
	fontSize: 16,
	lineHeight: 26,
	marginTop: 20,
	marginBottom: 20
})

const preStyle = css({
	backgroundColor: 'rgb(0, 0, 0)',
	borderBottomLeftRadius: 5,
	borderBottomRightRadius: 5,
	padding: 24
})