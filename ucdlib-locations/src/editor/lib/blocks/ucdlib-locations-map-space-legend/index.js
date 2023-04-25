import { UCDIcons, Save  } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-locations/map-space-legend';
const settings = {
  api_version: 2,
	title: "Space Legend",
  parent: [ 'ucdlib-locations/map-building' ],
	description: "Displays toggleable legend for space types",
	icon: UCDIcons.renderPublic('fa-eye-slash'),
	category: 'ucdlib-locations',
	keywords: [ 'study', 'zone' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
    title: {
      type: 'string',
      default: 'Study Spaces'
    }
  },
  edit: Edit,
  save: Save
};

export default { name, settings };