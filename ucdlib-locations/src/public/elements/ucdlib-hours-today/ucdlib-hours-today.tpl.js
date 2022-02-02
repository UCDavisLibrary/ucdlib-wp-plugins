import { html, css } from 'lit';
import headingsStyles from "@ucd-lib/theme-sass/1_base_html/_headings.css";
import headingClasses from "@ucd-lib/theme-sass/2_base_class/_headings.css";
import brandClasses from "@ucd-lib/theme-sass/4_component/_category-brand.css";

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }
  `;

  return [
    headingsStyles,
    headingClasses,
    brandClasses,
    elementStyles
  ];
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
      ` : this.ctl.renderStatus('error')
      }
    `
    ,
    initial: () => this.ctl.renderStatus('initial'),
    pending: () => this.ctl.renderStatus('pending'),
    error: () => this.ctl.renderStatus('error'),
  })}
`;}