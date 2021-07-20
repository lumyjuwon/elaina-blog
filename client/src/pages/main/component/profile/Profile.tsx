import React, { useState } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';

import { AlertStateType, AlertProps } from 'src/components';
import { ProfileType } from 'src/query/profile';

import { ProfileEditor } from './edit/ProfileEditor';
import { ProfileViewer } from './view/ProfileViewer';

const DynamicAlertBox = dynamic<AlertProps>(() => import('src/components').then((mod) => mod.AlertBox));

const Container = styled.aside({
  display: 'flex',
  width: '300px',
  minHeight: 'calc(90vh - 40px)',
  padding: '0 1rem',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  alignSelf: 'stretch',
  '@media screen and (max-width: 1380px)': {
    width: '28%',
    minWidth: '230px',
    maxWidth: '300px'
  },
  '@media screen and (max-width: 767px)': {
    width: '100%',
    maxWidth: '100%',
    minHeight: 'max-content',
    marginBottom: '2rem'
  }
});

interface Props {
  profile: ProfileType;
  isLogin: boolean;
}

export function Profile(props: Props) {
  const initAlertState: AlertStateType = { msg: '', isPop: false, isError: false };

  const [isEditMode, setIsEditMode] = useState(false);
  const [profile, setProfile] = useState<ProfileType>(props.profile);
  const [alertState, setAlertState] = useState<AlertStateType>(initAlertState);

  function applyUpdatedProfile(profile: ProfileType) {
    setProfile(profile);
  }

  function enterEditMode() {
    setIsEditMode(true);
  }

  return (
    <Container>
      {isEditMode ? (
        <ProfileEditor
          profile={profile}
          alertState={alertState}
          setEditMode={setIsEditMode}
          setAlertState={setAlertState}
          updateProfile={applyUpdatedProfile}
        />
      ) : (
        <ProfileViewer profile={profile} isLogin={props.isLogin} enterEditMode={enterEditMode} />
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
