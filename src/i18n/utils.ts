import { ui, defaultLang, showDefaultLang, routes } from './ui';

// recuperer la langue a partir de l'URL
export function getLangFromUrl(url: URL) {
    const [, lang] = url.pathname.split('/');
    if (lang in ui) return lang as keyof typeof ui;
    return defaultLang;
}

// fonction de traduction t()
export function useTranslations(lang: keyof typeof ui) {
    return function t(key: keyof typeof ui[typeof defaultLang]) {
        return ui[lang][key] || ui[defaultLang][key];
    }
}

// traduire la route en fonction de langue et matcher avec la route par defaut => navbar et le language picker
export function useTranslatedPath(lang: keyof typeof ui) {
    return function translatePath(path: string, l: string = lang) {
        const pathName = path.replaceAll('/', '')
        const hasTranslation = defaultLang !== l && routes[l] !== undefined && routes[l][pathName] !== undefined
        const translatedPath = hasTranslation ? '/' + routes[l][pathName] : path

        return !showDefaultLang && l === defaultLang ? translatedPath : `/${l}${translatedPath}`
    }
}

// recuperer la route en fonction de l'url
export function getRouteFromUrl(url: URL): string | undefined {
    const pathname = new URL(url).pathname
    const parts = pathname?.split('/')
    const path = parts.pop() || parts.pop()

    if (path === undefined) return undefined

    const currentLang = getLangFromUrl(url);

    if (defaultLang === currentLang) {
        const route = Object.values(routes)[0];
        return route[path] !== undefined ? route[path] : undefined
    }

    const getKeyByValue = (obj: Record<string, string>, value: string): string | undefined => {
        return Object.keys(obj).find((key) => obj[key] === value)
    }

    const reversedKey = getKeyByValue(routes[currentLang], path)

    if (reversedKey !== undefined) {
        return reversedKey
    }

    return undefined
}