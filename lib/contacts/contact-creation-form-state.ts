import type { BlockingContactDuplicate } from "./contact-repository.ts";

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
      status: "invalidInput" | "emptyContact";
      message: string;
    }
  | {
      status: "duplicateContact";
      message: string;
      duplicate?: BlockingContactDuplicate;
    };

export const initialContactCreationFormState: ContactCreationFormState = {
  status: "idle",
  message: "",
};
