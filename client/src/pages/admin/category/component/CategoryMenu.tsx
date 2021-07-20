import React, { useState } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import { useMutation } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical, faPen, faTrash, faSave, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import { UPDATE_CATEGORY } from 'src/query/category';

import { DeleteModalProps } from './DeleteCategoryModal';

const DynamicDeleteModal = dynamic<DeleteModalProps>(() => import('./DeleteCategoryModal').then((mod) => mod.DeleteCategoryModal));

const MenuContainer = styled.div((props) => ({
  display: 'flex',
  paddingLeft: '.5rem',
  borderLeft: `1px solid ${props.theme.borderColor}`,
  flexDirection: 'row',
  justifyContent: 'flex-end'
}));

const IconWrapper = styled.span<{ drag?: boolean }>((props) => ({
  display: 'flex',
  width: '40px',
  height: '40px',
  padding: '.5rem',
  borderRadius: '.5rem',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    backgroundColor: props.theme.hoverBackground,
    cursor: props.drag ? 'move' : 'pointer'
  }
}));

interface Props {
  isEdit: boolean;
  id: number;
  title: string;
  isDefault: boolean;
  index: number;
  enterEditMode: () => void;
  endEditMode: () => void;
  updateTitle: (title: string) => void;
  backupTitle: () => void;
  deleteCategory: (index: number) => void;
  grabElement: (index: number) => void;
  releaseElement: () => void;
  setGreenAlert: (msg: string) => void;
  setRedAlert: (err: any) => void;
}

export function CategoryMenu(props: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [updateCategory] = useMutation(UPDATE_CATEGORY);

  async function onSaveClick() {
    if (!props.title) {
      alert('제목을 입력해주세요.');
      return;
    }

    try {
      const { data } = await updateCategory({
        variables: {
          id: props.id,
          title: props.title
        }
      });

      // response null-check
      if (data.updateCategory) {
        props.updateTitle(data.updateCategory.title);
        props.setGreenAlert('Update category successfully.');
      } else {
        props.setRedAlert({ message: 'Cannot update category' });
      }
    } catch (err) {
      props.setRedAlert(err);
    }

    props.endEditMode();
  }

  const endDeleteModal = () => setIsModalOpen(false);

  if (props.isEdit) {
    return (
      <MenuContainer>
        <IconWrapper onClick={() => onSaveClick()}>
          <FontAwesomeIcon icon={faSave} style={{ fontSize: '1.25rem' }} />
        </IconWrapper>
        <IconWrapper
          onClick={() => {
            props.backupTitle();
            props.endEditMode();
          }}
        >
          <FontAwesomeIcon icon={faTimesCircle} style={{ fontSize: '1.25rem' }} />
        </IconWrapper>
      </MenuContainer>
    );
  }

  return (
    <MenuContainer>
      {!props.isDefault && (
        <>
          <IconWrapper onClick={() => props.enterEditMode()}>
            <FontAwesomeIcon icon={faPen} style={{ fontSize: '1.25rem' }} />
          </IconWrapper>
          <IconWrapper onClick={() => setIsModalOpen(true)}>
            <FontAwesomeIcon icon={faTrash} style={{ fontSize: '1.25rem' }} />
          </IconWrapper>
          <IconWrapper
            drag
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
              if (e.button === 0) {
                props.grabElement(props.index);
              } else {
                props.releaseElement();
              }
            }}
            onMouseUp={() => props.releaseElement()}
            onTouchStart={() => props.grabElement(props.index)}
            onTouchEnd={() => props.releaseElement()}
          >
            <FontAwesomeIcon icon={faGripVertical} style={{ fontSize: '1.25rem' }} />
          </IconWrapper>
          <DynamicDeleteModal
            visible={isModalOpen}
            index={props.index}
            deleteCategory={props.deleteCategory}
            setGreenAlert={props.setGreenAlert}
            setRedAlert={props.setRedAlert}
            endDeleteModal={endDeleteModal}
          />
        </>
      )}
    </MenuContainer>
  );
}

export const MomoizedCategoryMenu = React.memo(CategoryMenu);
