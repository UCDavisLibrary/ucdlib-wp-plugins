import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-directory/sort';
const settings = {
  api_version: 2,
	title: "Interactive Directory Sort",
	description: "Sorts people/department blocks. Should be used in conjunction with the Directory Results block",
	icon: UCDIcons.renderPublic('fa-arrow-down-a-z'),
	category: 'ucdlib-directory',
	keywords: [ 'people', 'person', 'department', 'sort' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
  },
  edit: Edit
};

export default { name, settings };