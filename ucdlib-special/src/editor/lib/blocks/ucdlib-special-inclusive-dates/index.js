import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucd-theme/special-inclusive-dates';
const settings = {
  apiVersion: 3,
	title: 'Special Collection Inclusive Dates',
	description: 'Special Collection Inclusive Dates',
  icon: UCDIcons.renderPublic('fa-file-invoice'),
	category: 'ucd-layout',
	keywords: [ 'special', 'collection', 'manuscript', 'inclusive', 'dates' ],
  supports: {
    'html': false,
    'customClassName': false
  },
  edit: Edit,
};

export default { name, settings };