import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-special/collection-results';
const settings = {
  api_version: 2,
	title: "Collection Results",
	description: "Displays a widget with an collection results",
	icon: UCDIcons.renderPublic('fa-book'),
	category: 'ucdlib-special',
	keywords: [ 'collection', 'manuscript', 'ua', 'university', 'archive'],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
    collectionType: {
      type: "string",
      default: ''
    }
  },
  edit: Edit
};

export default { name, settings };