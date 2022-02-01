import {html} from 'lit';

export class UcdlibLocation{
  constructor(data){
    this.data = data;
  }

  hasHoursData(){
    if ( this.data.hoursToday ){
      if ( !this.data.hoursToday.data ) return false;

    } else if ( this.data.hours ){
      if ( !Array.isArray(this.data.hours.data) ) return false;
    } else {
      return false;
    }
    return true;
  }
  
  isOpenToday(){
    if ( !this.hasHoursData() ) return false;
    return this.data.hoursToday.data.status == 'open';
  }

  renderHoursToday(){
    if ( !this.hasHoursData() ) return html``;
    let hours = this._getDaysHours(this.data.hoursToday.data);
    return this._renderHours(hours.from, hours.to);
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