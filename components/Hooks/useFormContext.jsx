import { useContext } from "react";
import FormContext from "../Context/RegisterContext";

const useFormContext = () => {
    return useContext(FormContext);
};

export default useFormContext;