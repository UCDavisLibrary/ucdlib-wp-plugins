import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-directory/expertise-areas';
const settings = {
  api_version: 2,
	title: "Areas of Expertise",
  parent: [],
	description: "Change your areas of expertise",
	icon: UCDIcons.renderPublic('fa-graduation-cap'),
	category: 'ucdlib-directory-person',
	keywords: [ 'expertise', 'knowledge' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
  },
  edit: Edit
};

export default { name, settings };