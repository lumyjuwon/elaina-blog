import React from 'react';
import styled from 'styled-components';

interface Styles {
  width?: string;
  height?: string;
  fontSize?: string;
  margin?: string;
  small?: {
    width?: string;
    height?: string;
  };
}

interface InputProps {
  // themeMode: ThemeMode;
  isValid?: boolean;
  styles?: Styles;
}

const Input = styled.input<InputProps>((props) => {
  return {
    width: props.styles?.width || '100px',
    height: props.styles?.height || '40px',
    margin: props.styles?.margin,
    border: `1px solid ${props.theme.inputBorder}`,
    borderRadius: '.5rem',
    backgroundColor: props.theme.inputBackground,
    color: props.theme.inputText,
    fontSize: props.styles?.fontSize || '1rem',
    '&:focus': {
      padding: '1px',
      borderWidth: '2px',
      borderColor: props.isValid ? props.theme.inputOutline : props.theme.invalidBorder,
      outline: 'none'
    },
    '&::placeholder': {
      color: props.theme.placeholderText
    },
    '@media screen and (max-width: 767px)': {
      width: props.styles?.small?.width || '100px',
      height: props.styles?.small?.height || '40px'
    }
  };
});

interface Props {
  type: string;
  minLength: number;
  maxLength: number;
  id?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  styles?: Styles;
  isValid?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RefInputBox = React.forwardRef<HTMLInputElement, Props>((props, forwardedRef) => {
  // const themeMode: ThemeMode = useSelector<RootState, any>((state) => state.common.theme);

  return (
    <Input
      ref={forwardedRef}
      id={props.id}
      placeholder={props.placeholder}
      type={props.type}
      minLength={props.minLength}
      maxLength={props.maxLength}
      autoComplete='off'
      styles={props.styles}
      // themeMode={themeMode}
      onFocus={() => {
        if (props.onFocus) {
          props.onFocus();
        }
      }}
      onBlur={() => {
        if (props.onBlur) {
          props.onBlur();
        }
      }}
      onKeyDown={props.onKeyDown}
      onChange={props.onChange}
      isValid={props.isValid}
      formNoValidate
    />
  );
});

RefInputBox.displayName = 'RefInputBox';

RefInputBox.defaultProps = {
  isValid: true
};
