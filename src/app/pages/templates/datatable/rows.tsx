// Import Dependencies
import dayjs from "dayjs";
import { Column, Getter, Table } from "@tanstack/react-table";

// Local Imports
import { Highlight } from "@/components/shared/Highlight";
import { Badge, Tag } from "@/components/ui";
import { useLocaleContext } from "@/app/contexts/locale/context";
import { ensureString } from "@/utils/ensureString";
import { EmailTemplate } from "@/@types/template";

// ----------------------------------------------------------------------

export function TemplateNameCell({
  getValue,
  column,
  table,
}: {
  getValue: Getter<any>;
  column: Column<EmailTemplate>;
  table: Table<EmailTemplate>;
}) {
  const globalQuery = ensureString(table.getState().globalFilter);
  const columnQuery = ensureString(column.getFilterValue());
  const name = getValue();

  return (
    <span className="text-primary-600 dark:text-primary-400 font-medium">
      <Highlight query={[globalQuery, columnQuery]}>{name}</Highlight>
    </span>
  );
}

export function LanguageCell({ getValue }: { getValue: Getter<any> }) {
  const language = getValue();
  const languageMap: Record<string, string> = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
  };

  return (
    <Tag color="neutral" className="uppercase">
      {languageMap[language] || language}
    </Tag>
  );
}

export function SubjectCell({
  getValue,
  column,
  table,
}: {
  getValue: Getter<any>;
  column: Column<EmailTemplate>;
  table: Table<EmailTemplate>;
}) {
  const globalQuery = ensureString(table.getState().globalFilter);
  const columnQuery = ensureString(column.getFilterValue());
  const subject = getValue();

  return (
    <p className="text-sm dark:text-dark-100 text-gray-800 max-w-md truncate">
      <Highlight query={[globalQuery, columnQuery]}>{subject}</Highlight>
    </p>
  );
}

export function VersionCell({ getValue }: { getValue: Getter<any> }) {
  const version = getValue();

  return (
    <Badge color="info" variant="soft" className="rounded-full">
      v{version}
    </Badge>
  );
}

export function StatusCell({ getValue }: { getValue: Getter<any> }) {
  const isActive = getValue();

  return (
    <Tag color={isActive ? "success" : "neutral"}>
      {isActive ? "Active" : "Inactive"}
    </Tag>
  );
}

export function UpdatedDateCell({ getValue }: { getValue: Getter<any> }) {
  const { locale } = useLocaleContext();
  const dateString = getValue();
  const date = dayjs(dateString).locale(locale).format("DD MMM YYYY");
  const time = dayjs(dateString).locale(locale).format("hh:mm A");

  return (
    <>
      <p className="font-medium">{date}</p>
      <p className="dark:text-dark-300 mt-0.5 text-xs text-gray-400">{time}</p>
    </>
  );
}
