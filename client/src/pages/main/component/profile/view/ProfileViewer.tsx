import { ProfileType } from 'src/query/profile';

import { MemoizedProfileImageViewer } from './ProfileImageViewer';
import { MemoizedProfileTextViewer } from './ProfileTextViewer';
import { ButtonContainer } from './ButtonContainer';

interface Props {
  profile: ProfileType;
  isLogin: boolean;
  enterEditMode: () => void;
}

export function ProfileViewer(props: Props) {
  return (
    <>
      <MemoizedProfileImageViewer image={props.profile.image || ''} />
      <MemoizedProfileTextViewer profile={props.profile} />
      {props.isLogin && <ButtonContainer enterEditMode={props.enterEditMode} />}
    </>
  );
}
