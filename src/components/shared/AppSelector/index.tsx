// Import Dependencies
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

// Local Imports
import { useAppContext } from "@/app/contexts/app/context";
import { App } from "@/@types/app";
import { Spinner } from "@/components/ui";

// ----------------------------------------------------------------------

export function AppSelector() {
  const { currentApp, apps, isLoading, setCurrentApp } = useAppContext();

  // Don't render anything if loading or no apps
  if (isLoading) {
    return null;
  }

  if (!currentApp || apps.length === 0) {
    return null;
  }

  return (
    <Listbox value={currentApp} onChange={setCurrentApp}>
      <div className="relative px-3 py-2">
        <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2.5 pl-3 pr-10 text-left shadow-sm ring-1 ring-gray-300 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-750 dark:ring-dark-450 dark:hover:bg-dark-700">
          <span className="flex items-center gap-2.5">
            {currentApp.icon && (
              <span className="text-lg">{currentApp.icon}</span>
            )}
            <span className="block truncate text-sm font-medium text-gray-800 dark:text-dark-100">
              {currentApp.name}
            </span>
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-[calc(100%-1.5rem)] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-dark-750 dark:ring-dark-450 sm:text-sm">
            {apps.map((app) => (
              <Listbox.Option
                key={app.id}
                className={({ active }) =>
                  clsx(
                    "relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors",
                    active
                      ? "bg-primary-50 text-primary-900 dark:bg-primary-900/20 dark:text-primary-100"
                      : "text-gray-900 dark:text-dark-100"
                  )
                }
                value={app}
                disabled={!app.isActive}
              >
                {({ selected }) => (
                  <>
                    <span className="flex items-center gap-2.5">
                      {app.icon && <span className="text-base">{app.icon}</span>}
                      <span
                        className={clsx(
                          "block truncate text-sm",
                          selected ? "font-semibold" : "font-normal",
                          !app.isActive && "opacity-50"
                        )}
                      >
                        {app.name}
                      </span>
                      {!app.isActive && (
                        <span className="text-xs text-gray-400 dark:text-dark-400">
                          (Inactive)
                        </span>
                      )}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600 dark:text-primary-400">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
