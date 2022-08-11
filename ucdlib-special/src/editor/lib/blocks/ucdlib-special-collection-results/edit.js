import { html, UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import { ToolbarSelectMenu } from "@ucd-lib/brand-theme-editor/lib/block-components";
import { useBlockProps, BlockControls } from '@wordpress/block-editor';

export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();

  const typeOptions = [
    {
      title: 'All Collections',
      slug: ''
    },
    {
      title: 'Manuscripts',
      slug: 'manuscript'
    },
    {
      title: 'University Archives',
      slug: 'university-archive'
    },
  ];
  return html`
  <div ...${ blockProps }>
    <${BlockControls} group="block">
      <${ToolbarSelectMenu} 
        label='Prefilter Collections'
        icon=${UCDIcons.renderPublic('fa-filter')}
        options=${typeOptions}
        value=${attributes.collectionType}
        onChange=${v => setAttributes({collectionType: v.slug})}
      /> 
      </${BlockControls}>
    <div className='alert'>A list of filterable collections will display here.</div>
  </div>
  `
}