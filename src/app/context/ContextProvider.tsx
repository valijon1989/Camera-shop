
import React, { ReactNode, useState } from "react";
import { GlobalContext } from "../hooks/useGlobals";
import Cookies from "universal-cookie";
import { Member } from "../../lib/types/member";



const ContextProvider: React.FC <{ children: ReactNode }> = ({ children })  => {
  const cookies = new Cookies();
  if (!cookies.get("accessToken")) localStorage.removeItem("memberData");
  
  const [authMember, setAuthMember] = useState<Member | null>(
    localStorage.getItem("memberData")
      ? JSON.parse(localStorage.getItem("memberData")!)
      : null
  );
  console.log("authMember:", authMember);
  return (
    <GlobalContext.Provider value={{ authMember, setAuthMember }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextProvider;
