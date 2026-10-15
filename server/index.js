import axios from "axios";
import express from "express";

const app = express();
const port = Number(process.env.PORT) || 3001;
const cacheTtlMs = 5 * 60 * 1000;
const ownersUrl = "https://digitalcodingtest.bupa.com.au/api/v1/bookowners";

let ownersCache;
let ownersRequest;

const normalizeBookOwners = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return undefined;
  }

  const owners = data.map((owner) => {
    const books = owner.books ?? owner.BOOKS ?? owner[""];

    if (
      typeof owner.name !== "string" ||
      !Number.isFinite(owner.age ?? owner.AGE) ||
      !Array.isArray(books)
    ) {
      return undefined;
    }

    const normalizedBooks = books.map((book) => {
      const name = book.name ?? book.NAME;
      const type = book.type ?? book.TYPE;

      return typeof name === "string" && typeof type === "string"
        ? { name, type }
        : undefined;
    });

    if (normalizedBooks.some((book) => book === undefined)) {
      return undefined;
    }

    return {
      name: owner.name,
      age: owner.age ?? owner.AGE,
      books: normalizedBooks,
    };
  });

  return owners.some((owner) => owner === undefined) ? undefined : owners;
};

const fetchOwners = () => {
  if (ownersCache && ownersCache.expiresAt > Date.now()) {
    return Promise.resolve({ data: ownersCache.data, cache: "HIT" });
  }

  if (!ownersRequest) {
    ownersRequest = (async () => {
      for (let attempt = 0; attempt < 2; attempt += 1) {
        const { data } = await axios.get(ownersUrl, {
          timeout: 10000,
          headers: { Accept: "*/*" },
        });
        const owners = normalizeBookOwners(data);

        if (owners) {
          ownersCache = { data: owners, expiresAt: Date.now() + cacheTtlMs };
          return { data: owners, cache: "MISS" };
        }

        if (attempt === 1) {
          throw new Error("Upstream returned an invalid book owners response.");
        }

        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    })().finally(() => {
      ownersRequest = undefined;
    });
  }

  return ownersRequest;
};

app.get("/api/bookowners", async (_req, res) => {
  try {
    const { data, cache } = await fetchOwners();
    res
      .set("Cache-Control", "no-store")
      .set("X-Cache", cache)
      .json(data);
  } catch (error) {
    const upstreamStatus = axios.isAxiosError(error)
      ? error.response?.status
      : undefined;
    const status = upstreamStatus === 429 ? 429 : 502;

    console.error("Failed to fetch book owners:", error.message);
    res.status(status).json({
      error:
        status === 429
          ? "The book owners service is rate limiting requests. Please try again later."
          : "The book owners service is currently unavailable.",
    });
  }
});

app.listen(port, () => {
  console.log(`Book owners API listening on http://localhost:${port}`);
});
