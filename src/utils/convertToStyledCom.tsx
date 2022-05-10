import React from 'react';

export default function convertToStyledCom(com: JSX.Element, sx: any) {
	const className = `css-${~~(Math.random() * 100000)}`;

	const styleSheet = document.createElement('style');

	document.head.appendChild(styleSheet); // must append before you can access sheet property
	const sheet = styleSheet.sheet;
	const css = Object.keys(sx).map(key => {
		return `${key}: ${sx[key]};`;
	}).join('');
	sheet?.insertRule(`.${className} { ${css} }`, 0);

	return React.cloneElement(com, { className: className });
}
