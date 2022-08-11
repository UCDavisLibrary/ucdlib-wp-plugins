import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';
import { Save } from "@ucd-lib/brand-theme-editor/lib/utils";

const name = 'ucdlib-locations/teasers';
const settings = {
  api_version: 2,
	title: "Location Teasers",
	description: "Preview UC Davis Library locations",
	icon: UCDIcons.renderPublic('fa-city'),
	category: 'ucdlib-locations',
	keywords: [ 'teaser', 'building', 'library' ],
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