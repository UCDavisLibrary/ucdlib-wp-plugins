import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucd-theme/special-subject';
const settings = {
  apiVersion: 3,
	title: 'Special Collection Subject',
	description: 'Special Collection Subject',
	icon: UCDIcons.renderPublic('fa-file-invoice'),
	category: 'ucd-layout',
	keywords: [ 'special', 'collection', 'manuscript', 'subject' ],
  supports: {
    'html': false,
    'customClassName': false
  },
  edit: Edit,
};

export default { name, settings };