import React from 'react';
import styled from 'styled-components';

const Table = styled.table({
  borderCollapse: 'collapse',
  textAlign: 'left',
  lineHeight: '1.5'
});

const Thead = styled.thead({});

const Tbody = styled.tbody({});

const Tr = styled.tr({});

const Th = styled.th({
  padding: '10px',
  fontWeight: 'bold',
  verticalAlign: 'top',
  color: '#369',
  borderBottom: '3px solid #036'
});

const Td = styled.td({
  width: '350px',
  padding: '10px',
  verticalAlign: 'top',
  borderBottom: '1px solid #ccc'
});

interface Props {
  title: string;
  date: string;
  like: string;
}

export function BoardTable(props: Props) {
  return (
    <Table>
      <Tbody>
        <Tr>
          <Td>
            <input type='checkbox' />
          </Td>
          <Td>{props.title}</Td>
          <Td>{props.date}</Td>
          <Td>{props.like}</Td>
        </Tr>
      </Tbody>
    </Table>
  );
}
