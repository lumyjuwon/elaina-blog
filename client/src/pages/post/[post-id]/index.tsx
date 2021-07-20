import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { initApolloClient } from 'src/apollo/withApollo';
import { FIND_POST_BY_ID, FIND_SAME_CATEGORY_POSTS, PostType } from 'src/query/post';
import { GET_COMMENTS, CommentContainerType } from 'src/query/comment';
import { GET_PROFILE, ProfileType } from 'src/query/profile';
import { AppCommonProps } from 'src/pages/_app';

import { ArticleContainer } from './component/article/ArticleContainer';
import { CommentContainer } from './component/comment/CommentContainer';
import { RightSideContainer } from './component/rightside/RightSideContainer';

const Container = styled.div({
  display: 'flex',
  width: '100%',
  maxWidth: '1000px',
  margin: '0 auto',
  justifyContent: 'stretch',
  alignItems: 'flex-start',
  '@media screen and (max-width: 1380px)': {
    width: '100%'
  },
  '@media screen and (max-width: 767px)': {
    overflowX: 'hidden'
  }
});

const ContentContainer = styled.section((props) => ({
  display: 'flex',
  flex: 3,
  margin: '0 2.5rem',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '.5rem',
  backgroundColor: props.theme.articleBackground,
  '@media screen and (max-width: 1380px)': {
    width: '72%'
  },
  '@media screen and (max-width: 767px)': {
    width: '100%',
    margin: '0'
  }
}));

const Comment = styled.section({
  width: '100%'
});

interface ServerSideProps {
  categoryId: number;
  post: PostType;
  comment: CommentContainerType;
  sameCategoryTitles: [{ title: string; _id: number }];
  category: { title: string };
  profile: ProfileType;
}

interface Props extends AppCommonProps, ServerSideProps {}

export default function PostId(props: Props) {
  const commentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  function scrollToComment() {
    window.scrollTo(0, commentRef.current?.offsetTop!);
  }

  return (
    <Container>
      <ContentContainer>
        <ArticleContainer
          title={props.post.title}
          profile={props.profile}
          createdAt={props.post.createdAt}
          article={props.post.article}
          isLogin={props.app.isLogin}
        />
        <Comment ref={commentRef}>
          <CommentContainer
            comments={props.comment}
            isLogin={props.app.isLogin}
            author={props.profile.name!}
            categoryId={props.categoryId}
            postId={props.post._id}
          />
        </Comment>
      </ContentContainer>
      <RightSideContainer commentsCount={props.comment.count} scrollToComment={scrollToComment} />
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (context: GetServerSidePropsContext) => {
  context.res.setHeader('Cache-Control', 'max-age=0, public, must-revalidate');

  const id = context.query['post-id'];

  try {
    const client = initApolloClient({}, context);

    const postQueryResult = await client.query({ query: FIND_POST_BY_ID, variables: { id } });
    const findedPost = postQueryResult.data.findPostById;

    if (!findedPost) {
      return {
        notFound: true
      };
    }

    const commentQueryResult = await client.query({ query: GET_COMMENTS, variables: { _id: findedPost._id } });
    const findedComment = commentQueryResult.data.comments;

    const profileQueryResult = await client.query({ query: GET_PROFILE });
    const profile = profileQueryResult.data.profile;

    const sameCategoryQueryResult = await client.query({
      query: FIND_SAME_CATEGORY_POSTS,
      variables: { categoryId: findedPost.categoryId }
    });
    const sameCategoryPostTitles = sameCategoryQueryResult.data.findSameCategoryPosts;

    return {
      props: {
        categoryId: findedPost.categoryId,
        post: findedPost,
        comment: findedComment,
        sameCategoryTitles: sameCategoryPostTitles.post,
        category: sameCategoryPostTitles.category,
        profile
      }
    };
  } catch (err) {
    console.log(err);
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    };
  }
};
