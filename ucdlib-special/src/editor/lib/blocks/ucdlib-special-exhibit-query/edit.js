import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { decodeEntities } from "@wordpress/html-entities";
import { useEffect } from '@wordpress/element';

export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();

  const statusOptions = [
    {value: '', label: 'All Statuses'},
    {value: 'current', label: 'Current'},
    {value: 'past', label: 'Past'},
    {value: 'permanent', label: 'Permanent'},
    {value: 'current_permanent', label: 'Current or Permanent'}
  ];

  const sortOptions = [
    {value: 'title', label: 'Title'},
    {value: 'start_date', label: 'Start Date'},
    {value: 'date', label: 'Publish Date'},
    {value: 'menu_order', label: 'Menu Order'}
  ];

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
      </div>
    </${PanelBody}>
    <${PanelBody} title="Results Display">
      <${SelectControl}
        options=${ sortOptions }
        value=${ attributes.orderby }
        label='Sort by'
        onChange=${ orderby => {setAttributes({orderby})} }
      />
    </${PanelBody}>
  </${InspectorControls}>
    <div className='alert'>A list of exhibits based on your query will display here.</div>
  </div>
  `
}