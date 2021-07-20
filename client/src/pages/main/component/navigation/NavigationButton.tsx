import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';

interface ButtonProps {
  isSelected: boolean;
}

const NavButtons = styled.a<ButtonProps>((props) => {
  return {
    display: 'flex',
    padding: '.5rem 1rem',
    boxShadow: props.isSelected ? `inset 0 -3px 0 ${props.theme.navUnderBar}` : 'none',
    alignItems: 'center',
    fontSize: '1.25rem',
    cursor: 'pointer',
    transition: '.2s all',
    userSelect: 'none',
    '&:hover': {
      boxShadow: props.isSelected ? `inset 0 -3px 0 ${props.theme.navUnderBar}` : `inset 0 -3px 0 ${props.theme.navHoverUnderBar}`
    }
  };
});

interface Props {
  href?: string;
  query?: string;
  children: JSX.Element;
}

export function NavigationButton(props: Props) {
  const router = useRouter();

  return (
    <Link href={props.href ? props.href : { query: { tab: props.query } }} shallow>
      <NavButtons isSelected={router.query['tab'] === props.query}>{props.children}</NavButtons>
    </Link>
  );
}
