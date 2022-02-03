import { html, css } from 'lit';
import { LocationsController } from '../../utils/locations-controller.js';

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
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

    @media (min-width: 400px) {
      .child-details {
        display: flex;
      }
      .child-details.child-details--appts .separator {
        display: block;
      }
    }
  `;
  let styles = [];

  // load brand styles used by all locations widgets
  if ( LocationsController.styles ){
    styles = LocationsController.styles;
  }

  styles.push(elementStyles);
  return styles;
}

export function render() { 
return html`
  <h2 class="heading--underline">${this.widgetTitle}</h2>
  
  ${this.ctl.render({
    complete: ( location ) => html`
      ${ location.hasHoursData ? html`
      <h3 class="heading--highlight">
        ${location.isOpenToday ? 
        location.renderHoursToday() : 
        html`<span>Closed</span>`}
      </h3>
      ${ location.renderOccupancyBar() }
      <div class="u-space-my"></div>
      <div class="children ${location.hasChildren ? '': 'children--none'}">
        ${location.children.map(child => html`
          <div class="child u-space-mb ${child.hasHoursData ? 'child--has-hours' : 'child--no-hours'}">
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
      ` : this.ctl.renderStatus('error')
      }
    `
    ,
    initial: () => this.ctl.renderStatus('initial'),
    pending: () => this.ctl.renderStatus('pending'),
    error: () => this.ctl.renderStatus('error'),
  })}
`;}