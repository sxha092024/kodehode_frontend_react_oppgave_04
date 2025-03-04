import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { retreiveData, storeData } from "../util/localstorage";
import { Author } from "../util/gutendex_api";

export interface Favourite {
  id: number | string;
  title: string;
  authors: Author[];
}

function handleDeleteClick(id: Favourite["id"]) {
  const prev = retreiveData<Favourite[]>("favourites") ?? [];
  const next = prev.filter((item) => item.id !== id);
  console.log({
    timestamp: new Date(),
    prev: prev,
    next: next,
  });
  storeData("favourites", next);
}

function Favourites() {
  const [favourites, setFavourites] = useState(
    retreiveData<Favourite[]>("favourites") ?? ([] as Favourite[]),
  );
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const refreshState = () => {
    setFavourites(
      retreiveData<Favourite[]>("favourites") ?? ([] as Favourite[]),
    );
  };

  const handleItemClick = (favourite: number | string) => {
    navigate(`/details/${favourite}`);
  };

  function handleShow() {
    setFavourites(
      retreiveData<Favourite[]>("favourites") ?? ([] as Favourite[]),
    );
    setShow((show) => !show);
  }

  return (
    <>
      <div className="mb-32 xl:mb-0">
        <h2
          className={`p-1 pl-20 pr-20 text-3xl font-semibold cursor-pointer select-none`}
          onClick={handleShow}
        >
          Favourites
        </h2>

        <ul
          className={`inline-grid col-auto transform origin-top transition-all duration-300 ease-in-out ${show ? "scale-none" : "scale-x-0"}`}
        >
          {favourites.map((favourite, index) => {
            return (
              <Link to={`/details/${favourite.id}`} key={index}>
                <li
                  key={favourite.id}
                  onClick={() => {
                    handleItemClick(favourite.id);
                  }}
                  className={`p-2 cursor-pointer select-none nth-[3n]:bg-zinc-700
                nth-[3n+1]:bg-slate-700 nth-[3n+2]:bg-stone-700 hover:contrast-150 
                hover:duration-75 ${show ? "scale-none" : "scale-y-0"} 
                origin-top transition-all duration-300 ease-in-out 
                last:rounded-bl-2xl first:rounded-tl-2xl nth-[3]:rounded-tr-2xl`}
                >
                  <p>Gutendex id: {favourite.id}</p>
                  <p>{favourite.title}</p>
                  <p>
                    {favourite.authors.map((author) => author.name).join(", ")}
                  </p>
                  <button
                    type="button"
                    className="bg-slate-800 px-4 pb-1 pt-1 rounded-3xl border-2 border-slate-700 hover:cursor-pointer"
                    onClick={() => {
                      handleDeleteClick(favourite.id);
                      refreshState();
                      if (favourites.length === 0) {
                        setShow(false);
                      }
                    }}
                  >
                    🗑️
                  </button>
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default Favourites;
