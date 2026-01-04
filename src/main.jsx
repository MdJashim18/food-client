import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import AuthProvider from './Provider/AuthProvider.jsx';
import RootLayout from './Layout/RootLayout.jsx';
import Login from './Components/Pages/Auth/Login/Login.jsx';
import Register from './Components/Pages/Auth/Register/Register.jsx';
import DashboardLayout from './Layout/DashboardLayout.jsx';
import Dashboard from './Components/Pages/Dashboard/Dashboard.jsx';
import AdminDashboard from './Components/Pages/Dashboard/AdminDashboard.jsx';
import UserDashboard from './Components/Pages/Dashboard/UserDashboard.jsx';
import PrivateRoute from './Provider/PrivateRoute.jsx';
import Home from './Components/Pages/Home.jsx/Home/Home.jsx';
import AddProducts from './Components/Pages/Products/AddProducts.jsx';
import ShowProducts from './Components/Pages/Products/ShowProducts.jsx';
import ProductsDetails from './Components/Pages/Products/ProductsDetails.jsx';
import UpdateProducts from './Components/Pages/Products/UpdateProducts.jsx';
import ProductsReviews from './Components/Pages/Products/ProductsReviews.jsx';
import SeeAllReviews from './Components/Pages/Products/SeeAllReviews.jsx';
import MyCards from './Components/Pages/Products/MyCards.jsx';
import AllProductsAdmin from './Components/Pages/Products/AllProductsAdmin.jsx';
import AllProducts from './Components/Pages/Products/AllProducts.jsx';
import PrivateRouter from './Provider/PrivateRoute.jsx';
import Cards from './Components/Pages/Products/Cards.jsx';
import AllOrders from './Components/Pages/Products/AllOrders.jsx';
import About from './Components/Pages/Home.jsx/About/About.jsx';
import Contact from './Components/Pages/Home.jsx/Contact/Contact.jsx';
import FAQ from './Components/Pages/Home.jsx/FAQ/FAQ.jsx';




const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    children: [
      {
        index: true,
        element: <Home></Home>

      },
      {
        path: '/login',
        element: <Login></Login>
      },
      {
        path: '/register',
        element: <Register></Register>
      },
      {
        path: '/ShowProducts',
        element: <ShowProducts></ShowProducts>
      },
      {
        path: '/ProductsDetails/:id',
        element: <ProductsDetails></ProductsDetails>
      },
      {
        path: '/ProductsReviews/:id',
        element: <ProductsReviews></ProductsReviews>
      },
      {
        path: '/AllProducts',
        element: <AllProducts></AllProducts>
      },
      {
        path: '/addedCards',
        element: <Cards></Cards>
      },
      {
        path: '/About',
        element: <About></About>
      },
      {
        path: '/Contact',
        element: <Contact></Contact>
      },
      {
        path: '/faq',
        element: <FAQ></FAQ>
      }
    ]
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute><DashboardLayout /></PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard></Dashboard>
      },
      {
        path: "admin",
        element: <AdminDashboard></AdminDashboard>
      },
      {
        path: "user",
        element: <UserDashboard></UserDashboard>
      },
      {
        path: 'addProducts',
        element: <AddProducts></AddProducts>
      },
      {
        path: 'UpdateProducts/:id',
        element: <UpdateProducts></UpdateProducts>
      },
      {
        path: 'SeeAllReviews',
        element: <SeeAllReviews></SeeAllReviews>
      },
      {
        path: 'MyCards',
        element: <MyCards></MyCards>
      },
      {
        path: 'AllOrders',
        element: <AllOrders></AllOrders>
      },
      {
        path: 'AllProductsAdmin',
        element: <AllProductsAdmin></AllProductsAdmin>
      },
      
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  </StrictMode>,
)
