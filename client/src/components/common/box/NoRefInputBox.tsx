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
    fontSize: props.styles?.fontSize || '1rem',
    color: props.theme.inputText,
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
  value: string;
  id?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  styles?: Styles;
  isValid?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function NoRefInputBox(props: Props) {
  return (
    <Input
      id={props.id}
      placeholder={props.placeholder}
      type={props.type}
      minLength={props.minLength}
      maxLength={props.maxLength}
      autoComplete='off'
      value={props.value}
      styles={props.styles}
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
}

NoRefInputBox.defaultProps = {
  isValid: true
};
