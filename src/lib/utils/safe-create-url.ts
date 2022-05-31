export default function safeCreateURL(value: string) {
	try {
		return new URL(value);
		// eslint-disable-next-line no-empty
	} catch {}
}
