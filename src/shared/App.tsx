// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import LoginForm from "../client/components/LoginForm";
// import ProtectedRoute from "../client/components/ProtectedRoute";
// import Dashboard from "../client/components/Dashboard";
// import { AuthProvider } from "../client/context/AuthContext";

// const App = () => {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/login" element={<LoginForm />} />
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// };

// const App: React.FC = () => {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/login" element={<LoginForm />} />
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// };

// export default App;
