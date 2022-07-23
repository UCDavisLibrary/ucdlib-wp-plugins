import { html } from "@ucd-lib/brand-theme-editor/lib/utils";
import classnames from 'classnames';
import { decodeEntities } from "@wordpress/html-entities";
import { Fragment } from "@wordpress/element";

function exhibitHighlight({
  exhibit,
  brandColor
}){

  if ( !exhibit || !Object.keys(exhibit).length ) return html`<${Fragment} />`;

  let color = '';
  if ( brandColor ) {
    color = brandColor;
  } else if( exhibit.exhibitBrandColor ){
    color = exhibit.exhibitBrandColor;
  }

  const imgSrc = exhibit.exhibitHero.src || '';
  const imgStyle = {};
  if (imgSrc) {
    imgStyle.backgroundImage = `url("${imgSrc}")`
  }

  const location = exhibit.exhibitLocations.length ? exhibit.exhibitLocations[0].name : '';

  const classes = classnames({
    'hero-banner': true,
    'hero-banner--exhibit': true,
    'u-space-mb': true,
    [`category-brand--${color}`]: color
  });

  return html`
    <section className=${classes}>
      <div className="hero-banner__image u-background-image" style=${imgStyle}></div>
      ${color != '' && html`<div className="hero-banner__film"></div>`}
      <div className="hero-banner__body">
        <div className="hero-banner__title">${decodeEntities(exhibit.exhibitTitle)}</div>
        <div className="hero-banner__summary">
          ${exhibit.exhibitIsPhysical ? html`
            <div>
              <div>${location}</div>
              ${exhibit.exhibitIsPermanent ? html`
                <div>Permanent Exhibit</div>
              ` : html`
                <div>${exhibit.exhibitDateRange}</div>
              `}
            </div>
          ` : html`
            ${exhibit.exhibitIsOnline ? html`<div>Online Exhibit</div>` : html`<div></div>` }
          `}
        </div>
        <div className="hero-banner__button-group">
          <a className="hero-banner__button">Exhibit Details</a>
        </div>
      </div>

    </section>
    
  `

}

export default exhibitHighlight;