import { useMutation } from '@apollo/client';

import { CommentType, DELETE_COMMENT, EDIT_COMMENT, ReplyType } from 'src/query/comment';
import { DELETE_COMMENT_LOG } from 'src/query/comment-log';
import { useApollo } from 'src/apollo/apolloClient';
import { IS_AUTH } from 'src/query/user';

import { CommentBoxLayout } from './BoxLayout';

interface Props {
  isLogin: boolean;
  postId: number;
  isCommentFromAdmin: boolean;
  comment: CommentType | ReplyType;
  author: string;
  commentIndex: number;
  editComment: (index: number, comment: string) => void;
  deleteComment: (index: number) => void;
  children?: JSX.Element;
}

export function CommentBox(props: Props) {
  const client = useApollo();
  const [deleteComment] = useMutation(DELETE_COMMENT);
  const [editComment] = useMutation(EDIT_COMMENT);
  const [deleteCommentLog] = useMutation(DELETE_COMMENT_LOG);

  async function handleEditComment(commentContent: string, password: string) {
    if (!commentContent) {
      throw new Error('내용을 입력해 주세요.');
    }

    const AuthResponse = await client.query({ query: IS_AUTH });
    const isAuth = AuthResponse.data.isAuth.isAuth;

    if (isAuth) {
      await editComment({
        variables: {
          _id: props.postId,
          index: props.commentIndex,
          newComment: commentContent
        }
      });
    } else {
      await editComment({
        variables: {
          _id: props.postId,
          index: props.commentIndex,
          newComment: commentContent,
          password
        }
      });
    }

    props.editComment(props.commentIndex, commentContent);
  }

  async function handleDeleteComment(password: string) {
    const AuthResponse = await client.query({ query: IS_AUTH });
    const isAuth = AuthResponse.data.isAuth.isAuth;

    // Admin can delete all comments
    if (isAuth) {
      try {
        await deleteComment({
          variables: {
            _id: props.postId,
            index: props.commentIndex
          }
        });
      } catch (err) {
        alert(err.message);
        return;
      }
    }
    // common users can delete only their comment
    else {
      try {
        await deleteComment({
          variables: {
            _id: props.postId,
            index: props.commentIndex,
            password
          }
        });
      } catch (err) {
        alert(err.message);
        return;
      }
    }

    try {
      deleteCommentLog({
        variables: {
          postId: props.postId,
          commentIndex: props.commentIndex + 1
        }
      });
    } catch (err) {
      alert(err.message);
    }

    props.deleteComment(props.commentIndex);
  }

  return (
    <CommentBoxLayout
      isLogin={props.isLogin}
      comment={props.comment}
      author={props.author}
      onEdit={handleEditComment}
      onDelete={handleDeleteComment}
    >
      {props.children}
    </CommentBoxLayout>
  );
}
