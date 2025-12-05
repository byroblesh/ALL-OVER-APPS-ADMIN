// Import Dependencies
import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { Table } from "@tanstack/react-table";
import { CSSProperties } from "react";

// Local Imports
import { FacedtedFilter } from "@/components/shared/table/FacedtedFilter";
import { Button, Input } from "@/components/ui";
import { TableConfig } from "./TableConfig";
import { useBreakpointsContext } from "@/app/contexts/breakpoint/context";
import { EmailTemplate } from "@/@types/template";

// ----------------------------------------------------------------------

const statusOptions = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];

const languageOptions = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
];

export function Toolbar({ table }: { table: Table<EmailTemplate> }) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings?.enableFullScreen;
  const { onCreateTemplate } = table.options.meta || {};

  return (
    <div className="table-toolbar">
      <div
        className={clsx(
          "transition-content flex items-center justify-between gap-4",
          isFullScreenEnabled ? "px-4 sm:px-5" : "px-(--margin-x) pt-4",
        )}
      >
        <div className="min-w-0">
          <h2 className="dark:text-dark-50 truncate text-xl font-medium tracking-wide text-gray-800">
            Email Templates
          </h2>
        </div>
        {isXs ? (
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton
              as={Button}
              variant="flat"
              className="size-8 shrink-0 rounded-full p-0"
            >
              <EllipsisHorizontalIcon className="size-4.5" />
            </MenuButton>
            <Transition
              as={MenuItems}
              enter="transition ease-out"
              enterFrom="opacity-0 translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-2"
              className="dark:border-dark-500 dark:bg-dark-700 absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 whitespace-nowrap shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden ltr:right-0 rtl:left-0 dark:shadow-none"
            >
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={onCreateTemplate}
                    className={clsx(
                      "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                      focus &&
                        "dark:bg-dark-600 dark:text-dark-100 bg-gray-100 text-gray-800",
                    )}
                  >
                    <span>Create Template</span>
                  </button>
                )}
              </MenuItem>
            </Transition>
          </Menu>
        ) : (
          <div className="flex space-x-2">
            <Button
              variant="outlined"
              className="h-8 space-x-2 rounded-md px-3 text-xs"
              onClick={onCreateTemplate}
            >
              <PlusIcon className="size-4" />
              <span>Create Template</span>
            </Button>
          </div>
        )}
      </div>

      {isXs ? (
        <>
          <div
            className={clsx(
              "flex space-x-2 pt-4 [&_.input-root]:flex-1",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-(--margin-x)",
            )}
          >
            <SearchInput table={table} />
            <TableConfig table={table} />
          </div>
          <div
            className={clsx(
              "hide-scrollbar flex shrink-0 space-x-2 overflow-x-auto pt-4 pb-1",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-(--margin-x)",
            )}
          >
            <Filters table={table} />
          </div>
        </>
      ) : (
        <div
          className={clsx(
            "custom-scrollbar transition-content flex justify-between space-x-4 overflow-x-auto pt-4 pb-1",
            isFullScreenEnabled ? "px-4 sm:px-5" : "px-(--margin-x)",
          )}
          style={
            {
              "--margin-scroll": isFullScreenEnabled
                ? "1.25rem"
                : "var(--margin-x)",
            } as CSSProperties
          }
        >
          <div className="flex shrink-0 space-x-2">
            <SearchInput table={table} />
            <Filters table={table} />
          </div>

          <TableConfig table={table} />
        </div>
      )}
    </div>
  );
}

function SearchInput({ table }: { table: Table<EmailTemplate> }) {
  return (
    <Input
      value={table.getState().globalFilter}
      onChange={(e) => table.setGlobalFilter(e.target.value)}
      prefix={<MagnifyingGlassIcon className="size-4" />}
      classNames={{
        input: "ring-primary-500/50 h-8 text-xs focus:ring-3",
        root: "shrink-0",
      }}
      placeholder="Search templates..."
    />
  );
}

function Filters({ table }: { table: Table<EmailTemplate> }) {
  const isFiltered = table.getState().columnFilters.length > 0;
  return (
    <>
      {table.getColumn("isActive") && (
        <FacedtedFilter
          options={statusOptions}
          column={table.getColumn("isActive")!}
          title="Status"
        />
      )}

      {table.getColumn("language") && (
        <FacedtedFilter
          options={languageOptions}
          column={table.getColumn("language")!}
          title="Language"
        />
      )}

      {isFiltered && (
        <Button
          onClick={() => table.resetColumnFilters()}
          className="h-8 px-2.5 text-xs whitespace-nowrap"
        >
          Reset Filters
        </Button>
      )}
    </>
  );
}
