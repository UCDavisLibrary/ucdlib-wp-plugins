import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl, FormTokenField, RangeControl } from '@wordpress/components';
import { decodeEntities } from "@wordpress/html-entities";
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();

  const curatorOrg = SelectUtils.terms('curator', {per_page: -1, orderby: 'name', order: 'asc'});
  const [ peoplePosts, setPeoplePosts ] = useState( [] );
  useEffect(() => {
    const path = `ucdlib-directory/people`;
    apiFetch( {path} ).then( 
      ( r ) => {
        setPeoplePosts(r);
      }, 
      (error) => {
        setPeoplePosts([]);
        console.warn(error);
      })

  }, []);
    // format people the way selector likes
    const curators = (() => {
      const out = {
        names: [],
        byId: {},
        byName: {},
        curators: []
      }
      peoplePosts.forEach(p => {
        p.name = `${p.name_first} ${p.name_last}`.trim();
        if ( p.name && p.id ) {
          out.names.push(p.name);
          out.byId[p.id] = p;
          out.byName[p.name] = p
        }
      })
      return out;
    })();

  const displayOptions = [
    {value: 'highlight', label: 'Highlight', optAttrs: 'templateHighlightOptions'},
    {value: 'teaser', label: 'Teaser', optAttrs: 'templateTeaserOptions'}
  ]

  const setTemplateOptions = (field, value, template='teaser') => {
    const attrName = displayOptions.find(({ value }) => value === template).optAttrs;
    const newOpt = {};
    newOpt[field] = value;
    const attrs = {};
    attrs[attrName] = {...eval(`attributes.${attrName}`), ...newOpt};
    setAttributes(attrs);
  }

  const getTempateOption = (field, defaultValue=false, template='teaser') => {
    const attrName = displayOptions.find(({ value }) => value === 'teaser').optAttrs;
    const v = eval(`attributes.${attrName}.${field}`);
    if ( v === undefined ) return defaultValue;
    return v;
  }

  const statusOptions = [
    {value: '', label: 'All Exhibits'},
    {value: 'current', label: 'Current Exhibits'},
    {value: 'past', label: 'Past Exhibits'},
    {value: 'permanent', label: 'Permanent Exhibits'},
    {value: 'current_permanent', label: 'Current or Permanent Exhibits'}
  ];

  const sortOptions = [
    {value: 'title', label: 'Title'},
    {value: 'start_date', label: 'Start Date'},
    {value: 'date', label: 'Publish Date'},
    {value: 'menu_order', label: 'Menu Order'}
  ];

  const asSelectOptions = (options) => {
    return options.map(o => {
      const out = {
        value: parseInt(o.id)
      }
      if ( o.name ) {
        out.label = decodeEntities(o.name);
      } else if ( o.title ) {
        out.label = decodeEntities(o.title.rendered)
      }
      return out;
    })
  };

  return html`
  <div ...${ blockProps }>
    <style>
      .exhibit-query-inspector-controls select[multiple] {
        height: auto !important;
        padding: 8px;
      }
      .exhibit-query-inspector-controls select[multiple] + .components-input-control__suffix {
        display: none;
      }
    </style>
  <${InspectorControls}>
    <${PanelBody} title="Query Filters">
      <div className='exhibit-query-inspector-controls'>
        <${SelectControl}
          options=${ statusOptions }
          value=${ attributes.status }
          label='Exhibit Status'
          onChange=${ status => setAttributes({status}) }
        />
        <${ToggleControl} 
          label='Online Exhibit'
          help='Exhibit must have an online component'
          checked=${attributes.isOnline}
          onChange=${() => setAttributes({isOnline: !attributes.isOnline})}
        />
        <${SelectControl}
          multiple
          options=${ asSelectOptions(curatorOrg) }
          value=${ attributes.curatorOrg }
          label='Curating Organizations'
          onChange=${ v => {setAttributes({curatorOrg: v.map(v => parseInt(v))})} }
        />
        <${FormTokenField}
          label='Curators'
          value=${ attributes.curator.map(c => curators.byId[c]).filter(c => c != undefined).map(c => c.name) }
          suggestions=${ curators.names }
          onChange=${ cs => {setAttributes({curator: cs.map(c => curators.byName[c]).filter(c => c != undefined).map(c => c.id)})} }
        />
      </div>
    </${PanelBody}>
    <${PanelBody} title="Results Display">
      <${SelectControl}
        options=${ displayOptions }
        value=${ attributes.template }
        label='Exhibit Preview Block'
        onChange=${ template => {setAttributes({template})} }
      />
      ${attributes.template == 'teaser' && html`
        <div>
          <${ToggleControl} 
            label='Hide Curating Organization'
            checked=${getTempateOption('hideCuratorOrgs')}
            onChange=${() => setTemplateOptions('hideCuratorOrgs', !getTempateOption('hideCuratorOrgs'))}
          />
          <${ToggleControl} 
            label='Hide Exhibit Location'
            checked=${getTempateOption('hideLocation')}
            onChange=${() => setTemplateOptions('hideLocation', !getTempateOption('hideLocation'))}
          />
          <${ToggleControl} 
            label='Hide Exhibit Dates'
            checked=${getTempateOption('hideDates')}
            onChange=${() => setTemplateOptions('hideDates', !getTempateOption('hideDates'))}
          />
        </div>
      `}
      <${SelectControl}
        options=${ sortOptions }
        value=${ attributes.orderby }
        label='Sort by'
        onChange=${ orderby => {setAttributes({orderby})} }
      />
      <${RangeControl} 
        label='Max number of exhibits'
        min=1
        max=30
        step=1
        value=${attributes.postsPerPage}
        onChange=${postsPerPage => setAttributes({postsPerPage})}
      />
    </${PanelBody}>
  </${InspectorControls}>
    <div className='alert'>A list of exhibits based on your query will display here.</div>
  </div>
  `
}