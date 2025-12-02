
import React, { ReactNode, useEffect, useState } from "react";
import { GlobalContext } from "../hooks/useGlobals";
import Cookies from "universal-cookie";
import { Member } from "../../lib/types/member";
import axios from "../../api/axios";



const ContextProvider: React.FC <{ children: ReactNode }> = ({ children })  => {
  const cookies = new Cookies();
  if (!cookies.get("accessToken")) localStorage.removeItem("memberData");
  
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
  console.log("authMember:", authMember);

  // Auto-fetch member detail if token cookie bor, lekin authMember null bo'lsa
  useEffect(() => {
    const token = cookies.get("accessToken");
    if (token && !authMember) {
      axios
        .get("/member/detail", { withCredentials: true })
        .then((res) => {
          setAuthMember(res.data);
          localStorage.setItem("memberData", JSON.stringify(res.data));
        })
        .catch((err) => {
          console.error("Failed to fetch member detail:", err);
          localStorage.removeItem("memberData");
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
