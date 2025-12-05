import { useState, useEffect } from "react";
import { EmailTemplate, TemplatePreviewData } from "@/@types/template";
import { templateService } from "@/services";

interface PreviewTemplateModalProps {
  template: EmailTemplate;
  onClose: () => void;
}

export function PreviewTemplateModal({
  template,
  onClose,
}: PreviewTemplateModalProps) {
  const [previewData, setPreviewData] = useState<TemplatePreviewData>({
    shopDomain: "example-shop.myshopify.com",
    subject: "Sample Subject",
    message: "This is a sample message content",
  });
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewText, setPreviewText] = useState<string>("");
  const [previewSubject, setPreviewSubject] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize preview data with default values based on template variables
  useEffect(() => {
    const initialData: TemplatePreviewData = {};

    template.variables.forEach((variable) => {
      switch (variable) {
        case "shopDomain":
          initialData.shopDomain = "example-shop.myshopify.com";
          break;
        case "customerEmail":
          initialData.customerEmail = "customer@example.com";
          break;
        case "exportDate":
          initialData.exportDate = new Date().toLocaleDateString();
          break;
        case "subject":
          initialData.subject = "Sample Subject";
          break;
        case "message":
          initialData.message = "This is a sample message content";
          break;
        default:
          initialData[variable] = `Sample ${variable}`;
      }
    });

    setPreviewData(initialData);
  }, [template]);

  // Load preview whenever preview data changes
  useEffect(() => {
    loadPreview();
  }, [previewData]);

  const loadPreview = async () => {
    try {
      setIsLoading(true);
      const preview = await templateService.previewTemplate(
        template._id,
        previewData
      );
      setPreviewHtml(preview.htmlContent);
      setPreviewText(preview.textContent);
      setPreviewSubject(preview.subject);
    } catch (error) {
      // Error is handled by axios interceptor with toast notification
      // Fallback to basic preview without API
      setPreviewHtml(template.htmlTemplate);
      setPreviewText(template.textTemplate);
      setPreviewSubject(template.subject);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-dark-900 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-50">
            Email Template Full Preview
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-200 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Preview Variables Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 dark:text-dark-50 mb-3">
              Preview Variables
            </h3>
            <p className="text-xs text-gray-500 dark:text-dark-400 mb-3">
              Edit the values below to see how they appear in the email:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {template.variables.map((variable) => (
                <div key={variable}>
                  <label className="block text-xs font-medium text-gray-700 dark:text-dark-200 mb-1">
                    {"{{"} {variable} {"}}"}
                  </label>
                  <input
                    type="text"
                    value={previewData[variable] || ""}
                    onChange={(e) =>
                      setPreviewData({ ...previewData, [variable]: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Subject Line Preview */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 dark:text-dark-50 mb-2">
              Subject Line
            </h3>
            <div className="p-3 bg-gray-50 dark:bg-dark-800 rounded-lg">
              <p className="text-sm text-gray-900 dark:text-dark-50">
                {isLoading ? "Loading..." : previewSubject}
              </p>
            </div>
          </div>

          {/* HTML Email Content Preview */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 dark:text-dark-50 mb-2">
              HTML Email Content
            </h3>
            <div className="border border-gray-200 dark:border-dark-700 rounded-lg overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-dark-50"></div>
                </div>
              ) : (
                <iframe
                  srcDoc={previewHtml}
                  className="w-full h-[500px] bg-white"
                  title="Email Preview"
                  sandbox="allow-same-origin"
                />
              )}
            </div>
          </div>

          {/* Plain Text Preview */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-dark-50 mb-2">
              Plain Text Version
            </h3>
            <div className="p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
              <pre className="text-sm text-gray-900 dark:text-dark-50 whitespace-pre-wrap font-mono">
                {isLoading ? "Loading..." : previewText}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-dark-200 bg-white dark:bg-dark-900 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
