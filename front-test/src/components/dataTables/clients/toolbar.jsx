import {
  XIcon,
  TrashIcon,
  MessageSquareTextIcon,
  MailIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DataTableFacetedFilter } from "../shared/facetedFilter";
import { DataTableViewOptions } from "../shared/viewOptions";
import { Link } from "react-router-dom";
import { guestOption, subscriberOptions } from "./options";
import {
  handleDeleteClients,
  handleSendEmail,
  handleSendSMS,
} from "@/functions/clients";
import { useState } from "react";
import { SMSDialog } from "@/components/forms/SMSDialog";
import { EmailDialog } from "@/components/forms/emailDialog";

export function DataTableToolbar({ table, refresh }) {
  const [isSMSDialogOpen, setIsSMSDialogOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex flex-wrap items-center flex-1 gap-2">
        <Input
          placeholder="Filter Code..."
          value={table.getState().globalFilter ?? ""}
          className="h-8 w-[150px] lg:w-[250px]"
          onChange={(event) => {
            table.setGlobalFilter(event.target.value);
          }}
        />
        {table.getColumn("isGuest") && (
          <DataTableFacetedFilter
            title="Account"
            column={table.getColumn("isGuest")}
            options={guestOption}
          />
        )}
        {table.getColumn("subscriber") && (
          <DataTableFacetedFilter
            title="Subscribe"
            column={table.getColumn("subscriber")}
            options={subscriberOptions}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <XIcon className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <>
            <Button
              onClick={() => {
                handleDeleteClients(
                  table.getFilteredSelectedRowModel().rows,
                  refresh
                );
              }}
              variant="outline"
              size="sm"
            >
              <TrashIcon className="mr-2 size-4" aria-hidden="true" />
              Delete ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
            <Button
              onClick={() => setIsSMSDialogOpen(true)}
              variant="outline"
              size="sm"
            >
              <MessageSquareTextIcon
                className="mr-2 size-4"
                aria-hidden="true"
              />
              Send SMS ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
            {isSMSDialogOpen && (
              <SMSDialog
                isOpen={isSMSDialogOpen}
                setIsOpen={setIsSMSDialogOpen}
                selectedRows={table.getFilteredSelectedRowModel().rows}
              />
            )}
            <Button
              onClick={() => setIsEmailOpen(true)}
              variant="outline"
              size="sm"
            >
              <MailIcon className="mr-2 size-4" aria-hidden="true" />
              Send Email ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
            {isEmailOpen && (
              <EmailDialog
                isEmailOpen={isEmailOpen}
                setIsEmailOpen={setIsEmailOpen}
                selectedRows={table.getFilteredSelectedRowModel().rows}
              />
            )}
          </>
        ) : null}
        <DataTableViewOptions table={table} />
        <Button size="sm">
          <Link to="new">Ajouter Clients</Link>
        </Button>
      </div>
    </div>
  );
}
