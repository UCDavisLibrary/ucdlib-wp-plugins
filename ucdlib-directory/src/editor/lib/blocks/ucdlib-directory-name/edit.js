import { html } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps } from '@wordpress/block-editor';


export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();

  return html`
  <div ...${ blockProps }>
    <p>I am a name</p>
  </div>
  `
}