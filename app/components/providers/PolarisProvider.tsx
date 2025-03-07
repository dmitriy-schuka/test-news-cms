/** Polaris requires all its components to be inside a context provided by the <AppProvider> component.
 * This component passes settings and common configuration for the entire library, such as:
 * Localization (via i18n), Themes (light or dark), Settings for navigation or customization of components. */

import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import React from 'react';

interface PolarisProviderProps {
    children: React.ReactNode;
}

export function PolarisProvider({ children }: PolarisProviderProps) {
    return (
        <AppProvider
            i18n={enTranslations}
            theme={'light'} /*features={{ newDesignLanguage: true }}*/
        >
            {children}
        </AppProvider>
    );
}
