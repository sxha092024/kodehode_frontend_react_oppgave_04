import { useState } from "react";
import "./App.css";
import Header from "./components/header";
import { BrowserRouter, Location, Route, Routes } from "react-router-dom";
import Results from "./pages/results";
import { QueryClientContextProvider } from "./util/query-client-context-provider";
import PageChangeEffect from "./util/page-change-effect";
import Details from "./pages/details";

function App() {
  const [dvh, setDvh] = useState(100);
  const [headerMT, setHeaderMT] = useState(16);

  function handlePageTransition(location?: Location) {
    if (location !== undefined) {
      if (location.pathname === "/") {
        setDvh(100);
        setHeaderMT(16);
      } else if (location.pathname.startsWith("/details")) {
        setDvh(33);
        setHeaderMT(0);
      } else {
        setDvh(33);
        setHeaderMT(0);
      }
    }
  }

  return (
    <>
      <QueryClientContextProvider>
        <BrowserRouter>
          <PageChangeEffect func={handlePageTransition} />
          <Header dvh={dvh} mt={headerMT} />
          <Routes>
            <Route path="/results" element={<Results />}></Route>
            <Route
              path="/"
              element={
                <>
                  {
                    // TODO:
                    // display results as list, paginate
                    // | name, author, date [*] | // favourite
                    // | name, author, date [ ] | // not favourite
                    // |   <  [1] [2] [3]   >   |
                    // |          ^^^           |
                    // N.B: we should only build the *next* page upon explicit user interaction and then bubble that
                    // up into a pagination-container component.
                    // the pagination component should be able to memoize based on the unique url containing the query params
                  }

                  <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                  </p>

                  <p className="read-the-docs">
                    Click on the Vite and React logos to learn more
                  </p>
                </>
              }
            ></Route>
            <Route path="/details/:id" element={<Details />}></Route>
          </Routes>
        </BrowserRouter>
      </QueryClientContextProvider>
    </>
  );
}

export default App;
