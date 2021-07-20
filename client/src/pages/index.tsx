import React from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

import { initApolloClient } from 'src/apollo/withApollo';
import { GET_LATEST_POSTS, GET_LATEST_POSTS_PER_CATEGORY, LatestPostQueryReturnType } from 'src/query/post';
import { GET_CATEGORIES_WITH_DETAILS, CategoryDetailType } from 'src/query/category';
import { GET_PROFILE, ProfileType } from 'src/query/profile';
import { AboutType, GET_ABOUT } from 'src/query/about';

import { AppCommonProps, appCommponProps } from './_app';
import { MainPageLayout } from './main/component/MainPageLayout';
import { AboutPage } from './main/about/About';
import { MemoizedContentCategory } from './main/category/ContentCategory';
import { PostContainer } from './main/post/PostContainer';

interface ServerSideProps {
  categoryLatestPosts: ({ _id: number; categoryId: number; title: string; article: string } | null)[]; // This will be deprecated
  latestPosts: LatestPostQueryReturnType[];
  profile: ProfileType;
  categories: CategoryDetailType[];
  about: AboutType;
}

interface Props extends AppCommonProps, ServerSideProps {}

export default function Index(props: Props) {
  const router = useRouter();

  if (router.query.tab === 'about') {
    return (
      <MainPageLayout profile={props.profile} isLogin={props.app.isLogin}>
        <AboutPage name={props.profile.name} about={props.about} isLogin={props.app.isLogin} />
      </MainPageLayout>
    );
  }

  if (router.query.tab === 'category') {
    return (
      <MainPageLayout profile={props.profile} isLogin={props.app.isLogin}>
        <MemoizedContentCategory categories={props.categories} latestPosts={props.categoryLatestPosts} isLogin={props.app.isLogin} />
      </MainPageLayout>
    );
  }

  return (
    <MainPageLayout profile={props.profile} isLogin={props.app.isLogin}>
      <PostContainer posts={props.latestPosts} />
    </MainPageLayout>
  );
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (context) => {
  context.res.setHeader('Cache-Control', 'max-age=0, public, must-revalidate');

  const { edit } = context.query;

  if (edit && edit !== 'true') {
    return {
      redirect: {
        permanent: true,
        destination: '/?tab=about'
      }
    };
  }

  if (edit && !appCommponProps.app.isLogin) {
    return {
      redirect: {
        permanent: false,
        destination: '/admin/login?url=%2F'
      }
    };
  }

  const apolloClient = initApolloClient({}, context);
  const [profileQueryResult, categoryQueryResult, categoryLatestPostQueryResult, aboutQueryResult, latestPostsQueryResult] =
    await Promise.all([
      apolloClient.query({ query: GET_PROFILE }),
      apolloClient.query({ query: GET_CATEGORIES_WITH_DETAILS }),
      apolloClient.query({ query: GET_LATEST_POSTS_PER_CATEGORY }),
      apolloClient.query({ query: GET_ABOUT }),
      apolloClient.query({
        query: GET_LATEST_POSTS,
        variables: {
          page: 1
        }
      })
    ]);

  const about = aboutQueryResult.data.about;
  const profile = profileQueryResult.data.profile;
  const categories = categoryQueryResult.data.categoriesWithDetails;
  const categoryLatestPosts = categoryLatestPostQueryResult.data.getLatestPostsEachCategory;
  const latestPosts = latestPostsQueryResult.data.getLatestPosts;

  return {
    props: {
      categoryLatestPosts,
      latestPosts,
      profile,
      categories,
      about
    }
  };
};
