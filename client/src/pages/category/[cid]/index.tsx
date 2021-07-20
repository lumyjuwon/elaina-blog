import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { GET_CATEGORIES_WITH_DETAILS, CategoryDetailType } from 'src/query/category';
import { initApolloClient } from 'src/apollo/withApollo';
import { FIND_SAME_CATEGORY_POSTS } from 'src/query/post';

import { PostContainer } from './component/PostContainer';
import { CategoryContainer } from './component/CategoryContainer';

const Container = styled.div({
  display: 'flex',
  width: '1200px',
  margin: '0 auto',
  alignItems: 'flex-start',
  justifyContent: 'center'
});

interface ServerSideProps {
  categoryData: CategoryDetailType[];
  postData: { _id: number; title: string; article: string }[];
}

interface Props extends ServerSideProps {}

export default function CategoryPage(props: Props) {
  const router = useRouter();

  const cid = router.asPath.split('/')[2];
  const postCount = props.categoryData.filter((category) => category._id === +cid)[0].postCount;

  return (
    <Container>
      <CategoryContainer categories={props.categoryData} />
      <PostContainer posts={props.postData} postCount={postCount || 0} />
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (context) => {
  context.res.setHeader('Cache-Control', 'max-age=0, public, must-revalidate');

  const categoryId = context.resolvedUrl.split('/')[2];
  const apolloClient = initApolloClient({}, context);

  const { data: categoryData } = await apolloClient.query({ query: GET_CATEGORIES_WITH_DETAILS });
  const { data: postData } = await apolloClient.query({
    query: FIND_SAME_CATEGORY_POSTS,
    variables: { categoryId: Number.parseInt(categoryId) }
  });

  return {
    props: {
      categoryData: categoryData.categoriesWithDetails,
      postData: postData.findSameCategoryPosts.post
    }
  };
};
