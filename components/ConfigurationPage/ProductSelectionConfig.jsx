import React from 'react';

const ProductSelectionConfig = ({ rows, addRow, handleSelectChange, removeRowConfig }) => {  // เปลี่ยนเป็น removeRowConfig
  return (
    <div className="bg-white shadow-md p-6 rounded-lg w-4/6 h-full overflow-y-auto">
      {rows.map((_, index) => (
        <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-lg relative">
          {/* Icon Close_round_fill ที่มุมบนขวาของกล่อง */}
          <div className="absolute top-2 right-2 p-2 cursor-pointer">
            <img 
              src="/icon/Close_round_fill.png" 
              alt="Remove" 
              className="w-5 h-5"
              onClick={() => removeRowConfig(index)} // เปลี่ยนเป็น removeRowConfig
            />
          </div>
          <div className="mb-2">
            <select 
              className="w-1/5 p-2 border rounded text-accent-900 shadow" 
              defaultValue="" 
              onChange={(e) => handleSelectChange(e, index, 'product')}
            >
              <option value="" disabled>PC WIRE</option>
              <option value="PC WIRE">PC WIRE</option>
              <option value="PC STRAND">PC STRAND</option>
            </select>
          </div>
          <div className="grid grid-cols-4 gap-6">
            <select 
              className="p-2 border rounded text-accent-900 shadow" 
              defaultValue="" 
              onChange={(e) => handleSelectChange(e, index, 'steelSize')}
            >
              <option value="" disabled>SIZE</option>
              <option value="10">10 MM</option>
              <option value="20">20 MM</option>
            </select>
            <select 
              className="p-2 border rounded text-accent-900 shadow" 
              defaultValue="" 
              onChange={(e) => handleSelectChange(e, index, 'steelFeature')}
            >
              <option value="" disabled>FEATURE</option>
              <option value="Smooth">Smooth</option>
              <option value="Rough">Rough</option>
            </select>
            <input 
              type="number"
              step="0.01"
              className="p-2 border rounded text-accent-900 shadow" 
              placeholder="LENGTH" 
              onChange={(e) => handleSelectChange(e, index, 'length')}
            />
            <input 
              type="number"
              step="0.1"
              className="p-2 border rounded text-accent-900 shadow" 
              placeholder="WEIGHT" 
              onChange={(e) => handleSelectChange(e, index, 'weight')}
            />
          </div>
        </div>
      ))}
      <button 
        onClick={addRow}
        className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500"
      >
        +
      </button>
    </div>
  );
};

export default ProductSelectionConfig;
