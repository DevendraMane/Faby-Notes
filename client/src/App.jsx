import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { Home } from "./pages/Home";
import Semesters from "./pages/Semesters";
import { Subjects } from "./pages/Subjects";
import VerifyEmail from "./components/VerifyEmail";
import ResendVerification from "./components/ResendVerification";
import GoogleAuthSuccess from "./pages/GoogleAuthSuccess";
import { ErrorBoundary } from "./components/ErrorBoundary";
import NotesDetail from "./pages/NotesDetail";
import { NotesView } from "./pages/NotesView";
import UploadForm from "./pages/UploadForm";
import { NotesType } from "./pages/NotesType";
import AiAssistant from "./pages/AiAssistant";
import EditUser from "./pages/EditUser";
import Bookmark from "./pages/Bookmarks";
import { Books } from "./pages/Books";
import StreamViseBooks from "./pages/StreamViseBooks";
import BookMarksView from "./pages/BookMarksView";

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
  return <RouterProvider router={router} />;
};

export default App;
