// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { DesignTokens } from '@bangle.io/shared-types';

export { getFromPath, walkObject } from './walk-object';

// This exists to provide a shape for creating the vars object
const tokensShape: DesignTokens = {
  app: {
    editor: {
      backgroundColor: '',
    },
  },
  border: {
    radius: {
      DEFAULT: '',
      none: '',
      sm: '',
      md: '',
      lg: '',
      xl: '',
    },
    width: {
      DEFAULT: '',
      none: '',
      lg: '',
      md: '',
    },
  },
  widescreenWidth: '',
  color: {
    background: {
      body: '',
      brand: '',
      brandAccent: '',
      brandAccentActive: '',
      brandAccentHover: '',
      brandAccentLight: '',
      brandAccentLightActive: '',
      brandAccentLightHover: '',
      caution: '',
      cautionActive: '',
      cautionHover: '',
      cautionLight: '',
      cautionLightActive: '',
      cautionLightHover: '',
      critical: '',
      criticalActive: '',
      criticalHover: '',
      criticalLight: '',
      criticalLightActive: '',
      criticalLightHover: '',
      info: '',
      infoActive: '',
      infoHover: '',
      infoLight: '',
      infoLightActive: '',
      infoLightHover: '',
      neutral: '',
      neutralActive: '',
      neutralHover: '',
      neutralLight: '',
      neutralLightActive: '',
      neutralLightHover: '',
      neutralSoft: '',
      positive: '',
      positiveActive: '',
      positiveHover: '',
      positiveLight: '',
      positiveLightActive: '',
      positiveLightHover: '',
      surface: '',
      surfaceDark: '',
    },
    foreground: {
      brandAccent: '',
      brandAccentLight: '',
      caution: '',
      cautionLight: '',
      critical: '',
      criticalLight: '',
      info: '',
      infoLight: '',
      link: '',
      linkHover: '',
      linkLight: '',
      linkVisited: '',
      neutral: '',
      neutralInverted: '',
      neutralLight: '',
      positive: '',
      positiveLight: '',
      promote: '',
      promoteLight: '',
      secondary: '',
      secondaryInverted: '',
    },
  },

  ringWidth: {
    DEFAULT: '',
    none: '',
  },
  size: {
    'xs': '',
    'sm': '',
    'md': '',
    'lg': '',
    'xl': '',
    '2xl': '',
    '3xl': '',
    '4xl': '',
    '5xl': '',
    '6xl': '',
    '7xl': '',
    'prose': '',
  },
  space: {
    '0': '',
    '0_5': '',
    '1': '',
    '1_5': '',
    '2': '',
    '2_5': '',
    '3': '',
    '4': '',
    '5': '',
    '6': '',
    '7': '',
    '8': '',
    '9': '',
    '10': '',
    '12': '',
    '14': '',
    '16': '',
    '20': '',
    '24': '',
    '48': '',
    'px': '',
  },
  theme: '',
  typography: {
    fontFamily: {
      sans: '',
      serif: '',
      mono: '',
    },
    text: {
      'xl': {
        height: '',
        size: '',
      },
      'lg': {
        height: '',
        size: '',
      },

      'base': {
        height: '',
        size: '',
      },
      'sm': {
        height: '',
        size: '',
      },
      'xs': {
        height: '',
        size: '',
      },
      '2xl': {
        height: '',
        size: '',
      },
      '3xl': {
        height: '',
        size: '',
      },
    },
  },
};

// unnest the object to get a better type
export const tokens = { ...tokensShape };