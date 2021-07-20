import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faClock, faBuilding, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

import { FormatUnifier } from 'src/utils';
import { ProfileType } from 'src/query/profile';

const ContentInfoWrapper = styled.div({
  display: 'flex'
});

const Author = styled.div({
  display: 'flex',
  position: 'relative',
  marginRight: '1rem',
  alignItems: 'center',
  transition: '.2s all',
  '&:hover': {
    cursor: 'pointer',
    color: 'rgb(134, 125, 255)'
  }
});

const HoverBox = styled.div({
  position: 'absolute',
  top: '2rem',
  left: '0',
  width: '300px',
  padding: '.5rem',
  backgroundColor: '#ddd',
  borderRadius: '.5rem',
  cursor: 'auto',
  zIndex: 1,
  color: '#121314',
  '&::after': {
    position: 'absolute',
    top: '-.8rem',
    left: '20%',
    width: '0',
    height: '0',
    border: '.8rem solid transparent',
    borderBottomColor: '#ddd',
    borderTop: '0',
    borderLeft: '0',
    content: "''"
  }
});

const Flex = styled.div({
  display: 'flex',
  alignItems: 'center'
});

const Time = styled.span({
  display: 'flex',
  alignItems: 'center'
});

interface Props {
  profile: ProfileType;
  time: Date;
}

export function ArticleInfo(props: Props) {
  let timeOutId: ReturnType<typeof setTimeout>;

  const [isHover, setIsHover] = useState(false);

  function handleHover(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    timeOutId = setTimeout(() => {
      setIsHover(true);
    }, 300);
  }

  function clearHover() {
    clearTimeout(timeOutId);
    setIsHover(false);
  }

  return (
    <ContentInfoWrapper>
      <Author onMouseEnter={(e) => handleHover(e)} onMouseLeave={() => clearHover()}>
        <FontAwesomeIcon icon={faUser} style={{ marginRight: '0.5rem' }} />
        {props.profile.name}
        {isHover && (
          <HoverBox>
            <Flex>
              <p>{props.profile.introduce}</p>
            </Flex>
            {props.profile.location && (
              <Flex>
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <p>{props.profile.location}</p>
              </Flex>
            )}
            {props.profile.company && (
              <Flex>
                <FontAwesomeIcon icon={faBuilding} />
                <p>{props.profile.company}</p>
              </Flex>
            )}
          </HoverBox>
        )}
      </Author>
      <Time>
        <FontAwesomeIcon icon={faClock} style={{ marginRight: '0.5rem' }} />
        {FormatUnifier.getFullFormatDate(props.time)}
      </Time>
    </ContentInfoWrapper>
  );
}

export default React.memo(ArticleInfo);
