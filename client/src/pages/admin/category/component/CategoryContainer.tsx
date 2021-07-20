import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { AlertStateType, AlertProps } from 'src/components';
import { CategoryDetailType } from 'src/query/category';

import { CategoryViewer } from './CategoryViewer';
import { NewCategory } from './NewCategory';

const DynamicAlertBox = dynamic<AlertProps>(() => import('src/components').then((mod) => mod.AlertBox));

const Container = styled.div({});

const AddCategory = styled.button((props) => ({
  display: 'flex',
  width: '600px',
  margin: '0 auto',
  padding: '.5rem',
  borderRadius: '.5rem',
  backgroundColor: props.theme.submitButton.buttonColor,
  color: props.theme.submitButton.textColor,
  alignItems: 'center',
  justifyContent: 'center'
}));

interface Props {
  categories: CategoryDetailType[];
  isAddModalOpen: boolean;
  setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CategoryContainer(props: Props) {
  const initAlertState: AlertStateType = { msg: '', isPop: false, isError: false };

  const [isAdd, setIsAdd] = useState(false);
  const [categories, setCategories] = useState<CategoryDetailType[]>(props.categories);
  const [alertState, setAlertState] = useState<AlertStateType>(initAlertState);
  const [grabbingCategoryIndex, setGrabbingCategoryIndex] = useState<number>(-1);

  const grabElement = (index: number) => {
    setGrabbingCategoryIndex(index);
  };

  const releaseElement = () => setGrabbingCategoryIndex(-1);

  const setInitAlert = () => setAlertState(initAlertState);

  const setGreenAlert = (msg: string) => setAlertState({ msg, isPop: true, isError: false });

  const setRedAlert = (err: any) => setAlertState({ msg: err.message, isPop: true, isError: true });

  const updateCategories = (newCategories: CategoryDetailType[]) => setCategories(newCategories);

  const cancelCreateCategory = () => {
    setIsAdd(false);
  };

  const addNewCategory = (category: CategoryDetailType) => setCategories((prev) => [...prev, category]);

  const deleteCategory = (index: number) => {
    const remainCategories = categories.filter((category) => category.order !== index);
    const reorderedCategories = remainCategories.map((category) => {
      if (category.order > index) {
        return { ...category, order: category.order - 1 };
      } else {
        return category;
      }
    });

    setCategories(reorderedCategories);
  };

  return (
    <Container>
      <Container>
        {categories.map((category, index) => {
          return (
            <CategoryViewer
              key={category.title}
              categories={categories}
              title={categories[index].title}
              index={index}
              grabbingCategoryIndex={grabbingCategoryIndex}
              initAlertState={initAlertState}
              updateCategories={updateCategories}
              deleteCategory={deleteCategory}
              grabElement={grabElement}
              releaseElement={releaseElement}
              setGreenAlert={setGreenAlert}
              setRedAlert={setRedAlert}
              setInitAlert={setInitAlert}
            />
          );
        })}
      </Container>
      {isAdd ? (
        <NewCategory
          cancelCreateCategory={cancelCreateCategory}
          setInitAlert={setInitAlert}
          setGreenAlert={setGreenAlert}
          setRedAlert={setRedAlert}
          addNewCategory={addNewCategory}
        />
      ) : (
        <AddCategory onClick={() => setIsAdd(true)}>
          <FontAwesomeIcon icon={faPlus} style={{ marginRight: '.5rem' }} />
          <p>Add Category</p>
        </AddCategory>
      )}
      {alertState.isPop && (
        <DynamicAlertBox
          isError={alertState.isError}
          msg={alertState.msg}
          onCloseButtonClick={() => {
            setAlertState(initAlertState);
          }}
        />
      )}
    </Container>
  );
}
