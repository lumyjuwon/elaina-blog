import React from 'react';
import styled from 'styled-components';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { BorderBox } from 'src/components';
import { CircleRippleWrapper } from 'src/components/common/wrapper/CircleRippleWrapper';
import { initApolloClient } from 'src/apollo/withApollo';
import { appCommponProps, AppCommonProps } from 'src/pages/_app';
import { PostType, GET_POSTS } from 'src/query/post';
import { AdminPageLayout } from 'src/pages/admin/component/AdminPageLayout';
import { trans, Lang } from 'src/resources/languages';

import { PageTitle } from '../component/PageTitle';

const Container = styled.div({
  width: '100%'
});

const PostContainer = styled.div({
  width: '100%'
});

const Wrapper = styled.div({
  position: 'relative',
  flex: 1
});

const DeleteButtonWrapper = styled.div({
  position: 'absolute',
  top: '.2rem',
  right: '1rem',
  zIndex: 1,

  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '1px 8px 5px -3px gray'
  }
});

const Content = styled.div({
  padding: '.8rem',
  width: '100%',
  height: '7rem'
});

const PreviewTextWrapper = styled.div({
  width: '100%',
  height: '100%'
});

const PreviewTitle = styled.span({
  flexShrink: 0,
  height: '2rem',
  width: '100%',
  fontSize: '1.4rem',
  fontWeight: 'bold',
  textAlign: 'left',
  wordBreak: 'break-all',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  '@media screen and (max-width: 1380px)': {
    wordBreak: 'break-all'
  }
});

const PreviewContent = styled.span({
  flexShrink: 0,
  width: '100%',
  margin: '.8rem 0 0',
  wordBreak: 'keep-all',
  textAlign: 'left',
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden'
});

interface ServerSideProps {
  posts: PostType[];
}

interface Props extends AppCommonProps, ServerSideProps {}

export default function PostProps(props: Props) {
  // const [posts, setPosts] = useState<PostType[]>(props.posts);

  return (
    <AdminPageLayout>
      <Container>
        <PageTitle title={trans(Lang.BoardManage)} />
        {props.posts.map((post) => {
          return (
            <Link key={post.title + post._id} href={`/post/${post._id}`} passHref>
              <PostContainer>
                <BorderBox isHoverEffect={true} styles={{ width: '100%', margin: '.8rem 0' }}>
                  <Wrapper>
                    <DeleteButtonWrapper>
                      <CircleRippleWrapper
                        onClick={(event) => {
                          event.stopPropagation();
                          // setDeletedPost({ isModalOpen: true, index });
                          alert('준비중');
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} style={{ fontSize: '1.25rem' }} />
                      </CircleRippleWrapper>
                    </DeleteButtonWrapper>
                    <Content>
                      <PreviewTextWrapper>
                        <PreviewTitle>{post.title}</PreviewTitle>
                        <PreviewContent>{post.article}</PreviewContent>
                      </PreviewTextWrapper>
                    </Content>
                  </Wrapper>
                </BorderBox>
              </PostContainer>
            </Link>
          );
        })}
      </Container>
    </AdminPageLayout>
  );
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (context) => {
  if (!appCommponProps.app.isLogin) {
    return {
      redirect: {
        permanent: false,
        destination: '/admin/login?url=%2Fadmin%2Fposts'
      }
    };
  }

  const client = initApolloClient({}, context);
  const { data } = await client.query({ query: GET_POSTS });
  const posts = data.posts;

  return {
    props: {
      posts
    }
  };
};
