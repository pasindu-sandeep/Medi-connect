import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const [allow, setAllow] = useState(false);

  useEffect(() => {
    const allowed = sessionStorage.getItem("adminNavigated");
    if (allowed === "true") {
      sessionStorage.removeItem("adminNavigated");
      setAllow(true);
    } else {
      navigate("/"); // redirect to home if accessed directly
    }
  }, [navigate]);

  return allow ? <>{children}</> : null;
};

export default ProtectedAdminRoute;
