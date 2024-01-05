import { lazy, Suspense } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

const FeedPage = lazy(() => import("./main-feed"));

const Routing = () => {
    return (
        <Router>
            <Suspense fallback={<></>}>
                <Routes>
                    <Route path="/feed" element={<FeedPage />} />
                </Routes>
            </Suspense>
        </Router>
    );
};

export default Routing;