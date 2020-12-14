import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { LinearProgress } from '@material-ui/core';

import routes from '@/config/routes';

import App from './App';

const LazyDataPage = React.lazy(() =>
  import('../../features/data-loader/DataLoader')
);

const LazyModelCreatorPage = React.lazy(() =>
  import('../../features/model-creator/ModelCreator')
);

const LazyTrainingPage = React.lazy(() =>
  import('../../features/model-trainer/ModelTrainer')
);

export default function Routes() {
  return (
    <App>
      <React.Suspense fallback={<LinearProgress />}>
        <Switch>
          <Route path={routes.DATA} component={LazyDataPage} />
          <Route path={routes.MODEL} component={LazyModelCreatorPage} />
          <Route path={routes.TRAINING} component={LazyTrainingPage} />
          <Route path="/" render={() => <Redirect to={routes.DATA} />} />
        </Switch>
      </React.Suspense>
    </App>
  );
}
