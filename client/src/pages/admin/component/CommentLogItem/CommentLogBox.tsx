import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { FormatUnifier } from 'src/utils';

const Context = styled.div({
  display: 'flex',
  float: 'left',
  width: '700px',
  height: '7rem',
  padding: '.8rem',
  marginTop: '5px',
  marginBottom: '20px',
  border: '1px solid ',
  borderColor: '#dfe0e2',
  borderRadius: '.4rem',
  justifyContent: 'left',
  flexDirection: 'column',
  '&:hover > p': {
    color: '#50a3f1',
    cursor: 'pointer'
  }
});

const CategoryTitle = styled.p({
  paddingBottom: '0.5rem',
  fontSize: '25px',
  fontWeight: 'bold'
});

const PostTitle = styled.p({
  fontSize: '18px'
});

const EventAndDate = styled.p({
  opacity: '0.5'
});

const UserImage = styled.img({
  display: 'block',
  float: 'left',
  width: '40px',
  height: '40px',
  marginRight: '5px',
  objectFit: 'cover',
  '@media screen and (max-width: 1380px)': {
    width: '40px'
  }
});

interface Props {
  time: number;
  categoryTitle: string;
  postId: number;
  postTitle: string;
  isEvent: number | null;
}

export default function CommentLogBox(props: Props) {
  const dateDifferent = FormatUnifier.calculateDate(props.time);
  const event = props.isEvent === null ? `User upload new comment ${dateDifferent}` : `User upload new reply ${dateDifferent}`;
  return (
    <div>
      {/* <UserImage src='/public/images/FakeProfile.png'></UserImage> */}
      <Link href={`post/${props.postId}`}>
        <Context>
          <CategoryTitle>{props.categoryTitle}</CategoryTitle>
          <PostTitle>{props.postTitle}</PostTitle>
          <EventAndDate>{event}</EventAndDate>
        </Context>
      </Link>
    </div>
  );
}
