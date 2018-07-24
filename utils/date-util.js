const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') 
}
const formatHourTime = date =>{

  const hour = date.getHours()
  const minute = date.getMinutes()

  return  [hour, minute].map(formatNumber).join(':')
}
const dateAdd = function(date,type,number){
     if(!type){
        throw Error("type 参数必须，type 参数为year,month,day");
     }
     type = type.toLowerCase()
     if("year" === type){
        date.setFullYear(date.getFullYear()+number);
     }else if("month" === type){
         date.setMonth(date.getMonth()+number);
     }else if("day" === type){
         date.setDate(date.getDate()+number);
     }
     return date;
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatHourTime:formatHourTime,
  formatDate:formatDate,
  dateAdd:dateAdd
}
