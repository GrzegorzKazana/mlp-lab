import React, { ReactNode } from 'react';
import { CssBaseline, Grid, Paper, Divider } from '@material-ui/core';
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';

import NavBar from '@/common/components/NavBar';

type Props = {
  children: ReactNode;
};

const theme = createMuiTheme({
  overrides: {
    MuiGrid: {
      container: {
        flexWrap: 'nowrap',
      },
    },
  },
});

const useStyles = makeStyles(() => ({
  root: {
    height: '100vh',
  },
  appBody: {
    flexGrow: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default function App(props: Props) {
  const { children } = props;

  const styles = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="stretch"
        className={styles.root}
      >
        <CssBaseline />
        <Grid item>
          <NavBar />
          <Divider variant="middle" />
        </Grid>
        <Paper elevation={0} className={styles.appBody}>
          {children}
        </Paper>
      </Grid>
    </ThemeProvider>
  );
}
