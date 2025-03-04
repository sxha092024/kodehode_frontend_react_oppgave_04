import { FormEvent, useState } from "react";
import { useNavigate, useNavigation } from "react-router-dom";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (search.trim()) {
      const urlParams = new URLSearchParams(window.location.search);
      const savedParams: [string, string][] = [];
      Array.from(urlParams.entries()).map((entry) => {
        const [key, value] = entry;
        if (key !== "search") {
          savedParams.push([key, value]);
        }
      });
      savedParams.push(["search", search]);
      const encodedParams = savedParams.reduce((prev, curr) => {
        const [key, value] = curr;
        return prev === ""
          ? `?${key}=${encodeURIComponent(value)}`
          : `${prev}&${key}=${encodeURIComponent(value)}`;
      }, "");
      navigate(`/results${encodedParams}`);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSearch}
        className="p-1 pl-3 pr-3 text-3xl font-semibold"
      >
        <input
          className="border-2 rounded-3xl text-center focus-visible:outline-0 focus-visible:border-lime-300"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="search..."
          required
        />
      </form>
    </>
  );
};

export default SearchBar;
