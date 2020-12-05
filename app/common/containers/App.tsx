import React, { ReactNode, useState } from 'react';
import { Stepper, Step, StepButton, CssBaseline } from '@material-ui/core';

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;

  const [currentStep, changeStep] = useState(0);

  const steps = ['asd', 'hmm', 'also'];

  return (
    <>
      <CssBaseline />
      <Stepper nonLinear activeStep={currentStep}>
        {steps.map((title, idx) => (
          <Step key={title}>
            <StepButton onClick={() => changeStep(idx)}>{title}</StepButton>
          </Step>
        ))}
      </Stepper>
      {children}
    </>
  );
}
