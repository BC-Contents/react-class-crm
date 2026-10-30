import { createBrowserRouter } from "react-router";
import Layout from "../Layout/Layout";
import Home from "../pages/Home/Home";
import Contact from "../pages/Contact/Contact";
import TopicsPage from "../pages/Topics/TopicsPage";
import NotFound from "../pages/NotFound/NotFound";

export const router = createBrowserRouter([
    {
        path:"/",
        element: <Layout/>,
        children:[
            {
                path:"/",
                element:<Home/>
            },
            {
                path:"/contacto",
                element:<Contact/>
            },
            {
                path:"/tema/:id",
                element:<TopicsPage/>
            },
            {
                path:"*",
                element:<NotFound/>
            }
        ],
    },
])