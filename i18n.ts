import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});

export const locales = ['de', 'en'];
export const defaultLocale = 'de';

// URL path mappings for localized routes
export const pathnames = {
  '/': '/',
  '/en': '/en',
  '/geschichte': '/geschichte',
  '/history': '/history',
  '/speisekarte': '/speisekarte', 
  '/menu': '/menu',
  '/kontakt': '/kontakt',
  '/contact': '/contact',
  '/reservierung': '/reservierung',
  '/reservation': '/reservation'
};