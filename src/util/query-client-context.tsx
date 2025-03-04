import { createContext, useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const QueryClientContext = createContext<QueryClient | null>(null);

export const useQueryClientContext = () => {
  const context = useContext(QueryClientContext);
  if (!context) {
    // TODO: better error message
    const message = "useQueryClientContext missing context";
    console.error({
      timestamp: new Date(),
      message: message,
    });
    throw new Error(message);
  }
  return context;
};

export const QueryClientContextProvider = ({
  children,
}: React.PropsWithChildren) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientContext.Provider value={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </QueryClientContext.Provider>
  );
};
