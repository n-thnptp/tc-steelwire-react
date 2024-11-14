import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import generatePayload from 'promptpay-qr';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const Banking = ({ 
    orderId, 
    totalAmount, 
    selectedFile,
    setSelectedFile,
    isPromptPayOpen,
    setIsPromptPayOpen
}) => {
    const router = useRouter();
    const [qrCode, setQrCode] = useState('');
    const promptPayNumber = "0626100038";

    useEffect(() => {
        if (totalAmount) {
            generateQR();
        }
    }, [totalAmount]);

    const generateQR = async () => {
        try {
            const payload = generatePayload(promptPayNumber, { amount: totalAmount });
            const qr = await QRCode.toDataURL(payload);
            setQrCode(qr);
        } catch (err) {
            console.error('Error generating QR code:', err);
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    return (
        <div>
            <h2 className="text-lg font-bold mb-6 text-[#603F26] font-inter">PAYMENT</h2>
            
            {/* PromptPay Section */}
            <div className="border p-4 rounded-lg shadow mb-4">
                <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setIsPromptPayOpen(!isPromptPayOpen)}
                >
                    <img src="/pic/PROMPTPAY.png" alt="PromptPay" className="w-24" />
                    <button className="text-gray-600 transition-transform duration-200" 
                            style={{ transform: isPromptPayOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <span>&#9660;</span>
                    </button>
                </div>

                <AnimatePresence>
                    {isPromptPayOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="flex flex-col items-center mt-4">
                                {qrCode && (
                                    <img 
                                        src={qrCode} 
                                        alt="PromptPay QR Code" 
                                        className="w-64 h-64 mb-4"
                                    />
                                )}
                                <p className="text-sm text-gray-600 mb-2">
                                    PromptPay Number: {promptPayNumber}
                                </p>
                                <p className="text-lg font-bold text-[#603F26]">
                                    Amount: {totalAmount?.toLocaleString()} BAHT
                                </p>

                                <div className="w-full mt-6">
                                    <p className="text-sm font-semibold text-[#603F26] mb-2">Upload Payment Slip</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                    {selectedFile && (
                                        <p className="text-sm text-green-600 mt-2">
                                            Selected file: {selectedFile.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bank Options Section */}
            <div className="border p-4 rounded-lg shadow flex justify-between items-center">
                <div className="flex space-x-4">
                    <img src="/pic/SCB_LOGO.png" alt="SCB" className="w-8" />
                    <img src="/pic/KBANK_LOGO.png" alt="KBANK" className="w-8" />
                    <img src="/pic/BAY_LOGO.png" alt="BAY" className="w-8" />
                    <img src="/pic/KTB_LOGO.png" alt="KTB" className="w-8" />
                    <img src="/pic/BBL_LOGO.png" alt="BBL" className="w-8" />
                </div>
                <button className="text-gray-600">
                    <span>&#9660;</span>
                </button>
            </div>
        </div>
    );
};

export default Banking;
