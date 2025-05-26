import { useEffect, useState } from "react";

export const useTimer = () => {
	const MINUTES_IN_MS = 10 * 60 * 1000;
	const INTERVAL = 1000;
	const [timeLeft, setTimeLeft] = useState<number>(MINUTES_IN_MS);

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prevTime) => {
				if (prevTime <= INTERVAL) {
					clearInterval(timer);
					console.log("타이머 종료");
					return 0;
				}
				return prevTime - INTERVAL;
			});
		}, INTERVAL);

		return () => clearInterval(timer);
	}, []);

	const minutes = Math.floor(timeLeft / (1000 * 60));
	const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

	const formattedMinutes = (minutes < 10 ? '0' : '') + minutes;
	const formattedSeconds = (seconds < 10 ? '0' : '') + seconds;
	return {
		formattedMinutes,
		formattedSeconds,
		timeLeft,
	};
};