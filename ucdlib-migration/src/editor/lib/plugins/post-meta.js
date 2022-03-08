import { createElement } from "@wordpress/element";
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import htm from 'htm';

const html = htm.bind( createElement );
const name = 'ucdlib-migration-meta';

const Edit = () => {
  return html`
    <${PluginDocumentSettingPanel}
      className=${name}
      title="Migration">
      <div>hello world</div>
    </${PluginDocumentSettingPanel}>
  `
}

const settings = {render: Edit};
export default { name, settings };