import classnames from 'classnames';

import { html } from '@ucd-lib/brand-theme-editor/lib/utils';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';


export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();

  const classes = classnames({
    "digital-sign-sections": true,
  });

  const style = {
    minHeight: '100vh'
  };

  const parentProps = {
    className: classes,
    style
  };


  // innerblock settings
  const allowedBlocks = ['ucdlib-locations/sign-section']
  const template = [['ucdlib-locations/sign-section', {}]];
  const innerBlocksProps = useInnerBlocksProps( parentProps, {
    allowedBlocks,
    template
  } );

  return html`
  <div ...${ blockProps }>
    <div ...${ innerBlocksProps } >
    </div>
  </div>
  `
}