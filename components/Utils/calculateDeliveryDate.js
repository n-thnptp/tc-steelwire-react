import { formatDate } from "./formatDate";

export const calculateDeliveryDate = (orderDate, est) => {
  if (!orderDate) return '';
  const date = new Date(orderDate);
  date.setDate(date.getDate() + est);
  return formatDate(date);
};