import React, { useState } from 'react';

const OrderForm = () => {
  const [rows, setRows] = useState([{}]);
  const [summary, setSummary] = useState({
    currentWeight: 'XX:XX / 03.80 TONS',
    items: []
  });

  const addRow = () => {
    setRows([...rows, {}]);
  };

  const handleSelectChange = (e, index, field) => {
    const updatedItems = [...summary.items];
    if (!updatedItems[index]) {
      updatedItems[index] = {};
    }
    updatedItems[index][field] = e.target.value;
    setSummary((prevSummary) => ({
      ...prevSummary,
      items: updatedItems,
    }));
  };

  // ฟังก์ชันบันทึกข้อมูลออเดอร์ไปยัง localStorage
  const handleConfirm = () => {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const newOrder = {
      items: summary.items,
      currentWeight: summary.currentWeight,
    };
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders)); // บันทึกออเดอร์ไปยัง localStorage
    alert("Order confirmed!");
  };

  return (
    <div className="p-4 items-start bg-gray-100" style={{ height: 'calc(96.5vh - 50px)' }}>  
      <div className="p-4 flex h-[80vh]">
        <div className="w-full flex">

          {/* กล่องฟอร์มสั่งซื้อ */}
          <div className="bg-white shadow-md p-6 rounded-lg w-4/6 h-full overflow-y-auto">
            {rows.map((_, index) => (
              <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-lg">
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
                    className="p-2 border rounded text-accent-900 shadow" 
                    placeholder="LENGTH" 
                    onChange={(e) => handleSelectChange(e, index, 'length')}
                  />
                  <input 
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

          {/* กล่อง SUMMARY */}
          <div className="bg-white p-6 rounded-lg w-2/6 h-full flex flex-col">
            <div className="mb-4">
              <h2 className="text-4xl font-bold text-accent-900 text-right font-inter">Summary</h2>
            </div>

            <div className="flex-grow overflow-y-auto bg-gray-100 rounded-lg shadow-lg p-4 mb-4">
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

            <div className="mt-4 flex justify-center">
              <button onClick={handleConfirm} className="w-[30%] bg-accent-900 text-white p-4 rounded-full font-inter">
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
