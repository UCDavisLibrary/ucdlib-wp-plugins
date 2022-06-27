import { html } from "@ucd-lib/brand-theme-editor/lib/utils";import Edit from './edit';
import { InnerBlocks } from '@wordpress/block-editor';

export default ( props ) => {
  return html`
    <${InnerBlocks.Content} />
  `;
  }