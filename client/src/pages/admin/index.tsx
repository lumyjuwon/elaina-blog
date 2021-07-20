import React from 'react';
import styled from 'styled-components';
import { GetServerSideProps } from 'next';

import { initApolloClient } from 'src/apollo/withApollo';
import { CommentLogType, GET_COMMENT_LOGS } from 'src/query/comment-log';
import CommnetLogBox from 'src/pages/admin/component/CommentLogItem/CommentLogBox';
import { GET_CATEGORIES_WITH_DETAILS, CategoryDetailType } from 'src/query/category';
import { PostType, GET_POSTS } from 'src/query/post';
import { trans, Lang } from 'src/resources/languages';

import { AdminPageLayout } from './component/AdminPageLayout';
import { PageTitle } from './component/PageTitle';
import { AppCommonProps, appCommponProps } from '../_app';

interface ServerSideProps {
  logs: CommentLogType[];
  categoriesDetail: CategoryDetailType[];
  posts: PostType[];
}

interface Props extends AppCommonProps, ServerSideProps {}

const Container = styled.div({
  width: '100%'
});

export default function Admin(props: Props) {
  return (
    <AdminPageLayout>
      <Container>
        <PageTitle title={trans(Lang.Activities)} />
        {props.logs.map((log) => {
          /*category title 찾아주기*/
          const findCategoryTitle = props.categoriesDetail.find((category) => category._id === log.categoryId)?.title!;
          const findPostTitle = props.posts.find((post) => post._id === log._id)?.title!;
          return (
            <CommnetLogBox
              key={log._id}
              isEvent={log.replyIndex}
              time={log.time}
              postId={log.postId}
              categoryTitle={findCategoryTitle}
              postTitle={findPostTitle}
            />
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
        destination: '/admin/login?url=%2Fadmin'
      }
    };
  }

  context.res.setHeader('Cache-Control', 'max-age=0, public, must-revalidate');

  const client = initApolloClient({}, context);
  const { data: CommentData } = await client.query({ query: GET_COMMENT_LOGS });
  const { data: CategoryData } = await client.query({ query: GET_CATEGORIES_WITH_DETAILS });
  const { data: PostTitle } = await client.query({ query: GET_POSTS });
  const logs: CommentLogType[] = CommentData.commentLogs;
  const categoriesDetail = CategoryData.categoriesWithDetails;
  const posts = PostTitle.posts;
  return {
    props: {
      logs,
      categoriesDetail,
      posts
    }
  };
};
