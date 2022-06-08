import { html, SelectUtils} from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default ( props ) => {

  const meta = SelectUtils.editedPostAttribute('meta');
  const hide = meta.hide_amenities_block ? true : false;

  const blockProps = useBlockProps();
  const template = [
    ['ucd-theme/heading', {content: 'At This Library', className: ''}],
    ['core/list', {className: 'list--arrow'}]
  ];

  return html`
  <div ...${ blockProps } >
    ${!hide && html`
      <div className="o-box panel">
        <${InnerBlocks} 
          templateLock="all"
          template=${template}
        />
      </div>
    `}
  </div>
  `
}