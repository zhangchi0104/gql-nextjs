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
  const { state, formAction, isPending } = useValidateLocality();
  const { validationState, errors, verificationMessage } = state;
  // const [isDirty, setIsDirty] = useState(false);
  return (
    <form
      data-testid="locality-form__form"
      className={cn("space-y-4", className)}
      {...props}
      action={formAction}
    >
      <FormField data-testid="locality-form__suburb">
        <FormLabel htmlFor="locality-form__suburb">Suburb</FormLabel>
        <Input
          placeholder="Sydney"
          id="locality-form__suburb"
          name="suburb"
          type="text"
        />
        <ErrorMessage className="relative -top-1">{errors.suburb}</ErrorMessage>
      </FormField>
      <div className="flex  flex-row gap-8">
        <FormField className="flex-1" data-testid="locality-form__postcode">
          <FormLabel htmlFor="locality-form__postcode">Postcode</FormLabel>
          <Input
            placeholder="2000"
            id="locality-form__postcode"
            name="postcode"
            type="number"
          />
          <ErrorMessage className="relative -top-1">
            {errors.postcode}
          </ErrorMessage>
        </FormField>
        <FormField className="flex-1" data-testid="locality-form__state">
          <FormLabel htmlFor="locality-form__state">State</FormLabel>
          <StateSelector />
          <ErrorMessage className="relative -top-1">
            {errors.state}
          </ErrorMessage>
        </FormField>
      </div>

      <FormField data-testid="locality-form__submit">
        <Button disabled={isPending} type="submit" className="w-full mt-4">
          Validate Now
        </Button>
      </FormField>
      <VerificationResult
        status={validationState}
        message={verificationMessage ?? ""}
      />
    </form>
  );
};

export default LocalityForm;
