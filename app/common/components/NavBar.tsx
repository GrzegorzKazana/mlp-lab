import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Stepper, Step, StepButton } from '@material-ui/core';

import routes from '@/config/routes';

const steps = [
  { label: 'Data', route: routes.DATA },
  { label: 'Model', route: routes.MODEL },
  { label: 'Training', route: routes.createTrainingHistoryEntryUrl() },
];

export default function NavBar() {
  const history = useHistory();
  const { pathname } = useLocation();

  const currentRouteIndex = steps.findIndex(({ route }) => route === pathname);
  const currentStep = currentRouteIndex !== -1 ? currentRouteIndex : 0;

  return (
    <nav>
      <Stepper nonLinear activeStep={currentStep}>
        {steps.map(({ label, route }) => (
          <Step key={route}>
            <StepButton onClick={() => history.push(route)}>{label}</StepButton>
          </Step>
        ))}
      </Stepper>
    </nav>
  );
}
