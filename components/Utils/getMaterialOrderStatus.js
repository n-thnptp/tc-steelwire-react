export const getMaterialOrderStatus = (status) => {
  switch (status) {
    case 1:
      return { label: "SHIPPING", color: "text-status-info" }
    case 2:
      return { label: "SUCCESS", color: "text-status-success" }
    case 3:
      return { label: "CANCEL", color: "text-status-error" }
    default:
      return { label: "UNKNOWN", color: "text-status-error" }
  }
}