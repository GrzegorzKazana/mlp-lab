import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from '@/config/routes';
import App from './App';

const LazyCounterPage = React.lazy(() =>
  import('../../features/counter/Counter')
);

export default function Routes() {
  return (
    <App>
      <React.Suspense fallback={<h1>Loading...</h1>}>
        <Switch>
          <Route path={routes.DATA} component={LazyCounterPage} />
          <Route path="/" render={() => <Redirect to={routes.DATA} />} />
        </Switch>
      </React.Suspense>
    </App>
  );
}
