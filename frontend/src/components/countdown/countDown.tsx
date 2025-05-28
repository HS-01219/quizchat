import { useTimer } from '@/hooks/useTimer';
import * as S from './countDown.style';
const CountDown = () => {
	const { formattedMinutes, formattedSeconds } = useTimer();

	return (
		<S.CountDownContainer>
			{formattedMinutes}:{formattedSeconds}
		</S.CountDownContainer>
	);
};

export default CountDown;