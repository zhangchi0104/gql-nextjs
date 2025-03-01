"use client";

import { DetailedHTMLProps, FormHTMLAttributes } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { FormField } from "./form-field";
import FormLabel from "./form-label";
import { cn } from "~/lib/utils";
import StateSelector from "./state-selector";
import useValidateLocality from "./hooks";
import ErrorMessage from "./error-message";
import VerificationResult from "./verification-result";

const LocalityForm = ({
  className,
  ...props
}: DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>) => {
  const { state, formAction, isPending, isDirty, setIsDirty } =
    useValidateLocality();
  const {
    serverValidationState: validationState,
    errors,
    verificationMessage,
  } = state;
  // const [isDirty, setIsDirty] = useState(false);
  return (
    <form
      data-testid="locality-form__form"
      className={cn("space-y-4", className)}
      {...props}
      action={formAction}
      onSubmit={() => setIsDirty(false)}
    >
      <FormField>
        <FormLabel htmlFor="locality-form__suburb">Suburb</FormLabel>
        <Input
          onChange={() => setIsDirty(true)}
          placeholder="Sydney"
          id="locality-form__suburb"
          data-testid="locality-form__suburb"
          name="suburb"
          type="text"
        />
        {!isDirty && (
          <ErrorMessage
            className="relative -top-1"
            dataTestId="locality-form__suburb-error"
          >
            {errors.suburb}
          </ErrorMessage>
        )}
      </FormField>
      <div className="flex  flex-row gap-8">
        <FormField className="flex-1">
          <FormLabel htmlFor="locality-form__postcode">Postcode</FormLabel>
          <Input
            onChange={() => setIsDirty(true)}
            placeholder="2000"
            id="locality-form__postcode"
            data-testid="locality-form__postcode"
            name="postcode"
            type="number"
          />
          {!isDirty && (
            <ErrorMessage
              className="relative -top-1"
              dataTestId="locality-form__postcode-error"
            >
              {errors.postcode}
            </ErrorMessage>
          )}
        </FormField>
        <FormField className="flex-1">
          <FormLabel htmlFor="locality-form__state">State</FormLabel>
          <StateSelector onChange={() => setIsDirty(true)} />
          {!isDirty && (
            <ErrorMessage
              className="relative -top-1"
              dataTestId="locality-form__state-error"
            >
              {errors.state}
            </ErrorMessage>
          )}
        </FormField>
      </div>

      <FormField>
        <Button
          disabled={isPending}
          type="submit"
          className="w-full mt-4"
          data-testid="locality-form__submit"
        >
          Validate Now
        </Button>
      </FormField>
      {!isPending && (
        <VerificationResult
          status={validationState}
          message={verificationMessage ?? ""}
        />
      )}
    </form>
  );
};

export default LocalityForm;
