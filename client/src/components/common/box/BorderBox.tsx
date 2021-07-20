import styled from 'styled-components';

interface Styles {
  margin?: string;
  width?: string;
}

interface BoxProps {
  styles?: Styles;
  isHoverEffect: boolean;
}

const Box = styled.div<BoxProps>((props) => {
  return {
    display: 'flex',
    width: props.styles?.width || 'max-content',
    margin: props.styles?.margin || '10px',
    border: `1px solid ${props.theme.borderColor}`,
    borderRadius: '.5rem',
    transition: '.2s all',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: `${props.isHoverEffect ? 'pointer' : 'default'}`,
    '&:hover': {
      boxShadow: `${props.isHoverEffect ? `0 0 .75rem ${props.theme.shadowColor}` : 'none'}`
    }
  };
});

interface Props {
  children: JSX.Element;
  isHoverEffect: boolean;
  styles?: Styles;
}

export function BorderBox(props: Props) {
  // const themeMode: ThemeMode = useSelector<RootState, any>((state) => state.common.theme);

  return (
    <Box isHoverEffect={props.isHoverEffect} styles={props.styles}>
      {props.children}
    </Box>
  );
}
