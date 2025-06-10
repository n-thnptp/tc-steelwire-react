export const getOrderStatus = (status) => {
  switch (status) {
    case 1:
      return { label: "CONFIRM", color: "text-status-warning" }
    case 2:
      return { label: "PREPARING", color: "text-status-warning" }
    case 3:
      return { label: "SHIPPING", color: "text-status-info" }
    case 4:
      return { label: "SUCCESS", color: "text-status-success" }
    case 5:
      return { label: "CANCEL", color: "text-status-error" }
    default:
      return { label: "UNKNOWN", color: "text-status-error" }
  }
}