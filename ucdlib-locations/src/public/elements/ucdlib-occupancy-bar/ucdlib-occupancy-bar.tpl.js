import { html, css } from 'lit';

export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }
    .container {
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
    .user-icons.user-icons--2 {
      background-color: #DAAA00;
    }
    .user-icons.user-icons--3 {
      background-color: #F18A00;
    }
    .user-icons.user-icons--4 {
      background-color: #F93549;
    }
    .user-icons.user-icons--5 {
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
    .has-text .user-icons {
      margin-right: .5rem;
    }
    .status-text {
      font-weight: 700;
      font-style: italic;
      white-space: nowrap;
      margin: 2px 0;
    }
  `;

  return [elementStyles];
}

export function render() { 
return html`
<div class="container ${this.hideText ? 'no-text' : 'has-text'}">
  ${this.level ? html`
    <div class="user-icons user-icons--${this.level}" title="Current Occupancy: ${this.current}">
      ${[0,1,2,3,4].map((v) => this._renderUserSvg(v >= this.level))}
    </div>
    <div class="status-text">${this.textOptions[this.level - 1]}</div>
  ` : html``}
</div>

`;}