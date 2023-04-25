import { html } from "@ucd-lib/brand-theme-editor/lib/utils";
import { TextControl } from "@wordpress/components";
import { useBlockProps} from '@wordpress/block-editor';

export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();

  return html`
    <div ...${ blockProps} >
      <p>I am a toggle</p> 
    </div>
  `
}