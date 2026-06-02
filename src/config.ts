import type {
	ExpressiveCodeConfig,
	GiscusConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "DarkSpace",
	subtitle: "Code & Creativity",
	lang: "zh",
	themeColor: {
		hue: 250,
		fixed: false,
	},
	banner: {
		enable: true,
		src: "assets/images/demo-banner.png",
		position: "center",
		credit: {
			enable: false,
			text: "",
			url: "",
		},
	},
	toc: {
		enable: true,
		depth: 2,
	},
	favicon: [],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Projects,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "GitHub",
			url: "https://github.com/DarkSpaceY",
			external: true,
		},
		{
			name: "bilibili",
			url: "https://space.bilibili.com/3493146323323491",
			external: true,
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/demo-avatar.png",
	name: "DarkSpace",
	bio: "Savoir pour prévoir, prévoir pour pouvoir.",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/DarkSpaceY",
		},
		{
			name: "bilibili",
			icon: "fa6-brands:bilibili",
			url: "https://space.bilibili.com/3493146323323491",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const giscusConfig: GiscusConfig = {
	enable: false,
	repo: "your-username/your-repo",
	repoId: "R_kgDOxxxxx",
	category: "Announcements",
	categoryId: "DIC_kwDOxxxxx",
	mapping: "pathname",
	strict: false,
	reactionsEnabled: true,
	emitMetadata: false,
	inputPosition: "top",
	lang: "zh-CN",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};
