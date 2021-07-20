import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { NoRefInputBox } from 'src/components';
import { trans, Lang } from 'src/resources/languages';

const SearchButton = styled.button((props) => ({
  display: 'flex',
  width: '45px',
  height: '45px',
  marginLeft: '5px',
  border: 'none',
  borderRadius: '50%',
  backgroundColor: props.theme.headerBackground,
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.2rem',
  cursor: 'pointer',
  '&:focus': {
    outline: 'none'
  },
  '&:hover': {
    backgroundColor: props.theme.hoverBackground
  },
  '@media screen and (max-width: 767px)': {
    width: '32px',
    height: '32px',
    backgroundColor: props.theme.secondaryContentBackground
  }
}));

const SearchForm = styled.form({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center'
});

export function SearchMenu() {
  const router = useRouter();
  const [searchKeyword, setSearchKeyWord] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (searchKeyword.length < 2) {
      alert('2글자 이상 입력해주세요');
      return;
    }

    router.push({ pathname: '/search', query: { word: searchKeyword } });
  }

  return (
    <SearchForm onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
      <NoRefInputBox
        type='text'
        placeholder={trans(Lang.Search)}
        id='search'
        minLength={2}
        maxLength={10}
        value={searchKeyword}
        styles={{ width: '180px', small: { width: '120px', height: '32px' } }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchKeyWord(e.currentTarget.value)}
      />
      <SearchButton type='submit'>
        <FontAwesomeIcon icon={faSearch} />
      </SearchButton>
    </SearchForm>
  );
}
