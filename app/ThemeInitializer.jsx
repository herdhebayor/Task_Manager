'use client';

import { useEffect } from 'react';
import { applyThemeToDocument, getPreferredTheme } from '@/utils/theme';

export default function ThemeInitializer() {


  useEffect(() => {
    const theme = getPreferredTheme();
    applyThemeToDocument(theme);
    // We don't need React state here; applying the DOM class is enough.
  }, []);

  return null;

}

