import { useContext } from "react";
import FormContext from "../Context/RegisterContext";

const useFormContext = () => {
    const context = useContext(FormContext);
    
    if (!context) {
        throw new Error("useLoginContext must be used within a LoginProvider");
    }
    
    return context;
};

export default useFormContext;