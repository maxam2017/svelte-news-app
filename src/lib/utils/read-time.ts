const WPM = 200;

export default function readTime(wordLength: number) {
	return Math.max(1, Math.round(wordLength / WPM));
}
