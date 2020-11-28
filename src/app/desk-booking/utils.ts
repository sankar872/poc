function timeConverter(UNIX_timestamp) {
  let a = new Date(parseInt(UNIX_timestamp));
  let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
  ];
  let date = (a.getDate().toString().length <= 1) ? 0+a.getDate().toString(): a.getDate().toString()
  let month = ((a.getMonth()+1).toString().length <= 1) ? 0+(a.getMonth()+1).toString(): (a.getMonth()+1).toString();
  let year = a.getFullYear();
  let monthString = months[a.getMonth()];
  let hour = a.getHours();
  let min = a.getMinutes();
  let sec = a.getSeconds();
  let timeStampObj: any = {};
  timeStampObj.UNIXtimeStamp = a;
  timeStampObj.date = date;
  timeStampObj.monthString = monthString;
  timeStampObj.month = month;
  timeStampObj.year = year;
  timeStampObj.hour = hour;
  timeStampObj.min = min;
  timeStampObj.sec = sec;

  return timeStampObj;
}
export function getTimeStamp(dateObj, type="start"){
  let timeStampObj = timeConverter(dateObj);
  if(type === "start") {
      return new Date(`${timeStampObj.year}-${timeStampObj.month}-${timeStampObj.date}T00:00:00.000+00:00`).getTime();
  }else {
      return new Date(`${timeStampObj.year}-${timeStampObj.month}-${timeStampObj.date}T23:59:59.000+00:00`).getTime();
  }
}