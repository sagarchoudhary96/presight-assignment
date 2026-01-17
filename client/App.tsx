import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserList } from "@/components/UserList";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              User Directory
            </h1>
            <p className="text-muted-foreground">
              Dynamic list of users with infinite scroll and virtualization.
            </p>
          </header>

          <UserList />
        </div>
      </main>
    </QueryClientProvider>
  );
}

export default App;
