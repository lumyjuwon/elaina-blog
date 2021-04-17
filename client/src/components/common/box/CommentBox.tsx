import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faClock, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';

import { DropDownMenu } from 'src/components';
import { Comment, DELETE_COMMENT, DELETE_REPLY, Reply } from 'src/query/comment';
import { ModalWrapper } from 'src/components';
import { FormatUnifier } from 'src/utils';
import { RootState } from 'src/redux/rootReducer';
import { ThemeMode } from 'src/redux/common/type';
import { theme } from 'src/styles';
import { useApollo } from 'src/apollo/apolloClient';
import { IS_AUTH } from 'src/query/user';
import { Lang, trans } from 'src/resources/languages';
import { InputBox } from './InputBox';

const Container = styled.div({
  width: '100%',
  margin: '.5rem',
  padding: '.5rem',
  borderRadius: '.5rem'
});

const DetailsContainer = styled.div({
  display: 'flex',
  width: '100%',
  height: 'max-content',
  fontSize: '.8rem',
  justifyContent: 'space-between',
  '@media screen and (max-width: 767px)': {
    margin: '0 0 .2rem'
  }
});

const InformationContainer = styled.div({
  display: 'flex',
  fontSize: '.8rem',
  alignItems: 'center',
  '@media screen and (max-width: 767px)': {
    flexDirection: 'column',
    alignItems: 'flex-start'
  }
});

const Author = styled.div({
  marginRight: '.7rem',
  display: 'flex',
  alignItems: 'center',
  '@media screen and (max-width: 767px)': {
    margin: '0 0 .2rem'
  }
});

const Time = styled.span({
  display: 'flex',
  alignItems: 'center'
});

const CommentContent = styled.p({
  margin: '2rem 0',
  display: 'flex',
  alignItems: 'center',
  width: '100%'
});

const MenuButton = styled.p<{ danger?: boolean }>((props) => ({
  display: 'block',
  padding: '.5rem',
  textAlign: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  borderRadius: '.5rem',
  wordBreak: 'keep-all',
  color: props.danger ? '#dd0000' : 'inherit',
  '&:hover': {
    backgroundColor: '#ddd'
  }
}));

const ModalContainer = styled.div((props) => ({
  width: '25rem',
  padding: '.5rem'
}));

const ModalParagraph = styled.p({
  width: '100%'
});

const Password = styled.div({
  margin: '.5rem 0',
  width: '60%'
});

const ModalButtonContainer = styled.div({
  display: 'flex',
  width: '100%',
  marginTop: '1rem',
  alignItems: 'center',
  justifyContent: 'flex-end'
});

const ModalButton = styled.button<{ themeMode?: ThemeMode }>((props) => ({
  width: '4.5rem',
  padding: '.5rem',
  borderRadius: '.5rem',
  marginLeft: '.5rem',
  backgroundColor: props.themeMode ? theme[props.themeMode].dangerButtonColor : 'inherit',
  color: props.themeMode ? theme[props.themeMode].dangerContentText : 'inherit'
}));

interface Props {
  isLogin: boolean;
  isCommentFromAdmin: boolean;
  comment: Comment | Reply;
  author: string;
  commentIndex: number;
  children?: JSX.Element;
  isReply?: boolean;
  replyIndex?: number;
  setDeletedIndex?: React.Dispatch<React.SetStateAction<number>>;
  setDeletedReplyIndex?: React.Dispatch<React.SetStateAction<number>>;
}

