// import React from "react";
// import Dropdown, { DropdownOption } from "@/components/atoms/Dropdown";

// export type RequestStatus = "pending" | "completed" | "approved" | "rejected";

// export interface ItemRequest {
//   id: string;
//   requestorName: string;
//   itemRequested: string;
//   createdDate: string; // ISO string
//   lastEditedDate?: string; // optional
//   status: RequestStatus;
// }

// interface ItemRequestsTableProps {
//   requests: ItemRequest[];
//   onStatusChange: (id: string, status: RequestStatus) => void;
// }

// const statusOptions: DropdownOption[] = [
//   { label: "Pending", value: "pending" },
//   { label: "Completed", value: "completed" },
//   { label: "Approved", value: "approved" },
//   { label: "Rejected", value: "rejected" },
// ];

// function formatDate(iso: string) {
//   const d = new Date(iso);
//   if (Number.isNaN(d.getTime())) return iso;
//   return d.toLocaleString();
// }

// export default function ItemRequestsTable({
//   requests,
//   onStatusChange,
// }: ItemRequestsTableProps) {
//   return (
//     <div className="w-full overflow-x-auto rounded-md border border-gray-stroke">
//       <table className="min-w-[900px] w-full text-left text-sm">
//         <thead className="bg-primary-fill text-gray-text">
//           <tr>
//             <th className="px-4 py-3">Requestor Name</th>
//             <th className="px-4 py-3">Item Requested</th>
//             <th className="px-4 py-3">Created Date</th>
//             <th className="px-4 py-3">Last Edited Date</th>
//             <th className="px-4 py-3">Status</th>
//           </tr>
//         </thead>

//         <tbody>
//           {requests.map((r) => {
//             const lastEdited = r.lastEditedDate ?? r.createdDate;

//             return (
//               <tr key={r.id} className="border-t border-gray-stroke">
//                 <td className="px-4 py-3 whitespace-nowrap">
//                   {r.requestorName}
//                 </td>
//                 <td className="px-4 py-3">{r.itemRequested}</td>
//                 <td className="px-4 py-3 whitespace-nowrap">
//                   {formatDate(r.createdDate)}
//                 </td>
//                 <td className="px-4 py-3 whitespace-nowrap">
//                   {formatDate(lastEdited)}
//                 </td>
//                 <td className="px-4 py-3 w-56">
//                   <Dropdown
//                     value={r.status}
//                     options={statusOptions}
//                     onChange={(e) =>
//                       onStatusChange(r.id, e.target.value as RequestStatus)
//                     }
//                   />
//                 </td>
//               </tr>
//             );
//           })}

//           {requests.length === 0 && (
//             <tr className="border-t border-gray-stroke">
//               <td className="px-4 py-6 text-gray-text" colSpan={5}>
//                 No item requests found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// import React, { useMemo, useRef, useEffect } from "react";
// import Dropdown, { DropdownOption } from "@/components/atoms/Dropdown";

// export type RequestStatus = "pending" | "completed" | "approved" | "rejected";

// export interface ItemRequest {
//   id: string;
//   requestorName: string;
//   itemRequested: string;
//   createdDate: string; // ISO string
//   lastEditedDate?: string; // optional
//   status: RequestStatus;
// }

// interface ItemRequestsTableProps {
//   requests: ItemRequest[]; // page will always pass an array, but we still guard
//   onStatusChange: (id: string, status: RequestStatus) => void;

//   selectedIds: Set<string>;
//   setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
// }

// const statusOptions: DropdownOption[] = [
//   { label: "Pending", value: "pending" },
//   { label: "Completed", value: "completed" },
//   { label: "Approved", value: "approved" },
//   { label: "Rejected", value: "rejected" },
// ];

// function formatDate(iso: string) {
//   const d = new Date(iso);
//   if (Number.isNaN(d.getTime())) return iso;
//   return d.toLocaleDateString();
// }

// export default function ItemRequestsTable({
//   requests,
//   onStatusChange,
//   selectedIds,
//   setSelectedIds,
// }: ItemRequestsTableProps) {
//   // ✅ hard guard so map/length never explode
//   const safeRequests = Array.isArray(requests) ? requests : [];

//   const allOnPageSelected = useMemo(() => {
//     return safeRequests.length > 0 && safeRequests.every((r) => selectedIds.has(r.id));
//   }, [safeRequests, selectedIds]);

//   const someOnPageSelected = useMemo(() => {
//     return safeRequests.some((r) => selectedIds.has(r.id)) && !allOnPageSelected;
//   }, [safeRequests, selectedIds, allOnPageSelected]);

//   const selectAllRef = useRef<HTMLInputElement | null>(null);

//   useEffect(() => {
//     if (selectAllRef.current) {
//       selectAllRef.current.indeterminate = someOnPageSelected;
//     }
//   }, [someOnPageSelected]);

