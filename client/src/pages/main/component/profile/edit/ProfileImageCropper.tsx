import React, { useEffect, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import styled from 'styled-components';

import { ModalWrapper } from 'src/components';
import { Lang, trans } from 'src/resources/languages';

import 'react-image-crop/dist/ReactCrop.css';

const Container = styled.div({
  width: '500px',
  '@media screen and (max-width: 767px)': {
    width: '100%'
  }
});

const ButtonContainer = styled.div({
  display: 'flex',
  width: '100%',
  justifyContent: 'flex-end',
  alignItems: 'center',
  '& > div:first-child': {
    marginRight: '.5rem'
  }
});

const Button = styled.div({
  width: '7rem',
  padding: '.5rem',
  border: '1px solid #ddd',
  borderRadius: '.5rem',
  cursor: 'pointer',
  textAlign: 'center'
});

async function getCropImage(image: HTMLImageElement, imageName: string, imageType: string, crop: Crop): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = crop.width!;
  canvas.height = crop.height!;
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const ctx = canvas.getContext('2d');

  ctx?.drawImage(image, crop.x! * scaleX, crop.y! * scaleY, crop.width! * scaleX, crop.height! * scaleY, 0, 0, crop.width!, crop.height!);

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob: Blob | null) => {
        if (blob !== null) {
          //@ts-ignore
          blob.name = imageName;
          resolve(blob);
        }
      },
      imageType,
      1
    );
  });
}

interface Props {
  imageFile: File;
  onSave: (blob: Blob) => void;
  onCancel: () => void;
  visible: boolean;
}

export function ProfileImageCropper(props: Props) {
  const [crop, setCrop] = useState<Crop>({ aspect: 1 / 1 });
  const [profileImage, setProfileImage] = useState<string>(props.imageFile ? URL.createObjectURL(props.imageFile) : '');
  const [profileHtmlImageElement, setProfileHtmlImageElement] = useState<HTMLImageElement>();

  useEffect(() => {
    if (props.imageFile) {
      setProfileImage(URL.createObjectURL(props.imageFile));
      setCrop({ aspect: 1 / 1 });
    }
  }, [props.imageFile]);

  if (props.visible) {
    return (
      <ModalWrapper visible={props.visible}>
        <Container>
          <p style={{ marginBottom: '.3rem' }}>Crop your new profile picture</p>
          <ReactCrop
            src={profileImage}
            crop={crop}
            onImageLoaded={(img) => {
              setProfileHtmlImageElement(img);
            }}
            onChange={(newCrop) => setCrop(newCrop)}
            imageAlt='edit-profile-image'
            circularCrop={true}
          />
          <ButtonContainer>
            <Button
              onClick={async () => {
                const croppedImage = await getCropImage(profileHtmlImageElement!, props.imageFile.name, props.imageFile.type, crop);
                props.onSave(croppedImage);
              }}
            >
              {trans(Lang.Save)}
            </Button>
            <Button onClick={() => props.onCancel()}>{trans(Lang.Cancel)}</Button>
          </ButtonContainer>
        </Container>
      </ModalWrapper>
    );
  } else {
    return null;
  }
}
