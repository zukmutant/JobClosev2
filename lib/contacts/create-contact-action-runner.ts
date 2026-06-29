import type { TrustedBusinessContext } from "../server/business-context.ts";
import type { ContactRepository } from "./contact-repository.ts";
import type { CreateContactResult } from "./create-contact-service.ts";
import { createContact } from "./create-contact-service.ts";
import { prepareContactCreateInput } from "./contact-preparation.ts";
import { createContactInputSchema } from "./contact-validation.ts";

type CreateContactActionDependencies = {
  getBusinessContext: () => TrustedBusinessContext;
  repository: ContactRepository;
  createContactService: typeof createContact;
};

export async function runCreateContactAction(
  input: unknown,
  dependencies: CreateContactActionDependencies,
): Promise<CreateContactResult> {
  const validation = createContactInputSchema.safeParse(input);

  if (!validation.success) {
    return { ok: false, reason: "invalidInput" };
  }

  const { businessId } = dependencies.getBusinessContext();
  const preparedInput = prepareContactCreateInput(validation.data);

  return dependencies.createContactService(
    {
      businessId,
      input: preparedInput,
    },
    dependencies.repository,
  );
}
