import { html, css } from 'lit';

import normalizeCss from "@ucd-lib/theme-sass/normalize.css.js";
import teaserStyles from "@ucd-lib/theme-sass/4_component/_index.css.js";
import baseStyles from "@ucd-lib/theme-sass/1_base_html/_index.css.js";
import buttons from "@ucd-lib/theme-sass/2_base_class/_index.css.js";
export function styles() {
  const elementStyles = css`
    :host {
      display: block;
    }
    form {
      width:100%;
    }
    #tag {
      width:75%;
      display: inline-block;
    }
    #tag-color {
      width:24%;
      display: inline-block;    
    }
    #delete {
      width:24%;
      display: inline-block;    
    }
    #permalink-author {
      width:75%;
      display: inline-block;
    }
    #permalink-tags {
      width:75%;
      display: inline-block;  
    }
    #permalink-tags-url {
      width:75%;
      display: inline-block;  
    }


  `;

  return [elementStyles,baseStyles,teaserStyles,normalizeCss, buttons];
}

export function render() {
  return html`
  <style>
    .vm-teaser__figure.category_loading{
      background-color:#dcdcdc;
      height:165px;
      width:135px;
    }
    .load_teaser_a{
      background-color:#dcdcdc;
      width: 85%;
      height:25px;
    }
    .load_teaser_b{
      background-color:#dcdcdc;
      width: 67%;
      height:20px;
    }
    .load_teaser_c{
      background-color:#dcdcdc;
      width: 33.3%;
      height:18px;
    }
  </style>
  <!-- 
    Starts the Permalink Fetch
  -->
  ${this.perma ? html`
    ${this.perma.render({
      complete: (result) => this._onComplete(result),
      initial: () => this._onLoading(),
      pending: () => this._onPending(),
      error: (e) => this._onError(e)
      })
    }`:html``
  }

  <article class="vm-teaser   ">
  ${!this.LOADING ? html`
      <!-- 
        If it is completed permalink fetch
      -->
    <div> Result: ${this.result}</div>
    <div> URL: ${this.url}</div>

 
  `:html`
      <!-- 
        If it is in the loading stage of the permalink fetch
        it will render this
        look.
      -->
      <div class="vm-teaser__figure category_loading"></div>
      <div class="vm-teaser__body">
        <div class="load_teaser_a"></div>
        <br/>
        <div class="load_teaser_b"></div>
        <br/>
        <div class="load_teaser_c"></div>
        <br/>
        <div class="load_teaser_c"></div>
      </div>
  `}
</article>
`;
}