import axios from "@/utils/axios";
import {
  EmailTemplate,
  GetTemplatesParams,
  TemplateFormData,
  TemplatePreviewData,
} from "@/@types/template";

// ============================================================================
// Types
// ============================================================================

export interface GetTemplatesResponse {
  success: boolean;
  data: EmailTemplate[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetTemplateResponse {
  success: boolean;
  data: EmailTemplate;
}

export interface PreviewTemplateResponse {
  success: boolean;
  data: {
    htmlContent: string;
    textContent: string;
    subject: string;
  };
}

// ============================================================================
// Template Service
// ============================================================================

class TemplateService {
  /**
   * Get the current app ID from localStorage
   */
  private getAppId(): string {
    const appId = localStorage.getItem("selectedAppId");
    if (!appId) {
      throw new Error("No app selected. Please select an app first.");
    }
    return appId;
  }

  /**
   * Get all templates with optional filters
   */
  async getTemplates(params?: GetTemplatesParams): Promise<GetTemplatesResponse> {
    const appId = this.getAppId();
    const response = await axios.get<GetTemplatesResponse>(`/${appId}/templates`, {
      params,
    });
    return response.data;
  }

  /**
   * Get single template by ID
   */
  async getTemplateById(templateId: string): Promise<EmailTemplate> {
    const appId = this.getAppId();
    const response = await axios.get<GetTemplateResponse>(
      `/${appId}/templates/${templateId}`,
    );
    return response.data.data;
  }

  /**
   * Create new template
   */
  async createTemplate(data: TemplateFormData): Promise<EmailTemplate> {
    const appId = this.getAppId();
    const response = await axios.post<GetTemplateResponse>(`/${appId}/templates`, {
      ...data,
      variables: data.variables.split(",").map((v) => v.trim()),
    });
    return response.data.data;
  }

  /**
   * Update existing template
   */
  async updateTemplate(
    templateId: string,
    data: Partial<TemplateFormData>,
  ): Promise<EmailTemplate> {
    const appId = this.getAppId();
    const payload: any = { ...data };
    if (data.variables) {
      payload.variables = data.variables.split(",").map((v) => v.trim());
    }

    const response = await axios.patch<GetTemplateResponse>(
      `/${appId}/templates/${templateId}`,
      payload,
    );
    return response.data.data;
  }

  /**
   * Delete template
   */
  async deleteTemplate(templateId: string): Promise<void> {
    const appId = this.getAppId();
    await axios.delete(`/${appId}/templates/${templateId}`);
  }

  /**
   * Preview template with sample data
   */
  async previewTemplate(
    templateId: string,
    previewData: TemplatePreviewData,
  ): Promise<PreviewTemplateResponse["data"]> {
    const appId = this.getAppId();
    const response = await axios.post<PreviewTemplateResponse>(
      `/${appId}/templates/${templateId}/preview`,
      previewData,
    );
    return response.data.data;
  }

  /**
   * Duplicate template
   */
  async duplicateTemplate(templateId: string): Promise<EmailTemplate> {
    const appId = this.getAppId();
    const response = await axios.post<GetTemplateResponse>(
      `/${appId}/templates/${templateId}/duplicate`,
    );
    return response.data.data;
  }
}

// Export singleton instance
export const templateService = new TemplateService();
export default templateService;
