import { useEffect } from "react";
import { Location, useLocation } from "react-router-dom";

interface PageChangeEffectProps {
  func: <T>(location: Location<T>) => void;
}

const PageChangeEffect = ({
  func,
}: React.PropsWithChildren<PageChangeEffectProps>) => {
  const location = useLocation();

  useEffect(() => {
    func(location);
  }, [location.pathname, location.search, func, location]);

  return null;
};

export default PageChangeEffect;
