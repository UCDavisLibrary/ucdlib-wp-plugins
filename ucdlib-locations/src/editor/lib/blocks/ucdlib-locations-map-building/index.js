import { UCDIcons, Save  } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-locations/map-building';
const settings = {
  api_version: 2,
	title: "Interactive Building Map",
	description: "Displays an interactive map of a building",
	icon: UCDIcons.renderPublic('fa-map'),
	category: 'ucdlib-locations',
	keywords: [ 'study', 'zone' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {},
  edit: Edit,
  save: Save
};

export default { name, settings };