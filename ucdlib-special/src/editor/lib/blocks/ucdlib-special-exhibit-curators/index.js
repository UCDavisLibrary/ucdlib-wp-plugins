import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-special/exhibit-curators';
const settings = {
  api_version: 2,
	title: "Exhibit Curators",
	description: "Displays a widget with an exhibit's curators",
	icon: UCDIcons.renderPublic('fa-trowel-bricks'),
	category: 'ucdlib-special',
	keywords: [ 'org', 'department'],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
  },
  edit: Edit
};

export default { name, settings };