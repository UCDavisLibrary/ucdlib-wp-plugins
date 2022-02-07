import { html, svg } from 'lit';
import { DateTimeUtils } from './datetime';
import "../elements/ucdlib-occupancy-bar/ucdlib-occupancy-bar";

/**
 * @class UcdlibLocation
 * @classdesc Model for working with a UCD Library location, such as a library or department.
 * @property {Object} data - A location object from the Locations Wordpress API.
 */
export class UcdlibLocation{
  constructor(data){
    this.data = data;

    // instantiate any child locations as well
    this.children = [];
    if ( Array.isArray(data.children) ){
      data.children.forEach(child => {
        this.children.push( new UcdlibLocation(child) );
      });
    }

    this._setHoursFor24HrStatus()
  }

  /**
   * @property {Boolean} roomNumber
   * @description Room number of location. Will be 'Main Building' if is library
   */
  get roomNumber(){
    if ( !this.data.labels ) return false;
    if ( !this.data.labels.room_number && this.children.length ) return 'Main Building';
    return this.data.labels.room_number;
  }

  /**
   * @property {Boolean} hasAppointments
   * @description Location has appointments
   */
  get hasAppointments() {
    if ( !this.data.appointments ) return false;
    if ( ! this.data.appointments.required ) return false;
    return true;
  }

  /**
   * @property {String} name
   * @description Formal name of location
   */
  get name(){
    return this.data.labels.title;
  }

  /**
   * @property {Boolean} hasChildren
   * @description Location has departments or services
   */
  get hasChildren(){
    return this.children.length ? true : false;
  }

  /**
   * @property {Boolean} hasHoursData
   * @description Location has operating hours available
   */
  get hasHoursData(){
    if ( this.data.hoursToday ){
      if ( !this.data.hoursToday.data ) return false;

    } else if ( this.data.hours ){
      if ( typeof this.data.hours.data !== 'object' || this.data.hours.data === null ) return false;
    } else {
      return false;
    }
    return true;
  }

  /**
   * @property {Boolean} isOpenToday
   * @description Location is open today (if has hours data)
   */
  get isOpenToday(){
    if ( !this.hasHoursData ) return false;
    if ( this.data.hoursToday ) {
      return this.data.hoursToday.data.status == 'open';
    }
    const todaysHours = this.data.hours.data[this._todayOnWestCoast()];
    return todaysHours.status == 'open';
  }

  /**
   * @property {Boolean} isOpenNow
   * @description Location is open right now ( if has hours data )
   */
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

  /**
   * @property {Boolean} hasOccupancyData
   * @description Location has capacity and occupancy data
   */
  get hasOccupancyData() {
    if ( !this.data.occupancyNow ) return false;
    if ( isNaN(this.data.occupancyNow.data) ) return false;
    if ( isNaN(this.data.capacity) ) return false;
    return true;
  }

  /**
   * @property {Number|Boolean} capacity
   * @description Location's max occupancy. false if missing.
   */
  get capacity() {
    if ( !this.hasOccupancyData ) return false;
    return this.data.capacity;
  }

  /**
   * @property {Number|Boolean} currentOccupancy
   * @description Location's current occupancy. false if missing.
   */
  get currentOccupancy() {
    if ( !this.hasOccupancyData ) return false;
    return this.data.occupancyNow.data;
  }

  /**
   * @property {Object} hoursDateRange
   * @description Date range (UTC) for which we have hours data (inclusive)
   */
  get hoursDateRange(){
    const range = {from: false, to: false};
    if ( !this.hasHoursData ) {
      return range;
    }
    if ( this.data.hoursToday ) {
      const now = this._nowOnWestCoast();
      range.from = now;
      range.to = now;
      return range;
    }
    Object.keys(this.data.hours.data).forEach(d => {
      d = new Date(d);
      if ( !range.from ) {
        range.from = d;
      } else if ( d < range.from ) {
        range.from = d;
      }
      if ( !range.to ) {
        range.to = d;
      } else if ( d > range.to ) {
        range.to = d;
      }
    })
    return range;
  }

