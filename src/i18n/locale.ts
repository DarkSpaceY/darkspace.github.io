let _locale = "en";

export function getSafeLocale(): string {
	return _locale;
}

export function setSafeLocale(locale: string) {
	_locale = locale;
}
