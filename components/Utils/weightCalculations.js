export const WEIGHT_PER_METER = {
    '1': 0.06,
    '2': 0.11,
    '3': 0.15,
    '4': 0.30,
    '5': 0.50
};

export const getMinWeightPerMeters = (steelSize) => {
    return WEIGHT_PER_METER[steelSize];
}

export const calculateMinimumWeight = (lengthInCm, steelSize) => {
    if (!lengthInCm || !steelSize || !WEIGHT_PER_METER[steelSize]) return 0;

    const lengthInMeters = parseFloat(lengthInCm) / 100;
    return (WEIGHT_PER_METER[steelSize] * lengthInMeters).toFixed(2);
};