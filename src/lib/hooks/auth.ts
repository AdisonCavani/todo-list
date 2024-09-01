import { AuthContext } from "@components/auth-provider";
import { useContext } from "react";

export const useSession = () => useContext(AuthContext);
