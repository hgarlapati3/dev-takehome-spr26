"use client";

import { useEffect, useMemo, useState } from "react";
import ItemRequestsTable, {
  ItemRequest,
  RequestStatus,
} from "@/components/tables/ItemsRequestTable";
import Pagination from "@/components/molecules/Pagination";
import Dropdown, { DropdownOption } from "@/components/atoms/Dropdown";
import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";

type Tab = "all" | "pending" | "approved" | "completed" | "rejected";

const statusOptions: DropdownOption[] = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Completed", value: "completed" },
  { label: "Rejected", value: "rejected" },
];

export default function ItemRequestsPage() {
  const [requests, setRequests] = useState<ItemRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const hasSelection = selectedIds.size > 0;

  const fetchRequests = async (tab: Tab, page: number) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (tab !== "all") params.set("status", tab);

    const res = await fetch(`/api/request?${params.toString()}`);
    const data = await res.json();

    setRequests(Array.isArray(data?.requests) ? data.requests : []);
    setTotalRecords(typeof data?.totalRecords === "number" ? data.totalRecords : 0);
    setSelectedIds(new Set());
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await fetchRequests(activeTab, pageNumber);
      } finally {
        setLoading(false);
      }
    })();
  }, [activeTab, pageNumber]);


  const handleBulkStatus = async (status: RequestStatus) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    const results = await Promise.all(
      ids.map((id) =>
        fetch("/api/request", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status }),
        })
      )
    );

    if (results.some((r) => !r.ok)) {
      alert("One or more updates failed");
      return;
    }

    await fetchRequests(activeTab, pageNumber);
  };

  const handleTrashClick = () => {
    alert("Delete not implemented yet.");
  };

  const tabs = useMemo(
    () => [
      { key: "all" as const, label: "All" },
      { key: "pending" as const, label: "Pending" },
      { key: "approved" as const, label: "Approved" },
      { key: "completed" as const, label: "Completed" },
      { key: "rejected" as const, label: "Rejected" },
    ],
    []
  );

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl border border-gray-stroke shadow-sm">

        <div className="p-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Item Requests</h2>

          <div className="flex items-center gap-4">
            <span className="text-gray-text text-lg">Mark As</span>

            <Dropdown
              placeholder="Status"
              options={statusOptions}
              size="lg"
              disabled={!hasSelection}
              onChange={(val) => handleBulkStatus(val as RequestStatus)}
            />

            <div className="h-10 w-px bg-gray-stroke" />

            <button
              type="button"
              onClick={handleTrashClick}
              disabled={!hasSelection}
              className="h-12 w-12 rounded-md flex items-center justify-center text-gray-text disabled:opacity-40"
              aria-label="Delete selected"
              title="Delete selected"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="px-6">
          <div className="flex gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setActiveTab(t.key);
                  setPageNumber(1);
                }}
                className={[
                  "px-6 py-3 rounded-t-md text-sm font-medium border border-b-0",
                  activeTab === t.key
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-fill-light text-gray-text border-gray-fill-light hover:bg-gray-200",
                ].join(" ")}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-b border-gray-stroke" />

        <div className="px-6 py-4">
          {loading ? (
            <div className="text-gray-text">Loading...</div>
          ) : (
            <ItemRequestsTable
              requests={requests}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
            />
          )}
        </div>

        <div className="px-6 pb-6 flex justify-end">
          <Pagination
            pageNumber={pageNumber}
            pageSize={PAGINATION_PAGE_SIZE}
            totalRecords={totalRecords}
            onPageChange={setPageNumber}
          />
        </div>
      </div>
    </div>
  );
}
