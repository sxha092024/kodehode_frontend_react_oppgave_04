import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { retreiveData, storeData } from "../util/localstorage";
import { Favourite } from "../components/favourites";
import { useQueryClientContext } from "../util/query-client-context";
import ItemList from "../components/paginated-list";
import PageChangeEffect from "../util/page-change-effect";

function Results() {
  const base = "https://gutendex.com/books";
  const [favourites, setFavourites] = useState(
    retreiveData<Favourite[]>("favourites") ?? ([] as Favourite[]),
  );
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = Array.from(queryParams.entries()).map((entry) => {
    const [key, value] = entry;
    return `${key}=${value}\n`;
  });
  const [url, setUrl] = useState(`${base}${location.search}`);

  useEffect(() => {
    setUrl(`${base}${location.search}`);
  }, [location.search, location.pathname]);

  // TODO: update type
  function handleFavouriteClick(result: any) {
    const { id, title, authors } = result;

    const favourite = {
      id: id,
      title: title,
      authors: authors,
    } as Favourite;
    favourites.push(favourite);
    setFavourites(favourites);
  }

  return (
    <>
      <div className="-mt-24 flex-col justify-between">
        <h2 className="bg-pink-950 text-2xl font-semibold">results for</h2>
        <ul>
          {query.map((val, idx) => (
            <li className="even:bg-pink-950 odd:bg-red-950 pt-1 pb-1" key={idx}>
              {val}
            </li>
          ))}
        </ul>
        <ItemList initialUrl={url}></ItemList>
      </div>
    </>
  );
}

export default Results;
