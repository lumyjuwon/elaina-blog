import React, { useRef } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div({
  display: 'flex',
  position: 'fixed',
  top: 0,
  right: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  tabIndex: -1,
  zIndex: 1000,
  overflowX: 'hidden'
});

const WrapperInner = styled.div({
  display: 'flex',
  position: 'relative',
  width: 'fit-content',
  height: 'fit-content',
  padding: '16px',
  margin: '0 auto',
  borderRadius: '.5rem',
  boxShadow: '0px 0px 4px 4px rgba(0,0,0,0.25)',
  backgroundColor: '#fff',
  flexDirection: 'column'
});

// let ModalWrapperHashId = 0;
// let usedLockHashId = -1;
// let callBack = () => {};

// function lockScroll(hashId: number | undefined) {
//   if (usedLockHashId === -1 && typeof hashId === 'number') {
//     usedLockHashId = hashId;

//     const yOffset = window.pageYOffset;
//     callBack = () => {
//       window.scrollTo(0, yOffset);
//     };
//     window.addEventListener('scroll', callBack);
//   }
// }

// function unLockScroll(hashId: number | undefined) {
//   if (usedLockHashId === hashId) {
//     window.removeEventListener('scroll', callBack);
//     usedLockHashId = -1;
//   }
// }

interface Props {
  visible: boolean;
  children: JSX.Element | JSX.Element[];
}

export function ModalWrapper(props: Props) {
  // const hashId = useRef<number>();
  const modalRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   hashId.current = ModalWrapperHashId;
  //   ModalWrapperHashId++;
  // }, []);

  if (props.visible) {
    // lockScroll(hashId.current);
    return (
      <Wrapper ref={modalRef}>
        <WrapperInner>{props.children}</WrapperInner>
      </Wrapper>
    );
  } else {
    // unLockScroll(hashId.current);
    return null;
  }
}

ModalWrapper.defaultProps = {
  visible: false
};
