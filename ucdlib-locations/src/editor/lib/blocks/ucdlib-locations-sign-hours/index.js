import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-locations/sign-hours';
const settings = {
  api_version: 2,
	title: "Digital Sign Hours Display",
	description: "Renders a simple display of a location's current hours",
	icon: UCDIcons.renderPublic('fa-clock'),
	category: 'ucdlib-locations-signs',
	keywords: [ 'digital', 'sign' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
    locationId: {
      type: 'number',
      default: 0
    },
    refreshRate: {
      type: 'number',
      default: 5
    }
  },
  edit: Edit
};

export default { name, settings };