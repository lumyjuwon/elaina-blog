import 'styled-components';

declare module 'styled-components' {
  interface NavList {
    selectedColor: string;
    selectedBorderLeft: string;
    hoverColor: string;
    hoverMarginLeft: string;
    hoverBorderLeft: string;
  }

  interface Button {
    buttonColor: string;
    textColor: string;
  }

  interface SubmitButton extends Button {}

  interface DangerButton extends Button {}

  export interface DefaultTheme {
    themeColor: string;
    // Background Color
    mainBackground: string;
    headerBackground: string;
    inputBackground: string;
    hoverBackground: string;
    articleBackground: string;
    secondaryContentBackground: string;
    editorBackground: string;
    adminCommentColor: string;
    adminReplyColor: string;
    loadingBackground: string;
    selectedButton: string;
    // Text Color
    blogName: string;
    mainText: string;
    detailText: string;
    hoverText: string;
    placeholderText: string;
    inputText: string;
    // Border
    borderColor: string;
    inputBorder: string;
    focusBorder: string;
    hoverBorderColor: string;
    invalidBorder: string;
    // Others
    navUnderBar: string;
    navHoverUnderBar: string;
    shadowColor: string;
    inputOutline: string;

    // submit btn
    submitButton: SubmitButton;

    // danget btn
    dangerButton: DangerButton;

    // Nav
    navList: NavList;
  }
}
