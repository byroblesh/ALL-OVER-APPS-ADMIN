import { Page } from "@/components/shared/Page";
import { useState, useEffect } from "react";
import { EmailTemplate } from "@/@types/template";
import { templateService } from "@/services";
import { TemplateTable } from "./components/TemplateTable";
import { EditTemplateModal } from "./components/EditTemplateModal";
import { PreviewTemplateModal } from "./components/PreviewTemplateModal";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";

export default function Templates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await templateService.getTemplates({
        page: currentPage,
        limit: 20,
      });

      if (response.success) {
        setTemplates(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
          setTotal(response.pagination.total);
        }
      }
    } catch (error) {
      console.error("Failed to load templates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setIsCreating(true);
    setIsEditModalOpen(true);
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsCreating(false);
    setIsEditModalOpen(true);
  };

  const handlePreviewTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewModalOpen(true);
  };

  const handleDeleteTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsDeleteModalOpen(true);
  };

  const handleSaveTemplate = async () => {
    setIsEditModalOpen(false);
    await loadTemplates();
  };

  const handleConfirmDelete = async () => {
    if (selectedTemplate) {
      try {
        await templateService.deleteTemplate(selectedTemplate._id);
        setIsDeleteModalOpen(false);
        await loadTemplates();
      } catch (error) {
        console.error("Failed to delete template:", error);
      }
    }
  };

  return (
    <Page title="Email Templates">
      <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
        <div className="min-w-0 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
                Email Templates
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-dark-300">
                Manage email templates used throughout the application. Changes take effect immediately.
              </p>
            </div>
            <button
              onClick={handleCreateTemplate}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-900 dark:bg-dark-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:hover:bg-dark-700 transition-colors"
            >
              <span className="text-lg">+</span>
              Create Template
            </button>
          </div>
        </div>

        <TemplateTable
          templates={templates}
          isLoading={isLoading}
          onEdit={handleEditTemplate}
          onPreview={handlePreviewTemplate}
          onDelete={handleDeleteTemplate}
        />

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between border-t border-gray-200 dark:border-dark-700 pt-4">
            <p className="text-sm text-gray-600 dark:text-dark-300">
              {total} templates total
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-dark-200 hover:bg-gray-200 dark:hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-700 dark:text-dark-200">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-dark-200 hover:bg-gray-200 dark:hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {isEditModalOpen && (
        <EditTemplateModal
          template={selectedTemplate}
          isCreating={isCreating}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveTemplate}
        />
      )}

      {isPreviewModalOpen && selectedTemplate && (
        <PreviewTemplateModal
          template={selectedTemplate}
          onClose={() => setIsPreviewModalOpen(false)}
        />
      )}

      {isDeleteModalOpen && selectedTemplate && (
        <DeleteConfirmModal
          templateName={selectedTemplate.name}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </Page>
  );
}
