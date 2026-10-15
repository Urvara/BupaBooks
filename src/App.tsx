import { useState, useMemo, useCallback } from "react";
import axios from "axios";
import { useBooks } from "./hooks/useBooks";
import "./styles.css";
import { Book, Owner } from "./interfaces/types";



export default function App() {
  const [showBooks, setShowBooks] = useState(false);
  const [hardcoverOnly, setHardcoverOnly] = useState(false);

  const {
    data: owners = [],
    isLoading,
    isError,
    error,
  } = useBooks(showBooks);

  const errorMessage = axios.isAxiosError(error)
    ? ((error.response?.data as { error?: string })?.error ??
        error.message)
    : "Unable to load book owners.";

  const groupedBooks = useMemo(() => {
    const adults: Book[] = [];
    const children: Book[] = [];

    owners.forEach((owner: Owner) => {
      const target = owner.age >= 18 ? adults : children;

      owner.books.forEach((book: Book) => {
        if (
          hardcoverOnly &&
          book.type.toLowerCase() !== "hardcover"
        ) {
          return;
        }

        target.push(book);
      });
    });

    adults.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    children.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return {
      adults,
      children,
    };
  }, [owners, hardcoverOnly]);

  const handleGetBooks = useCallback(() => {
    setShowBooks(true);
    setHardcoverOnly(false);
  }, []);

  const handleHardcoverOnly = useCallback(() => {
    setShowBooks(true);
    setHardcoverOnly(true);
  }, []);

  return (
    <div className="container">
      <h1>Bupa Books</h1>

      <div className="controls">
        <button onClick={handleGetBooks}>
          Get Books
        </button>

        <button onClick={handleHardcoverOnly}>
          Hardcover Only
        </button>
      </div>

      {showBooks && isLoading && (
        <p>Loading...</p>
      )}

      {showBooks && isError && (
        <p role="alert">
          {errorMessage}
        </p>
      )}

      {showBooks &&
        !isLoading &&
        !isError && (
          <>
            <section>
              <h2>
                {hardcoverOnly
                  ? "Hardcover Books owned by Adults"
                  : "Books owned by Adults"}
              </h2>

              {groupedBooks.adults.length > 0 ? (
                <ul>
                  {groupedBooks.adults.map(
                    (book, index) => (
                      <li
                        key={`${book.name}-${index}`}
                      >
                        {book.name}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>No books found.</p>
              )}
            </section>

            <section>
              <h2>
                {hardcoverOnly
                  ? "Hardcover Books owned by Children"
                  : "Books owned by Children"}
              </h2>

              {groupedBooks.children.length >
              0 ? (
                <ul>
                  {groupedBooks.children.map(
                    (book, index) => (
                      <li
                        key={`${book.name}-${index}`}
                      >
                        {book.name}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>No books found.</p>
              )}
            </section>
          </>
        )}
    </div>
  );
}