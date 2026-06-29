export type Contact = {
  id: string;
  businessId: string;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  companyName?: string | null;
  firstNameNormalized?: string | null;
  lastNameNormalized?: string | null;
  displayNameNormalized?: string | null;
  companyNameNormalized?: string | null;
  email?: string | null;
  emailNormalized?: string | null;
  emailDomain?: string | null;
  phone?: string | null;
  phoneE164?: string | null;
  phoneRegion?: string | null;
  companyCode?: string | null;
  companyCodeNormalized?: string | null;
  vatCode?: string | null;
  vatCodeNormalized?: string | null;
  phoneSmsEnabled: boolean;
  phoneWhatsappEnabled: boolean;
  phoneTelegramEnabled: boolean;
  removedFromActiveAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ContactCreateInput = {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  companyCode?: string;
  vatCode?: string;
  phoneSmsEnabled?: boolean;
  phoneWhatsappEnabled?: boolean;
  phoneTelegramEnabled?: boolean;
};

export type PreparedContactCreateInput = ContactCreateInput & {
  firstNameNormalized?: string;
  lastNameNormalized?: string;
  displayNameNormalized?: string;
  companyNameNormalized?: string;
  emailNormalized?: string;
  emailDomain?: string;
  phoneE164?: string;
  phoneRegion?: string;
  companyCodeNormalized?: string;
  vatCodeNormalized?: string;
};

export type ContactCreateRecord = PreparedContactCreateInput & {
  businessId: string;
};
