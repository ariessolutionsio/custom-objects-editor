import {
  TMessageTranslations,
  parseChunkImport,
} from '@commercetools-frontend/i18n';

const loadMessages = (locale: string): Promise<TMessageTranslations> => {
  let loadAppI18nPromise;
  switch (locale) {
    case 'de':
      loadAppI18nPromise = import(
        './i18n/data/de.json' /* webpackChunkName: "app-i18n-de" */
      );
      break;
    case 'es':
      loadAppI18nPromise = import(
        './i18n/data/es.json' /* webpackChunkName: "app-i18n-es" */
      );
      break;
    default:
      loadAppI18nPromise = import(
        './i18n/data/en.json' /* webpackChunkName: "app-i18n-en" */
      );
  }

  return loadAppI18nPromise.then(
    (result) => parseChunkImport(result),
    (error) => {
      // eslint-disable-next-line no-console
      console.warn(
        `Something went wrong while loading the app messages for ${locale}`,
        error
      );

      return {};
    }
  );
};

export default loadMessages;
