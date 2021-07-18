import React, { useState } from 'react';
import styled from 'styled-components';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useMutation } from '@apollo/client';

import { BorderBox, ModalWrapper } from 'src/components';
import { CircleRippleWrapper } from 'src/components/common/wrapper/CircleRippleWrapper';
import { initApolloClient } from 'src/apollo/withApollo';
import { appCommponProps, AppCommonProps } from 'src/pages/_app';
import { Post, GET_POSTS } from 'src/query/post';
import { AdminPageLayout } from 'src/pages/admin/component/AdminPageLayout';
import { ThemeMode } from 'src/redux/common/type';
import { theme } from 'src/styles';
import { RootState } from 'src/redux/rootReducer';
import { useApollo } from 'src/apollo/apolloClient';
import { IS_AUTH } from 'src/query/user';
import { DELETE_POST, FIND_SAME_CATEGORY_POSTS } from 'src/query/post';
import { DELETE_POST_ALL_COMMENT_LOG } from 'src/query/comment-log';
import { trans, Lang } from 'src/resources/languages';

import { PageTitle } from '../component/PageTitle';
import { BoardTable } from './component/BoardTable';

const Container = styled.div({
  width: '100%'
});

const PostListContainer = styled.div({
  width: '100%',
  padding: '.5rem'
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

const ModalContainer = styled.div({
  width: '20rem',
  padding: '.5rem'
});

const ModalParagraph = styled.p({
  width: '100%'
});

const ModalButtonContainer = styled.div({
  display: 'flex',
  width: '100%',
  marginTop: '1rem',
  alignItems: 'center',
  justifyContent: 'flex-end'
});

const ModalButton = styled.button<{ themeMode?: ThemeMode }>((props) => ({
  width: '4.5rem',
  padding: '.5rem',
  borderRadius: '.5rem',
  marginLeft: '.5rem',
  backgroundColor: props.themeMode ? theme[props.themeMode].dangerButtonColor : 'inherit',
  color: props.themeMode ? theme[props.themeMode].dangerContentText : 'inherit'
}));

interface ServerSideProps {
  posts: Post[];
}

interface Props extends AppCommonProps, ServerSideProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PostProps(props: Props) {
  const [posts, setPosts] = useState<Post[]>(props.posts);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [deletePostID, setDeletePostID] = useState(0);

  const themeMode: ThemeMode = useSelector<RootState, any>((state) => state.common.theme);

  const router = useRouter();
  const client = useApollo();

  const [deletePost] = useMutation(DELETE_POST);
  const [deletePostAllCommentLog] = useMutation(DELETE_POST_ALL_COMMENT_LOG);

  const id = deletePostID;

  async function handleDeleteButtonClick() {
    const authResponse = await client.query({ query: IS_AUTH });

    const isAdmin = authResponse.data.isAuth.isAuth;

    if (isAdmin) {
      // alert(`(test) 글을 삭제합니다. [id: ${id}]`);

      try {
        const deleteResponse = await deletePost({
          variables: {
            id: +id
          }
        });

        1;

        window.location.reload();

        await deletePostAllCommentLog({
          variables: {
            postId: +id
          }
        });
      } catch (err) {
        alert(err.message);
      }
    } else {
      return router.push('/admin/login');
    }
  }

  return (
    <AdminPageLayout>
      <PostListContainer>
        <Container>
          <PageTitle title={trans(Lang.BoardManage)} />
          <BoardTable title='글 제목' date='작성일' like='좋아요 수'></BoardTable>

          {posts.map((post) => {
            return (
              <BoardTable title={post.title} date='--' like='00'></BoardTable>

              // <Link key={post.title + post._id} href={`/post/${post._id}`} passHref>
              //   <PostContainer>
              //     <BorderBox isTransform={true} styles={{ width: '100%', margin: '.8rem 0' }}>
              //       <Wrapper>
              //         <DeleteButtonWrapper>
              //           <CircleRippleWrapper
              //             onClick={(event) => {
              //               event.stopPropagation();
              //               // setDeletedPost({ isModalOpen: true, index });
              //               // alert('준비중');

              //               setIsModalOpen(true);
              //               setDeletePostID(post._id);
              //             }}
              //           >
              //             <FontAwesomeIcon icon={faTrash} style={{ fontSize: '1.25rem' }} />
              //           </CircleRippleWrapper>
              //         </DeleteButtonWrapper>
              //         <Content>
              //           <PreviewTextWrapper>
              //             <PreviewTitle>{post.title}</PreviewTitle>
              //             <PreviewContent>{post.article}</PreviewContent>
              //           </PreviewTextWrapper>
              //         </Content>
              //       </Wrapper>
              //     </BorderBox>
              //   </PostContainer>
              // </Link>
            );
          })}

          <ModalWrapper visible={isModalOpen}>
            <ModalContainer>
              <ModalParagraph>정말 삭제하시겠습니까?</ModalParagraph>
              <ModalButtonContainer>
                <ModalButton
                  onClick={() => {
                    setIsModalOpen(false);
                    handleDeleteButtonClick();
                  }}
                  themeMode={themeMode}
                >
                  예
                </ModalButton>
                <ModalButton onClick={() => setIsModalOpen(false)}>아니요</ModalButton>
              </ModalButtonContainer>
            </ModalContainer>
          </ModalWrapper>
        </Container>
      </PostListContainer>
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
