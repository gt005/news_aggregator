import { lazy, Suspense } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

const FeedPage = lazy(() => import("./mainFeed").then(module => ({ default: module.FeedPage })));
const FolderPage = lazy(() => import("./folder").then(module => ({ default: module.FolderPage })));

const Routing = () => {
    return (
        <Router>
            <Suspense fallback={<></>}>
                <Routes>
                    <Route path="/" element={<FeedPage />} />
                    <Route path="/folder/:folderId" element={<FolderPage />} />
                </Routes>
            </Suspense>
        </Router>
    );
};

export default Routing;