import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Move = keyframes({
  from: {
    opacity: 0,
    transform: 'translateX(-1rem)'
  },
  to: {
    opacity: 1,
    transform: 'translateX(0)'
  }
});

const Container = styled.nav(
  (props) => ({
    display: 'flex',
    position: 'sticky',
    top: 'calc(4rem + 20px)',
    width: '250px',
    height: 'calc(100vh - 4rem - 20px)',
    paddingLeft: '1rem',
    marginRight: '.5rem',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '0'
    },
    '@media screen and (max-width: 1380px)': {
      width: '28%',
      minWidth: '240px'
    },
    '@media screen and (max-width: 767px)': {
      position: 'fixed',
      top: '5rem',
      left: 0,
      width: '50%',
      minWidth: '250px',
      height: 'calc(100vh - 5rem)',
      backgroundColor: props.theme.secondaryContentBackground,
      borderRadius: '0 .5rem .5rem 0',
      boxShadow: `6px 0 6px -6px ${props.theme.shadowColor}`,
      zIndex: 1
    }
  }),
  css`
    @media screen and (max-width: 767px) {
      animation: 0.4s ${Move} forwards;
    }
  `
);

const FlexWrapper = styled.div({
  display: 'flex',
  width: '100%',
  height: '3rem',
  padding: '.5rem',
  alignItems: 'center',
  justifyContent: 'space-between'
});

const CategoryName = styled.p({
  fontSize: '1.4rem',
  fontWeight: 'bold',
  maxWidth: '90%',
  wordBreak: 'break-all'
});

const WriteButton = styled.button({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '4px 5px',
  borderRadius: '50%',
  '&:hover': {
    backgroundColor: '#eee'
  }
});

const TitleContainer = styled.ul({
  width: '100%',
  margin: '0',
  padding: '0 .5rem',
  borderRadius: '0 .5rem 0 0',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    display: 'none'
  }
});

const TitleList = styled.li<{ currentNav: boolean }>((props) => ({
  width: '100%',
  padding: '.5rem',
  borderLeft: props.currentNav ? '2px solid #867dff' : 'none',
  borderBottom: `1px solid ${props.theme.borderColor}`,
  cursor: 'pointer',
  listStyle: 'none',
  fontWeight: props.currentNav ? 'bold' : 'normal',
  color: props.currentNav ? '#867dff' : 'inherit',
  textDecoration: props.currentNav ? 'underline' : 'none',
  transition: '.2s all',
  '&:hover': {
    color: props.theme.mainText,
    marginLeft: '.35rem',
    borderLeft: `2px solid ${props.theme.hoverBorderColor}`,
    fontWeight: 'bolder',
    textDecoration: 'underline'
  }
}));

const Title = styled.span({
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical'
});

interface Props {
  titles: [{ title: string; _id: number }];
  currentPostId: number;
  category: { title: string };
  isLogin: boolean;
}

export function PostCategory(props: Props) {
  const router = useRouter();

  function handleWriteButtonClick() {
    router.push({ pathname: '/admin/writer', query: { category: props.category.title } });
  }

  return (
    <Container>
      <FlexWrapper>
        <CategoryName>{props.category.title}</CategoryName>
        {props.isLogin && (
          <WriteButton onClick={() => handleWriteButtonClick()}>
            <FontAwesomeIcon icon={faPlus} />
          </WriteButton>
        )}
      </FlexWrapper>
      <TitleContainer>
        {props.titles.map(({ title, _id }) => {
          return (
            <TitleList key={`${title}${_id}`} currentNav={props.currentPostId === _id}>
              <Link href={`/post/${_id}`} passHref>
                <Title>{title}</Title>
              </Link>
            </TitleList>
          );
        })}
      </TitleContainer>
    </Container>
  );
}
