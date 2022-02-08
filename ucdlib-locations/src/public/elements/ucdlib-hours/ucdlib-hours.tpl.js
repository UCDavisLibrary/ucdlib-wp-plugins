import { html, css } from 'lit';
import { LocationsController } from '../../utils/locations-controller.js';


export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }
    .keep-together {
      white-space: nowrap;
    }
    .location--no-hours {
      display: none;
    }
    .paginator {
      background-color: var(--brand--primary-30, #ebf3fa);
      padding: var(--spacer--small, .5rem);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .paginator button {
      font-family: "Font Awesome 5 Free";
      font-size: 1.2rem;
      background-color: var(--brand-secondary, #ffbf00);
      color: var(--brand-primary, #022851);
      min-height: 0;
      border: none;
      padding: var(--spacer--tiny, .25rem);
      cursor: pointer;
    }
    .paginator button[disabled] {
      cursor: initial;
      opacity: .5;
    }
    .paginator .week-label-container {
      padding: 0 .5rem;
      flex-grow: 1;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .paginator .week-label {
      font-size: 1.2rem;
      margin: 0;
      transition: left 400ms linear;
    }
    .paginator .week-label.inactive {
      display: none;
    }
    h3.heading--highlight {
      margin-bottom: 1rem;
    }
    ucdlib-occupancy-bar {
      margin-bottom: 1rem;
    }
    .day {
      padding: .5rem .5rem;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
    }
    .day.is-today {
      background-color: var(--brand--secondary-30, #fff4d2);
    }
    .day .label {
      width: 30%;
      min-width: 10%;
      padding-right: .5rem;
    }
    .label .date {
      white-space: nowrap;
    }
    .label .day-of-week {
      font-weight: 700;
    }
    .day .value {
      flex-grow: 1;
    }
    @media (max-width: 330px) {
      .label .date {
        display: block;
      }
      .hours-to {
        display: block;
      }
    }
    @media (min-width: 768px) {
      .week {
        display: flex;
        flex-wrap: nowrap;
      }
      .day {
        display: block;
        flex-grow: 1;
        padding: .5rem;
      }
      .day.is-today {
        background-color: var(--brand--primary-30, #ebf3fa);
      }
      .day .label {
        width: unset;
        min-width: unset;
        border-bottom: 1px solid #ffbf00;
        padding-bottom: .25rem;
      }
      .day .value {
        padding-top: .25rem;
      }
      .label .date {
        display: block;
      }
      .hours-to {
        display: block;
      }
    }
    @media (min-width: 1600px){
      .label .date {
        display: inline;
      }
      .hours-to {
        display: inline;
      }
    }
  `;

  const styles = LocationsController.styles;
  styles.push(elementStyles);

  return styles;
}

export function render() { 
return html`
  ${this.ctl.render({
    complete: this.renderComplete,
    initial: () => this.ctl.renderStatus('pending'),
    pending: () => html`${this.ctl.hasSuccesfullyFetched ? 
      this.renderComplete(this.ctl.data) : this.ctl.renderStatus('pending')
    }`,
    error: () => this.ctl.renderStatus('error'),
  })}


`;}

// Renders if api call is successful
export function renderComplete(locations) {
return html`
  ${this._renderWeekPaginator()}
  ${locations.map(location => html`
    <section class="location ${!location.hasHoursData ? 'location--no-hours' : ''}">
      <h2 class="heading--underline">${location.name}</h2>
      <div>
        <h3 class="heading--highlight">${location.roomNumber}</h3>
        ${location.renderOccupancyBar()}
        ${this.ctl.hoursDateRange.weeks.map((week, i) => html`
          <div>
            ${location.renderWeeklyHours(week) }
          </div>
        `)}
        
      </div>
    </section>
  `)}
`;}