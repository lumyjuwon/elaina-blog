import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic, faFont, faCode, faListUl, faQuoteLeft, faImages } from '@fortawesome/free-solid-svg-icons';

import { MenuButton } from './MenuButton';

const Container = styled.div({
  display: 'flex',
  width: '100%',
  height: '3rem',
  alignItems: 'center',
  userSelect: 'none',
  padding: '.4rem 0',
  '@media screen and (max-width: 767px)': {
    flexWrap: 'wrap',
    height: 'max-content'
  }
});

interface Props {
  setArticle: React.Dispatch<React.SetStateAction<string>>;
}

export const Menu = React.forwardRef<HTMLTextAreaElement, Props>((props, forwardedRef) => {
  const selection: Selection | null = window.getSelection();

  function getNodeWithNodeName(startNode: Node, name: string): Node | null {
    if (startNode.nodeName === name) {
      return startNode;
    }

    if (startNode.parentNode) {
      return getNodeWithNodeName(startNode.parentNode, name);
    }
    return null;
  }

  function insertMarkdownStartAndEnd(startMarkdown: string, endMarkdown: string = startMarkdown) {
    if (selection === null || forwardedRef === null) {
      return;
    }

    // const selectionRange = selection.getRangeAt(0);

    if (selection.anchorNode === selection.focusNode) {
      if (selection.anchorOffset <= selection.focusOffset) {
        const newText =
          selection.anchorNode?.textContent?.slice(0, selection.anchorOffset) +
          startMarkdown +
          selection.anchorNode?.textContent?.slice(selection.anchorOffset, selection.focusOffset) +
          endMarkdown +
          selection.anchorNode?.textContent?.slice(selection.focusOffset);

        if (selection.anchorNode) {
          selection.anchorNode.textContent = newText;
          // Need to focus!!!
          // forwardedRef?.current!.focus();
        }
        console.log(selection.getRangeAt(0));
        // selection.getRangeAt(0).setStart(getNodeWithNodeName(selection.focusNode, 'P'), selection.focusOffset + startMarkdown.length);
      } else {
        const newText =
          selection.anchorNode?.textContent?.slice(0, selection.focusOffset) +
          startMarkdown +
          selection.anchorNode?.textContent?.slice(selection.focusOffset, selection.anchorOffset) +
          endMarkdown +
          selection.anchorNode?.textContent?.slice(selection.anchorOffset);

        if (selection.anchorNode) {
          selection.anchorNode.textContent = newText;
        }
        // Need to focus
        // forwardedRef.current?.focus();
        // selectionRange.setStart(selection.anchorNode, selection.anchorOffset + startMarkdown.length);
      }
    } else {
      const newAnchorText =
        selection.anchorNode?.textContent?.slice(0, selection.anchorOffset) +
        startMarkdown +
        selection.anchorNode?.textContent?.slice(selection.anchorOffset);
      const newFocusText =
        selection.focusNode?.textContent?.slice(0, selection.focusOffset) +
        endMarkdown +
        selection.focusNode?.textContent?.slice(selection.focusOffset);

      if (selection.anchorNode && selection.focusNode) {
        selection.anchorNode.textContent = newAnchorText;
        selection.focusNode.textContent = newFocusText;
      }
      // Need to focus
      // forwardedRef.current?.focus();
    }
    // Need to FIX
    // props.setArticle(forwardedRef.current?.textContent);
  }

  function insertMarkdownLineStart(markdown: string) {
    if (selection === null || !selection.anchorNode || !selection.focusNode) {
      return;
    }

    const findedNode = getNodeWithNodeName(selection.anchorNode, 'DIV');

    if (findedNode === null) {
      return;
    }

    const NODE = 1;
    const list = findedNode.childNodes;
    const anchorParagraph = getNodeWithNodeName(selection.anchorNode, 'P');
    const focusParagraph = getNodeWithNodeName(selection.focusNode, 'P');

    if (anchorParagraph === null || focusParagraph === null) {
      return;
    }

    let insertFlag = false;
    for (const child of list.entries()) {
      if (anchorParagraph.isSameNode(child[NODE])) {
        insertFlag = true;
      } else if (focusParagraph.isSameNode(child[NODE])) {
        focusParagraph.textContent = markdown + focusParagraph.textContent;
        break;
      }

      if (insertFlag) child[NODE].textContent = markdown + child[NODE].textContent;
    }
    // Need to FIX
    // forwardedRef.current?.focus();
    // props.setArticle(forwardedRef.current?.textContent);
  }

  return (
    <Container contentEditable={false}>
      <MenuButton isActive desc='Bold' onClick={() => insertMarkdownStartAndEnd('**')}>
        <FontAwesomeIcon icon={faBold} />
      </MenuButton>
      <MenuButton isActive desc='Italic' onClick={() => insertMarkdownStartAndEnd('*')}>
        <FontAwesomeIcon icon={faItalic} />
      </MenuButton>
      <MenuButton isActive desc='Color' onClick={() => insertMarkdownStartAndEnd("<span style='color:#ccc'>", '</span>')}>
        <FontAwesomeIcon icon={faFont} />
      </MenuButton>
      <MenuButton isActive desc='Code Block' onClick={() => insertMarkdownStartAndEnd('\n```\n')}>
        <FontAwesomeIcon icon={faCode} />
      </MenuButton>
      <MenuButton isActive desc='List' onClick={() => insertMarkdownLineStart('* ')}>
        <FontAwesomeIcon icon={faListUl} />
      </MenuButton>
      <MenuButton isActive desc='Quote' onClick={() => insertMarkdownLineStart('> ')}>
        <FontAwesomeIcon icon={faQuoteLeft} />
      </MenuButton>
      <MenuButton isActive desc='Upload Image' onClick={() => alert('sorry...')}>
        <FontAwesomeIcon icon={faImages} />
      </MenuButton>
    </Container>
  );
});

Menu.displayName = 'Menu';
