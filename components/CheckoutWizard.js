import { Step, StepLabel, Stepper } from '@mui/material';
import React from 'react';
import useStyles from '../utils/styles';

const CheckoutWizard = ({ activeStep = 0 }) => {

    const classes = useStyles()

    const steps = ['Login', 'Shipping Address', 'Payment Method', 'Place Order']

    return (
        <Stepper
            className={classes.transparentBackgroud}
            activeStep={activeStep}
            alternativeLabel
            sx={{paddingTop:'1rem'}}
        >
            {steps.map(step => (
                <Step key={step}>
                    <StepLabel>{step}</StepLabel>
                </Step>
            ))}
        </Stepper>
    );
}

export default CheckoutWizard;