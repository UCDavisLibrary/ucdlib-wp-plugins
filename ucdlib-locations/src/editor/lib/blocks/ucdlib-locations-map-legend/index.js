import { UCDIcons, Save  } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-locations/map-legend';
const settings = {
  api_version: 2,
	title: "Map Legend",
  parent: [ 'ucdlib-locations/map-building' ],
	description: "A static legend for a building map",
	icon: UCDIcons.renderPublic('fa-list'),
	category: 'ucdlib-locations',
	keywords: [ 'icons' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
    title: {
      type: 'string',
      default: 'Map Legend'
    }
  },
  edit: Edit,
  save: Save
};

export default { name, settings };