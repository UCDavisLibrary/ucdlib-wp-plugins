export class DateTimeUtils {
  /**
   * @method _convertTimeToIso
   * @description Converts a 12 hour string into 24 hour
   * @param {String} time 12 hour string i.e. 1:30pm
   * @returns {String} 24 hour string i.e. 13:30:00
   */
  static convertTimeToIso(time){
    time = time.replace(/\s/g, '').split(":");
    let hour = time[0];
    let minute = time[1].slice(0,2);
    let isPM = time[1].slice(2,4).toLowerCase() == 'pm';
    if ( isPM ) {
      if ( hour < 12 ) hour = parseInt(hour) + 12;

    } else {
      if ( hour == 12 ) hour = "00";
    }
    hour = String(hour).padStart(2, '0');
    minute = String(minute).padStart(2, '0');
    return `${hour}:${minute}:00`
  }

  static labels = {
    days: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  }
}