export function CommentBox(props: Props) {
  const createdAt = new Date(props.comment.createdAt);
  const themeMode: ThemeMode = useSelector<RootState, any>((state) => state.common.theme);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const router = useRouter();

  const client = useApollo();
  const [deleteReply] = useMutation(DELETE_REPLY);
  const [deleteComment] = useMutation(DELETE_COMMENT);

  async function handleDeleteComment() {
    const AuthResponse = await client.query({ query: IS_AUTH });
    const isAuth = AuthResponse.data.isAuth.isAuth;
    const _id = +router.query['post-id'];

    // Admin can delete all comments
    if (isAuth) {
      try {
        await deleteComment({
          variables: {
            _id,
            index: props.commentIndex
          }
        });

        if (props.setDeletedIndex) props.setDeletedIndex(props.commentIndex);
      } catch (err) {
        alert(err.message);
      }
    }
    // common users can delete only their comment
    else {
      try {
        await deleteComment({
          variables: {
            _id,
            index: props.commentIndex,
            password
          }
        });

        if (props.setDeletedIndex) props.setDeletedIndex(props.commentIndex);
      } catch (err) {
        alert(err.message);
      }
    }
  }

  async function handleDeleteReply() {
    const AuthResponse = await client.query({ query: IS_AUTH });
    const isAuth = AuthResponse.data.isAuth.isAuth;
    const _id = +router.query['post-id'];

    // Admin can delete all replies
    if (isAuth) {
      try {
        await deleteReply({
          variables: {
            _id,
            commentIndex: props.commentIndex,
            replyIndex: props.replyIndex
          }
        });

        if (props.replyIndex !== undefined && props.setDeletedReplyIndex) props.setDeletedReplyIndex(props.replyIndex);
      } catch (err) {
        alert(err);
      }
    }
    // common users can delete only their reply
    else {
      try {
        await deleteReply({
          variables: {
            _id,
            commentIndex: props.commentIndex,
            replyIndex: props.replyIndex,
            password
          }
        });

        if (props.replyIndex !== undefined && props.setDeletedReplyIndex) props.setDeletedReplyIndex(props.replyIndex);
      } catch (err) {
        alert(err);
      }
    }
  }

  return (
    <Container>
      <DetailsContainer>
        <InformationContainer>
          <Author>
            <FontAwesomeIcon icon={faUser} style={{ marginRight: '.5rem' }} />
            <p>{props.comment.isAdmin ? props.author : props.comment.username}</p>
          </Author>
          <Time>
            <FontAwesomeIcon icon={faClock} style={{ marginRight: '.5rem' }} />
            <p>{FormatUnifier.getFullFormatDate(createdAt)}</p>
          </Time>
        </InformationContainer>
        {(props.isLogin || !props.isCommentFromAdmin) && (
          <DropDownMenu
            visible={isMenuOpen}
            mainButton={<FontAwesomeIcon icon={faEllipsisV} />}
            setVisible={setIsMenuOpen}
            dropMenu={
              <>
                {/* admin인경우: 자기것만 edit, 나머지는 edit 버튼 X, admin 아닌경우 edit 버튼 O */}
                {props.isLogin ? (
                  props.comment.isAdmin && <MenuButton onClick={() => {}}>{trans(Lang.Edit)}</MenuButton>
                ) : (
                  <MenuButton onClick={() => {}}>{trans(Lang.Edit)}</MenuButton>
                )}
                <MenuButton
                  danger
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                >
                  {trans(Lang.Delete)}
                </MenuButton>
              </>
            }
          />
        )}
      </DetailsContainer>
      <CommentContent>{props.comment.comment}</CommentContent>
      {props.children}
      <ModalWrapper visible={isModalOpen}>
        <ModalContainer>
          <ModalParagraph>{props.isLogin ? '정말 삭제하시겠습니까?' : '비밀번호를 입력해주세요'}</ModalParagraph>
          {props.isLogin || (
            <Password>
              <InputBox
                id='comment-pw-auth'
                type='password'
                placeholder='Password'
                maxLength={12}
                minLength={4}
                styles={{ width: '100%' }}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            </Password>
          )}
          <ModalButtonContainer>
            <ModalButton
              onClick={() => {
                setIsModalOpen(false);
                if (props.isReply) {
                  handleDeleteReply();
                } else {
                  handleDeleteComment();
                }
              }}
              themeMode={themeMode}
            >
              {props.isLogin ? '예' : '삭제'}
            </ModalButton>
            <ModalButton onClick={() => setIsModalOpen(false)}>{props.isLogin ? '아니요' : '취소'}</ModalButton>
          </ModalButtonContainer>
        </ModalContainer>
      </ModalWrapper>
    </Container>
  );
}
