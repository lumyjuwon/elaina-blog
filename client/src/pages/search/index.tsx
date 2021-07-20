import React from 'react';
import styled from 'styled-components';
import { GetServerSideProps } from 'next';

import { PostType, SEARCH } from 'src/query/post';
import { initApolloClient } from 'src/apollo/withApollo';
import { ResultContainer } from './components/ResultContainer';

const Container = styled.div<{ isEmptyResult?: boolean }>((props) => ({
  display: 'flex',
  width: '100%',
  height: props.isEmptyResult ? 'calc(100vh - 5rem - 20px)' : 'auto',
  flexDirection: 'column',
  alignItems: props.isEmptyResult ? 'center' : 'flex-start',
  justifyContent: props.isEmptyResult ? 'center' : 'flex-start',
  ['& > div:first-child']: {
    marginTop: '0'
  }
}));

const Wrapper = styled.div({
  display: 'flex',
  width: '100%',
  padding: '0 15%',
  margin: '1rem 0',
  flexDirection: 'column',
  alignItems: 'center'
});

const CountContainer = styled.div({
  alignSelf: 'flex-start'
});

const Count = styled.p({
  marginBottom: '.5rem',
  fontSize: '1.3rem',
  fontWeight: 'bold'
});

interface ServerSideProps {
  searchResult: { post: PostType; content: string }[];
}

interface Props extends ServerSideProps {}

export default function SearchPage(props: Props) {
  const searchResults: { post: PostType; content: string }[] = props.searchResult;

  if (searchResults.length === 0) {
    return (
      <Container isEmptyResult>
        <p>검색 결과가 없습니다.</p>
      </Container>
    );
  }

  return (
    <Container>
      <Wrapper>
        <CountContainer>
          <Count>{`검색 결과 ${searchResults.length}건`}</Count>
        </CountContainer>
        <ResultContainer searchResults={searchResults} />
      </Wrapper>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (context) => {
  const keyword = context.query['word'];
  const client = initApolloClient({}, context);

  const { data } = await client.query({ query: SEARCH, variables: { keyword } });

  const searchResult = data.search.result;

  return {
    props: {
      searchResult
    }
  };
};
