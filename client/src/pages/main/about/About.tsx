import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

import { AboutType } from 'src/query/about';

import { MemoizedAboutContent } from './component/AboutContent';
import { AboutMenu } from './component/AboutMenu';
import { AboutEditor } from './component/AboutEditor';

const Container = styled.section({
  width: '100%',
  minHeight: '100vh',
  marginTop: '2rem'
});

interface Props {
  about: AboutType;
  name: string;
  isLogin: boolean;
}

export function AboutPage(props: Props) {
  const [about, setAbout] = useState<AboutType>(props.about);
  const router = useRouter();

  function onUpdate(updatedAbout: AboutType) {
    setAbout(updatedAbout);
  }

  if (router.query.edit) {
    return (
      <Container>
        <AboutEditor article={about.article} onUpdate={onUpdate} />
      </Container>
    );
  }

  return (
    <Container>
      <AboutMenu name={props.name} updatedAt={about.updatedAt} isLogin={props.isLogin} />
      <MemoizedAboutContent content={about.article} />
    </Container>
  );
}
