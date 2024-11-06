import { useContext } from 'react';
import LoginContext from '../Context/LoginContext';

const useLoginContext = () => {
    const context = useContext(LoginContext);
    if (!context) {
        throw new Error('useLoginContext must be used within a LoginProvider');
    }
    return context;
};

export default useLoginContext; 