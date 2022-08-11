import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-locations/teaser';
const settings = {
  api_version: 2,
	title: "Location Teaser",
  parent: ['ucdlib-locations/teasers'],
	description: "Preview a location",
	icon: UCDIcons.renderPublic('fa-building-columns'),
	category: 'ucdlib-locations',
	keywords: [ 'teaser', 'building', 'library' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
    locationId: {
      type: 'number',
      default: 0
    },
    featured: {
      type: 'boolean',
      default: false
    }
  },
  edit: Edit,
};

export default { name, settings };