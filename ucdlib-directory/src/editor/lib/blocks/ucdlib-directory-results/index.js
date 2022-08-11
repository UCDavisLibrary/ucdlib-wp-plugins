import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-directory/results';
const settings = {
  api_version: 2,
	title: "Interactive Directory Results",
	description: "Displays people and departments. Should be used in conjunction with the Directory Filter Block",
	icon: UCDIcons.renderPublic('fa-users-line'),
	category: 'ucdlib-directory',
	keywords: [ 'people', 'person', 'department' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
  },
  edit: Edit
};

export default { name, settings };