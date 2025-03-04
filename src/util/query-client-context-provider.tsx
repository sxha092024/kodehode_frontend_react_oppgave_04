import {
  QueryClient,
  QueryClientContext,
  QueryClientProvider,
} from "@tanstack/react-query";

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
