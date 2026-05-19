import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucd-theme/special-finding-aid';
const settings = {
  apiVersion: 3,
	title: 'Special Collection Finding Aid',
	description: 'Special Collection Finding Aid',
	icon: UCDIcons.renderPublic('fa-file-invoice'),
	category: 'ucd-layout',
	keywords: [ 'special', 'collection', 'manuscript', 'finding', 'aid' ],
  supports: {
    'html': false,
    'customClassName': false
  },
  edit: Edit,
};

export default { name, settings };