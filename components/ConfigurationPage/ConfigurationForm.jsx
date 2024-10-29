import React, { useState } from 'react';
import ProductSelectionConfig from './ProductSelectionConfig';
import SummaryViewConfig from './SummaryViewConfig';

const ConfigurationForm = () => {
  const [rows, setRows] = useState([{}]);
  const [summary, setSummary] = useState({
    currentWeight: 0,
    items: [{ product: "PC WIRE" }],  // ตั้งค่าเริ่มต้นเป็น PC WIRE
  });

  const maxWeight = 3800;

  const addRow = () => {
    if (summary.currentWeight >= maxWeight) {
      alert('ไม่สามารถเพิ่มสินค้าได้ เนื่องจากน้ำหนักครบ 3.8 ตันแล้ว');
      return;
    }

    const currentItem = summary.items[summary.items.length - 1];
    if (
      !currentItem.steelSize ||
      !currentItem.steelFeature ||
      !currentItem.length ||
      !currentItem.weight
    ) {
      alert('กรุณากรอกข้อมูลให้ครบทุกฟิลด์ก่อนเพิ่มสินค้าใหม่');
      return;
    }

    setRows([...rows, {}]);
    setSummary((prevSummary) => ({
      ...prevSummary,
      items: [...prevSummary.items, { product: "PC WIRE" }],  // เพิ่มแถวใหม่พร้อมค่าเริ่มต้นเป็น PC WIRE
    }));
  };

  const removeRowConfig = (index) => {  
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);

    const updatedItems = [...summary.items];
    updatedItems.splice(index, 1);

    setRows(updatedRows);
    updateWeight(updatedItems);
  };

  const handleSelectChange = (e, index, field) => {
    const updatedItems = [...summary.items];
    if (!updatedItems[index]) {
      updatedItems[index] = { product: "PC WIRE" };  // ตั้งค่าเริ่มต้นให้เป็น PC WIRE
    }
    updatedItems[index][field] = e.target.value;

    if (field === 'weight') {
      updatedItems[index].weight = parseFloat(e.target.value) || 0;
    }

    updateWeight(updatedItems);
  };

  const updateWeight = (updatedItems) => {
    const totalWeight = updatedItems.reduce(
      (acc, item) => acc + (parseFloat(item.weight) || 0),
      0
    );
    setSummary({
      ...summary,
      items: updatedItems,
      currentWeight: totalWeight,
    });
  };

  const updateOrder = () => {  
    const incompleteRow = summary.items.some(
      (item) =>
        !item.steelSize ||
        !item.steelFeature ||
        !item.length ||
        !item.weight
    );

    if (incompleteRow) {
      alert('กรุณากรอกข้อมูลให้ครบทุกฟิลด์');
      return;
    }

    if (summary.currentWeight > maxWeight) {
      alert(
        `ไม่สามารถสั่งซื้อได้เนื่องจากน้ำหนักรวมเกิน 3.8 ตัน (${maxWeight} KG)`
      );
      return;
    } else {
      const orders = JSON.parse(localStorage.getItem('orders')) || [];
      const newOrder = {
        items: summary.items,
        currentWeight: summary.currentWeight,
      };
      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));
      alert('สั่งซื้อสำเร็จ!');
    }
  };

  return (
    <div className="p-4 items-start bg-white">
      <div className="p-4 flex h-[80vh]">
        <div className="w-full flex">
          {/* Product Selection */}
          <ProductSelectionConfig
            rows={rows}
            addRow={addRow}
            handleSelectChange={handleSelectChange}
            removeRowConfig={removeRowConfig}  
          />

          {/* Summary View */}
          <SummaryViewConfig summary={summary} updateOrder={updateOrder} /> 
        </div>
      </div>
    </div>
  );
};

export default ConfigurationForm;
