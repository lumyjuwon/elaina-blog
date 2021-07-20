import React, { useState } from 'react';
import styled from 'styled-components';
import { cloneDeep } from 'lodash';

import { BorderBox } from 'src/components';
import { ReplyType, CommentType, CommentContainerType } from 'src/query/comment';
import { trans, Lang } from 'src/resources/languages';

import { CommentBox } from './box/CommentBox';
import { ReplyWriter } from './writer/ReplyWriter';
import { ReplyElement } from './ReplyElement';

const Container = styled.div<{ isAdmin: boolean }>((props) => ({
  borderRadius: '.5rem',
  backgroundColor: props.isAdmin ? props.theme.adminCommentColor : 'inherit'
}));

const ReplyButtonContainer = styled.div({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center'
});

const ReplyButton = styled.span({
  padding: '0 .5rem',
  textAlign: 'right',
  fontSize: '.8rem',
  cursor: 'pointer',
  userSelect: 'none',
  '&:hover': {
    textDecoration: 'solid underline #1f2f3f 1px'
  }
});

const ReplyContainer = styled.div({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center'
});

interface Props {
  comment: CommentType;
  isLogin: boolean;
  author: string;
  isCommentFromAdmin: boolean;
  count: number;
  commentContainer: CommentContainerType;
  categoryId: number;
  postId: number;
  commentIndex: number;
  editComment: (index: number, comment: string) => void;
  deleteComment: (index: number) => void;
  setCommentContainer: React.Dispatch<React.SetStateAction<CommentContainerType>>;
}

export function CommentElement(props: Props) {
  const [isShowingReply, setIsShowingReply] = useState(false);
  const [isAddReply, setIsAddReply] = useState(false);

  function onAddReply(newReply: ReplyType) {
    const copiedComments = cloneDeep(props.commentContainer.comments);
    copiedComments[props.commentIndex].replies.push(newReply);

    props.setCommentContainer({ ...props.commentContainer, comments: copiedComments, count: props.count + 1 });
    setIsAddReply(false);
    setIsShowingReply(true);
  }

  function onEditReply(editReplyIndex: number, reply: string) {
    const copiedComments = cloneDeep(props.commentContainer.comments);
    copiedComments[props.commentIndex].replies[editReplyIndex].comment = reply;

    props.setCommentContainer({ ...props.commentContainer, comments: copiedComments });
  }

  function onDeleteReply(deleteReplyIndex: number) {
    const copiedComments = cloneDeep(props.commentContainer.comments);
    copiedComments[props.commentIndex].replies.splice(deleteReplyIndex, 1);

    props.setCommentContainer({ ...props.commentContainer, comments: copiedComments, count: props.count - 1 });
  }

  return (
    <Container isAdmin={props.isCommentFromAdmin}>
      <BorderBox isHoverEffect={false} styles={{ margin: '1rem 0 0', width: '100%' }}>
        <CommentBox
          isLogin={props.isLogin}
          postId={props.postId}
          isCommentFromAdmin={props.isCommentFromAdmin}
          comment={props.comment}
          author={props.author}
          commentIndex={props.commentIndex}
          editComment={props.editComment}
          deleteComment={props.deleteComment}
        >
          <>
            <ReplyButtonContainer>
              <ReplyButton onClick={() => props.comment.replies.length && setIsShowingReply(!isShowingReply)}>{`${
                isShowingReply ? 'Hide' : `Show ${props.comment.replies.length}`
              } Reply `}</ReplyButton>
              <ReplyButton onClick={() => setIsAddReply(!isAddReply)}>
                {isAddReply ? trans(Lang.Cancel) : trans(Lang.WriteReply)}
              </ReplyButton>
            </ReplyButtonContainer>
            {isAddReply && (
              <ReplyWriter
                isLogin={props.isLogin}
                onAddReply={onAddReply}
                categoryId={props.categoryId}
                postId={props.postId}
                commentIndex={props.commentIndex}
                replyIndex={props.comment.replies.length + 1}
              />
            )}
            <ReplyContainer>
              {isShowingReply
                ? props.comment.replies.map((reply: ReplyType, index: number) => {
                    return (
                      <ReplyElement
                        key={index}
                        postId={props.postId}
                        isLogin={props.isLogin}
                        author={props.author}
                        commentIndex={props.commentIndex}
                        reply={reply}
                        replyIndex={index}
                        editReply={onEditReply}
                        deleteReply={onDeleteReply}
                      />
                    );
                  })
                : null}
            </ReplyContainer>
          </>
        </CommentBox>
      </BorderBox>
    </Container>
  );
}
