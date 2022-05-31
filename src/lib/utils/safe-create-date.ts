export default function safeCreateDate(value: number | string) {
	try {
		return new Date(value);
	} catch {
		return new Date();
	}
}
