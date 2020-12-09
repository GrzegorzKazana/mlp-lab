import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from '@/config/routes';
import App from './App';

const LazyCounterPage = React.lazy(() =>
  import('../../features/counter/Counter')
);

const LazyDataPage = React.lazy(() =>
  import('../../features/data-loader/DataLoader')
);

export default function Routes() {
  return (
    <App>
      <React.Suspense fallback={<h1>Loading...</h1>}>
        <Switch>
          <Route path={routes.DATA} component={LazyDataPage} />
          <Route path="/" render={() => <Redirect to={routes.DATA} />} />
        </Switch>
      </React.Suspense>
    </App>
  );
}
