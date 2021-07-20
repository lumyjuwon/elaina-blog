import React from 'react';
import styled from 'styled-components';
import { faUsersCog } from '@fortawesome/free-solid-svg-icons';

import { Lang, trans } from 'src/resources/languages';

import { SideMenuTitle } from './SideMenuTitle';
import { SideMenuItem } from './SideMenuItem';

const Container = styled.div({
  width: '100%',
  marginTop: '1rem'
});

export function SettingMenuContainer() {
  return (
    <Container>
      <SideMenuTitle icon={faUsersCog} title={trans(Lang.Setting)} />
      <SideMenuItem menu={trans(Lang.ChangePassword)} href='/admin/password' />
      <SideMenuItem menu={trans(Lang.DeviceManage)} href='/admin/device' />
    </Container>
  );
}