//   const toggleOne = (id: string) => {
//     setSelectedIds((prev) => {
//       const next = new Set(prev);
//       if (next.has(id)) next.delete(id);
//       else next.add(id);
//       return next;
//     });
//   };

//   const toggleAllOnPage = () => {
//     setSelectedIds((prev) => {
//       const next = new Set(prev);

//       if (allOnPageSelected) {
//         safeRequests.forEach((r) => next.delete(r.id));
//       } else {
//         safeRequests.forEach((r) => next.add(r.id));
//       }

//       return next;
//     });
//   };

//   return (
//     <div className="w-full overflow-x-auto rounded-md border border-gray-stroke">
//       <table className="min-w-[1000px] w-full text-left text-sm">
//         <thead className="bg-primary-fill text-gray-text">
//           <tr>
//             <th className="px-4 py-3 w-14">
//               <input
//                 ref={selectAllRef}
//                 type="checkbox"
//                 checked={allOnPageSelected}
//                 onChange={toggleAllOnPage}
//                 className="h-5 w-5"
//                 aria-label="Select all rows on page"
//               />
//             </th>

//             <th className="px-4 py-3">Name</th>
//             <th className="px-4 py-3">Item Requested</th>
//             <th className="px-4 py-3">Created</th>
//             <th className="px-4 py-3">Updated</th>
//             <th className="px-4 py-3">Status</th>
//           </tr>
//         </thead>

//         <tbody>
//           {safeRequests.map((r) => {
//             const lastEdited = r.lastEditedDate ?? r.createdDate;
//             const isSelected = selectedIds.has(r.id);

//             return (
//               <tr
//                 key={r.id}
//                 className={[
//                   "border-t border-gray-stroke",
//                   isSelected ? "bg-blue-50" : "bg-white",
//                 ].join(" ")}
//               >
//                 <td className="px-4 py-3">
//                   <input
//                     type="checkbox"
//                     checked={isSelected}
//                     onChange={() => toggleOne(r.id)}
//                     className="h-5 w-5"
//                     aria-label={`Select request ${r.id}`}
//                   />
//                 </td>

//                 <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
//                   {r.requestorName}
//                 </td>
//                 <td className="px-4 py-3 text-gray-text">{r.itemRequested}</td>
//                 <td className="px-4 py-3 whitespace-nowrap text-gray-text">
//                   {formatDate(r.createdDate)}
//                 </td>
//                 <td className="px-4 py-3 whitespace-nowrap text-gray-text">
//                   {formatDate(lastEdited)}
//                 </td>

//                 <td className="px-4 py-3 w-56">
//                   <Dropdown
//                     value={r.status}
//                     options={statusOptions}
//                     onChange={(e) =>
//                       onStatusChange(r.id, e.target.value as RequestStatus)
//                     }
//                   />
//                 </td>
//               </tr>
//             );
//           })}

//           {safeRequests.length === 0 && (
//             <tr className="border-t border-gray-stroke">
//               <td className="px-4 py-6 text-gray-text" colSpan={6}>
//                 No item requests found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// import React from "react";
// import Dropdown, { DropdownOption } from "@/components/atoms/Dropdown";

// export type RequestStatus = "pending" | "completed" | "approved" | "rejected";

// export interface ItemRequest {
//   id: string;
//   requestorName: string;
//   itemRequested: string;
//   createdDate: string;
//   lastEditedDate?: string;
//   status: RequestStatus;
// }

// interface ItemRequestsTableProps {
//   requests: ItemRequest[];
//   onStatusChange: (id: string, status: RequestStatus) => Promise<void> | void;
//   selectedIds: Set<string>;
//   setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
// }

// const statusOptions: DropdownOption[] = [
//   { label: "Pending", value: "pending" },
//   { label: "Approved", value: "approved" },
//   { label: "Completed", value: "completed" },
//   { label: "Rejected", value: "rejected" },
// ];

// function formatDate(iso: string) {
//   const d = new Date(iso);
//   if (Number.isNaN(d.getTime())) return iso;
//   return d.toLocaleDateString();
// }

// export default function ItemRequestsTable({
//   requests,
//   onStatusChange,
//   selectedIds,
//   setSelectedIds,
// }: ItemRequestsTableProps) {
//   const safeRequests = Array.isArray(requests) ? requests : [];

//   const toggleOne = (id: string) => {
//     setSelectedIds((prev) => {
//       const next = new Set(prev);
//       if (next.has(id)) next.delete(id);
//       else next.add(id);
//       return next;
//     });
//   };

//   return (
//     <div className="w-full overflow-x-auto rounded-md border border-gray-stroke">
//       <table className="min-w-[1000px] w-full text-left text-sm">
//         <thead className="bg-primary-fill text-gray-text">
//           <tr>
//             <th className="px-4 py-3 w-14"></th>
//             <th className="px-4 py-3">Name</th>
//             <th className="px-4 py-3">Item Requested</th>
//             <th className="px-4 py-3">Created</th>
//             <th className="px-4 py-3">Updated</th>
//             <th className="px-4 py-3">Status</th>
//           </tr>
//         </thead>

