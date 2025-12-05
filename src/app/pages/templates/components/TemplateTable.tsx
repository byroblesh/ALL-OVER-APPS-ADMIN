import { EmailTemplate } from "@/@types/template";

interface TemplateTableProps {
  templates: EmailTemplate[];
  isLoading: boolean;
  onEdit: (template: EmailTemplate) => void;
  onPreview: (template: EmailTemplate) => void;
  onDelete: (template: EmailTemplate) => void;
}

export function TemplateTable({
  templates,
  isLoading,
  onEdit,
  onPreview,
  onDelete,
}: TemplateTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-dark-900 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-dark-50"></div>
        </div>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-900 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-8">
        <div className="text-center">
          <p className="text-gray-600 dark:text-dark-300">
            No templates found. Create your first template to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-900 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                Template Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                Language
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                Version
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
            {templates.map((template) => (
              <tr
                key={template._id}
                className="hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-50">
                  {template.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-dark-300">
                  {template.language.toUpperCase()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-dark-300 max-w-md truncate">
                  {template.subject}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                    {template.version}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      template.isActive
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {template.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-dark-300">
                  {new Date(template.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onPreview(template)}
                      className="text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-dark-50 transition-colors"
                      title="Preview"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onEdit(template)}
                      className="text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-dark-50 transition-colors"
                      title="Edit"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(template)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                      title="Delete"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
