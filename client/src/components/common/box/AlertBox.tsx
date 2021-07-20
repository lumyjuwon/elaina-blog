import React from 'react';
import styled, { keyframes, css } from 'styled-components';

const GoingDown = keyframes({
  from: {
    transform: 'translateY(-1rem)'
  },
  to: {
    transform: 'translateY(0)'
  }
});

const Container = styled.div<{ isError: boolean }>(
  (props) => ({
    display: 'flex',
    position: 'fixed',
    top: '4rem',
    left: '0',
    right: '0',
    width: '100vw',
    padding: '.5rem',
    backgroundColor: props.isError ? 'rgb(224, 103, 103)' : 'rgb(111, 178, 237)',
    alignItems: 'center',
    justifyContent: 'space-between'
  }),
  css`
    animation: ${GoingDown} 0.3s forwards;
  `
);

const MessageContainer = styled.div({
  fontSize: '.9rem'
});

const Message = styled.p({
  padding: '0 2rem'
});

const CloseButton = styled.button({
  padding: '.5rem',
  marginRight: '1.5rem',
  border: 'none',
  outline: 'none'
});

export interface AlertProps {
  msg: string;
  isError: boolean;
  onCloseButtonClick: () => void;
}

export interface AlertStateType {
  msg: string;
  isPop: boolean;
  isError: boolean;
}

export function AlertBox(props: AlertProps) {
  return (
    <Container isError={props.isError}>
      <MessageContainer>
        <Message>{props.msg}</Message>
      </MessageContainer>
      <CloseButton onClick={() => props.onCloseButtonClick()}>
        <b>X</b>
      </CloseButton>
    </Container>
  );
}

export const initAlert: AlertStateType = { isError: false, isPop: false, msg: '' };
