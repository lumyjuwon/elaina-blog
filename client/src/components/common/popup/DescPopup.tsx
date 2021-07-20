import styled from 'styled-components';

interface Props {
  desc: string;
}

// interface DescProps {
//   desc: string;
// }

const Container = styled.div({});

// const Desc = styled.span<DescProps>((props: DescProps) => {
//   return {};
// });

export function DescPopUp(props: Props) {
  console.log(props.desc);
  return <Container></Container>;
}
