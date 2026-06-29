"use server";

import { getTrustedBusinessContext } from "../server/business-context.ts";
import { contactRepository } from "./prisma-contact-repository.ts";
import type { CreateContactResult } from "./create-contact-service.ts";
import { createContact } from "./create-contact-service.ts";
import { runCreateContactAction } from "./create-contact-action-runner.ts";

const createContactActionDependencies = {
  getBusinessContext: getTrustedBusinessContext,
  repository: contactRepository,
  createContactService: createContact,
} as const;

export async function createContactAction(input: unknown): Promise<CreateContactResult> {
  return runCreateContactAction(input, createContactActionDependencies);
}
