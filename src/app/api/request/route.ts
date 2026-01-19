import { ResponseType } from "@/lib/types/apiResponse";
import { ServerResponseBuilder } from "@/lib/builders/serverResponseBuilder";
import { InputException } from "@/lib/errors/inputExceptions";

import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config"; // keep your path

const ALLOWED_STATUSES = ["pending", "completed", "approved", "rejected"];

function getDbName() {
  const dbName = process.env.MONGODB_DB;
  return typeof dbName === "string" && dbName.length > 0 ? dbName : null;
}

function getPageSize() {
  // Defend against undefined / non-number constants
  const n = Number(PAGINATION_PAGE_SIZE);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const page = parseInt(url.searchParams.get("page") || "1");

  try {

    if (!Number.isInteger(page) || page < 1) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }

    if (status !== null && !ALLOWED_STATUSES.includes(status)) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }

    const dbName = getDbName();
    const pageSize = getPageSize();
    if (!dbName || !pageSize) {
      return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
    }

    const client = await clientPromise;
    const db = client.db(dbName);

    // Fast fail if connection/auth/whitelist/uri is wrong (helps you see the real error in terminal)
    await db.command({ ping: 1 });

    const collection = db.collection("requests");

    const filter: any = {};
    if (status) filter.status = status;

    const docs = await collection
      .find(filter)
      .sort({ createdDate: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const paginatedRequests = docs.map((d: any) => ({
      id: d._id.toString(),
      requestorName: d.requestorName,
      itemRequested: d.itemRequested,
      createdDate: d.createdDate,
      lastEditedDate: d.lastEditedDate,
      status: d.status,
    }));

    // return new Response(JSON.stringify(paginatedRequests), {
    //   status: 200,
    //   headers: { "Content-Type": "application/json" },
    // });

    const totalRecords = await collection.countDocuments(filter);

    return new Response(
        JSON.stringify({
          requests: paginatedRequests,
          totalRecords,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
      
  } catch (e) {
    console.error("GET /api/request failed:", e); // <-- crucial for seeing the real error
    if (e instanceof InputException) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
  }
}

export async function PUT(request: Request) {
  try {
    const req = await request.json();

    const requestorName = req?.requestorName;
    const itemRequested = req?.itemRequested;

    if (
      typeof requestorName !== "string" ||
      requestorName.trim().length < 3 ||
      requestorName.trim().length > 30 ||
      typeof itemRequested !== "string" ||
      itemRequested.trim().length < 2 ||
      itemRequested.trim().length > 100
    ) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }

    const dbName = getDbName();
    if (!dbName) {
      return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
    }

    const now = new Date();

    const doc = {
      requestorName: requestorName.trim(),
      itemRequested: itemRequested.trim(),
      createdDate: now,
      lastEditedDate: now,
      status: "pending",
    };

    const client = await clientPromise;
    const db = client.db(dbName);

    // Fast fail if DB connection is wrong
    await db.command({ ping: 1 });

    const collection = db.collection("requests");
    const result = await collection.insertOne(doc);

    const newRequest = {
      id: result.insertedId.toString(),
      ...doc,
    };

    return new Response(JSON.stringify(newRequest), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("PUT /api/request failed:", e);
    if (e instanceof InputException) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
  }
}

export async function PATCH(request: Request) {
  try {
    const req = await request.json();

    const id = req?.id;
    const status = req?.status;

    if (
      typeof id !== "string" ||
      !ObjectId.isValid(id) ||
      typeof status !== "string" ||
      !ALLOWED_STATUSES.includes(status)
    ) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }

    const dbName = getDbName();
    if (!dbName) {
      return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
    }

    const client = await clientPromise;
    const db = client.db(dbName);

    await db.command({ ping: 1 });

    const collection = db.collection("requests");

    const now = new Date();

    const updateResult = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, lastEditedDate: now } }
    );

    if (updateResult.matchedCount === 0) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }

    const updated = await collection.findOne({ _id: new ObjectId(id) });
    if (!updated) {
      return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
    }

    const editedRequest = {
      id: (updated as any)._id.toString(),
      requestorName: (updated as any).requestorName,
      itemRequested: (updated as any).itemRequested,
      createdDate: (updated as any).createdDate,
      lastEditedDate: (updated as any).lastEditedDate,
      status: (updated as any).status,
    };

    return new Response(JSON.stringify(editedRequest), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("PATCH /api/request failed:", e);
    if (e instanceof InputException) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
  }
}
