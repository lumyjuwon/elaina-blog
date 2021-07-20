import React, { useImperativeHandle, useRef, useEffect } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div({
  position: 'relative'
});

interface Props {
  children: JSX.Element;
  visible: boolean;
  onClickOutside: () => void;
}

export const FocusWrapper = React.forwardRef<HTMLDivElement, Props>((props, forwardedRef) => {
  const focusRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(forwardedRef, () => focusRef.current as HTMLDivElement);

  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (props.visible && !focusRef.current?.contains(event.target as Node)) {
        props.onClickOutside();
      }
    }

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('drag', handleClickOutside);
    document.addEventListener('scroll', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('drag', handleClickOutside);
      document.removeEventListener('scroll', handleClickOutside);
    };
  }, [props]);

  if (props.visible) {
    return <Wrapper ref={focusRef}>{props.children}</Wrapper>;
  } else {
    return null;
  }
});

FocusWrapper.displayName = 'FocusWrapper';
