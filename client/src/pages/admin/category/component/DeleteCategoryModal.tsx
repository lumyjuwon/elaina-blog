import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';

import { ModalWrapper } from 'src/components';
import { DELETE_CATEGORY } from 'src/query/category';
import { useApollo } from 'src/apollo/apolloClient';
import { IS_AUTH } from 'src/query/user';

const ModalContainer = styled.div({
  width: '25rem',
  padding: '.5rem'
});

const ModalParagraph = styled.p({
  width: '100%'
});

const ModalButtonContainer = styled.div({
  display: 'flex',
  width: '100%',
  marginTop: '1rem',
  alignItems: 'center',
  justifyContent: 'flex-end'
});

const ModalButton = styled.button<{ delete?: boolean }>((props) => ({
  width: '4.5rem',
  padding: '.5rem',
  marginLeft: '.5rem',
  borderRadius: '.5rem',
  backgroundColor: props.delete ? props.theme.dangerButton.buttonColor : 'inherit',
  color: props.delete ? props.theme.dangerButton.textColor : 'inherit'
}));

export interface DeleteModalProps {
  visible: boolean;
  index: number;
  deleteCategory: (index: number) => void;
  setGreenAlert: (msg: string) => void;
  setRedAlert: (err: any) => void;
  endDeleteModal: () => void;
}

export function DeleteCategoryModal(props: DeleteModalProps) {
  const router = useRouter();

  const client = useApollo();
  const [deleteCategory] = useMutation(DELETE_CATEGORY);

  async function handleDeleteCategory() {
    const authResponse = await client.query({ query: IS_AUTH });

    if (!authResponse.data.isAuth.isAuth) {
      alert('auth failed');
      return router.push('/admin/login');
    }

    if (props.index === undefined) {
      return;
    }

    try {
      const { data } = await deleteCategory({
        variables: {
          index: props.index
        }
      });

      // response check
      if (data.deleteCategory.isSuccess) {
        props.deleteCategory(props.index);
        props.setGreenAlert('Category deleted successfully.');
      } else {
        props.setRedAlert({ message: 'Cannot delete category...' });
      }
    } catch (err) {
      props.setRedAlert(err);
    }
  }

  return (
    <ModalWrapper visible={props.visible}>
      <ModalContainer>
        <ModalParagraph>{`정말 삭제하시겠습니까?\n 글은 최신글로 이동됩니다.`}</ModalParagraph>
        <ModalButtonContainer>
          <ModalButton
            onClick={() => {
              props.endDeleteModal();
              handleDeleteCategory();
            }}
            delete
          >
            예
          </ModalButton>
          <ModalButton onClick={() => props.endDeleteModal()}>아니요</ModalButton>
        </ModalButtonContainer>
      </ModalContainer>
    </ModalWrapper>
  );
}
