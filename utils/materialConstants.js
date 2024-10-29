export const MIN_LENGTH = 100; // cm

export const MATERIAL_SPECS = {
    '3': { price: 26, weightPerMeter: 0.06 },
    '4': { price: 26, weightPerMeter: 0.11 },
    '5': { price: 21, weightPerMeter: 0.15 },
    '7': { price: 36, weightPerMeter: 0.30 },
    '9': { price: 36, weightPerMeter: 0.50 }
};

export const validateOrderItem = (item) => {
    const errors = [];

    if (!item.steelSize) {
        errors.push("กรุณาเลือกขนาดเหล็ก");
    }
    if (!item.steelFeature) {
        errors.push("กรุณาเลือกลักษณะเหล็ก");
    }
    if (!item.length) {
        errors.push("กรุณากรอกความยาว");
    } else if (parseFloat(item.length) < MIN_LENGTH) {
        errors.push(`ความยาวต้องไม่น้อยกว่า ${MIN_LENGTH} cm`);
    }

    if (!item.weight) {
        errors.push("กรุณากรอกน้ำหนัก");
    } else if (item.steelSize && MATERIAL_SPECS[item.steelSize]) {
        const specs = MATERIAL_SPECS[item.steelSize];
        const minWeight = (specs.weightPerMeter * parseFloat(item.length) / 100);
        if (parseFloat(item.weight) < minWeight) {
            errors.push(`น้ำหนักต้องไม่น้อยกว่า ${minWeight.toFixed(2)} kg สำหรับขนาด ${item.steelSize}mm และความยาว ${item.length}cm`);
        }
    }

    return errors;
};