  /**
   * @method renderWeeklyHours
   * @description Renders the operating hours for a given week
   * @param {Array} week - An array of contiguous dates
   * @returns {TemplateResult}
   */
  renderWeeklyHours(week){
    if ( !this.hasHoursData ) return html``;
    const today = new Date( this._todayOnWestCoast() );
    let _week = [];
    let _day;
    week.forEach(day => {
      _day = Object.assign({}, day);
      _day.hours = this.getAnHoursObject(day.isoKey);
      _week.push(_day);
    })
    console.log(week);

    return html`
      <div class="week">
        ${_week.map(day => html`
          <div class="day">
            <div class="label">
              <time datetime=${day.isoKey}>
                <span>${day.day}</span>
                <span>${day.month} ${day.dayOfMonth}</span>
              </time>
            </div>
            <div class="value">
              ${day.hours ? html`
                <time></time><time></time>
              ` : html`<span>?</span>`}
              
            </div>
          </div>
        `)}
      </div>
    `;

  }

  /**
   * @method renderHoursToday
   * @description Renders operating hours for today
   * @returns {TemplateResult}
   */
  renderHoursToday(){
    if ( !this.hasHoursData ) return html``;
    let hours = this._getDaysHours(this.data.hoursToday.data);
    return this._renderHours(hours.from, hours.to);
  }

  /**
   * @method renderOccupancyBar
   * @description Renders a ucdlib-occupancy-bar element with location's current occupancy
   * @returns {TemplateResult}
   */
  renderOccupancyBar(){
    if ( !this.hasOccupancyData || !this.isOpenNow ) return html``;
    return html`
    <ucdlib-occupancy-bar
      current=${this.currentOccupancy}
      max=${this.capacity}
    ></ucdlib-occupancy-bar>
    `;
  }

  /**
   * @method renderAppointmentsLink
   * @description Renders stylized link to location's appt booking system
   * @param {Boolean} showIcon Renders a calendar icon before link. default: true
   * @returns {TemplateResult}
   */
  renderAppointmentsLink(showIcon=true){
    if ( !this.hasAppointments ) return html``;
    const appt = this.data.appointments;
    const icon = svg`
      <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path fill="currentColor" d="M12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm436-44v-36c0-26.5-21.5-48-48-48h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v36c0 6.6 5.4 12 12 12h424c6.6 0 12-5.4 12-12z"></path>
      </svg>`
    return html`<span class="appt-link">${showIcon ? icon : html``}<a href="${appt.link_url}">${appt.link_text}</a></span>`;
  }

  /**
   * @method renderSeeAllLink
   * @description Renders a link to the main library hours landing page
   * @param {String} text - Link text to display
   * @returns {TemplateResult}
   */
  renderSeeAllLink(text="See all library hours"){
    if ( !this.data.links.hoursPage ) return html``;
    return html`
      <a href=${this.data.links.hoursPage} class="category-brand--secondary icon icon--circle-arrow-right">${text}</a>
    `;
  }

  /**
   * @method getAnHoursObject
   * @description Returns an hours object for a specific date
   * @param {String} day - ISO format
   * @returns {Object}
   */
  getAnHoursObject(day){
    if ( !this.hasHoursData ) return false;
    if ( !this.data.hours.data[day] ) return false;
    return this.data.hours.data[day];
  }

  /**
   * @property {String|Boolean}
   * @description Returns data key of hours object.
   */
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

    const fromTime = DateTimeUtils.convertTimeToIso(hours.from);
    const toTime = DateTimeUtils.convertTimeToIso(hours.to);
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

  /**
   * @method _getDaysHours
   * @description Utility function for extracting a day's first set of hours
   * @param {Object} day - An hours data object.
   * @returns {Object}
   */
  _getDaysHours(day){
    if ( !Array.isArray(day.hours) || !day.hours.length ) return {};
    return day.hours[0];
  }

  /**
   * @method _renderHours
   * @param {String} from - A formatted string date
   * @param {String} to - A formatted string date
   * @returns {TemplateResult}
   */
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

  /**
   * @method _setHoursFor24HrStatus
   * @description If a location has an operating hours status of "24hours", 
   *  sets "to" and "from" hours to 12:00am and marks location as "open"
   */
  _setHoursFor24HrStatus(){
    if ( !this.hasHoursData ) return;
    const hours = [{from: "12:00am", to: "12:00am"}];
    if ( this.data.hoursToday && this.data.hoursToday.data.status == '24hours') {
      this.data.hoursToday.data.status = 'open';
      this.data.hoursToday.data.isOpen24Hours = true;
      this.data.hoursToday.data.hours = hours;
      return;
    }
    if ( this.data.hours ) {
      let days = this.data.hours.data;
      for (const day in days) {
        if ( days[day].status == '24hours' ){
          days[day].status = 'open';
          days[day].isOpen24Hours = true;
          days[day].hours = hours;
        }
        
      }
    }
  }

}