import React, { useRef, useState, FormEvent, useEffect } from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

import { RefInputBox } from 'src/components';
import { LOGIN } from 'src/query/user';
import { appCommponProps } from 'src/pages/_app';

const Container = styled.div({
  display: 'flex',
  width: '100%',
  height: 'calc(100vh - 5rem - 20px)',
  alignItems: 'center',
  justifyContent: 'center'
});

const LogInForm = styled.form({
  display: 'flex',
  width: '400px',
  height: '400px',
  padding: '.5rem',
  border: '1px solid #ddd',
  borderRadius: '.5rem',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
});

const InputWrapper = styled.div({
  display: 'flex',
  width: '80%',
  margin: '10px 0',
  flexDirection: 'column'
});

const HelpWrapper = styled.div({
  display: 'flex',
  width: '80%',
  margin: '10px 0',
  flexDirection: 'column'
});

const Label = styled.label<{ color?: string; isBold?: boolean }>((props) => {
  return {
    display: 'inline-block',
    textAlign: 'left',
    fontWeight: props.isBold ? 'bold' : 'normal',
    color: props.color ? props.color : ''
  };
});

Label.defaultProps = {
  isBold: false
};

const LogInButton = styled.button((props) => ({
  width: '85%',
  height: '2.5rem',
  marginTop: '24px',
  borderRadius: '.5rem',
  backgroundColor: props.theme.submitButton.buttonColor,
  color: props.theme.submitButton.textColor
}));

const LogInText = styled.span({
  fontWeight: 'bold'
});

const MessageBox = styled.div({
  display: 'flex',
  marginTop: '16px'
});

interface ServerSideProps {}

// interface Props extends ServerSideProps {
//   cookie?: string;
// }

export default function Login() {
  // const themeMode: ThemeMode = useSelector<RootState, any>((state) => state.common.theme);

  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [isEamilInputValid, setIsEamilInputValid] = useState(true);
  const [isPasswordInputValid, setIsPasswordInputValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [login] = useMutation(LOGIN, {
    onCompleted: () => {
      router.replace(router.asPath);
    },
    onError: (err: Error) => {
      handleSubmitError(err.message);
    }
  });

  // prefetch
  useEffect(() => {
    const prefetchURL = `${router.query.url}`.replaceAll('%2F', '/');
    router.prefetch(prefetchURL);
  }, []);

  function controlEnterKey(e: React.KeyboardEvent<HTMLDivElement>, myInputRef: HTMLInputElement, otherInputRef: HTMLInputElement) {
    e.preventDefault();

    const myValueLength: number = myInputRef.value.length;
    const otherValueLength: number = otherInputRef.value.length;

    if (myValueLength !== 0 && otherValueLength === 0) {
      otherInputRef.focus();
    } else if (myValueLength !== 0 && otherValueLength !== 0) {
      buttonRef.current?.click();
    }
  }

  function handleSubmitError(message: string) {
    if (passwordInputRef.current) {
      passwordInputRef.current.value = '';
    }
    passwordInputRef.current?.focus();
    setIsPasswordInputValid(false);
    setErrorMessage(message);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (emailInputRef.current && passwordInputRef.current) {
      if (emailInputRef.current.value.length < 1) {
        emailInputRef.current.focus();
        setIsEamilInputValid(false);
        setErrorMessage('Please Input Email');
      } else {
        login({
          variables: {
            emailId: emailInputRef.current.value,
            password: passwordInputRef.current.value
          }
        });
      }
    }
  }

  return (
    <Container>
      <LogInForm onSubmit={(event: FormEvent) => handleSubmit(event)}>
        <InputWrapper>
          <Label isBold={true}>Email</Label>
          <RefInputBox
            ref={emailInputRef}
            id='admin-id'
            type='email'
            minLength={4}
            maxLength={100}
            placeholder='Email'
            styles={{ margin: '8px 0 0 0', width: '100%', small: { width: '100%' } }}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (!isEamilInputValid) {
                setIsEamilInputValid(true);
              }

              if (e.nativeEvent.key === 'Enter') {
                if (emailInputRef.current && passwordInputRef.current) {
                  controlEnterKey(e, emailInputRef.current, passwordInputRef.current);
                }
              }
            }}
            isValid={isEamilInputValid}
          />
        </InputWrapper>
        <InputWrapper>
          <Label isBold={true}>암호</Label>
          <RefInputBox
            ref={passwordInputRef}
            id='admin-pw'
            type='password'
            minLength={8}
            maxLength={20}
            placeholder='암호'
            styles={{ margin: '8px 0 0 0', width: '100%', small: { width: '100%' } }}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (!isPasswordInputValid) {
                setIsPasswordInputValid(true);
              }

              if (e.nativeEvent.key === 'Enter') {
                if (emailInputRef.current && passwordInputRef.current) {
                  controlEnterKey(e, passwordInputRef.current, emailInputRef.current);
                }
              }
            }}
            isValid={isPasswordInputValid}
          />
        </InputWrapper>
        <MessageBox>
          <Label color={'red'}>{errorMessage}</Label>
        </MessageBox>
        <LogInButton ref={buttonRef} type='submit'>
          <LogInText>로그인</LogInText>
        </LogInButton>
        <HelpWrapper></HelpWrapper>
      </LogInForm>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (context) => {
  if (appCommponProps.app.isLogin) {
    return {
      redirect: {
        permanent: false,
        destination: context.query.url || '/'
      },
      props: {}
    };
  }

  return {
    props: {}
  };
};
