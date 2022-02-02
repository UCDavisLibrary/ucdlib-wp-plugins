import { html, css } from 'lit';

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }
    .occupancy-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }
    .user-icons {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      padding: 5px 10px;
      border-radius: 20px;
      background-color: #3DAE2B;
    }
    .occupancy-bar--2 .user-icons {
      background-color: #DAAA00;
    }
    .occupancy-bar--3 .user-icons {
      background-color: #F18A00;
    }
    .occupancy-bar--4 .user-icons {
      background-color: #F93549;
    }
    .occupancy-bar--5 .user-icons {
      background-color: #C6007E;
    }
    .user-icons svg {
      width: 18px;
      height: 18px;
      min-width: 18px;
      min-height: 18px;
      margin-right: 4px;
      color: #fff;
    }
    .user-icons svg.inactive {
      opacity: 50%;
    }
    .user-icons svg:last-child {
      margin-right: 0;
    }
  `;

  return [elementStyles];
}

export function render() { 
return html`
<div class="container">
  ${this.level ? html`
    <div class="occupancy-bar occupancy-bar--${this.level}" title="Current Occupancy: ${this.current}">
      <div class="user-icons">
        ${[0,1,2,3,4].map((v) => this._renderUserSvg(v >= this.level))}
      </div>
    </div>
  ` : html``}
</div>

`;}