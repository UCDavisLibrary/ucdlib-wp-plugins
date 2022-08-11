import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-directory/service-results';
const settings = {
  api_version: 2,
	title: "Interactive Service Results",
	description: "Displays services. Should be used in conjunction with the Service Filter Block",
	icon: UCDIcons.renderPublic('fa-bell-concierge'),
	category: 'ucdlib-directory',
	keywords: [ 'directory' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
  },
  edit: Edit
};

export default { name, settings };