import React, { useState } from 'react';
import ProductSelection from './ProductSelection'; // เรียกใช้ฟอร์มเลือกสินค้า
import SummaryView from './SummaryView'; // เรียกใช้ SummaryView

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

  return (
    <div className="p-4 items-start bg-gray-100" style={{ height: 'calc(96.5vh - 50px)' }}>
      <div className="p-4 flex h-[80vh]">
        {/* เรียกใช้กล่องเลือกสินค้าและกล่องสรุป */}
        <ProductSelection rows={rows} addRow={addRow} handleSelectChange={handleSelectChange} />
        <SummaryView summary={summary} />
      </div>
    </div>
  );
};

export default OrderForm;
