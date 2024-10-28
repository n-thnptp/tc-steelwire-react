export const WEIGHT_PER_METER = {
    '3': 0.06,
    '4': 0.11,
    '5': 0.15,
    '7': 0.30,
    '9': 0.50
};

export const calculateMinimumWeight = (lengthInCm, steelSize) => {
    if (!lengthInCm || !steelSize || !WEIGHT_PER_METER[steelSize]) return 0;

    const lengthInMeters = parseFloat(lengthInCm) / 100;
    return (WEIGHT_PER_METER[steelSize] * lengthInMeters).toFixed(2);
};