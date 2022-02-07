import { html, css } from 'lit';
import { LocationsController } from '../../utils/locations-controller.js';


export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }
    .location--no-hours {
      display: none;
    }
    .day {
      padding: .5rem .25rem;
    }
    .day .label {
      font-weight: 700;
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
  ${locations.map(location => html`
    <section class="location ${!location.hasHoursData ? 'location--no-hours' : ''}">
      <h2 class="heading--underline">${location.name}</h2>
      <div>
        <h3 class="heading--highlight">${location.roomNumber}</h3>
        ${location.renderOccupancyBar()}
        ${location.renderWeeklyHours(this.ctl.hoursDateRange.weeks[0]) }
      </div>
    </section>
  `)}
`;}