// Import Dependencies
import { ColumnDef } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";
import {
  SelectCell,
  SelectHeader,
} from "@/components/shared/table/SelectCheckbox";
import {
  TemplateNameCell,
  LanguageCell,
  SubjectCell,
  VersionCell,
  StatusCell,
  UpdatedDateCell,
} from "./rows";
import { EmailTemplate } from "@/@types/template";

// ----------------------------------------------------------------------

export const columns: ColumnDef<EmailTemplate>[] = [
  {
    id: "select",
    label: "Row Selection",
    header: SelectHeader,
    cell: SelectCell,
  },
  {
    id: "name",
    accessorKey: "name",
    label: "Template Name",
    header: "Template Name",
    cell: TemplateNameCell,
  },
  {
    id: "language",
    accessorKey: "language",
    label: "Language",
    header: "Language",
    cell: LanguageCell,
  },
  {
    id: "subject",
    accessorKey: "subject",
    label: "Subject",
    header: "Subject",
    cell: SubjectCell,
  },
  {
    id: "version",
    accessorKey: "version",
    label: "Version",
    header: "Version",
    cell: VersionCell,
  },
  {
    id: "isActive",
    accessorKey: "isActive",
    label: "Status",
    header: "Status",
    cell: StatusCell,
    filterFn: "arrIncludesSome",
  },
  {
    id: "updatedAt",
    accessorKey: "updatedAt",
    label: "Updated",
    header: "Updated",
    cell: UpdatedDateCell,
    filterFn: "inNumberRange",
  },
  {
    id: "actions",
    label: "Row Actions",
    header: "Actions",
    cell: RowActions,
  },
];
