import { LangCode } from 'src/resources/languages';

import { ActionTypes, CommonAction, CommonState, ThemeMode } from './type';

export const initialCommonState: CommonState = {
  theme: ThemeMode.LIGHT,
  lang: LangCode.KO
};

export function commonReducer(state = initialCommonState, action: CommonAction) {
  switch (action.type) {
    case ActionTypes.SetTheme:
      return {
        ...state,
        theme: action.payload
      };
    case ActionTypes.SetLang:
      return {
        ...state,
        lang: action.payload
      };
    default:
      return state;
  }
}
