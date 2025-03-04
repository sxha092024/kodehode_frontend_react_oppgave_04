import React from "react";
import SearchBar from "./search-bar";
import Categories from "./categories";
import { Link } from "react-router-dom";
import Favourites from "./favourites";

interface HeaderProps {
  dvh?: number;
  mt?: number;
}

const Header = ({ dvh, mt }: React.PropsWithChildren<HeaderProps>) => {
  return (
    /* TODO:
    |-----------------------------------------------------------------------|
    |--------header with: category dropdown, search field, favourite--------|
    |=======================================================================|
    |---------dropdown---------[ search... ]---------[ favourite ]----------|
    |.........vvvvvvvv......................................................|
    |........|Category|.....................................................|
    |........|========|.....................................................|
    |=======================================================================|
    It is currently a non-goal to have the dropdown be floating, or otherwise
    not affect the underlying layout of the page */
    <>
      <header
        className={`flex flex-col justify-center items-center mt-${mt} transition-all duration-700 ease-in-out`}
        style={{ height: `${dvh}dvh` }}
      >
        <h1 className={`text-8xl mb-8 font-black`}>
          <Link to="/">Gutendex lookup</Link>
        </h1>
        <nav className="flex justify-between">
          <Categories />
          <SearchBar />
          <Favourites />
        </nav>
      </header>
    </>
  );
};

export default Header;
