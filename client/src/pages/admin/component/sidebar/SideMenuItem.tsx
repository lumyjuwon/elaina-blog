import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';

const MenuContainer = styled.nav<{ currentNav: boolean }>((props) => ({
  listStyle: 'none',
  width: '100%',
  padding: '.5rem',
  borderLeft: props.currentNav ? props.theme.navList.selectedBorderLeft : 'none',
  borderBottom: `1px solid ${props.theme.borderColor}`,
  cursor: 'pointer',
  fontWeight: props.currentNav ? 'bold' : 'normal',
  color: props.currentNav ? props.theme.navList.selectedColor : 'inherit',
  textDecoration: props.currentNav ? 'underline' : 'none',
  transition: '.2s all',
  userSelect: 'none',
  '&:hover': {
    color: props.theme.navList.hoverColor,
    marginLeft: props.theme.navList.hoverMarginLeft,
    borderLeft: props.theme.navList.hoverBorderLeft,
    fontWeight: 'bolder'
  }
}));

const Menu = styled.p({
  listStyle: 'none',
  width: '100%',
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline'
  }
});

interface Props {
  menu: string;
  href?: string;
  onClick?: () => void;
}

export function SideMenuItem(props: Props) {
  // const themeMode: ThemeMode = useSelector<RootState, any>((state) => state.common.theme);

  const router = useRouter();

  if (props.href) {
    return (
      <MenuContainer currentNav={router.pathname === props.href}>
        <Link href={props.href}>
          <a>
            <Menu>{props.menu}</Menu>
          </a>
        </Link>
      </MenuContainer>
    );
  } else {
    return (
      <MenuContainer currentNav={false}>
        <Menu
          onClick={() => {
            if (props.onClick) {
              props.onClick();
            }
          }}
        >
          {props.menu}
        </Menu>
      </MenuContainer>
    );
  }
}
