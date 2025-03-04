import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ItemList from "../components/paginated-list";

function Results() {
  const base = "https://gutendex.com/books";
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
