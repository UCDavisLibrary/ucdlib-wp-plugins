import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-directory/description';
const settings = {
  api_version: 2,
	title: "Description",
  parent: [],
	description: "A brief description",
	icon: UCDIcons.renderPublic('fa-circle-info'),
	category: 'ucdlib-directory',
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
    placeholder: {
      type: 'string',
      default: ''
    }
  },
  edit: Edit
};

export default { name, settings };