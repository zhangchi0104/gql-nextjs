// import { useFormAction } from "react-dom";

import { AustralianState } from "@repo/graphql";
import { useActionState, useState } from "react";
import { validateLocality } from "~/lib/apollo-client";

interface LocalityValidationErrors {
  state?: string;
  suburb?: string;
  postcode?: string;
  validation?: string;
}
interface LocalityFormState {
  serverValidationState: "pending" | "success" | "error";
  errors: LocalityValidationErrors;
  verificationMessage?: string;
}

const handleSubmitForm = async (
  _prevState: LocalityFormState,
  formData: FormData,
): Promise<LocalityFormState> => {
  const state = formData.get("state") as AustralianState;
  const suburb = formData.get("suburb");
  const postcode = formData.get("postcode");

  // validation could be done with zod or joi
  // but for now we will stick with vanila js

  const errorDraft = {} as LocalityValidationErrors;
  // local validation, make sure all fields are not empty
  if (!state) {
    errorDraft.state = "State is required";
  }
  if (!suburb || !suburb.toString().trim()) {
    errorDraft.suburb = "Suburb is required";
  }
  if (!postcode) {
    errorDraft.postcode = "Postcode is required";
  }
  if (postcode && postcode.toString().trim().length !== 4) {
    errorDraft.postcode = "Postcode must be 4 digits";
  }

  if (errorDraft.state || errorDraft.suburb || errorDraft.postcode) {
    return {
      serverValidationState: "pending",
      errors: errorDraft,
    };
  }
  const verifcationResult = await validateLocality(
    state,
    suburb!.toString(),
    postcode!.toString(),
  );

  return {
    serverValidationState:
      verifcationResult.status === "ok" ? "success" : "error",
    errors: {},
    verificationMessage: verifcationResult.message,
  };
};

const initialState: LocalityFormState = {
  serverValidationState: "pending",
  errors: {},
};

const useValidateLocality = () => {
  const [isDirty, setIsDirty] = useState(false);
  const [state, formAction, isPending] = useActionState<
    LocalityFormState,
    FormData
  >(handleSubmitForm, initialState);
  return { state, formAction, isPending, isDirty, setIsDirty };
};
export default useValidateLocality;
