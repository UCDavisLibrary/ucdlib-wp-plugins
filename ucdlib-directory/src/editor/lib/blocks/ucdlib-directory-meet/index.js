import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-directory/meet';
const settings = {
  api_version: 2,
	title: "Appointment Widget",
	description: "Widget with a link to a person's appointment system",
	icon: UCDIcons.renderPublic('fa-calendar-check'),
	category: 'ucdlib-directory-person',
	keywords: [ "calendly", 'meet', 'appointment', 'link' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
  },
  edit: Edit
};

export default { name, settings };