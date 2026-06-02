import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { LinkPreset, type NavBarLink } from "@/types/config";

export function getLinkPresets(locale: string): { [key in LinkPreset]: NavBarLink } {
	const prefix = locale ? `/${locale}` : "";
	return {
		[LinkPreset.Home]: {
			name: i18n(I18nKey.home, locale),
			url: `${prefix}/`,
		},
		[LinkPreset.About]: {
			name: i18n(I18nKey.about, locale),
			url: `${prefix}/about/`,
		},
		[LinkPreset.Archive]: {
			name: i18n(I18nKey.archive, locale),
			url: `${prefix}/archive/`,
		},
		[LinkPreset.Projects]: {
			name: i18n(I18nKey.projects, locale),
			url: `${prefix}/projects/`,
		},
	};
}
