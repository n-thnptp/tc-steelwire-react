import React, { useState } from 'react';

const PCWire = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Array ของ URL ภาพใน Carousel
  const images = [
    '/pic/PC-wire1.png',
    '/pic/PC-wire2.png',
    '/pic/PC-wire3.png'
  ]; // แค่เก็บเส้นทางรูป

  // ฟังก์ชันสำหรับการเลื่อนซ้าย-ขวา
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // จำนวนภาพทั้งหมด
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-center w-full p-10 bg-white">
      {/* Right Section (Text and Description) */}
      <div className="w-full lg:w-1/2 p-8 order-1 lg:order-2">
        <div className="flex items-center mb-4">
          <div className="bg-[#F8D4A0] px-4 py-2 text-4xl lg:text-6xl font-inter font-bold rounded-l-lg text-[#603F26] h-[70px] lg:h-[100px]">PC</div>
          <div className="bg-[#6A462F] px-4 py-2 text-4xl lg:text-6xl font-inter font-bold rounded-r-lg h-[70px] lg:h-[100px] text-[#F8D4A0]">WIRE</div>
        </div>
        <h2 className="text-lg font-inter font-bold mb-4 text-[#603F26]">PRODUCTION DESCRIPTION :</h2>
        <div className="text-sm font-inter w-3/4 text-[#603F26]" style={{ whiteSpace: 'pre-line' }}>
          Pre-stressed Concrete wire คือ ลวดเหล็กที่ถูกออกแบบมาเพื่อใช้ในงานคอนกรีตอัดแรง 
          (Prestressed Concrete) โดยทั่วไปแล้วลวดพีซีจะถูกใช้ในงานก่อสร้างที่ต้องการโครงสร้างที่แข็งแรง
          และสามารถรับน้ำหนักได้มาก สินค้า PC Wire ผลิตได้ทั้งแบบผิวเรียบ, แบบมีรอยย้ำ, แบบหยัก หรือแบบบั้ง
        </div>
      </div>

      {/* Left Section (Image) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center order-2 lg:order-1">
        <img
          src={images[currentIndex]}  // ใช้ URL ของรูป
          alt="PCWire"
          className="w-full max-w-[676px] h-auto rounded-lg shadow-lg"
        />

        {/* Carousel Dots และ ปุ่ม Previous และ Next */}
        <div className="flex items-center justify-center space-x-4 mt-4">
          <button onClick={handlePrevious} className="text-2xl px-4">{"<"}</button>
          <div className="flex space-x-2">
            {images.map((_, index) => (
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

export default PCWire;
