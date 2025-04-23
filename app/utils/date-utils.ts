/**
 * Formats a date into "Joined Month Year" format.
 * Example: "Joined January 2025"
 * @param date - The date object, date string, or timestamp to format.
 * @returns The formatted date string or an empty string if the date is invalid.
 */
export function formatJoinedDate(date: Date | string | number): string {
  try {
    const dateObj = new Date(date);

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      console.error("Invalid date provided to formatJoinedDate:", date);
      return ""; // Or return a default string like "Joined Unknown"
    }

    const month = dateObj.toLocaleString('en-US', { month: 'long' }); // Get full month name (e.g., "January")
    const year = dateObj.getFullYear(); // Get the full year (e.g., 2025)

    return `Joined ${month} ${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return ""; // Return empty string on error
  }
}

export function formatDate(date: Date | string | number): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
}


// 时间戳转换成 8:00 AM · Apr 6, 2025
export function formatTimestamp(timestamp: number | string): string {
  const date = new Date(Number(timestamp));
  
  // 获取小时和分钟
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  // 确定是 AM 还是 PM
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12; // 转换为12小时制
  
  // 获取月份
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  
  // 获取日期和年份
  const day = date.getDate();
  const year = date.getFullYear();
  
  // 组合成最终格式
  return `${hour12}:${minutes} ${period} · ${month} ${day}, ${year}`;
}

