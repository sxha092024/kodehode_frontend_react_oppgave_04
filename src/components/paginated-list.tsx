import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { Pagination as PaginatedResult } from "../util/gutendex_api";
import { useLocation, Link } from "react-router-dom";

interface BookFetchParam {
  pageParam: string | null | undefined;
}

interface ItemListProps {
  initialUrl: string;
}

export default function ItemList({ initialUrl }: ItemListProps) {
  const location = useLocation();

  const queryClient = useQueryClient();

  const fetchBooks = async ({ pageParam }: BookFetchParam) => {
    const url = pageParam || initialUrl;
    console.log({
      timestamp: new Date(),
      url: url,
      message: "fetching infinite query",
    });
    const res = await fetch(url);
    console.log({
      timestamp: new Date(),
      url: url,
      message: "fetched infinite query",
      data: res,
    });
    const data = await res.json();
    console.log({
      timestamp: new Date(),
      url: url,
      message: "converted to json",
      json: data,
    });
    return data as PaginatedResult;
  };

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery(
    {
      queryKey: ["gutendexSearchResult"],
      queryFn: fetchBooks,
      initialPageParam: null,
      getNextPageParam: (last) => last.next || null,
    },
    queryClient,
  );
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(
    (node: HTMLElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        },
        {
          rootMargin: "100px",
        },
      );

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  useEffect(() => {
    const handleLocationChange = async () => {
      console.log({
        timestamp: new Date(),
        queryClient: queryClient,
        location: location,
        params: location.search,
        path: location.pathname,
        state: location.state,
        hash: location.hash,
        key: location.key,
      });
      // Reset the infinite query when URL parameters change
      await queryClient.resetQueries({
        queryKey: ["gutendexSearchResult"],
      });
      console.log({
        timestamp: new Date(),
        message: "Query cache has been reset, refetchting...",
      });

      refetch();

      console.log({
        timestamp: new Date(),
        message: "Refetching completed.",
      });
    };
    handleLocationChange();
  }, [location, queryClient, refetch]);

  return isLoading ? (
    <>
      <div>
        <p>Loading...</p>
      </div>
    </>
  ) : isError ? (
    <>
      <div>
        <p>Error: {error.message}</p>
      </div>
    </>
  ) : (
    <>
      <div className="max-h-[800px] overflow-y-auto border-2 border-indigo-300 p-4">
        <ul>
          {data?.pages.map((page) =>
            page.results.map((book, index) => (
              <li
                key={book.id}
                ref={index === page.results.length - 1 ? lastItemRef : null}
                className="mt-3 odd:bg-orange-900 even:bg-green-900"
              >
                <Link
                  to={`/details/${book.id}`}
                  className="block p-2 hover:bg-sky-950 transition-all duration-250 ease-in-out"
                >
                  <div>
                    <h3>
                      {book.title} -{" "}
                      {book.authors
                        .map((author) => {
                          let year = "";
                          if (author.birth_year && author.death_year) {
                            year = `(${author.birth_year} - ${author.death_year})`;
                          } else if (
                            author.birth_year &&
                            !(author.death_year ?? false)
                          ) {
                            year = `(${author.birth_year} - ????)`;
                          } else if (
                            !(author.birth_year ?? false) &&
                            author.death_year
                          ) {
                            year = `(???? - ${author.death_year})`;
                          }
                          return `${author.name} ${year}`.trimEnd();
                        })
                        .join(", ")
                        .trimEnd()}
                    </h3>
                    <p>{book.summaries}</p>
                  </div>
                </Link>
              </li>
            )),
          )}
        </ul>

        {isFetchingNextPage && <div>Loading more...</div>}
      </div>
    </>
  );
}
