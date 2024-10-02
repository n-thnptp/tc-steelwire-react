import React, { useState } from 'react';

const PCStrand = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // ฟังก์ชันสำหรับการเลื่อนซ้าย-ขวา
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % 3); // จำนวนภาพทั้งหมดคือ 3
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + 3) % 3);
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-center w-full p-10 bg-[#FFEAC5]">
      {/* Left Section (Text and Description) */}
      <div className="w-full lg:w-1/2 p-8">
        <div className="flex items-center mb-4">
          <div className="bg-[#FFDBB5] px-4 py-2 text-4xl lg:text-6xl font-inter font-bold rounded-l-lg text-[#603F26] h-[70px] lg:h-[100px]">PC</div>
          <div className="bg-[#603F26] px-4 py-2 text-4xl lg:text-6xl font-inter font-bold rounded-r-lg text-[#FFDBB5] h-[70px] lg:h-[100px]">STRAND</div>
        </div>
        <h2 className="text-lg font-inter font-bold mb-4 text-[#603F26]">PRODUCTION DESCRIPTION :</h2>
        {/* Text Box Section */}
        <div className="text-sm font-inter w-3/4 text-[#603F26]" style={{ whiteSpace: 'pre-line' }}>
          Pre-stressed Concrete Strand คือ ลวดเหล็กที่ถูกดึงให้มีความตึงก่อนที่จะถูกนำไปใช้ในงานก่อสร้าง
          เพื่อเพิ่มความแข็งแรงให้กับคอนกรีตที่ต้องรับน้ำหนักหรือแรงดันสูง โดยทั่วไปจะใช้ในงาน โครงสร้างที่ต้องการความทนทาน
          เช่น สะพาน คาน หรือพื้นคอนกรีตที่ต้องการความสามารถในการรับแรงสูง
        </div>

      </div>

      {/* Right Section (Image) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center">
        <img
          src={require('../../pic/PC-strand1.png')}
          alt="PCStrand"
          className="w-full max-w-[676px] h-auto rounded-lg shadow-lg"
        />

        {/* Carousel Dots และ ปุ่ม Previous และ Next */}
        <div className="flex items-center justify-center space-x-4 mt-4">
          <button onClick={handlePrevious} className="text-2xl px-4">{"<"}</button>
          <div className="flex space-x-2">
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className={`w-3 h-3 rounded-full ${
                  currentIndex === index ? 'bg-brown-500' : 'bg-gray-300'
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
