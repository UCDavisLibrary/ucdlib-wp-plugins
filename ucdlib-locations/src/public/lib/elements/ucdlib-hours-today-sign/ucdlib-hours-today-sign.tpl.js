import { html, css, svg } from 'lit';
import { LocationsController } from '../../utils/locations-controller.js';

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }
    .closed {
      color: var(--ucdlib-hours-today-sign-closed-color, #c10230);
      display: flex;
      align-items: center;
    }
  `;
  let styles = LocationsController.styles;
  styles.push(elementStyles);
  return styles
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
export function renderComplete(location) {
  return html`
    ${ location.hasHoursData ? html`
    <div class="hours">
      ${location.isOpenToday ? 
        html`
          <span>
            ${ location.renderHoursToday() }
          </span>
        ` : 
        html`
        <span class="closed">
          <span>
            ${svg`<svg class='error-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M80 192V144C80 64.47 144.5 0 224 0C303.5 0 368 64.47 368 144V192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H80zM144 192H304V144C304 99.82 268.2 64 224 64C179.8 64 144 99.82 144 144V192z"/></svg>`}
          </span>
          <span>CLOSED</span>
        </span>`}
    </div>
    ` : this.ctl.renderStatus('error')
    }
`;}