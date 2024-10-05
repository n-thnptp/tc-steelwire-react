import React from 'react';

const SummaryView = ({ summary }) => {
  return (
    <div className="bg-white p-6 rounded-lg w-2/6 h-full flex flex-col">
      {/* กล่องที่ 1: ข้อความ "Summary" */}
      <div className="mb-4">
        <h2 className="text-4xl font-bold text-accent-900 text-right font-inter">Summary</h2> {/* ปรับขนาดและชิดขวา */}
      </div>

      {/* กล่องที่ 2: ข้อมูลสรุป */}
      <div className="flex-grow overflow-y-auto bg-gray-100 rounded-lg shadow-lg p-4 mb-4"> {/* เพิ่มเงาให้กล่อง */}
        <p className="mb-2 text-gray-500 font-inter">CURRENT WEIGHT : {summary.currentWeight}</p>
        {summary.items.map((item, index) => (
          <div key={index} className="text-accent-900 font-inter font-bold">
            <p>{item.product}</p>
            <p>STEEL SIZE : {item.steelSize} MM</p>
            <p>STEEL FEATURE : {item.steelFeature}</p>
            <p>LENGTH : {item.length} CM</p>
            <p>WEIGHT : {item.weight} KG</p>
          </div>
        ))}
      </div>

      {/* กล่องที่ 3: ปุ่ม Confirm */}
      <div className="mt-4 flex justify-center"> {/* ทำให้ปุ่ม Confirm อยู่ center */}
        <button className="w-[30%] bg-accent-900 text-white p-4 rounded-full font-inter"> {/* ปรับขนาดให้กว้างขึ้น */}
          CONFIRM
        </button>
      </div>
    </div>
  );
};

export default SummaryView;
