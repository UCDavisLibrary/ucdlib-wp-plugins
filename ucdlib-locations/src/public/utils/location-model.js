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

  get id(){
    return this.data.id;
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
   * @property {String} shortName
   * @description Short name of location. Returns the formal name if it does not exist.
   */
  get shortName(){
    if ( this.data.labels.short ) return this.data.labels.short;
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
   * @property {String} hoursPlaceholder
   * @description Message to display instead of location's hours
   */
  get hoursPlaceholder(){
    if ( !this.data.hoursPlaceholder || !this.data.hoursPlaceholder.show ) return "";
    return this.data.hoursPlaceholder.message;
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
   * @property {Boolean} hasServices
   * @description This location has children that are "services" 
   * i.e. not collapsible in the main hours widget
   */
  get hasServices(){
    return this.children.filter(c => !c.data.notACollapsibleChild).length ? true: false;
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
    const today = this._todayOnWestCoast();
    let _week = [];
    let _day;
    let hours;
    week.forEach(day => {
      _day = Object.assign({}, day);
      hours = this.getAnHoursObject(day.isoKey);
      _day.isToday = day.isoKey == today;
      _day.hasHoursData = hours ? true : false;
      if ( hours ) {
        _day.isOpen = this.isOpenOnDay(day.isoKey);
      }
      if ( _day.isOpen ) {
        _day.hours = this._getDaysHours(hours);
      }
      
      _week.push(_day);
    })

    return html`
      <div class="week">
        ${_week.map(day => html`
          <div class="day ${day.isToday ? 'is-today' : ''}">
            <div class="label">
              <time datetime=${day.isoKey}>
                <span class="day-of-week">${day.day}</span>
                <span class="date">${day.month} ${day.dayOfMonth}</span>
              </time>
            </div>
            <div class="value">
              ${day.hasHoursData ? html`
                ${ day.isOpen ? 
                    this.hasAppointments ? this.renderAppointmentsLink(false, true) :
                      this._renderHours(day.hours.from, day.hours.to) 
                  : html`
                    <span class="double-decker">Closed</span>`}
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
  renderAppointmentsLink(showIcon=true, useAltText=false){
    if ( !this.hasAppointments ) return html``;
    const appt = this.data.appointments;
    let text
    if ( useAltText ){
      text = appt.link_text_alt ? appt.link_text_alt : "Schedule a Visit";
    } else {
      text = appt.link_text ? appt.link_text : "Appointment Required";
    }
    
    const icon = svg`
      <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path fill="currentColor" d="M12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm436-44v-36c0-26.5-21.5-48-48-48h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v36c0 6.6 5.4 12 12 12h424c6.6 0 12-5.4 12-12z"></path>
      </svg>`
    return html`<span class="appt-link">${showIcon ? icon : html``}<a href="${appt.link_url}">${text}</a></span>`;
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
   * @method renderAlert
   * @description Renders the stylized global location alert
   * @returns {TemplateResult}
   */
  renderAlert(){
    const alert = this.getAlert('global');
    if ( !alert ) return html``;
    return html`
      <div class="global-alert double-decker">
        <div class="exclamation-icon">
          ${svg`
            <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path></svg>
          `}
        </div>
        <div>${alert}</div>
      </div>
    `;
  }

  /**
   * @method getAlert
   * @description Returns an alert message
   * @param {String} alert - Type of alert
   * @returns {String}
   */
  getAlert(alert){
    if ( !this.data.alerts || !this.data.alerts[alert]) return "";
    return this.data.alerts[alert];
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
   * @method isOpenOnDay
   * @param {String} day iso formatted date
   * @returns {Boolean}
   */
  isOpenOnDay(day){
    if ( !this.hasHoursData || !this.data.hours) return;
    if ( !this.data.hours.data[day] ) return;
    return this.data.hours.data[day].status == 'open';
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
    let toIso = "";
    let fromIso = "";
    try {
      toIso = DateTimeUtils.convertTimeToIso(to);
      fromIso = DateTimeUtils.convertTimeToIso(from);
    } catch (error) {
      console.warn('Unable to convert time to iso');
    }
    from = `${from.slice(0, -2)} ${from.slice(-2)}`;
    to = `${to.slice(0, -2)} ${to.slice(-2)}`;
    return html`
    <time class="hours-from" datetime=${fromIso} style="${styles}">${from}</time><span> - </span><time class="hours-to" datetime=${toIso} style="${styles}">${to}</time>
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