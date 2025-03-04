import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/header";
import { BrowserRouter, Location, Route, Routes } from "react-router-dom";
import Results from "./pages/results";
import { QueryClientContextProvider } from "./util/query-client-context-provider";
import PageChangeEffect from "./util/page-change-effect";
import Details from "./pages/details";
import useBreakpoint from "./util/breakpoints";

function App() {
  const breakpoint = useBreakpoint();
  useEffect(() => {}, [breakpoint]);
  const [dvh, setDvh] = useState(100);
  const [headerMT, setHeaderMT] = useState(16);

  function handlePageTransition(location?: Location) {
    if (location !== undefined) {
      if (
        location.pathname === "/" ||
        location.pathname === "/kodehode_frontend_react_oppgave_04"
      ) {
        setDvh(100);
        setHeaderMT(16);
      } else if (location.pathname.startsWith("/details")) {
        if (breakpoint !== "xs") {
          setDvh(33);
        } else {
          setDvh(80);
        }
        setHeaderMT(0);
      } else {
        if (breakpoint !== "xs") {
          setDvh(33);
        } else {
          setDvh(100);
        }
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
            <Route path="/" element={<></>}></Route>
            <Route path="/details/:id" element={<Details />}></Route>
          </Routes>
        </BrowserRouter>
      </QueryClientContextProvider>
    </>
  );
}

export default App;
