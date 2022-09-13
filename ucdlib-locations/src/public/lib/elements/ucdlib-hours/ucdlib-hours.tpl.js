import { html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
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
    .location {
      margin-bottom: 2rem;
    }
    .location:last-child{
      margin-bottom: 1rem;
    }
    .paginator {
      background-color: var(--brand--primary-30, #ebf3fa);
      padding: var(--spacer--small, .5rem);
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    .paginator button {
      font-family: "Font Awesome 5 Free";
      font-size: 1.2rem;
      background-color: var(--brand-secondary, #ffbf00);
      color: var(--brand-primary, #022851);
      min-height: 0;
      border: none;
      padding: .1rem .3rem;
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
      transition: left 350ms linear;
      position: absolute;
      top: 0;
    }
    .paginator .week-label.active {
      left: 0;
      right: 0;
      margin: 0 .5rem;
    }
    .paginator .week-label.inactive.before {
      left: -200%;
    }
    .paginator .week-label.inactive.after {
      left: 200%;
    }
    .paginator .week-label.stub {
      visibility: hidden;
      position: static;
    }
    h3.heading--highlight {
      margin-bottom: 1rem;
    }
    .child h3.heading--highlight {
      margin-top: 1rem;
    }
    ucdlib-occupancy-bar {
      margin-bottom: 1rem;
    }
    .week-container {
      position: relative;
      overflow: hidden;
    }
    .week-ctl {
      margin: 0;
      transition: left 350ms linear;
      position: absolute;
      top: 0;
    }
    .week-ctl.active {
      left: 0;
      width: 100%;
    }
    .week-ctl.inactive.before {
      left: -200%;
    }
    .week-ctl.inactive.after {
      left: 200%;
    }
    .week-ctl.stub {
      visibility: hidden;
      position: static;
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
      white-space: nowrap;
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
    .services {
      display: none;
    }
    .services.visible {
      display: block;
    }
    .services-toggle {
      text-decoration: none;
      cursor: pointer;
      margin-top: 1rem;
      display: block;
      font-weight: 700;
    }
    .services-toggle .chevron {
      font-family: "Font Awesome 5 Free";
      display: inline-block;
      font-size: .75rem;
    }
    .services.visible + .services-toggle .chevron {
      transform: rotate(180deg);
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
        flex: 1;
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
    @media (min-width: 992px) and (max-width: 1199px) {
      .day {
        font-size: .9rem;
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
    <section class="location ${!location.hasHoursData && !location.hoursPlaceholder ? 'location--no-hours' : ''}">
      <h2 class="heading--underline">${location.name}</h2>
      <div>
        ${location.children.length ? html`<h3 class="heading--highlight">${location.roomNumber}</h3>` : html``}
        ${location.renderAlert('u-space-mb')}
        ${location.renderOccupancyBar()}
        ${location.data.appointmentDisplay.required ? html`${location.renderAppointmentsLink(false, true, true)}` :html``}
        ${console.log(location.name)}
        ${console.log(location.data.hideHours)}
        ${location.hoursPlaceholder ? html`
          <div>${unsafeHTML(location.hoursPlaceholder)}</div>
          <!-- Added conditional statements for hide hours toggle and adding appointment description -->
        `:html` ${location.data.hideHours.required ? html``: html`${this._renderWeeklyHours(location)}`}`}
          <!-- Added conditional statements for hide hours toggle and adding appointment description -->
        <div class="children">
          ${location.children.filter(c => this._surfaceChildren.includes(c.id)).map(c => this._renderChild(c))}
          ${location.hasServices && location.children.filter(c => !this._surfaceChildren.includes(c.id)).length ? html`
            <div class="services ${this._visibleServices[location.id] ? 'visible' : ''}">
              ${location.children.filter(c => !this._surfaceChildren.includes(c.id)).map(c => this._renderChild(c))}
            </div>
            <a class="services-toggle" 
              @click=${() => this.toggleServiceVisibility(location.id)}>
              ${this._visibleServices[location.id] ? 'Hide' : 'Show'} hours for ${location.shortName} Library services <span class="chevron">&#xf078</span></a>
          ` : html``}
        </div>

        
      </div>
    </section>
  `)}
`;}

/**
 * @function _renderWeekPaginator
 * @description Renders the paginator that allows user to select a new week to display
 * @returns {TemplateResult}
 */
  export function _renderWeekPaginator(){
  const weeks = this.ctl.hoursDateRange.weeks;
    return html`
    <div class="paginator">
      <button 
        type="button" 
        ?disabled=${!this._activeWeekPanel}
        @click=${this._onBackwardClick}
        >&#xf053</button>
      <div class="week-label-container">
        <div class="week-label stub heading--highlight" aria-hidden="true" focusable="false">
          ${this._renderWeekLabel(weeks[this._activeWeekPanel])}
        </div>
        ${weeks.map((week, i) => html`
          <div class=${classMap(this._getAnimationClasses(i, 'label'))} aria-hidden=${i == this._activeWeekPanel ? 'false' : 'true'}>
            ${this._renderWeekLabel(week)}
          </div>
        `)}
      </div>
      <button 
        type="button" 
        ?disabled=${this._activeWeekPanel + 1 == weeks.length}
        @click=${this._onForwardClick}>&#xf054</button>
    </div>
    `;
}

export function _renderWeekLabel(week){
  return html`
  <span class="keep-together">${this.ctl.getWeekDayString(week, 0)}</span><span> to </span><span class="keep-together">${this.ctl.getWeekDayString(week, 6)}</span>
  `
}

/**
 * @function _renderWeeklyHours
 * @description Renders the hours for a given location
 * @param {UcdlibLocation} location - A library/department
 * @returns {TemplateResult}
 */
  export function _renderWeeklyHours(location){
  const weeks = this.ctl.hoursDateRange.weeks;
  return html`
  <div class="week-container">
    <div class="week-ctl stub">
      ${location.renderWeeklyHours(this.getActiveWeek()) }
    </div>
    ${weeks.map((week, i) => html`
      <div class=${classMap(this._getAnimationClasses(i, 'data'))}  aria-hidden=${i == this._activeWeekPanel ? 'false' : 'true'}>
        ${location.renderWeeklyHours(week) }
      </div>
    `)}
  </div>
  `;
}

export function _renderChild(child){
  if ( !child.hasHoursData ) return html``;
  return html`
    <div class="child">
      <h3 class="heading--highlight">${child.name}</h3>
      <!-- Added conditional statements for hide hours toggle and adding appointment description -->
      ${(child.data.appointmentDisplay.required) ? html`${child.renderAppointmentsLink(false, true, true)}` :html``}
      ${(child.data.hideHours.required) ? html`` : html`${this._renderWeeklyHours(child)}`}
      <!-- Added conditional statements for hide hours toggle and adding appointment description -->

    </div>
  `;
}