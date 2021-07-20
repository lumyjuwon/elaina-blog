import { LangCode } from 'src/resources/languages';

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface CommonState {
  theme: ThemeMode;
  lang: LangCode;
}

export enum ActionTypes {
  SetTheme = 'SetTheme',
  SetLang = 'SetLang'
}

interface SetTheme {
  type: ActionTypes.SetTheme;
  payload: ThemeMode;
}

interface SetLang {
  type: ActionTypes.SetLang;
  payload: LangCode;
}

export type CommonAction = SetTheme | SetLang;
