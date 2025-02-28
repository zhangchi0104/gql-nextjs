// import { useFormAction } from "react-dom";

import { AustralianState } from "@repo/graphql";
import { useActionState } from "react";
import { validateLocality } from "~/lib/apollo-client";

interface LocalityValidationErrors {
  state?: string;
  suburb?: string;
  postcode?: string;
  validation?: string;
}
interface LocalityFormState {
  validationState: "pending" | "success" | "error";
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
  if (!suburb) {
    errorDraft.suburb = "Suburb is required";
  }
  if (!postcode) {
    errorDraft.postcode = "Postcode is required";
  }

  if (errorDraft.state || errorDraft.suburb || errorDraft.postcode) {
    return {
      validationState: "error",
      errors: errorDraft,
    };
  }
  const verifcationResult = await validateLocality(
    state,
    suburb!.toString(),
    postcode!.toString(),
  );

  return {
    validationState: verifcationResult.status === "ok" ? "success" : "error",
    errors: {},
    verificationMessage: verifcationResult.message,
  };
};

const initialState: LocalityFormState = {
  validationState: "pending",
  errors: {},
};

const useValidateLocality = () => {
  const [state, formAction, isPending] = useActionState<
    LocalityFormState,
    FormData
  >(handleSubmitForm, initialState);
  return { state, formAction, isPending };
};
export default useValidateLocality;
