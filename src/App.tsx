import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Analytics from "@/pages/Analytics";
import Staff from "@/pages/Staff";
import CheckIn from "@/pages/CheckIn";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/check-in" element={<CheckIn />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;