import { html, css } from 'lit';
import { LocationsController } from '../../utils/locations-controller.js';

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
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
    .child-details {
      display: block;
    }
    .child-details .separator {
      display: none;
      padding: 0 5px;
    }

    @media (min-width: 400px) and (max-width: 991px) {
      .child-details {
        display: flex;
      }
      .child-details.child-details--appts .separator {
        display: block;
      }
    }

    @media (min-width: 1600px) {
      .child-details {
        display: flex;
      }
      .child-details.child-details--appts .separator {
        display: block;
      }
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
  <div class="location-status ${this.onlyShowChildren ? 'hide' : ''}">
    <h3 class="heading--highlight">
      ${location.isOpenToday ? 
      location.renderHoursToday() : 
      html`<span>Closed</span>`}
    </h3>
    ${ location.renderOccupancyBar() }
    <div class="u-space-my"></div>
  </div>
  <div class="children ${location.hasChildren ? '': 'children--none'}">
    ${location.children.map(child => html`
      <div class="child u-space-mb ${child.hasHoursData && (!this._childFilter.length || this._childFilter.includes(child.id)) ? 'child--has-hours' : 'child--no-hours'}">
        <div class="name">${child.name}</div>
        <div class="child-details ${child.hasAppointments ? 'child-details--appts' : ''}">
          <div>${child.isOpenToday ? 
            child.renderHoursToday() : 
            html`<span class="double-decker">Closed</span>`}
          </div>
          <span class="separator">|</span>
          <div>${child.renderAppointmentsLink()}</div>
        </div>
      </div>
    `)}
  </div>
  ${ location.renderSeeAllLink() }
  ` : this.ctl.renderStatus('error')
  }
`;}