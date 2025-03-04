import { useState } from "react";
import { BookCategory } from "../data/categories";
import { useNavigate } from "react-router-dom";

function Categories() {
  const allNames = Object.keys(BookCategory).map((ene) => ene);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleItemClick = (item: string | null) => {
    let nextItem = item;
    if (selectedItem === item) {
      setSelectedItem(null);
      nextItem = null;
    } else {
      setSelectedItem(item);
    }
    const urlParams = new URLSearchParams(window.location.search);
    const savedParams: [string, string][] = [];
    Array.from(urlParams.entries()).map((entry) => {
      const [key, value] = entry;
      if (key !== "topic") {
        savedParams.push([key, value]);
      }
    });
    if (nextItem !== null) {
      savedParams.push(["topic", nextItem]);
    }
    const encodedParams = savedParams.reduce((prev, curr) => {
      const [key, value] = curr;
      return prev === ""
        ? `?${key}=${encodeURIComponent(value)}`
        : `${prev}&${key}=${encodeURIComponent(value)}`;
    }, "");
    navigate(`/results${encodedParams}`);
  };

  function handleShow() {
    setShow((show) => !show);
  }

  return (
    <>
      <div>
        <h2
          className={`p-2 pl-20 pr-20 text-3xl font-semibold cursor-pointer select-none`}
          onClick={handleShow}
        >
          Categories
        </h2>

        <ul
          className={`inline-grid grid-cols-3 transform origin-top transition-all duration-300 ease-in-out ${show ? "scale-none" : "scale-x-0"}`}
        >
          {allNames.map((item) => {
            return (
              <li
                key={item}
                onClick={() => {
                  handleItemClick(item);
                }}
                className={`p-2 cursor-pointer select-none ${
                  selectedItem === item
                    ? "bg-lime-700 border-lime-800"
                    : "nth-[3n]:bg-zinc-700 nth-[3n+1]:bg-slate-700 nth-[3n+2]:bg-stone-700 hover:contrast-150 hover:duration-75"
                } ${show ? "scale-none" : "scale-y-0"} origin-top transition-all duration-300 ease-in-out last:rounded-bl-2xl first:rounded-tl-2xl nth-[3]:rounded-tr-2xl`}
              >
                {item}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default Categories;
