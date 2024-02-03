import { defineConfig } from 'astro/config'

import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
	site: 'https://ashley-lizbeth.github.io',
	base: '/portfolio',
	trailingSlash: 'always',
	integrations: [tailwind()],
	i18n: {
		defaultLocale: "en",
		locales: ["en", "es"],
		routing: {
			prefixDefaultLocale: true
		}
	}
})
