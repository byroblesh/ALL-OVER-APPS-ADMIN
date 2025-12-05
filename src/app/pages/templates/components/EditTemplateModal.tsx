import { useState, useEffect } from "react";
import { EmailTemplate, TemplateFormData } from "@/@types/template";
import { templateService } from "@/services";

interface EditTemplateModalProps {
  template: EmailTemplate | null;
  isCreating: boolean;
  onClose: () => void;
  onSave: () => void;
}

type TabType = "basic" | "html" | "text" | "variables";

export function EditTemplateModal({
  template,
  isCreating,
  onClose,
  onSave,
}: EditTemplateModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("basic");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<TemplateFormData>({
    name: template?.name || "",
    language: template?.language || "en",
    subject: template?.subject || "",
    htmlTemplate: template?.htmlTemplate || "",
    textTemplate: template?.textTemplate || "",
    variables: template?.variables?.join(", ") || "",
    isActive: template?.isActive ?? true,
  });

  const tabs: { id: TabType; label: string }[] = [
    { id: "basic", label: "Basic Info" },
    { id: "html", label: "HTML Template" },
    { id: "text", label: "Text Template" },
    { id: "variables", label: "Variables" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);

      if (isCreating) {
        await templateService.createTemplate(formData);
      } else if (template) {
        await templateService.updateTemplate(template._id, formData);
      }

      onSave();
    } catch (error) {
      console.error("Failed to save template:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-dark-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-50">
            {isCreating ? "Create Template" : "Edit Template"}
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

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-dark-700 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-gray-900 dark:border-dark-50 text-gray-900 dark:text-dark-50"
                  : "border-transparent text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-dark-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6">
            {activeTab === "basic" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                      Template Name
                    </label>
                    <input
                      type="text"
                      required
                      disabled={!isCreating}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-dark-700 disabled:cursor-not-allowed"
                      placeholder="customer-data-export"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-dark-400">
                      Internal name for the template (cannot be changed after creation)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                      Language
                    </label>
                    <select
                      required
                      disabled={!isCreating}
                      value={formData.language}
                      onChange={(e) =>
                        setFormData({ ...formData, language: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-dark-700 disabled:cursor-not-allowed"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500 dark:text-dark-400">
                      Language for this template (cannot be changed after creation)
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                    Email Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your Data Export from {{shopDomain}} - Banners All Over"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-dark-400">
                    Use {"{{"} variableName {"}}}"} for dynamic content
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="isActive"
                    className="text-sm font-medium text-gray-700 dark:text-dark-200"
                  >
                    Template is active
                  </label>
                </div>
              </div>
            )}

            {activeTab === "html" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                  HTML Template
                </label>
                <textarea
                  required
                  value={formData.htmlTemplate}
                  onChange={(e) =>
                    setFormData({ ...formData, htmlTemplate: e.target.value })
                  }
                  rows={20}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-50 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="<!DOCTYPE html>..."
                />
              </div>
            )}

            {activeTab === "text" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                  Plain Text Template
                </label>
                <textarea
                  required
                  value={formData.textTemplate}
                  onChange={(e) =>
                    setFormData({ ...formData, textTemplate: e.target.value })
                  }
                  rows={20}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-50 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Plain text version of the email. Use {{variableName}} for dynamic content."
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-dark-400">
                  Plain text version of the email. Use {"{{"} variableName {"}}}"} for
                  dynamic content.
                </p>
              </div>
            )}

            {activeTab === "variables" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                  Available Variables
                </label>
                <input
                  type="text"
                  value={formData.variables}
                  onChange={(e) =>
                    setFormData({ ...formData, variables: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="shopDomain, exportDate, customerEmail"
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-dark-400">
                  Comma-separated list of variables available in this template (e.g.,
                  shopDomain, customerEmail, exportDate)
                </p>

                <div className="mt-6 p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-dark-50 mb-3">
                    Common Variables:
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-dark-300">
                    <li>
                      <code className="text-blue-600 dark:text-blue-400">
                        shopDomain
                      </code>{" "}
                      - Shop domain name
                    </li>
                    <li>
                      <code className="text-blue-600 dark:text-blue-400">
                        customerEmail
                      </code>{" "}
                      - Customer email address
                    </li>
                    <li>
                      <code className="text-blue-600 dark:text-blue-400">
                        exportDate
                      </code>{" "}
                      - Date of export
                    </li>
                    <li>
                      <code className="text-blue-600 dark:text-blue-400">
                        subject
                      </code>{" "}
                      - Support ticket subject
                    </li>
                    <li>
                      <code className="text-blue-600 dark:text-blue-400">
                        message
                      </code>{" "}
                      - Support message content
                    </li>
                    <li>
                      <code className="text-blue-600 dark:text-blue-400">
                        htmlReport
                      </code>{" "}
                      - HTML formatted report content
                    </li>
                    <li>
                      <code className="text-blue-600 dark:text-blue-400">
                        reportContent
                      </code>{" "}
                      - Plain text report content
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-dark-200 bg-white dark:bg-dark-900 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-dark-700 hover:bg-gray-800 dark:hover:bg-dark-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
