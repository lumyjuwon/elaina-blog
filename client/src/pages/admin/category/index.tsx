import React, { useState } from 'react';
import styled from 'styled-components';
import { GetServerSideProps } from 'next';

import { initApolloClient } from 'src/apollo/withApollo';
import { appCommponProps, AppCommonProps } from 'src/pages/_app';
import { CategoryDetailType, GET_CATEGORIES_WITH_DETAILS } from 'src/query/category';
import { trans, Lang } from 'src/resources/languages';

import { AdminPageLayout } from '../component/AdminPageLayout';
import { CategoryContainer } from './component/CategoryContainer';
import { PageTitle } from '../component/PageTitle';

const Container = styled.div({
  width: '100%'
});

interface ServerSideProps {}

interface Props extends AppCommonProps, ServerSideProps {
  categories: CategoryDetailType[];
}

export default function Category(props: Props) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <AdminPageLayout>
      <Container>
        <PageTitle title={trans(Lang.CategoryManage)} />
        <CategoryContainer categories={props.categories} isAddModalOpen={isAddModalOpen} setIsAddModalOpen={setIsAddModalOpen} />
      </Container>
    </AdminPageLayout>
  );
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (context) => {
  if (!appCommponProps.app.isLogin) {
    return {
      redirect: {
        permanent: false,
        destination: '/admin/login?url=%2Fadmin%2Fcategory'
      }
    };
  }

  context.res.setHeader('Cache-Control', 'max-age=0, public, must-revalidate');

  const client = initApolloClient({}, context);
  const { data } = await client.query({ query: GET_CATEGORIES_WITH_DETAILS });

  const categories = data.categoriesWithDetails;

  return {
    props: {
      categories
    }
  };
};
