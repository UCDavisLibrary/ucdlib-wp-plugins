import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { decodeEntities } from "@wordpress/html-entities";
import { useEffect } from '@wordpress/element';

export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();

  useEffect(() => {
    if ( !attributes.hideDepartments ){
      setAttributes({hideDepartments: 'true'});
    }
  }, [])

  const libraries = SelectUtils.terms('library', {per_page: -1, orderby: 'name', order: 'asc'});
  const tags = SelectUtils.terms('directory-tag', {per_page: -1, orderby: 'name', order: 'asc'});
  const departments = SelectUtils.posts({per_page: -1, orderby: 'title', order: 'asc', context: 'view'}, 'department');

  const sortOptions = [
    {value: 'department', label: 'Department Order'},
    {value: 'name', label: 'Alphabetical'}
  ];

  const columnOptions = [
    {value: 'one', label: 'One'},
    {value: 'two', label: 'Two'}
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
      .directory-query-inspector-controls select[multiple] {
        height: auto !important;
        padding: 8px;
      }
      .directory-query-inspector-controls select[multiple] + .components-input-control__suffix {
        display: none;
      }
    </style>
  <${InspectorControls}>
    <${PanelBody} title="Query Filters">
      <div className='directory-query-inspector-controls'>
        <${TextControl} 
          value=${attributes.q.join(' ')}
          label='Name'
          onChange=${ v => {setAttributes({q: v.split(' ')})}}
        />
        <${SelectControl}
          multiple
          options=${ asSelectOptions(libraries) }
          value=${ attributes.library }
          label='Library'
          onChange=${ v => {setAttributes({library: v.map(v => parseInt(v))})} }
        />
        <${SelectControl}
          multiple
          options=${ asSelectOptions(departments) }
          value=${ attributes.department }
          label='Department'
          onChange=${ v => {setAttributes({department: v.map(v => parseInt(v))})} }
        />
        <${SelectControl}
          multiple
          options=${ asSelectOptions(tags) }
          value=${ attributes.directoryTag }
          label='Tags and Subject Areas'
          onChange=${ v => {setAttributes({directoryTag: v.map(v => parseInt(v))})} }
        />
      </div>
    </${PanelBody}>
    <${PanelBody} title="Results Display">
      <${SelectControl}
          options=${ columnOptions }
          value=${ attributes.columns }
          label='Number of Columns:'
          onChange=${ v => {setAttributes({columns: v})} }
        />
      <${SelectControl}
        options=${ sortOptions }
        value=${ attributes.orderby }
        label='Sort by'
        onChange=${ v => {setAttributes({orderby: v})} }
      />
    </${PanelBody}>
  </${InspectorControls}>
    <div className='alert'>A list of people based on your query will display here.</div>
  </div>
  `
}