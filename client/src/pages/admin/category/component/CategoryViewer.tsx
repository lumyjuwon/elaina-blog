import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import { cloneDeep, throttle } from 'lodash';

import { BorderBox, AlertStateType } from 'src/components';
import { CategoryDetailType, ORDER_CATEGORY } from 'src/query/category';
import { CategoryTitle } from './CategoryTitle';
import { CategoryMenu } from './CategoryMenu';

const Container = styled.div({
  width: '600px',
  margin: '0 auto'
});

const Wrapper = styled.div({
  display: 'flex',
  width: '100%',
  padding: '.5rem',
  alignItems: 'center',
  justifyContent: 'space-between'
});

interface Props {
  categories: CategoryDetailType[];
  index: number;
  title: string;
  grabbingCategoryIndex: number;
  initAlertState: AlertStateType;
  updateCategories: (newCategories: CategoryDetailType[]) => void;
  deleteCategory: (index: number) => void;
  grabElement: (index: number) => void;
  releaseElement: () => void;
  setGreenAlert: (msg: string) => void;
  setRedAlert: (err: any) => void;
  setInitAlert: () => void;
}

export function CategoryViewer(props: Props) {
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState(props.title);
  const initialCategoryOrder = useRef<number[] | null>(null);

  const [orderCategory] = useMutation(ORDER_CATEGORY);

  const handleEditTitle = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);

  const backupTitle = () => setTitle(props.title);

  const updateTitle = (newTitle: string) => setTitle(newTitle);

  const endEditMode = () => setIsEdit(false);

  const enterEditMode = () => setIsEdit(true);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    initialCategoryOrder.current = props.categories.map((category) => category._id);
  };

  const onDragEnter = throttle((e: React.DragEvent<HTMLDivElement>) => {
    let dragOverItemPosition = Number(e.currentTarget.dataset.position);

    // props is immutable, splice() change data
    const copiedCategory = cloneDeep(props.categories);

    copiedCategory.splice(props.grabbingCategoryIndex, 1);
    copiedCategory.splice(dragOverItemPosition, 0, props.categories[props.grabbingCategoryIndex]);

    props.grabElement(dragOverItemPosition);
    dragOverItemPosition = -1;
    props.updateCategories(copiedCategory);
  }, 400);

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    try {
      const changedOrder = props.categories.map((category) => category._id);
      if (initialCategoryOrder.current) {
        if (initialCategoryOrder.current.every((id, index) => id === changedOrder[index])) {
          // if order doesn't change, don't need to call mutation query
          return;
        }
      }

      props.setInitAlert();

      await orderCategory({
        variables: {
          ids: changedOrder
        }
      });
    } catch (err) {
      const backUpCategories = [...props.categories];
      props.updateCategories(backUpCategories);
      props.setRedAlert(err);
    }
  };

  return (
    <Container
      data-position={props.index}
      draggable={props.grabbingCategoryIndex === props.index}
      onDragStart={(e) => props.grabbingCategoryIndex > -1 && onDragStart(e)}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => props.grabbingCategoryIndex > -1 && onDragEnter(e)}
      onDrop={(e) => props.grabbingCategoryIndex > -1 && onDrop(e)}
    >
      <BorderBox isHoverEffect={false} styles={{ width: '100%', margin: '.8rem 0' }}>
        <Wrapper>
          <CategoryTitle isDefault={props.categories[props.index]._id === 0} title={title} isEdit={isEdit} handleChange={handleEditTitle} />
          <CategoryMenu
            isEdit={isEdit}
            id={props.categories[props.index]._id}
            title={title}
            isDefault={props.categories[props.index]._id === 0}
            index={props.index}
            enterEditMode={enterEditMode}
            endEditMode={endEditMode}
            updateTitle={updateTitle}
            backupTitle={backupTitle}
            deleteCategory={props.deleteCategory}
            grabElement={props.grabElement}
            releaseElement={props.releaseElement}
            setGreenAlert={props.setGreenAlert}
            setRedAlert={props.setRedAlert}
          />
        </Wrapper>
      </BorderBox>
    </Container>
  );
}
