import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Dashboard from "./components/Dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRote";
import Unauthorized from "./pages/Unauthorized";
import AdminPanel from "./components/AdminPanel";
import Header from "./components/Header/Header";
import Registration from "./components/Users/Registration";
import CategoriesList from "./components/CategoriesList/CategoriesList";
import ProductOrder from "./components/ProductOrder/ProductOrder";
import ProductCart from "./components/ProductCart/ProductCart";
import ProductConfirmation from "./components/ProductConfirmation/ProductConfirmation";
import ProductDelivery from "./components/ProductDelivery/ProductDelivery";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<>
          <Header />
          <Dashboard />
        </>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/dashboard"
          element={
            <>
              <Header />
              <Dashboard />
            </>
          }
        />
        <Route
          path="/categories-list/:categoryId/:id"
          element={
            <>
              <Header />
              <CategoriesList />
            </>
          }
        />
        <Route
          path="/product-order/:id/:listItemId"
          element={
            <>
              <Header />
              <ProductOrder />
            </>
          }
        />
        <Route
          path="/product-confirmation/:listItemId"
          element={
            <>
              <Header />
              <ProductConfirmation />
            </>
          }
        />
        <Route
          path="/delivery"
          element={
            <ProtectedRoute>
              <Header />
              <ProductDelivery />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Header />
              <ProductCart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registration"
          element={
            <ProtectedRoute>
              <Header />
              <Registration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <RoleBasedRoute role="admin">
              <AdminPanel />
            </RoleBasedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;