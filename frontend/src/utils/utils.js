/**
 * Combines multiple class names into a single string
 * @param  {...string} classes - Class names to combine
 * @returns {string} - Combined class names
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}


export const formatDate = (dateString) => {
  const [year, month, daytime] = dateString.split('-');
  const [day] = daytime.split('T');
  return `${day}/${month}/${year}`;
};