export interface EmailTemplate {
  _id: string;
  name: string;
  language: string;
  subject: string;
  htmlTemplate: string;
  textTemplate: string;
  variables: string[];
  version: number;
  isActive: boolean;
  shopId?: string | null;
  updatedAt: string;
  createdAt: string;
}

export interface TemplateFormData {
  name: string;
  slug: string;
  language: string;
  subject: string;
  htmlTemplate: string;
  textTemplate: string;
  variables: string;
  isActive: boolean;
  shop?: string;
}

export interface TemplatePreviewData {
  shopDomain?: string;
  subject?: string;
  message?: string;
  exportDate?: string;
  customerEmail?: string;
  htmlReport?: string;
  reportContent?: string;
  [key: string]: string | undefined;
}

export interface GetTemplatesParams {
  page?: number;
  limit?: number;
  shop?: string;
  category?: string;
  isActive?: boolean;
  search?: string;
}
