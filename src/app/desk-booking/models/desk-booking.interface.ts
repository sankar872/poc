export interface BookingRequestObject {
  endTime: number 
  recurringEndTime: number
  recurringStartTime: number
  startTime: number
  userId: number
  floorId: number
  user?: userObj
  department?:departmentObj
}
export interface userObj {
  id: number,
  firstName: string,
  lastName:string,
  imageUrl:string,
  name:string,
  email:string,
  department:string
}
export interface departmentObj {
  id: number,
  name:string,
}