import styled from 'styled-components';

import { CategoryDetailType } from 'src/query/category';
import { MemoizedCategoryItem } from './CategoryItem';

const Container = styled.div({
  position: 'sticky',
  top: 'calc(4rem + 20px)',
  width: '300px'
});

const Description = styled.p({
  fontSize: '1.2rem',
  fontWeight: 'bold'
});

const CategoryList = styled.ul({});

// const CategoryTitle = styled.p({
//   display: '-webkit-box',
//   width: '100%',
//   padding: '0 .5rem',
//   wordBreak: 'break-all',
//   textAlign: 'left',
//   overflow: 'hidden',
//   WebkitLineClamp: 1,
//   WebkitBoxOrient: 'vertical'
// });

interface Props {
  categories: CategoryDetailType[];
}

export function CategoryContainer(props: Props) {
  return (
    <Container>
      <Description>Categories</Description>
      <CategoryList>
        {props.categories.map((category) => {
          return <MemoizedCategoryItem key={category.title} title={category.title} id={category._id} />;
        })}
      </CategoryList>
    </Container>
  );
}
