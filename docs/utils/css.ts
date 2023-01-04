/**
 * © 2021 WavePlay <dev@waveplay.com>
 */
import { StyleSheet } from 'react-native'
import { isNative } from './utils'

interface CSSStyle {
	style: any
}

const adapt = (style: any): any => {
	// Additional native checks
	if (isNative()) {
		// Phones don't like cursors
		if (style['cursor']) {
			delete style['cursor'];
		}

		// fontWeight is apparently useless and separate font families must be used instead...
		if (style['fontFamily'] === 'ProximaNova' && style['fontWeight'] === 600) {
			style['fontFamily'] = 'ProximaNova-SemiBold';
			delete style['fontWeight'];
		}
		if (style['fontFamily'] === 'ProximaNova' && style['fontWeight'] === 800) {
			style['fontFamily'] = 'ProximaNova-ExtraBold';
			delete style['fontWeight'];
		}

		// React Native really wants fontWeight to be a string
		if (style['fontWeight']) {
			style['fontWeight'] = style['fontWeight'] + '';
		}

		// Fix resizeMode
		if (style['objectFit']) {
			style['resizeMode'] = style['objectFit'];
			delete style['objectFit'];
		}

		// TODO: Fix boxShadow support on Android
		// style['elevation'] = 4;
		if (style['boxShadow']?.includes(' ')) {
			const boxShadow = style['boxShadow'];
			const shadow = boxShadow.split(' ');
			let shadowColor = boxShadow.substring(shadow[0].length + shadow[1].length + shadow[2].length + shadow[3].length + 3);
			if (!shadow[3].includes('px')) {
				shadowColor = boxShadow.substring(shadow[0].length + shadow[1].length + shadow[2].length + 3);
			}
			style['shadowColor'] = shadowColor;
			style['shadowOffset'] = {
				width: parseInt(shadow[0].replace('px', '')),
				height: parseInt(shadow[1].replace('px', ''))
			};
			style['shadowOpacity'] = 1;
			style['shadowRadius'] = parseInt(shadow[2].replace('px', ''));
			delete style['boxShadow'];
		} else {
			fix(style, 'boxShadow');
		}

		// Not supported on native
		if (style['height'] === 'fit-content') {
			fix(style, 'height');
		}
		if (style['width'] === 'fit-content') {
			fix(style, 'width');
		}

		// Fix border
		fix(style, 'border');
		fix(style, 'caretColor');

		// Fix outline
		fix(style, 'outline');
		fix(style, 'outlineColor');
		fix(style, 'outlineStyle');
		fix(style, 'outlineWidth');

		// Fix fixed positions (hehe)
		if (style['position'] === 'fixed') {
			style['position'] = 'absolute';
		}
		
		// Native only supports flexbox
		if (style['display'] === 'block') {
			delete style['display'];
		}

		// Not supported on native
		if (style['textOverflow']) {
			delete style['textOverflow'];
		}
		if (style['overflowX']) {
			delete style['overflowX'];
		}

		// These properties don't exist nor are they need in native apps
		if (style.hasOwnProperty('justifySelf')) {
			delete style['justifySelf'];
		}
		if (style.hasOwnProperty('transformOrigin')) {
			delete style['transformOrigin'];
		}
		if (style['userSelect']) {
			delete style['userSelect'];
		}
		if (style['webkitTouchCallout']) {
			delete style['webkitTouchCallout'];
		}
		if (style['webkitUserSelect']) {
			delete style['webkitUserSelect'];
		}
		if (style['mozUserSelect']) {
			delete style['mozUserSelect'];
		}
		if (style['msUserSelect']) {
			delete style['msUserSelect'];
		}
		if (style['webkitTapHighlightColor']) {
			delete style['webkitTapHighlightColor'];
		}
	}

	return style;
};

export const css = (style: any): CSSStyle => {
	return {
		style: StyleSheet.create({style: adapt(style)}).style
	};
};

export const cssWeb = (style: any): CSSStyle => {
	return {style};
};

export const cssWebOrNative = (style: any): CSSStyle => {
	return isNative() ? css(style) : cssWeb(style);
};

const fix = (style: any, property: string, action?: (value?: any) => void) => {
	if (style[property] !== undefined) {
		delete style[property];
	}
};
