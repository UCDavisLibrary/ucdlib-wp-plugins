import { html, SelectUtils} from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default ( props ) => {

  const meta = SelectUtils.editedPostAttribute('meta');
  const hide = meta.hide_use_the_library_block ? true : false;

  const blockProps = useBlockProps();
  const allowedBlocks = ['ucd-theme/marketing-highlight-horizontal'];
  const template = [
    ['ucd-theme/heading', {content: 'Use The Library'}],
    ['ucd-theme/layout-columns', {columnCt: 3}, [
      [
        'ucd-theme/column', 
        {layoutClass: "l-first",forbidWidthEdit: true, allowedBlocks},
        [['ucd-theme/marketing-highlight-horizontal']]
      ],
      [
        'ucd-theme/column', 
        {layoutClass: "l-second",forbidWidthEdit: true, allowedBlocks},
        [['ucd-theme/marketing-highlight-horizontal']]
      ],
      [
        'ucd-theme/column', 
        {layoutClass: "l-third",forbidWidthEdit: true, allowedBlocks},
        [['ucd-theme/marketing-highlight-horizontal']]
      ]
    ]]
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