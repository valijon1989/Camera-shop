import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { GlobalContext } from "../hooks/useGlobals";
import Cookies from "universal-cookie";
import { Member } from "../../lib/types/member";
import axios from "../../api/axios";
import { getApiUrl } from "../../lib/config";

const ContextProvider: React.FC <{ children: ReactNode }> = ({ children })  => {
  const cookies = useMemo(() => new Cookies(), []);
  const [authMember, setAuthMember] = useState<Member | null>(() => {
    try {
      const raw = localStorage.getItem("memberData");
      if (!raw || raw === "undefined") {
        localStorage.removeItem("memberData");
        return null;
      }
      return JSON.parse(raw) as Member;
    } catch (err) {
      console.error("Failed to parse memberData from localStorage:", err);
      localStorage.removeItem("memberData");
      return null;
    }
  });
  const [orderBuilder, setOrderBuilder] = useState<Date>(new Date());

  useEffect(() => {
    if (!cookies.get("accessToken")) {
      localStorage.removeItem("memberData");
      setAuthMember(null);
    }
  }, [cookies]);

  // Auto-fetch member detail if token cookie bor, lekin authMember null bo'lsa
  useEffect(() => {
    const token = cookies.get("accessToken");
    if (token && !authMember) {
      axios
        .get(getApiUrl("member/detail"), { withCredentials: true })
        .then((res) => {
          if (res.data) {
            setAuthMember(res.data);
            localStorage.setItem("memberData", JSON.stringify(res.data));
            return;
          }
          cookies.remove("accessToken", { path: "/" });
          localStorage.removeItem("memberData");
          setAuthMember(null);
        })
        .catch((err) => {
          if (err?.response?.status === 401) {
            cookies.remove("accessToken", { path: "/" });
          }
          localStorage.removeItem("memberData");
          setAuthMember(null);
        });
    }
  }, [authMember, cookies]);

  return (
    <GlobalContext.Provider value={{ authMember, setAuthMember, orderBuilder, setOrderBuilder }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextProvider;
