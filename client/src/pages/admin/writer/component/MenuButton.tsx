import React from 'react';
import styled from 'styled-components';

const Toggle = styled.div({
  width: 'max-content',
  borderRadius: '.5rem',
  position: 'absolute',
  flexShrink: 0,
  top: '2.1rem',
  padding: '.2rem',
  left: '0',
  backgroundColor: 'rgba(0,0,0,.8)',
  color: '#f1f2f3',
  display: 'none'
});

const Container = styled.div<{ isActive: boolean }>((props) => {
  return {
    display: 'flex',
    width: '2rem',
    height: '2rem',
    margin: '.2rem',
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
    border: '1px solid transparent',
    borderRadius: '.5rem',
    cursor: props.isActive ? 'pointer' : 'not-allowed',
    '&:hover': {
      border: props.isActive ? `1px solid ${props.theme.hoverBorderColor}` : '1px solid transparent'
    },
    [`&:hover ${Toggle}`]: {
      display: 'block'
    }
  };
});

interface Props {
  isActive: boolean;
  desc: string;
  children: JSX.Element;
  onClick: () => void;
}

export function MenuButton(props: Props) {
  // const themeMode: ThemeMode = useSelector<RootState, any>((state) => state.common.theme);

  return (
    <Container onClick={() => props.onClick()} isActive={props.isActive}>
      {props.children}
      <Toggle>
        <p>{props.desc}</p>
      </Toggle>
    </Container>
  );
}

MenuButton.defaultProps = {
  isActive: false
};
