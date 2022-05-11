import React, { CSSProperties, useEffect, useState } from 'react';

const specialMap = {
	p: 'padding',
	pl: 'padding-left',
	px: ['padding-right', 'padding-left'],
} as unknown as {
	[key: string]: keyof CSSProperties | (keyof CSSProperties)[];
}

function isSpecial(key: keyof CSSProperties|keyof typeof specialMap):key is keyof typeof specialMap {
	const SPECIAL_LIST  = ['p', 'pl', 'px'] as (keyof typeof specialMap)[];
	if(SPECIAL_LIST.includes(key)) {
		return true;
	}
	return false;
}

const addPxforNumber = (key:keyof CSSProperties, value: any)=> {
	const PROPERTIES_LIST = ['width', 'height', 'padding', 'padding-left', 'padding-right'];

	if(PROPERTIES_LIST.includes(key)&&(typeof value === 'number')){
		return `${key}: ${value}px;`;
	}else {
		return `${key}: ${value};`;
	}
}

function isArray<T>(value:T|T[]):value is T[]{
	return Array.isArray(value);
}

const convertSxToCssString = (sx?:CSSProperties)=> {
	if(!sx) return '';
	return (Object.keys(sx) as (keyof CSSProperties)[]).map((key) => {
		if(isSpecial(key)) {
			const newKey = specialMap[key]
			if(isArray<keyof CSSProperties>(newKey)){
				return newKey.map(sk=>addPxforNumber(sk, sx[key])).join('');
			}else {
				return addPxforNumber(newKey, sx[key]);
			}
		} 
		return addPxforNumber(key as keyof CSSProperties, sx[key])
	}).join('');
}

let cache = {} as {[key: string]: string};

export default function useStyledCom(com: JSX.Element, sx?: CSSProperties) {
	const [className, setClassName] = useState('')

	useEffect(()=>{
		const styleSheets = document.getElementsByTagName('style');
		const cacheStyleSheet = Array.prototype.slice.call(styleSheets).find(sh => sh?.dataset?.emotion==='css-global')
		const styleSheet = cacheStyleSheet || document.createElement('style');
		if(!cacheStyleSheet) {
			styleSheet.dataset.emotion = 'css-global';
		}
		document.head.appendChild(styleSheet);

		const sheet = styleSheet.sheet;
		const stringSx = convertSxToCssString(sx);
		const newClass = cache[stringSx]?cache[stringSx]:`css-${~~(Math.random() * 100000)}`
		setClassName(newClass)
		sheet?.insertRule(`.${newClass} { ${convertSxToCssString(sx)} }`, 0);
		cache[stringSx] = newClass;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[])

	return React.cloneElement(com, { className: className });
}
