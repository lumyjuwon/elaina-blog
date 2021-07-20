import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useMutation } from '@apollo/client';

import { AlertStateType } from 'src/components';
import { ProfileType, UPDATE_PROFILE } from 'src/query/profile';
import { FileType, UPLOAD_FILE } from 'src/query/file';
import { useApollo } from 'src/apollo/apolloClient';
import { IS_AUTH } from 'src/query/user';

import { MemoizedProfileImageEditor } from './ProfileImageEditor';
import { MemoizedProfileFormEditor } from './ProfileFormEditor';
import { ButtonContainer } from './ButtonContainer';

interface CropperProps {
  imageFile: File;
  onSave: (blob: Blob) => void;
  onCancel: () => void;
  visible: boolean;
}

const DynamicProfileImageCropper = dynamic<CropperProps>(() => import('./ProfileImageCropper').then((mod) => mod.ProfileImageCropper), {
  ssr: false
});

interface Props {
  profile: ProfileType;
  alertState: AlertStateType;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertState: React.Dispatch<React.SetStateAction<AlertStateType>>;
  updateProfile: (profile: ProfileType) => void;
}

export function ProfileEditor(props: Props) {
  const [isSelectImage, setIsSelectImage] = useState(false);
  const [croppedImageFile, setCroppedImageFile] = useState<Blob>();
  const [selectedImageFile, setSelectedImageFile] = useState<File>();
  const [editingProfile, setEditingProfile] = useState<ProfileType>(props.profile);

  const client = useApollo();
  const [uploadFile] = useMutation<{ uploadFile: FileType }>(UPLOAD_FILE);
  const [updateProfile] = useMutation<{ updateProfile: ProfileType }>(UPDATE_PROFILE);

  const setEditModeFalse = useCallback(() => props.setEditMode(false), []);

  const selectImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        setSelectedImageFile(file);
        setIsSelectImage(true);
      }
    }
    e.target.value = '';
  }, []);

  const updateEditingProfile = useCallback((profileProperty: string) => {
    return useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      e.persist();
      setEditingProfile((prev) => ({ ...prev, [profileProperty]: e.target.value }));
    }, []);
  }, []);

  const onChangeIntroduce = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.persist();
    setEditingProfile((prev) => ({ ...prev, introduce: e.target.value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>, oldProfile: ProfileType, newProfile: ProfileType) => {
    e.preventDefault();

    let uploadedImagePath: string | undefined;
    const { data } = await client.query({ query: IS_AUTH });

    const isAdmin = data.isAuth.isAuth;

    if (!isAdmin) {
      props.setAlertState({
        msg: 'Login Invalid: Please login',
        isPop: true,
        isError: true
      });
      setEditModeFalse();
      return;
    }

    if (Object.entries(oldProfile).toString() === Object.entries(newProfile).toString()) {
      setEditModeFalse();
      return;
    }

    try {
      if (newProfile.image !== oldProfile.image) {
        const uploadResponse = await uploadFile({
          variables: {
            file: croppedImageFile
          }
        });

        uploadedImagePath = uploadResponse.data?.uploadFile.path || '';
      }
    } catch (err) {
      alert(err.message);
      return;
    }

    try {
      const { data } = await updateProfile({
        variables: {
          id: newProfile._id,
          image: uploadedImagePath ? uploadedImagePath : oldProfile.image,
          name: newProfile.name,
          introduce: newProfile.introduce,
          link: newProfile.link,
          company: newProfile.company,
          location: newProfile.location,
          email: newProfile.email
        }
      });

      props.updateProfile(data?.updateProfile!);
      setEditModeFalse();
      props.setAlertState({
        msg: 'Profile changed successfully',
        isPop: true,
        isError: false
      });
    } catch (err) {
      props.setAlertState({
        msg: err.message,
        isPop: true,
        isError: true
      });
      setEditModeFalse();
      setEditingProfile(oldProfile);
    }
  }, []);

  return (
    <>
      <MemoizedProfileImageEditor image={editingProfile.image || ''} selectImage={selectImage} />
      <MemoizedProfileFormEditor
        profile={props.profile}
        editingProfile={editingProfile}
        updateEditingProfile={updateEditingProfile}
        handleSubmit={handleSubmit}
        setEditModeFalse={setEditModeFalse}
        onChangeIntroduce={onChangeIntroduce}
      />
      <ButtonContainer setEditModeFalse={setEditModeFalse} />
      <DynamicProfileImageCropper
        visible={isSelectImage}
        imageFile={selectedImageFile as File}
        onSave={(croppedImage: Blob) => {
          setCroppedImageFile(croppedImage);
          setEditingProfile({ ...editingProfile, image: URL.createObjectURL(croppedImage) });
          setIsSelectImage(false);
        }}
        onCancel={() => {
          setIsSelectImage(false);
        }}
      />
    </>
  );
}
