import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface PageChangeEffectProps {
  func: Function;
}

const PageChangeEffect = ({
  func,
}: React.PropsWithChildren<PageChangeEffectProps>) => {
  const location = useLocation();

  useEffect(() => {
    func(location);
  }, [location.pathname, location.search]);

  return null;
};

export default PageChangeEffect;
