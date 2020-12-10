import React, { ReactNode } from 'react';
import { CssBaseline } from '@material-ui/core';

import NavBar from '@/common/components/NavBar';

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;

  return (
    <>
      <CssBaseline />
      <NavBar />
      {children}
    </>
  );
}
