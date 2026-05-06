import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucd-theme/special-extent';
const settings = {
  apiVersion: 3,
	title: 'Special Collection Extent',
	description: 'Special Collection Extent',
  icon: UCDIcons.renderPublic('fa-file-invoice'),
	category: 'ucd-layout',
	keywords: [ 'special', 'collection', 'manuscript', 'extent' ],
  supports: {
    'html': false,
    'customClassName': false
  },
  edit: Edit,
};

export default { name, settings };