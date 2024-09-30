// src/components/PCWire.jsx
import React, { useState } from 'react';

const PCWire = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // ฟังก์ชันสำหรับการเลื่อนซ้าย-ขวา
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % 3); // จำนวนภาพทั้งหมดคือ 3
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + 3) % 3);
  };

  return (
    <div className="flex justify-between items-center w-full p-10 bg-white">
      {/* Left Section (Image) */}
      <div className="w-1/2 flex flex-col items-start">
        <img
          src={require('../../pic/PC-wire1.png')}
          alt="PCWire"
          className="w-[676px] h-[463px] rounded-lg shadow-lg"
        />

        {/* Carousel Dots และ ปุ่ม Previous และ Next */}
        <div className="flex items-center justify-center space-x-4 mt-4 transform translate-x-[250px]">

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

      {/* Right Section (Text and Description) */}
      <div className="w-1/2 p-8">
        <div className="flex items-center mb-4">
          <div className="bg-[#F8D4A0] px-4 py-2 text-6xl font-inter font-bold rounded-l-lg text-[#603F26] h-[100px]">PC</div>
          <div className="bg-[#6A462F] px-4 py-2 text-6xl font-inter font-bold text-white rounded-r-lg #FFDBB5 h-[100px]">WIRE</div>
        </div>
        <h2 className="text-lg font-inter font-bold mb-4">PRODUCTION DESCRIPTION :</h2>
        <p className="text-sm">
          Pre-stressed Concrete wire คือ ลวดเหล็กที่ถูกออกแบบมาเพื่อใช้ในงานคอนกรีตอัดแรง 
          (Prestressed Concrete) <br></br> โดยทั่วไปแล้วลวดพีซีจะถูกใช้ในงานก่อสร้างที่ต้องการโครงสร้างที่แข็งแรง
          และสามารถรับน้ำหนักได้มาก <br></br> สินค้า PC Wire ผลิตได้ทั้งแบบผิวเรียบ, แบบมีรอยย้ำ, แบบหยัก หรือแบบบั้ง<br></br>
        </p>
      </div>
    </div>
  );
};

export default PCWire;
