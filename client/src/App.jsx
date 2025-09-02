import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// Pages
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import EnrolledCoursesPage from "./pages/EnrolledCoursesPage";
import CreatedCoursesPage from "./pages/CreatedCoursesPage";
import CoursePreviewPage from "./pages/CoursePreviewPage";
import CreateCoursePage from "./pages/CreateCoursePage";
import EditCoursePage from "./pages/EditCoursePage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Routes */}
              <Route
                path="/courses"
                element={
                  <ProtectedRoute>
                    <CoursesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:id"
                element={
                  <ProtectedRoute>
                    <CourseDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:id/preview"
                element={
                  <ProtectedRoute>
                    <CoursePreviewPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:id"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/enrolled"
                element={
                  <ProtectedRoute>
                    <EnrolledCoursesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/created"
                element={
                  <ProtectedRoute>
                    <CreatedCoursesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/create"
                element={
                  <ProtectedRoute>
                    <CreateCoursePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditCoursePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
