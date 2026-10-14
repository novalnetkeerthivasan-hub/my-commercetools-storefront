
import { Currency } from '@commercetools/frontend-sdk/lib/types/Currency';

interface LocalizationMapping {
  locale: string;
  localeName: string;
  currency: Currency;
  currencyCode: string;
  countryName: string;
  countryCode: string;
  countries: Array<string>;
}

const supportedCurrencies = {
  EUR: '€',
  USD: '$',
  CHF: 'CHF',
  PLN: 'zł',
} as const;

type SupportedCurrency = keyof typeof supportedCurrencies;

const countryCurrencyMapper: Record<
  string,
  { countryName: string; currency: Currency; currencyCode: string }
> = {
  DE: { countryName: 'Germany', currency: 'EUR', currencyCode: '€' },
  US: { countryName: 'United States', currency: 'USD', currencyCode: '$' },
  CH: { countryName: 'Switzerland', currency: 'CHF', currencyCode: 'CHF' },
  PL: { countryName: 'Poland', currency: 'PLN', currencyCode: 'zł' },
};

const supportedCountries = Object.keys(countryCurrencyMapper);

const localizationMapper = {
  en: {
    locale: 'en-US',
    localeName: 'English',
    currency: 'USD',
    currencyCode: '$',
    countryCode: 'US',
    countryName: 'United States',
    countries: supportedCountries,
  },
  de: {
    locale: 'de-DE',
    localeName: 'German',
    currency: 'EUR',
    currencyCode: '€',
    countryCode: 'DE',
    countryName: 'Germany',
    countries: supportedCountries,
  },
} as Record<string, LocalizationMapping>;

const locales = Object.keys(localizationMapper);
const defaultLocale = 'en';

export const i18nConfig = { locales, defaultLocale };

export const getLocalizationInfo = (
  locale: string,
  countryCode?: string,
  selectedCurrency?: SupportedCurrency,
): LocalizationMapping => {
  const languageInfo =
    localizationMapper[locale] ?? localizationMapper[defaultLocale];

  if (!(locale in localizationMapper)) {
    console.warn(
      `Invalid locale ${locale}. Supported locales: ${locales.join(', ')}`,
    );
  }

  const countryInfo = countryCode
    ? countryCurrencyMapper[countryCode.toUpperCase()]
    : undefined;

  if (countryCode && !countryInfo) {
    console.warn(`Unsupported country code: ${countryCode}`);
  }

  const currency = selectedCurrency
    ? supportedCurrencies[selectedCurrency]
      ? selectedCurrency
      : undefined
    : undefined;

  if (selectedCurrency && !currency) {
    console.warn(`Unsupported currency: ${selectedCurrency}`);
  }

  const currencyToUse = currency ?? countryInfo?.currency;

  const currencyCodeToUse = currencyToUse
    ? supportedCurrencies[currencyToUse as SupportedCurrency] ??
      countryInfo?.currencyCode ??
      languageInfo.currencyCode
    : languageInfo.currencyCode;

  return {
    ...languageInfo,
    ...(countryInfo ?? {}),
    countryCode: countryCode?.toUpperCase() ?? languageInfo.countryCode,
    currency: currencyToUse ?? languageInfo.currency,
    currencyCode: currencyCodeToUse,
  };
};

export { supportedCurrencies, countryCurrencyMapper };
