import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';
import { Save } from "@ucd-lib/brand-theme-editor/lib/utils";

const name = 'ucdlib-locations/use';
const settings = {
  api_version: 2,
	title: "Use The Library",
	description: "List of ways to use services of a location",
	icon: UCDIcons.renderPublic('fa-gifts'),
	category: 'ucdlib-locations',
	keywords: [ 'service', 'library' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
  },
  edit: Edit,
  save: Save
};

export default { name, settings };