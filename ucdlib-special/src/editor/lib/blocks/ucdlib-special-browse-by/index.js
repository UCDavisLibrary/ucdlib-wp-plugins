import { html } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucd-theme/special-browse-by';
const settings = {
  api_version: 2,
	title: 'Special Collection Browse By',
	description: 'Special Collection Browse By',
  icon: html`<ucdlib-icon style=${{marginLeft: '8px', width: '12px', minWidth: '12px'}} icon="ucd-public:fa-file-invoice"></ucdlib-icon>`,
	category: 'ucd-layout',
	keywords: [ 'special', 'collection', 'manuscript', 'biography' ],
  supports: {
    'html': false,
    'customClassName': false
  },
  attributes: {
    subjectChecked: {
      type: "boolean",
      default: true
    }
  },
  edit: Edit,
};

export default { name, settings };