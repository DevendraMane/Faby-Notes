import "./App.css";
import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Loader from "./components/Loader";

const lazyNamed = (importer, exportName) =>
  lazy(() => importer().then((module) => ({ default: module[exportName] })));

const AppLayout = lazyNamed(
  () => import("./components/layout/AppLayout"),
  "AppLayout",
);
const Home = lazyNamed(() => import("./pages/Home"), "Home");
const Semesters = lazy(() => import("./pages/Semesters"));
const Subjects = lazyNamed(() => import("./pages/Subjects"), "Subjects");
const VerifyEmail = lazy(() => import("./components/VerifyEmail"));
const ResendVerification = lazy(() =>
  import("./components/ResendVerification"),
);
const GoogleAuthSuccess = lazy(() => import("./pages/GoogleAuthSuccess"));
const ErrorBoundary = lazyNamed(
  () => import("./components/ErrorBoundary"),
  "ErrorBoundary",
);
const NotesDetail = lazy(() => import("./pages/NotesDetail"));
const NotesView = lazyNamed(() => import("./pages/NotesView"), "NotesView");
const UploadForm = lazy(() => import("./pages/UploadForm"));
const NotesType = lazyNamed(() => import("./pages/NotesType"), "NotesType");
const AiAssistant = lazy(() => import("./pages/AiAssistant"));
const EditUser = lazy(() => import("./pages/EditUser"));
const Bookmark = lazy(() => import("./pages/Bookmarks"));
const Books = lazyNamed(() => import("./pages/Books"), "Books");
const StreamViseBooks = lazy(() => import("./pages/StreamViseBooks"));
const BookMarksView = lazy(() => import("./pages/BookMarksView"));

export const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "feedback",
          element: <Home />,
        },
        {
          path: "register",
          element: <Home />,
        },
        {
          path: "login",
          element: <Home />,
        },
        {
          path: "verify-email",
          element: <VerifyEmail />,
        },
        {
          path: "resend-verification",
          element: <ResendVerification />,
        },
        {
          path: "branch/:slug",
          element: <Semesters />,
        },
        {
          path: "branch/:slug/semester/:semesterNumber",
          element: <Subjects />,
        },
        {
          path: "branch/:slug/semester/:semesterNumber/subject/:subjectCode",
          element: <NotesType />,
        },
        {
          path: "branch/:slug/semester/:semesterNumber/subject/:subjectCode/:notesType",
          element: <NotesDetail />,
        },
        // New route for individual note viewing
        {
          path: "branch/:slug/semester/:semesterNumber/subject/:subjectCode/:notesType/note/:noteId",
          element: <NotesView />,
        },
        {
          path: "upload/form",
          element: <UploadForm />,
        },
        {
          path: "auth/google/success",
          element: <GoogleAuthSuccess />,
        },
        {
          path: "ai-assistant",
          element: <AiAssistant />,
        },
        {
          path: "user/edit",
          element: <EditUser />,
        },
        {
          path: "/view-note/:noteId",
          element: <NotesView />,
        },
        {
          path: "/user/bookmarks",
          element: <Bookmark />,
        },
        {
          path: "/books",
          element: <Books />,
        },
        {
          path: "/books/:streamName",
          element: <StreamViseBooks />,
        },
        {
          path: "/books/:streamName/:book-view",
          element: <NotesView />,
        },
        {
          path: "/user/bookmarks/:notesId",
          element: <BookMarksView />,
        },
      ],
    },
  ]);
  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
