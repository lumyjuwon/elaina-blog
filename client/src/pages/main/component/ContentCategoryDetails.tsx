import styled from 'styled-components';

const Container = styled.div({
  marginTop: '.4rem',
  color: '#666',
  fontSize: '.8rem'
});

const LatestTime = styled.span({
  marginRight: '.8rem'
});

const PostCount = styled.span({});

export default function ContentCategoryDetails() {
  const now = new Date();
  const month = now.getMonth() < 12 ? now.getMonth() + 1 : 1;

  return (
    <Container>
      <LatestTime>{`Lastest Update: ${now.getFullYear()}.${month}.${now.getDate()}`}</LatestTime>
      <PostCount>
        <i className='fas fa-book'></i>&nbsp;3
      </PostCount>
    </Container>
  );
}
