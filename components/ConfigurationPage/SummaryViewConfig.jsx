import React from 'react';

const SummaryViewConfig = ({ summary, updateOrder }) => {
  return (
    <div className="bg-white p-6 rounded-lg w-2/6 h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-4xl font-bold text-accent-900 text-right font-inter">Summary</h2>
      </div>

      <div className="flex-grow overflow-y-auto bg-gray-100 rounded-lg shadow-lg p-4 mb-4">
        <p className="mb-2 text-gray-500 font-inter">
          CURRENT WEIGHT: {summary.currentWeight} KG / 3.8 TONS
        </p>
        {summary.items.map((item, index) => (
          <div key={index} className="text-accent-900 font-inter font-bold">
            <p><span style={{ color: 'black' }}>TYPE: </span> {item.product}</p>
            <p><span style={{ color: 'black' }}>STEEL SIZE: </span> {item.steelSize} MM</p>
            <p><span style={{ color: 'black' }}>STEEL FEATURE: </span> {item.steelFeature}</p>
            <p><span style={{ color: 'black' }}>LENGTH: </span> {item.length} CM</p>
            <p><span style={{ color: 'black' }}>WEIGHT: </span> {item.weight} KG</p>
            <br />
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <button onClick={updateOrder} className="w-[30%] bg-accent-900 text-white p-4 rounded-full font-inter">
          UPDATE ORDER
        </button>
      </div>
    </div>
  );
};

export default SummaryViewConfig;
