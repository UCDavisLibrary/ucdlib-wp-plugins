import { html, css } from 'lit';
import { LocationsController } from '../../utils/locations-controller.js';

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }

    .hide {
      display: none;
    }
    [hidden] {
      display: none !important;
    }
    .location-status.hide {
      display: none;
    }
    .heading--underline.hide {
      display: none;
    }
    .children.children--none {
      display: none;
    }
    .child.child--no-hours {
      display: none;
    }
    .child .name {
      font-weight: 700;
    }
    .keep-together {
      white-space: nowrap;
    }
  `;

  let styles = LocationsController.styles;
  styles.push(elementStyles);

  return styles;
}

export function render() { 
return html`
  <h2 class="heading--underline ${this.hideTitle ? 'hide' : ''}">${this.widgetTitle}</h2>
  
  ${this.ctl.render({
    complete: this.renderComplete,
    initial: () => this.ctl.renderStatus('pending'),
    pending: () => html`${this.ctl.successfulInitialFetch ? 
      this.renderComplete(this.ctl.data) : this.ctl.renderStatus('pending')
    }`,
    error: () => this.ctl.renderStatus('error'),
  })}
`;}

// Renders if api call is successful
export function renderComplete(location) {
  return html`
  ${ location.hasHoursData ? html`
  
  ${!location.data.hideHours.required ? html`
  <div class="location-status ${this.onlyShowChildren ? 'hide' : ''}">
    <h3 class="heading--highlight">
      ${location.isOpenToday ? 
      location.renderHoursToday() : 
      html`<span>Closed</span>`}
    </h3>
    ${ location.renderOccupancyBar() }
    <div class="u-space-my"></div>
  </div>
  `:html``}

  <div class="children ${location.hasChildren ? '': 'children--none'}">
    ${location.children.map(child => html`
      <div class="child u-space-mb ${child.hasHoursData && (!this._childFilter.length || this._childFilter.includes(child.id)) ? 'child--has-hours' : 'child--no-hours'}">
        <div class="name">${child.name}</div>
        <div class="child-details ${child.hasAppointments ? 'child-details--appts' : ''}">

        ${!child.data.hideHours.required ? html`
          <div>${child.isOpenToday ? html`
            <span ?hidden=${child.openPrefix ? false : true}>${child.openPrefix}</span>
            <span class='keep-together'>${child.renderHoursToday()}</span>`: 
            html`<span class="double-decker">Closed</span>`}
          </div>
        `:html``}
        <div>${child.renderAppointmentsLink()}</div>
        </div>
      </div>
    `)}
  </div>
  <div class="${this.hideSeeMore ? 'hide' : ''}">
    ${ location.renderSeeAllLink(this.seeMoreText) }
  </div>
  ` : this.ctl.renderStatus('error')
  }
`;}