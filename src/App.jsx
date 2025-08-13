import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import HomePage from "./Pages/HomePage";
import Pricing from "./Pages/Pricing";
import Products from "./Pages/Products";
import PageNotFound from "./Pages/PageNotFound";
import AppLayout from "./Pages/AppLayout";
import "./App.css";
import LogIn from "./Pages/LogIn";
import "leaflet/dist/leaflet.css";
import Cities from "./Pages/Cities";
import AddDetail from "./Pages/AddDetail";
import Countries from "./Pages/Countries";
import VisitDetail from "./Pages/VisitDetail";
import { CityDataProvider } from "./Context/CityDataContext";
import { AuthProvider } from "./Context/FakeAuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
function App() {
  return (
    <AuthProvider>
      <CityDataProvider>
        <BrowserRouter>
          <Routes>
            {/* index work as default page */}
            <Route index element={<HomePage />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/products" element={<Products />} />
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* here Cities element work as a default page for AppLayout */}

              {/* <Route
              index
              element={
                <Cities
                  citiesData={citiesData}
                  loading={loading}
                  error={error}
                  dispatch={dispatch}
                />
              }
            /> */}

              {/* if something connect with page and that page also set as default then that thing will only happen when route to page and not on default but using navigation in default part to direct to that page that has something associated will overcom this issue just like below */}

              <Route index element={<Navigate replace to="cities" />} />
              <Route path="cities" element={<Cities />} />
              <Route path="cities/:id" element={<VisitDetail />} />
              <Route path="detail" element={<AddDetail />} />
              <Route path="countries" element={<Countries />} />
              <Route path="visitDetail" element={<VisitDetail />} />
              <Route path="form" element={<AddDetail />} />
            </Route>
            <Route path="/login" element={<LogIn />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </CityDataProvider>
    </AuthProvider>
  );
}

export default App;
