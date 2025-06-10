import React, { useState } from 'react';

const PCStrand = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Array ของ URL ภาพใน Carousel
    const images = [
        '/pic/PC-strand1.png',
        '/pic/PC-strand2.png',
        '/pic/PC-strand3.png'
    ]; // แค่เก็บเส้นทางรูป

    // ฟังก์ชันสำหรับการเลื่อนซ้าย-ขวา
    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // จำนวนภาพทั้งหมด
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div className="flex flex-col lg:flex-row justify-between items-center w-full h-[calc(100dvh-4rem)] p-10 bg-neutral-gray-100 snap-start">
            {/* Left Section (Text and Description) */}
            <div className="w-full lg:w-1/2 p-8">
                <div className="flex items-center mb-4">
                    <div className="bg-primary-400 px-4 py-2 text-4xl lg:text-6xl font-inter font-bold rounded-l-lg text-neutral-white h-[70px] lg:h-[100px]">PC</div>
                    <div className="bg-primary-600 px-4 py-2 text-4xl lg:text-6xl font-inter font-bold rounded-r-lg text-neutral-white h-[70px] lg:h-[100px]">STRAND</div>
                </div>
                <h2 className="text-lg font-inter font-bold mb-4 text-primary-700">PRODUCTION DESCRIPTION :</h2>
                {/* Text Box Section */}
                <div className="text-sm font-inter w-3/4 text-primary-700" style={{ whiteSpace: 'pre-line' }}>
                    Pre-stressed Concrete Strand คือ ลวดเหล็กที่ถูกดึงให้มีความตึงก่อนที่จะถูกนำไปใช้ในงานก่อสร้าง
                    เพื่อเพิ่มความแข็งแรงให้กับคอนกรีตที่ต้องรับน้ำหนักหรือแรงดันสูง โดยทั่วไปจะใช้ในงาน โครงสร้างที่ต้องการความทนทาน
                    เช่น สะพาน คาน หรือพื้นคอนกรีตที่ต้องการความสามารถในการรับแรงสูง
                </div>
            </div>

            {/* Right Section (Image) */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center">
                <img
                    src={images[currentIndex]} // ใช้ URL ของรูป
                    alt="PCStrand"
                    className="w-full max-w-[676px] h-auto rounded-lg shadow-lg object-cover"
                />

                {/* Carousel Dots และ ปุ่ม Previous และ Next */}
                <div className="flex items-center justify-center space-x-4 mt-4">
                    <button onClick={handlePrevious} className="text-2xl px-4">{"<"}</button>
                    <div className="flex space-x-2">
                        {images.map((_, index) => (
                            <span
                                key={index}
                                className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-primary-700' : 'bg-neutral-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                    <button onClick={handleNext} className="text-2xl px-4">{">"}</button>
                </div>
            </div>
        </div>
    );
};

export default PCStrand;
