import { html, css } from 'lit';
import { LocationsController } from '../../utils/locations-controller.js';

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }
    .hours {
      margin-bottom: var(--spacer--tiny, .25rem);
    }
    .hours-label {
      font-weight: var(--font-weight--bold, 700);
      white-space: nowrap;
      padding-right: var(--spacer--tiny, .25rem);
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
    <div class="hours">
      <span class="hours-label">Hours Today</span>
      <span>
      ${location.isOpenToday ? 
        location.renderHoursToday() : 
        html`<span class="double-decker">Closed</span>`}
      </span>
    </div>
    ${ location.renderOccupancyBar() }
    ` : this.ctl.renderStatus('error')
    }
  `;}