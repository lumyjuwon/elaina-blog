import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import { FocusWrapper, useWidth } from 'src/components';

import { MemoizedModeSwitch } from './ModeSwitch';
import { MemoizedBlogTitle } from './BlogTitle';
import { ProgressBar } from './ProgressBar';
import { SearchMenu } from './SearchMenu';
import { MemoizedLanguageMenu } from './LanguageMenu';
import { AdminMenu } from './AdminMenu';

const StyledHeader = styled.header((props) => {
  return {
    display: 'flex',
    position: 'fixed',
    top: '0',
    width: '100%',
    height: '4rem',
    padding: '.5rem 0',
    borderBottom: '1px solid #ccc',
    backgroundColor: props.theme.headerBackground,
    fontWeight: 'bold',
    alignItems: 'center',
    zIndex: 9999
  };
});

const Container = styled.div({
  display: 'flex',
  width: '100%',
  height: '100%',
  padding: '0 4rem',
  margin: '0 auto',
  alignItems: 'center',
  justifyContent: 'space-between',
  '@media screen and (max-width: 1380px)': {
    padding: '0 10px'
  },
  '@media screen and (max-width: 767px)': {
    padding: '0'
  }
});

const Flex = styled.div({
  display: 'flex',
  width: 'max-content',
  alignItems: 'center',
  justifyContent: 'center'
});

const MobileMenuButton = styled.div({
  display: 'none',
  padding: '10px',
  fontSize: '1.5rem',
  '@media screen and (max-width: 767px)': {
    display: 'block'
  }
});

const OpeningAnimation = keyframes({
  from: {
    opacity: 0,
    top: '4rem'
  },
  to: {
    opacity: 1,
    top: '5rem'
  }
});

const ResponsiveMenuBox = styled.div(
  (props) => ({
    display: 'flex',
    '@media screen and (max-width: 767px)': {
      position: 'fixed',
      right: '0',
      padding: '10px',
      borderRadius: '.5rem',
      backgroundColor: props.theme.secondaryContentBackground,
      boxShadow: `0 8px 4px -4px ${props.theme.shadowColor}`,
      zIndex: 9999
    }
  }),
  css`
    @media screen and (max-width: 767px) {
      animation: 0.3s ${OpeningAnimation} forwards;
    }
  `
);

interface Props {
  isLogin: boolean;
  name: string;
  changeThemeMode: (value: string) => void;
}

export function Header(props: Props) {
  const width = useWidth();
  const [isSwitchAndSearchVisible, setIsSwitchAndSearchVisible] = useState<boolean>(width > 767);

  useEffect(() => {
    setIsSwitchAndSearchVisible(width > 767);
  }, [width]);

  function onMobileMenuButtonClick() {
    setIsSwitchAndSearchVisible(!isSwitchAndSearchVisible);
  }

  return (
    <StyledHeader>
      <ProgressBar color={'#036ffc'} />
      <Container>
        <MemoizedBlogTitle name={props.name} />
        <Flex>
          <FocusWrapper
            visible={isSwitchAndSearchVisible}
            onClickOutside={() => {
              if (width <= 767) setIsSwitchAndSearchVisible(false);
            }}
          >
            <>
              {isSwitchAndSearchVisible && (
                <ResponsiveMenuBox>
                  <MemoizedModeSwitch changeThemeMode={props.changeThemeMode} />
                  <SearchMenu />
                </ResponsiveMenuBox>
              )}
            </>
          </FocusWrapper>
          <MemoizedLanguageMenu />
          <AdminMenu isLogin={props.isLogin} />
          <MobileMenuButton onClick={() => onMobileMenuButtonClick()}>
            <FontAwesomeIcon icon={faBars} />
          </MobileMenuButton>
        </Flex>
      </Container>
    </StyledHeader>
  );
}
