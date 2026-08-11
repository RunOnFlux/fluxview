import { Navbar, Nodes, Apps, Splash } from "./components";
import { Routes, Route } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Core from "./Pages/Core";
import Gaming from "./Pages/Gaming";

const queryClient = new QueryClient();

const App = () => {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <DataProvider>
          <Routes>
            <Route path="/" element={<Navbar />}>
              <Route index element={<Splash />} />

              <Route path="Nodes" element={<Nodes />}>
                <Route path=":userId" element={<Nodes />} />
              </Route>

              <Route path="Apps" element={<Apps />}>
                <Route path=":userId" element={<Apps />} />
              </Route>

              <Route path="Core" element={<Core />}>
                <Route path=":userId" element={<Core />} />
              </Route>

              <Route path="Gaming" element={<Gaming />}>
                <Route path=":userId" element={<Gaming />} />
              </Route>

              <Route path="*" element={<p className="font-poppins text-white font-[52px]">Content Not Found</p>} />
            </Route>
          </Routes>
        </DataProvider>
      </QueryClientProvider>
    </div>
  );
};

export default App;
