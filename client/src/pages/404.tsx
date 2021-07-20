import styled from 'styled-components';

const Container = styled.div({
  display: 'flex',
  width: '100%',
  height: 'calc(100vh - 5rem - 20px)',
  justifyContent: 'center',
  alignItems: 'center'
});

const ErrorMessege = styled.p({
  fontSize: '1.25rem',
  fontWeight: 'bold'
});

export default function Custom404() {
  return (
    <Container>
      <ErrorMessege>잘못된 경로입니다.</ErrorMessege>
    </Container>
  );
}
