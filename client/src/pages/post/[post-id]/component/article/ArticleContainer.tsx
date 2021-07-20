import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { DELETE_POST, FIND_SAME_CATEGORY_POSTS } from 'src/query/post';
import { IS_AUTH } from 'src/query/user';
import { useApollo } from 'src/apollo/apolloClient';
import { ProfileType } from 'src/query/profile';

import { ArticleMenu } from './ArticleMenu';
import { DELETE_POST_ALL_COMMENT_LOG } from 'src/query/comment-log';
import { MemoizedArticle } from './Article';

interface ModalProps {
  visible: boolean;
  onDelete: () => void;
  onCancel: () => void;
}

const DynamicDeleteModal = dynamic<ModalProps>(() => import('./DeleteModal').then((mod) => mod.DeleteModal));

const Container = styled.main({
  display: 'flex',
  width: '100%',
  minHeight: 'calc(100vh - 5rem - 40px)',
  padding: '.5rem 1.5rem',
  flexDirection: 'column',
  jusitfyContent: 'flex-start',
  alignItems: 'center',
  '@media screen and (max-width: 767px)': {
    padding: '.5rem'
  }
});

const Title = styled.title({
  display: 'block',
  width: '100%',
  fontSize: '2.5rem',
  fontWeight: 'bold',
  '@media screen and (max-width: 767px)': {
    fontSize: '2rem'
  }
});

interface Props {
  title: string;
  profile: ProfileType;
  createdAt: number;
  article: string;
  isLogin: boolean;
}

export function ArticleContainer(props: Props) {
  const time = new Date(props.createdAt);

  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const client = useApollo();
  const [deletePost] = useMutation(DELETE_POST);
  const [deletePostAllCommentLog] = useMutation(DELETE_POST_ALL_COMMENT_LOG);

  const id = router.query['post-id']!;

  async function handleDeleteButtonClick() {
    const authResponse = await client.query({ query: IS_AUTH });

    const isAdmin = authResponse.data.isAuth.isAuth;

    if (isAdmin) {
      try {
        const [deleteResponse] = await Promise.all([
          deletePost({
            variables: {
              id: +id
            }
          }),
          deletePostAllCommentLog({
            variables: {
              postId: +id
            }
          })
        ]);

        const categoryId = deleteResponse.data.deletePost.categoryId;
        const { data } = await client.query({ query: FIND_SAME_CATEGORY_POSTS, variables: { categoryId } });

        if (data.findSameCategoryPosts.post.length === 0) {
          router.push('/');
        } else {
          const lastPostId = data.findSameCategoryPosts.post[0]._id;
          router.push(`/post/${lastPostId}`);
        }
      } catch (err) {
        alert(err.message);
      }
    } else {
      return alert('Invalid User');
    }

    setIsModalOpen(false);
  }

  function handleCancelButtonClick() {
    setIsModalOpen(false);
  }

  return (
    <Container>
      <Title>{props.title}</Title>
      <ArticleMenu isLogin={props.isLogin} time={time} profile={props.profile} id={id as string} setIsModalOpen={setIsModalOpen} />
      <MemoizedArticle article={props.article} />
      <DynamicDeleteModal visible={isModalOpen} onDelete={handleDeleteButtonClick} onCancel={handleCancelButtonClick} />
    </Container>
  );
}
