import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';

import { trans, Lang } from 'src/resources/languages/index';
import { UPDATE_ABOUT, AboutType } from 'src/query/about';

const Editor = styled.textarea((props) => ({
  display: 'block',
  width: '100%',
  height: '30rem',
  marginBottom: '1rem',
  padding: '.5rem',
  border: `1px solid ${props.theme.borderColor}`,
  borderRadius: '.5rem',
  outline: 'none',
  resize: 'none'
}));

const ButtonContainer = styled.div({
  display: 'flex',
  justifyContent: 'flex-end'
});

const Button = styled.button<{ submit?: boolean }>((props) => ({
  marginRight: props.submit ? '.5rem' : '0',
  padding: '.5rem',
  backgroundColor: props.submit ? props.theme.submitButton.buttonColor : 'inherit',
  borderRadius: '.5rem',
  color: props.submit ? props.theme.submitButton.textColor : 'inherit'
}));

interface Props {
  article: string;
  onUpdate: (about: AboutType) => void;
}

export function AboutEditor(props: Props) {
  const [article, setArticle] = useState(props.article);
  const router = useRouter();

  const [updateAbout] = useMutation(UPDATE_ABOUT);

  async function onSubmit() {
    try {
      const { data } = await updateAbout({ variables: { article } });

      const newAbout: AboutType = data.updateAbout;
      props.onUpdate(newAbout);
      router.replace('/?tab=about');
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <>
      <Editor placeholder='Your About' value={article} onChange={(e) => setArticle(e.target.value)} />
      <ButtonContainer>
        <Button submit onClick={onSubmit}>
          {trans(Lang.Save)}
        </Button>
        <Button onClick={() => router.replace('/?tab=about', undefined, { shallow: true })}>{trans(Lang.Cancel)}</Button>
      </ButtonContainer>
    </>
  );
}