//         <tbody>
//           {safeRequests.map((r) => {
//             const lastEdited = r.lastEditedDate ?? r.createdDate;
//             const isSelected = selectedIds.has(r.id);

//             return (
//               <tr
//                 key={r.id}
//                 className={[
//                   "border-t border-gray-stroke",
//                   isSelected ? "bg-blue-50" : "bg-white",
//                 ].join(" ")}
//               >
//                 <td className="px-4 py-3">
//                   <input
//                     type="checkbox"
//                     checked={isSelected}
//                     onChange={() => toggleOne(r.id)}
//                     className="h-5 w-5"
//                   />
//                 </td>

//                 <td className="px-4 py-3 font-medium">{r.requestorName}</td>
//                 <td className="px-4 py-3 text-gray-text">{r.itemRequested}</td>
//                 <td className="px-4 py-3 text-gray-text">
//                   {formatDate(r.createdDate)}
//                 </td>
//                 <td className="px-4 py-3 text-gray-text">
//                   {formatDate(lastEdited)}
//                 </td>

//                 <td className="px-4 py-3">
//                   <Dropdown
//                     value={r.status}
//                     options={statusOptions}
//                     onChange={(val) =>
//                       onStatusChange(r.id, val as RequestStatus)
//                     }
//                   />
//                 </td>
//               </tr>
//             );
//           })}

//           {safeRequests.length === 0 && (
//             <tr>
//               <td colSpan={6} className="px-4 py-6 text-gray-text">
//                 No item requests found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }


"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { StatusPill } from "@/components/atoms/Dropdown";

export type RequestStatus = "pending" | "completed" | "approved" | "rejected";

export interface ItemRequest {
  id: string;
  requestorName: string;
  itemRequested: string;
  createdDate: string;
  lastEditedDate?: string;
  status: RequestStatus;
}

interface ItemRequestsTableProps {
  requests: ItemRequest[];
  selectedIds: Set<string>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const statusLabel: Record<RequestStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  completed: "Completed",
  rejected: "Rejected",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString();
}

export default function ItemRequestsTable({
  requests,
  selectedIds,
  setSelectedIds,
}: ItemRequestsTableProps) {
  const safeRequests = Array.isArray(requests) ? requests : [];

  const allOnPageSelected = useMemo(() => {
    return safeRequests.length > 0 && safeRequests.every((r) => selectedIds.has(r.id));
  }, [safeRequests, selectedIds]);

  const someOnPageSelected = useMemo(() => {
    return safeRequests.some((r) => selectedIds.has(r.id)) && !allOnPageSelected;
  }, [safeRequests, selectedIds, allOnPageSelected]);

  const selectAllRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = someOnPageSelected;
  }, [someOnPageSelected]);

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllOnPage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) safeRequests.forEach((r) => next.delete(r.id));
      else safeRequests.forEach((r) => next.add(r.id));
      return next;
    });
  };

  return (
    <div className="w-full overflow-x-auto rounded-md border border-gray-stroke">
      <table className="min-w-[1000px] w-full text-left text-sm">
        <thead className="bg-primary-fill text-gray-text">
          <tr>
            {/* select-all */}
            <th className="px-4 py-3 w-14">
              <input
                ref={selectAllRef}
                type="checkbox"
                checked={allOnPageSelected}
                onChange={toggleAllOnPage}
                className="h-5 w-5"
                aria-label="Select all rows"
              />
            </th>

            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Item Requested</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3">Updated</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {safeRequests.map((r) => {
            const isSelected = selectedIds.has(r.id);
            const updated = r.lastEditedDate ?? r.createdDate;

            return (
              <tr
                key={r.id}
                className={[
                  "border-t border-gray-stroke",
                  isSelected ? "bg-blue-50" : "bg-white",
                ].join(" ")}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleOne(r.id)}
                    className="h-5 w-5"
                    aria-label="Select row"
                  />
                </td>

                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                  {r.requestorName}
                </td>
                <td className="px-4 py-3 text-gray-text">{r.itemRequested}</td>
                <td className="px-4 py-3 text-gray-text whitespace-nowrap">
                  {formatDate(r.createdDate)}
                </td>
                <td className="px-4 py-3 text-gray-text whitespace-nowrap">
                  {formatDate(updated)}
                </td>

                {/* ✅ status is READ ONLY pill */}
                <td className="px-4 py-3">
                  <StatusPill value={r.status} label={statusLabel[r.status]} />
                </td>
              </tr>
            );
          })}

          {safeRequests.length === 0 && (
            <tr className="border-t border-gray-stroke">
              <td colSpan={6} className="px-4 py-6 text-gray-text">
                No item requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
