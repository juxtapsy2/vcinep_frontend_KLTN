export function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }
  
  export function formatShowtimeDate(dateString) {
    const date = new Date(dateString);
    const days = [
      "Chủ Nhật",
      "Thứ Hai", 
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ];
    const dayOfWeek = days[date.getDay()];
    return `${dayOfWeek}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }