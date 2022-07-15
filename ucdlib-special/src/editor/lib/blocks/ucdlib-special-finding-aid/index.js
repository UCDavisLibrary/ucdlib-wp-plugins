import { html } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucd-theme/special-finding-aid';
const settings = {
  api_version: 2,
	title: 'Special Collection Finding Aid',
	description: 'Special Collection Finding Aid',
	icon: html`<ucdlib-icon style=${{marginLeft: '8px', width: '12px', minWidth: '12px'}} icon="ucd-public:fa-file-invoice"></ucdlib-icon>`,
	category: 'ucd-layout',
	keywords: [ 'special', 'collection', 'manuscript', 'finding', 'aid' ],
  supports: {
    'html': false,
    'customClassName': false
  },
  edit: Edit,
};

export default { name, settings };