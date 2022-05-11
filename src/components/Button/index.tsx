import useStyledCom from 'src/hook/useStyledComponent';
import React, { CSSProperties } from 'react';

function Button({ sx }: { sx?: CSSProperties }) {
	return useStyledCom(<button>Styled Component</button>, sx);
}

export default Button;
