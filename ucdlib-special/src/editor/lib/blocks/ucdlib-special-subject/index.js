import { html } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucd-theme/special-subject';
const settings = {
  api_version: 2,
	title: 'Special Collection Subject',
	description: 'Special Collection Subject',
	icon: html`<ucdlib-icon style=${{marginLeft: '8px', width: '12px', minWidth: '12px'}} icon="ucd-public:fa-file-invoice"></ucdlib-icon>`,
	category: 'ucd-layout',
	keywords: [ 'special', 'collection', 'manuscript', 'subject' ],
  supports: {
    'html': false,
    'customClassName': false
  },
  edit: Edit,
};

export default { name, settings };