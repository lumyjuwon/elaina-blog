import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { BorderBox } from 'src/components';
import { Reply, Comment, Comments } from 'src/query/comment';
import { trans, Lang } from 'src/resources/languages';

import { CommentBox } from './CommentBox';
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
  comment: Comment;
  isLogin: boolean;
  author: string;
  isCommentFromAdmin: boolean;
  count: number;
  commentContainer: Comments;
  categoryId: number;
  postId: number;
  commentIndex: number;
  setCommentContainer: React.Dispatch<React.SetStateAction<Comments>>;
  setDeletedIndex: React.Dispatch<React.SetStateAction<number>>;
}

export function CommentElement(props: Props) {
  const [isShowingReply, setIsShowingReply] = useState(false);
  const [isAddReply, setIsAddReply] = useState(false);
  const [replies, setReplies] = useState<Reply[]>(props.comment.replies);
  const [deletedReplyIndex, setDeletedReplyIndex] = useState(-1);

  useEffect(() => {
    if (deletedReplyIndex > -1) {
      setReplies([...replies.filter((reply, index) => index !== deletedReplyIndex)]);

      props.commentContainer.comments[props.commentIndex].replies.splice(deletedReplyIndex, 1);
      const newComments = props.commentContainer.comments;

      props.setCommentContainer({ ...props.commentContainer, comments: newComments, count: props.count - 1 });
    }
    setDeletedReplyIndex(-1);
  }, [deletedReplyIndex]);

  function onAddReply(newReply: Reply) {
    setReplies([...replies, newReply]);

    props.commentContainer.comments[props.commentIndex].replies.push(newReply);
    const newComments = props.commentContainer.comments;

    props.setCommentContainer({ ...props.commentContainer, comments: newComments, count: props.count + 1 });
    setIsAddReply(false);
    setIsShowingReply(true);
  }

  return (
    <Container isAdmin={props.isCommentFromAdmin}>
      <BorderBox isTransform={false} styles={{ margin: '1rem 0 0', width: '100%' }}>
        <CommentBox
          isLogin={props.isLogin}
          postId={props.postId}
          isCommentFromAdmin={props.isCommentFromAdmin}
          comment={props.comment}
          author={props.author}
          commentIndex={props.commentIndex}
          setDeletedIndex={props.setDeletedIndex}
        >
          <>
            <ReplyButtonContainer>
              <ReplyButton onClick={() => replies.length && setIsShowingReply(!isShowingReply)}>{`${
                isShowingReply ? 'Hide' : `Show ${replies.length}`
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
                replyIndex={replies.length + 1}
              />
            )}
            <ReplyContainer>
              {isShowingReply
                ? replies.map((reply: Reply, index: number) => {
                    return (
                      <ReplyElement
                        key={index}
                        postId={props.postId}
                        isLogin={props.isLogin}
                        author={props.author}
                        commentIndex={props.commentIndex}
                        reply={reply}
                        replyIndex={index}
                        setDeletedReplyIndex={setDeletedReplyIndex}
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
