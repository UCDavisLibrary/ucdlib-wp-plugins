import { html } from 'lit';
import "../elements/ucdlib-occupancy-bar/ucdlib-occupancy-bar";

export class UcdlibLocation{
  constructor(data){
    this.data = data;
  }

  get hasHoursData(){
    if ( this.data.hoursToday ){
      if ( !this.data.hoursToday.data ) return false;

    } else if ( this.data.hours ){
      if ( !Array.isArray(this.data.hours.data) ) return false;
    } else {
      return false;
    }
    return true;
  }

  get isOpenToday(){
    if ( !this.hasHoursData ) return false;
    return this.data.hoursToday.data.status == 'open';
  }

  get isOpenNow(){

    // check that we have data neccesary to determine if currently open
    if ( !this.isOpenToday ) return false;
    if ( !this.data[this._hoursField].tzOffset ) {
      console.warn(`Unknown timezone for ${this.data.id}`);
      return false;
    }

    const today = this._todayOnWestCoast();
    
    // get today's hours
    let hoursToday;
    if ( this.data.hoursToday ) {
      hoursToday = this._getDaysHours(this.data.hoursToday.data);
    } else if ( this.data.hours ) {
      hoursToday = this._getDaysHours(this.data.hours.data[today]);
    } else {
      return false;
    }

    return this._isInTimeFrame(today, hoursToday);
  }

  get hasOccupancyData() {
    if ( !this.data.occupancyNow ) return false;
    if ( isNaN(this.data.occupancyNow.data) ) return false;
    if ( isNaN(this.data.capacity) ) return false;
    return true;
  }

  get capacity() {
    if ( !this.hasOccupancyData ) return false;
    return this.data.capacity;
  }

  get currentOccupancy() {
    if ( !this.hasOccupancyData ) return false;
    return this.data.occupancyNow.data;
  }

  renderHoursToday(){
    if ( !this.hasHoursData ) return html``;
    let hours = this._getDaysHours(this.data.hoursToday.data);
    return this._renderHours(hours.from, hours.to);
  }

  renderOccupancyBar(){
    if ( !this.hasOccupancyData || !this.isOpenNow ) return html``;
    return html`
    <ucdlib-occupancy-bar
      current=${this.currentOccupancy}
      max=${this.capacity}
    ></ucdlib-occupancy-bar>
    `;
  }

  get _hoursField(){
    if ( this.data.hoursToday ) return "hoursToday";
    if ( this.data.hours ) return 'hours';
    return false;
  }

  /**
   * @method _isInTimeFrame
   * @param {String} day - An iso date of the haystack
   * @param {Object} hours - An hours Object {from: str, to: str}
   * @param {Date} needle - A date. Defaults to now.
   */
  _isInTimeFrame(date, hours, needle){
    if ( !needle ) needle = new Date();
    if ( 
      !hours.from ||
      !hours.to
      ) return false;

    const fromTime = this._convertTimeToIso(hours.from);
    const toTime = this._convertTimeToIso(hours.to);
    const tz = this.data[this._hoursField].tzOffset;

    const from = new Date(`${date}T${fromTime}${tz}`);
    const to = new Date(`${date}T${toTime}${tz}`);

    // operating hours spill into next day
    if ( from >= to ) {
      to.setDate(to.getDate() + 1);
    }

    return (needle >= from && needle < to);
  }

  /**
   * @method _convertTimeToIso
   * @description Converts a 12 hour string into 24 hour
   * @param {String} time 12 hour string i.e. 1:30pm
   * @returns {String} 24 hour string i.e. 13:30:00
   */
  _convertTimeToIso(time){
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

  /**
   * @method _nowOnWestCoast
   * @description Returns current datetime in pacific timezone
   * @returns {Date}
   */
   _nowOnWestCoast(){
    const pacificTime = this.data[this._hoursField].tzOffset;
    const now = new Date();
    const nowInUTCMilliseconds = now.getTime() + (now.getTimezoneOffset() * 60000);
    const offset = 3600000 * parseInt(pacificTime.split(":")[0]);
    return new Date(nowInUTCMilliseconds + offset);
  }

  /**
   * @method _todayOnWestCoast
   * @description Returns ISO date string for today in pacific time
   * @returns {String} yyyy-mm-dd
   */
  _todayOnWestCoast(){
    const now = this._nowOnWestCoast();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  _getDaysHours(day){
    if ( !Array.isArray(day.hours) || !day.hours.length ) return {};
    return day.hours[0];
  }

  _renderHours(from, to){
    if ( !from || !to ) {
      console.warn(`Can't render hours for location ${this.data.id}`);
      return html``;
    }
    const styles = 'white-space: nowrap;'; //TODO: make and use a theme utility class
    return html`
    <span style="${styles}">${from}</span><span> - </span><span style="${styles}">${to}</span>
    `;
  }

}