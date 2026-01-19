// "use client";

// import { useEffect, useState } from "react";
// import ItemRequestsTable, {
//   ItemRequest,
//   RequestStatus,
// } from "@/components/tables/ItemsRequestTable";

// export default function ItemRequestsPage() {
//   const [requests, setRequests] = useState<ItemRequest[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   const fetchRequests = async () => {
//     const res = await fetch("/api/request?page=1");
//     const data = await res.json();
//     setRequests(data);
//   };


//   useEffect(() => {
//     (async () => {
//       try {
//         await fetchRequests();
//       } catch (e) {
//         console.error("Failed to fetch requests", e);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);


//   const handleStatusChange = async (id: string, status: RequestStatus) => {

//     setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

//     try {
//       const res = await fetch("/api/request", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id, status }),
//       });

//       if (!res.ok) throw new Error("PATCH failed");

//       const updated: ItemRequest = await res.json();

   
//       setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
//     } catch (e) {
//       console.error("Failed to update status", e);

      
//       try {
//         await fetchRequests();
//       } catch {}
//       alert("Failed to update status. Please try again.");
//     }
//   };

//   return (
//     <div className="p-6 flex flex-col gap-4">
//       <h2 className="font-bold text-lg">Item Requests</h2>

//       {loading ? (
//         <div>Loading...</div>
//       ) : (
//         <ItemRequestsTable requests={requests} onStatusChange={handleStatusChange} />
//       )}
//     </div>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import ItemRequestsTable, {
//   ItemRequest,
//   RequestStatus,
// } from "@/components/tables/ItemsRequestTable";

// export default function ItemRequestsPage() {
//   const [requests, setRequests] = useState<ItemRequest[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [totalRecords, setTotalRecords] = useState<number>(0);

//   const fetchRequests = async () => {
//     const res = await fetch("/api/request?page=1");
//     const data = await res.json();

//     // ✅ FIX: backend now returns { requests, totalRecords }
//     setRequests(data.requests);
//     setTotalRecords(data.totalRecords);
//   };

//   useEffect(() => {
//     (async () => {
//       try {
//         await fetchRequests();
//       } catch (e) {
//         console.error("Failed to fetch requests", e);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   const handleStatusChange = async (id: string, status: RequestStatus) => {
//     // Optimistic UI update
//     setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

//     try {
//       const res = await fetch("/api/request", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id, status }),
//       });

//       if (!res.ok) throw new Error("PATCH failed");

//       // Re-fetch to keep data consistent
//       await res.json(); // consume response
//       await fetchRequests();
//     } catch (e) {
//       console.error("Failed to update status", e);

//       try {
//         await fetchRequests();
//       } catch {}
//       alert("Failed to update status. Please try again.");
//     }
//   };

//   return (
//     <div className="p-6 flex flex-col gap-4">
//       <h2 className="font-bold text-lg">Item Requests</h2>

