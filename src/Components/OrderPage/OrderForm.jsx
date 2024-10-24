import React, { useState } from 'react';
import SummaryView from './SummaryView';
import ProductSelection from './ProductSelection';

const OrderForm = () => {
  const [rows, setRows] = useState([{}]);
  const [summary, setSummary] = useState({
    currentWeight: 0,
    items: [{ product: "PC WIRE" }], // ตั้งค่าเริ่มต้น
  });

  // Maximum allowed weight (in KG)
  const maxWeight = 3800;

  // Add a new row, but prevent adding if weight exceeds limit or if current row is incomplete
  const addRow = () => {
    if (summary.currentWeight >= maxWeight) {
      alert("ไม่สามารถเพิ่มสินค้าได้ เนื่องจากน้ำหนักครบ 3.8 ตันแล้ว");
      return;
    }

    const currentItem = summary.items[summary.items.length - 1];
    if (!currentItem.steelSize || !currentItem.steelFeature || !currentItem.length || !currentItem.weight) {
      alert("กรุณากรอกข้อมูลให้ครบทุกฟิลด์ก่อนเพิ่มสินค้าใหม่");
      return;
    }

    setRows([...rows, {}]);
    setSummary((prevSummary) => ({
      ...prevSummary,
      items: [...prevSummary.items, { product: "PC WIRE" }], // ตั้งค่าเริ่มต้นเป็น PC WIRE
    }));
  };

  // Remove a row and update the weight
  const removeRow = (index) => {
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
      updatedItems[index] = { product: "PC WIRE" }; // ตั้งค่าเริ่มต้น
    }
    updatedItems[index][field] = e.target.value;

    if (field === 'weight') {
      updatedItems[index].weight = parseFloat(e.target.value) || 0;
    }

    updateWeight(updatedItems);
  };

  // Update the total weight based on the items
  const updateWeight = (updatedItems) => {
    const totalWeight = updatedItems.reduce((acc, item) => acc + (parseFloat(item.weight) || 0), 0);
    setSummary({
      ...summary,
      items: updatedItems,
      currentWeight: totalWeight
    });
  };

  // Handle order confirmation, prevent confirmation if weight exceeds the limit or if any field is incomplete
  const handleConfirm = () => {
    const incompleteRow = summary.items.some(
      (item) =>
        !item.steelSize ||
        !item.steelFeature ||
        !item.length ||
        !item.weight
    );

    if (incompleteRow) {
      alert("กรุณากรอกข้อมูลให้ครบทุกฟิลด์ก่อนยืนยันการสั่งซื้อ");
      return;
    }

    if (summary.currentWeight > maxWeight) {
      alert(`ไม่สามารถสั่งซื้อได้เนื่องจากน้ำหนักรวมเกิน 3.8 ตัน (${maxWeight} KG)`);
    } else {
      const orders = JSON.parse(localStorage.getItem('orders')) || [];
      const newOrder = {
        items: summary.items,
        currentWeight: summary.currentWeight,
      };
      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));
      alert("สั่งซื้อสำเร็จ!");
    }
  };

  return (
    <div className="p-4 items-start bg-white" style={{ height: 'calc(96.3vh - 50px)' }}>  
      <div className="p-4 flex h-[80vh]">
        <div className="w-full flex">
          {/* Product Selection */}
          <ProductSelection
            rows={rows}
            addRow={addRow}
            handleSelectChange={handleSelectChange}
            removeRow={removeRow}
          />

          {/* Summary View */}
          <SummaryView summary={summary} handleConfirm={handleConfirm} />
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
