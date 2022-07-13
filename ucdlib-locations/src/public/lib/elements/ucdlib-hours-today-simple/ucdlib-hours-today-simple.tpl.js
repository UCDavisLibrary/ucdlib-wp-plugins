import { html, css } from 'lit';
import { LocationsController } from '../../utils/locations-controller.js';

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }
    .hide {
      display: none !important;
    }
    .hours {
      margin-bottom: var(--spacer--tiny, .25rem);
      display: block;
      align-items: center;
      flex-wrap: wrap;
    }
    .hours-label {
      font-weight: var(--font-weight--bold, 700);
      white-space: nowrap;
      padding-right: var(--spacer--tiny, .25rem);
    }
    .separator {
      display: none;
      padding: 0 5px;
    }
    .appt-link {
      margin: 5px 0;
    }
    @media (min-width: 600px) and (max-width: 991px) {
      .hours {
        display: flex;
      }
      .hours.has-appts .separator {
        display: block;
      }
    }

    @media (min-width: 1250px) {
      .hours {
        display: flex;
      }
      .hours.has-appts .separator {
        display: block;
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
      error: () => html``,
    })}
  `;}
  
  // Renders if api call is successful
  export function renderComplete(location) {
    return html`
    ${ location.hasHoursData ? html`
    <div class="hours ${location.hasAppointments  ? 'has-appts' : ''}">
      <span>
        <span class="hours-label">Hours Today</span>
        ${location.isOpenToday ? 
          html`
            <span>
              ${ location.renderHoursToday() }
            </span>
          ` : 
          html`<span class="double-decker">Closed</span>`}
      </span>
      <span class="separator ${this.hideAppointmentLink ? 'hide' : ''}">|</span>
      <span class="${this.hideAppointmentLink ? 'hide' : ''}">${location.renderAppointmentsLink()}</span>
    </div>
    ${ location.renderOccupancyBar() }
    ` : this.ctl.renderStatus('error')
    }
  `;}