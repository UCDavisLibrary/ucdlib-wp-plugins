import { html } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, BlockControls } from '@wordpress/block-editor';
import { ToolbarDropdownMenu } from '@wordpress/components';
import {
  more,
  arrowRight,
  arrowUp,
} from '@wordpress/icons';
export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();
  console.log(attributes.manuscript);

  
  const changeManStatus = () => {
    setAttributes({'manuscript': true});
  }
  const changeUAStatus = () => {
    setAttributes({'manuscript': false});
  }
  return html`
  <div ...${ blockProps }>
    <${BlockControls} group="block">
        <${ToolbarDropdownMenu} 
          label="Set Type"
          controls=${[
                      {
                          title: 'Manuscripts',
                          icon: arrowUp,
                          onClick: () => changeManStatus(),
                      },
                      {
                          title: 'UA-Collection',
                          icon: arrowRight,
                          onClick: () => changeUAStatus(),
                      }
                    ]}
          icon=${html`<span>${more}</span>`}
        />
      </${BlockControls}>
    <div className='alert'>A widget with the collection results will be rendered, if applicable</div>
  </div>
  `
}