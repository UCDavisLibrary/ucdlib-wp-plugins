import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucd-theme/special-description';
const settings = {
  apiVersion: 3,
	title: 'Special Collection Description',
	description: 'Special Collection Description',
	icon: UCDIcons.renderPublic('fa-file-invoice'),
	category: 'ucd-layout',
	keywords: [ 'special', 'collection', 'manuscript', 'description' ],
  supports: {
    'html': false,
    'customClassName': false
  },
  edit: Edit,
};

export default { name, settings };