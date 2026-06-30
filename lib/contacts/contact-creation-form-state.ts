export type ContactCreationFormState =
  | {
      status: "idle";
      message: "";
    }
  | {
      status: "success";
      message: string;
    }
  | {
      status: "invalidInput" | "emptyContact" | "duplicateContact";
      message: string;
    };

export const initialContactCreationFormState: ContactCreationFormState = {
  status: "idle",
  message: "",
};
