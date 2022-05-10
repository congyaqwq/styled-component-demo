import convertToStyledCom from 'src/utils/convertToStyledCom';

function Button({ sx }: { sx?: any }) {
	return convertToStyledCom(<button>Styled Component</button>, sx);
}

export default Button;