//       {loading ? (
//         <div>Loading...</div>
//       ) : (
//         <ItemRequestsTable
//           requests={requests}
//           onStatusChange={handleStatusChange}
//         />
//       )}
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import ItemRequestsTable, {
//   ItemRequest,
//   RequestStatus,
// } from "@/components/tables/ItemsRequestTable";
// import Pagination from "@/components/molecules/Pagination";
// import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";

// type Tab = "all" | "pending" | "approved" | "completed" | "rejected";

// export default function ItemRequestsPage() {
//   const [requests, setRequests] = useState<ItemRequest[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   const [activeTab, setActiveTab] = useState<Tab>("all");
//   const [pageNumber, setPageNumber] = useState<number>(1);
//   const [totalRecords, setTotalRecords] = useState<number>(0);

//   const fetchRequests = async (tab: Tab, page: number) => {
//     const params = new URLSearchParams();
//     params.set("page", String(page));
//     if (tab !== "all") params.set("status", tab);

//     const res = await fetch(`/api/request?${params.toString()}`);
//     const data = await res.json();

//     // backend returns { requests, totalRecords }
//     setRequests(data.requests);
//     setTotalRecords(data.totalRecords);
//   };

//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         await fetchRequests(activeTab, pageNumber);
//       } catch (e) {
//         console.error("Failed to fetch requests", e);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [activeTab, pageNumber]);

//   const handleStatusChange = async (id: string, status: RequestStatus) => {
//     // Optimistic update
//     setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

//     try {
//       const res = await fetch("/api/request", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id, status }),
//       });

//       if (!res.ok) throw new Error("PATCH failed");

//       // Keep tab + pagination consistent
//       await fetchRequests(activeTab, pageNumber);
//     } catch (e) {
//       console.error("Failed to update status", e);
//       await fetchRequests(activeTab, pageNumber);
//       alert("Failed to update status. Please try again.");
//     }
//   };

//   const tabs: { key: Tab; label: string }[] = [
//     { key: "all", label: "All" },
//     { key: "pending", label: "Pending" },
//     { key: "approved", label: "Approved" },
//     { key: "completed", label: "Completed" },
//     { key: "rejected", label: "Rejected" },
//   ];

//   return (
//     <div className="p-6">
//       {/* Card container like Figma */}
//       <div className="bg-white rounded-xl border border-gray-stroke shadow-sm">
//         {/* Header */}
//         <div className="p-6">
//           <h2 className="text-2xl font-semibold text-gray-900">Item Requests</h2>
//         </div>

//         {/* Tabs */}
//         <div className="px-6">
//           <div className="flex gap-2">
//             {tabs.map((t) => (
//               <button
//                 key={t.key}
//                 onClick={() => {
//                   setActiveTab(t.key);
//                   setPageNumber(1); // reset page when switching tabs
//                 }}
//                 className={[
//                   "px-6 py-3 rounded-t-md text-sm font-medium border border-b-0",
//                   activeTab === t.key
//                     ? "bg-blue-600 text-white border-blue-600"
//                     : "bg-gray-fill-light text-gray-text border-gray-fill-light hover:bg-gray-200",
//                 ].join(" ")}
//               >
//                 {t.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Divider under tabs */}
//         <div className="border-b border-gray-stroke" />

//         {/* Table */}
//         <div className="px-6 py-4">
//           {loading ? (
//             <div className="text-gray-text">Loading...</div>
//           ) : (
//             <ItemRequestsTable
//               requests={requests}
//               onStatusChange={handleStatusChange}
//             />
//           )}
//         </div>

//         {/* Pagination footer (bottom-right-ish like Figma) */}
//         <div className="px-6 pb-6 flex justify-end">
//           <Pagination
//             pageNumber={pageNumber}
//             pageSize={PAGINATION_PAGE_SIZE}
//             totalRecords={totalRecords}
//             onPageChange={(newPage) => setPageNumber(newPage)}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useEffect, useMemo, useState } from "react";
// import ItemRequestsTable from "@/components/tables/ItemsRequestTable";
// import Pagination from "@/components/molecules/Pagination";
// import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";

// type RequestStatus = "pending" | "approved" | "completed" | "rejected";

// interface ItemRequest {
//   id: string;
//   requestorName: string;
//   itemRequested: string;
//   createdDate: string;
//   lastEditedDate?: string;
//   status: RequestStatus;
// }

// type Tab = "all" | "pending" | "approved" | "completed" | "rejected";

// export default function ItemRequestsPage() {
//   const [requests, setRequests] = useState<ItemRequest[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   const [activeTab, setActiveTab] = useState<Tab>("all");
//   const [pageNumber, setPageNumber] = useState<number>(1);
//   const [totalRecords, setTotalRecords] = useState<number>(0);

//   const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
//   const hasSelection = selectedIds.size > 0;

//   const tabs: { key: Tab; label: string }[] = useMemo(
//     () => [
//       { key: "all", label: "All" },
//       { key: "pending", label: "Pending" },
//       { key: "approved", label: "Approved" },
//       { key: "completed", label: "Completed" },
//       { key: "rejected", label: "Rejected" },
//     ],
//     []
//   );

//   // ✅ Robust fetch: supports BOTH shapes
//   // - array: [...]
//   // - object: { requests: [...], totalRecords: number }
//   const fetchRequests = async (tab: Tab, page: number) => {
//     const params = new URLSearchParams();
//     params.set("page", String(page));
//     if (tab !== "all") params.set("status", tab);

//     const res = await fetch(`/api/request?${params.toString()}`);
//     const data = await res.json();

//     const list = Array.isArray(data) ? data : data?.requests;
//     const total = Array.isArray(data) ? data.length : data?.totalRecords;

//     setRequests(Array.isArray(list) ? list : []);
//     setTotalRecords(typeof total === "number" ? total : 0);

//     // reset selection whenever the list changes
//     setSelectedIds(new Set());
//   };

//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         await fetchRequests(activeTab, pageNumber);
//       } catch (e) {
//         console.error("Failed to fetch requests", e);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [activeTab, pageNumber]);

//   const handleStatusChange = async (id: string, status: RequestStatus) => {
//     // optimistic update
//     setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

//     try {
//       const res = await fetch("/api/request", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id, status }),
//       });

//       if (!res.ok) throw new Error("PATCH failed");

//       await fetchRequests(activeTab, pageNumber);
//     } catch (e) {
//       console.error("Failed to update status", e);
//       await fetchRequests(activeTab, pageNumber);
//       alert("Failed to update status. Please try again.");
//     }
//   };

//   const handleBulkStatus = async (status: RequestStatus) => {
//     const ids = Array.from(selectedIds);
//     if (ids.length === 0) return;

//     try {
//       const results = await Promise.all(
//         ids.map((id) =>
//           fetch("/api/request", {
//             method: "PATCH",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ id, status }),
//           })
//         )
//       );

//       if (results.some((r) => !r.ok)) throw new Error("One or more PATCH failed");

//       await fetchRequests(activeTab, pageNumber);
//     } catch (e) {
//       console.error("Bulk status update failed:", e);
//       alert("Failed to update selected rows.");
//       await fetchRequests(activeTab, pageNumber);
//     }
//   };

//   const handleBulkDelete = async () => {
//     alert("Bulk delete not implemented yet.");
//   };

//   return (
//     <div className="p-6">
//       <div className="bg-white rounded-xl border border-gray-stroke shadow-sm">
//         {/* Header row */}
//         <div className="p-6 flex items-center justify-between">
//           <h2 className="text-2xl font-semibold text-gray-900">Item Requests</h2>

//           {/* Top-right controls */}
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-3">
//               <span className="text-gray-text text-lg">Mark As</span>

//               <select
//                 className="h-11 w-72 rounded-md border border-blue-600 bg-white px-4 text-gray-text focus:outline-none disabled:opacity-50"
//                 defaultValue=""
//                 disabled={!hasSelection}
//                 onChange={(e) => {
//                   const value = e.target.value as RequestStatus | "";
//                   if (value) handleBulkStatus(value);
//                   e.currentTarget.value = "";
//                 }}
//               >
//                 <option value="" disabled>
//                   Status
//                 </option>
//                 <option value="pending">Pending</option>
//                 <option value="approved">Approved</option>
//                 <option value="completed">Completed</option>
//                 <option value="rejected">Rejected</option>
//               </select>
//             </div>

//             <div className="h-10 w-px bg-gray-stroke" />

//             <button
//               className="h-11 w-11 rounded-md flex items-center justify-center text-gray-text disabled:opacity-40"
//               disabled={!hasSelection}
//               onClick={handleBulkDelete}
//               aria-label="Delete selected"
//               title="Delete selected"
//             >
//               🗑️
//             </button>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="px-6">
//           <div className="flex gap-2">
//             {tabs.map((t) => (
//               <button
//                 key={t.key}
//                 onClick={() => {
//                   setActiveTab(t.key);
//                   setPageNumber(1);
//                 }}
//                 className={[
//                   "px-6 py-3 rounded-t-md text-sm font-medium border border-b-0",
//                   activeTab === t.key
//                     ? "bg-blue-600 text-white border-blue-600"
//                     : "bg-gray-fill-light text-gray-text border-gray-fill-light hover:bg-gray-200",
//                 ].join(" ")}
//               >
//                 {t.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="border-b border-gray-stroke" />

//         {/* Table */}
//         <div className="px-6 py-4">
//           {loading ? (
//             <div className="text-gray-text">Loading...</div>
//           ) : (
//             <ItemRequestsTable
//               requests={requests}
//               onStatusChange={handleStatusChange}
//               selectedIds={selectedIds}
//               setSelectedIds={setSelectedIds}
//             />
//           )}
//         </div>

//         {/* Pagination */}
//         <div className="px-6 pb-6 flex justify-end">
//           <Pagination
//             pageNumber={pageNumber}
//             pageSize={Number(PAGINATION_PAGE_SIZE) || 5}
//             totalRecords={totalRecords}
//             onPageChange={(newPage) => setPageNumber(newPage)}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useEffect, useMemo, useState } from "react";
// import ItemRequestsTable, {
//   ItemRequest,
//   RequestStatus,
// } from "@/components/tables/ItemsRequestTable";
// import Pagination from "@/components/molecules/Pagination";
// import Dropdown, { DropdownOption } from "@/components/atoms/Dropdown";
// import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";

// type Tab = "all" | "pending" | "approved" | "completed" | "rejected";

// const statusOptions: DropdownOption[] = [
//   { label: "Pending", value: "pending" },
//   { label: "Approved", value: "approved" },
//   { label: "Completed", value: "completed" },
//   { label: "Rejected", value: "rejected" },
// ];

// export default function ItemRequestsPage() {
//   const [requests, setRequests] = useState<ItemRequest[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [activeTab, setActiveTab] = useState<Tab>("all");
//   const [pageNumber, setPageNumber] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);

//   const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
//   const hasSelection = selectedIds.size > 0;

//   const fetchRequests = async (tab: Tab, page: number) => {
//     const params = new URLSearchParams();
//     params.set("page", String(page));
//     if (tab !== "all") params.set("status", tab);

//     const res = await fetch(`/api/request?${params.toString()}`);
//     const data = await res.json();

//     // backend returns { requests, totalRecords }
//     setRequests(Array.isArray(data?.requests) ? data.requests : []);
//     setTotalRecords(typeof data?.totalRecords === "number" ? data.totalRecords : 0);

//     // reset selection on new page/tab
//     setSelectedIds(new Set());
//   };

//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         await fetchRequests(activeTab, pageNumber);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [activeTab, pageNumber]);

//   const handleStatusChange = async (id: string, status: RequestStatus) => {
//     const res = await fetch("/api/request", {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id, status }),
//     });

//     if (!res.ok) {
//       alert("Failed to update status");
//       return;
//     }

//     await fetchRequests(activeTab, pageNumber);
//   };

//   const handleBulkStatus = async (status: RequestStatus) => {
//     const ids = Array.from(selectedIds);
//     if (ids.length === 0) return;

//     const results = await Promise.all(
//       ids.map((id) =>
//         fetch("/api/request", {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ id, status }),
//         })
//       )
//     );

//     if (results.some((r) => !r.ok)) {
//       alert("One or more updates failed");
//       return;
//     }

//     await fetchRequests(activeTab, pageNumber);
//   };

//   const tabs = useMemo(
//     () => [
//       { key: "all" as const, label: "All" },
//       { key: "pending" as const, label: "Pending" },
//       { key: "approved" as const, label: "Approved" },
//       { key: "completed" as const, label: "Completed" },
//       { key: "rejected" as const, label: "Rejected" },
//     ],
//     []
//   );

//   return (
//     <div className="p-6">
//       <div className="bg-white rounded-xl border border-gray-stroke shadow-sm">
//         {/* Header */}
//         <div className="p-6 flex justify-between items-center">
//           <h2 className="text-2xl font-semibold">Item Requests</h2>

//           <div className="flex items-center gap-4">
//             <span className="text-gray-text text-lg">Mark As</span>

//             <Dropdown
//               placeholder="Status"
//               options={statusOptions}
//               size="lg"
//               disabled={!hasSelection}
//               onChange={(val) => handleBulkStatus(val as RequestStatus)}
//             />
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="px-6 flex gap-2">
//           {tabs.map((t) => (
//             <button
//               key={t.key}
//               onClick={() => {
//                 setActiveTab(t.key);
//                 setPageNumber(1);
//               }}
//               className={[
//                 "px-6 py-3 rounded-t-md text-sm font-medium border border-b-0",
//                 activeTab === t.key
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-fill-light text-gray-text",
//               ].join(" ")}
//             >
//               {t.label}
//             </button>
//           ))}
//         </div>

//         <div className="border-b border-gray-stroke" />

//         {/* Table */}
//         <div className="px-6 py-4">
//           {loading ? (
//             <div>Loading...</div>
//           ) : (
//             <ItemRequestsTable
//               requests={requests}
//               onStatusChange={handleStatusChange}
//               selectedIds={selectedIds}
//               setSelectedIds={setSelectedIds}
//             />
//           )}
//         </div>

//         {/* Pagination */}
//         <div className="px-6 pb-6 flex justify-end">
//           <Pagination
//             pageNumber={pageNumber}
//             pageSize={PAGINATION_PAGE_SIZE}
//             totalRecords={totalRecords}
//             onPageChange={setPageNumber}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

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

  // ✅ bulk mark-as (PATCH per id using YOUR backend)
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

  // Trash icon placeholder (no DELETE endpoint in your backend yet)
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
        {/* Header (title + Mark As + trash) */}
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

            {/* trash icon */}
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

        {/* Tabs */}
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

        {/* Table */}
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

        {/* Pagination */}
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
