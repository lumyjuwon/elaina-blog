import React, { useState } from 'react';
import styled from 'styled-components';
import { cloneDeep } from 'lodash';

import { CommentContainerType, CommentType } from 'src/query/comment';
import { trans, Lang } from 'src/resources/languages';

import { CommentWriter } from './writer/CommentWriter';
import { CommentElement } from './CommentElement';

const Container = styled.div({
  display: 'flex',
  width: '100%',
  minHeight: '20rem',
  margin: '20px 0',
  padding: '.5rem 1.5rem',
  flexDirection: 'column',
  jusitfyContent: 'flex-start',
  alignItems: 'center',
  '@media screen and (max-width: 767px)': {
    padding: '.5rem'
  }
});

const Title = styled.span({
  display: 'block',
  width: '100%',
  fontSize: '1.4rem',
  fontWeight: 'bold'
});

const Counter = styled.p({
  width: '100%',
  fontSize: '1.15rem',
  fontWeight: 'bold'
});

interface Props {
  categoryId: number;
  postId: number;
  comments: CommentContainerType;
  isLogin: boolean;
  author: string;
}

export function CommentContainer(props: Props) {
  const [commentContainer, setCommentContainer] = useState<CommentContainerType>(props.comments);

  function addNewComment(newComment: CommentType) {
    setCommentContainer({
      ...commentContainer,
      comments: [...commentContainer.comments, newComment],
      count: commentContainer.count + 1
    });
  }

  function editComment(editIndex: number, comment: string) {
    const comments = cloneDeep(commentContainer.comments);
    comments[editIndex].comment = comment;

    setCommentContainer({
      _id: commentContainer._id,
      comments,
      count: commentContainer.count
    });
  }

  function deleteComment(deleteIndex: number) {
    const decreaseCount = commentContainer.comments[deleteIndex].replies.length + 1;
    const filteredComment = commentContainer.comments.filter((comment, index) => index !== deleteIndex);

    setCommentContainer({
      _id: commentContainer._id,
      comments: filteredComment,
      count: commentContainer.count - decreaseCount
    });
  }

  return (
    <Container>
      <Title>{trans(Lang.Comments)}</Title>
      <CommentWriter
        isLogin={props.isLogin}
        onAddComment={addNewComment}
        categoryId={props.categoryId}
        postId={props.postId}
        commentIndex={commentContainer.comments.length + 1}
      />
      <div style={{ width: '100%' }}>
        <Counter>{`덧글 수: ${commentContainer.count}개`}</Counter>
        {commentContainer &&
          commentContainer.comments.map((comment: CommentType, index: number) => {
            return (
              <CommentElement
                key={index}
                comment={comment}
                isLogin={props.isLogin}
                author={props.author}
                isCommentFromAdmin={comment.isAdmin}
                categoryId={props.categoryId}
                postId={props.postId}
                commentIndex={index}
                count={commentContainer.count}
                commentContainer={commentContainer}
                editComment={editComment}
                deleteComment={deleteComment}
                setCommentContainer={setCommentContainer}
              />
            );
          })}
      </div>
    </Container>
  );
}
