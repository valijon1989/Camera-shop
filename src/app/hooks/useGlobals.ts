import { createContext, useContext } from "react";
import { Member } from "../../lib/types/member";


interface GlobalIntterface {
    authMember: Member | null;
    setAuthMember: (member: Member | null) => void;
}


export const GlobalContext = createContext<GlobalIntterface | undefined>(undefined);    


export const useGlobals = () => {
    const context = useContext(GlobalContext);
    if (context === undefined) {
        throw new Error("useGlobals must be used within a GlobalProvider");
    }
    return context;
};
