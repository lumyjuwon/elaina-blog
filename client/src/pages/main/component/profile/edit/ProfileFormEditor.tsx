import React, { useCallback } from 'react';
import styled from 'styled-components';
import { faBuilding, faEnvelope, faLink, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

import { ProfileType } from 'src/query/profile';

import { MemoizedProfileInput } from './ProfileInput';

const Form = styled.form({
  width: '100%',
  fontSize: '1.1rem'
});

const Editor = styled.textarea((props) => ({
  display: 'block',
  width: '100%',
  height: '5rem',
  padding: '.2rem',
  outline: 'none',
  border: `1px solid ${props.theme.inputBorder}`,
  borderRadius: '.5rem',
  backgroundColor: props.theme.inputBackground,
  color: props.theme.inputText,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  fontSize: '1.0rem',
  resize: 'none',
  '&:empty::before': {
    content: "'Add introduce'",
    color: '#888'
  },
  '&:empty:focus::before': {
    content: "''"
  }
}));

interface Props {
  profile: ProfileType;
  editingProfile: ProfileType;
  updateEditingProfile: (profileProperty: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, oldProfile: ProfileType, newProfile: ProfileType) => Promise<void>;
  setEditModeFalse: () => void;
  onChangeIntroduce: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function ProfileFormEditor(props: Props) {
  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => await props.handleSubmit(e, props.profile, props.editingProfile),
    [props.editingProfile]
  );

  return (
    <Form id='profile-form' onSubmit={onSubmit}>
      <MemoizedProfileInput
        placeholder='Username'
        value={props.editingProfile.name || ''}
        changeEditingProfile={props.updateEditingProfile('name')}
      />
      <Editor
        placeholder='Introduce'
        role='textbox'
        value={props.editingProfile.introduce}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => props.onChangeIntroduce(e)}
      />
      <MemoizedProfileInput
        icon={faLink}
        placeholder='Link'
        value={props.editingProfile.link || ''}
        changeEditingProfile={props.updateEditingProfile('link')}
      />
      <MemoizedProfileInput
        icon={faBuilding}
        placeholder='Company'
        value={props.editingProfile.company || ''}
        changeEditingProfile={props.updateEditingProfile('company')}
      />
      <MemoizedProfileInput
        icon={faMapMarkerAlt}
        placeholder='Location'
        value={props.editingProfile.location || ''}
        changeEditingProfile={props.updateEditingProfile('location')}
      />
      <MemoizedProfileInput
        icon={faEnvelope}
        placeholder='Email'
        value={props.editingProfile.email || ''}
        changeEditingProfile={props.updateEditingProfile('email')}
      />
    </Form>
  );
}

export const MemoizedProfileFormEditor = React.memo(ProfileFormEditor);
