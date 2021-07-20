import React from 'react';
import styled from 'styled-components';

import { BorderBox } from 'src/components';
import { CategoryDetailType } from 'src/query/category';

import { ContentCategoryDetails } from './ContentCategoryDetails';

const Content = styled.div({
  display: 'flex',
  width: '100%',
  padding: '.8rem',
  justifyContent: 'center',
  alignItems: 'center'
});

// const PreviewImage = styled.img({
//   display: 'block',
//   float: 'right',
//   width: '260px',
//   height: '8.4rem',
//   marginLeft: '1rem',
//   objectFit: 'cover',
//   overflow: 'hidden',
//   '@media screen and (max-width: 1380px)': {
//     width: '32%',
//     marginLeft: '3%'
//   }
// });

const PreviewTextWrapper = styled.div({
  display: 'flex',
  width: '100%',
  height: '8.4rem',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  '&:hover': {
    cursor: 'ponter'
  }
});

const LatestPostTitle = styled.p<{ null?: boolean }>((props) => ({
  display: '-webkit-box',
  width: '100%',
  height: '1.8rem',
  flexShrink: 0,
  textAlign: 'left',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  wordBreak: 'break-all',
  overflow: 'hidden',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  '&:hover': {
    cursor: props.null ? 'default' : 'pointer'
  },
  '@media screen and (max-width: 1380px)': {}
}));

// const LatestPostArticle = styled.p<{ null?: boolean }>((props) => ({
//   display: '-webkit-box',
//   width: '100%',
//   height: '4.5rem',
//   flexShrink: 0,
//   fontSize: '1.0rem',
//   margin: '.25rem 0 0',
//   wordBreak: 'keep-all',
//   textAlign: 'left',
//   overflow: 'hidden',
//   WebkitLineClamp: 3,
//   WebkitBoxOrient: 'vertical',
//   '&:hover': {
//     cursor: props.null ? 'default' : 'pointer'
//   }
// }));

interface Props {
  category: CategoryDetailType;
  latestPost: { _id: number; categoryId: number; title: string; article: string } | null;
  isLogin?: boolean;
  isEmpty?: boolean;
}

export function ContentCategoryItem(props: Props) {
  if (props.latestPost === null) {
    return (
      <BorderBox isHoverEffect={false} styles={{ width: '100%', margin: '.8rem 0' }}>
        <Content>
          <PreviewTextWrapper>
            <LatestPostTitle null={!props.isLogin}>{props.category.title}</LatestPostTitle>
            {/* <LatestPostArticle null={!props.isLogin}></LatestPostArticle> */}
            {/* <ContentCategoryDetails time={props.category.recentCreatedAt} count={props.category.postCount} /> */}
            <ContentCategoryDetails time={props.category.recentCreatedAt} count={props.category.postCount} />
          </PreviewTextWrapper>
          {/* {!(width <= 767) && <PreviewImage src={props.category.previewImage} alt={`${props.category.title} preview image`} />} */}
        </Content>
      </BorderBox>
    );
  }

  return (
    <BorderBox isHoverEffect={props.isEmpty ? false : true} styles={{ width: '100%', margin: '.8rem 0' }}>
      <Content>
        <PreviewTextWrapper>
          <LatestPostTitle>{props.category.title}</LatestPostTitle>
          {/* <LatestPostArticle>{props.latestPost.article}</LatestPostArticle> */}
          {/* <ContentCategoryDetails time={props.category.recentCreatedAt} count={props.category.postCount} /> */}
          <ContentCategoryDetails time={props.category.recentCreatedAt} count={props.category.postCount} />
        </PreviewTextWrapper>
        {/* {!(width <= 767) && <PreviewImage src={props.category.previewImage} alt={`${props.category.title} preview image`} />} */}
      </Content>
    </BorderBox>
  );
}
