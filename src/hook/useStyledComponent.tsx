import React, { CSSProperties, useEffect } from 'react';

const specialMap = {
	p: 'padding',
	pl: 'paddingLeft',
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

const convertSxToCssString = (sx?:CSSProperties)=> {
	if(!sx) return '';
	return Object.keys(sx).map((key) => {
		if(isSpecial(key)) {
			if(Array.isArray(specialMap[key])){
				return (specialMap[key] as (keyof CSSProperties)[]).map(sk=>addPxforNumber(sk, sx[key as keyof CSSProperties])).join('');
			}else {
				return addPxforNumber(specialMap[key] as keyof CSSProperties, sx[key as keyof CSSProperties]);
			}
		} 
		return addPxforNumber(key as keyof CSSProperties, sx[key])
	}).join('');
}

export default function useStyledCom(com: JSX.Element, sx?: CSSProperties) {
	const className = `css-${~~(Math.random() * 100000)}`;

	useEffect(()=>{
		const styleSheet = document.createElement('style');
		document.head.appendChild(styleSheet);
		const sheet = styleSheet.sheet;
		console.log(convertSxToCssString(sx),999)
		sheet?.insertRule(`.${className} { ${convertSxToCssString(sx)} }`, 0);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[])

	return React.cloneElement(com, { className: className });
}
