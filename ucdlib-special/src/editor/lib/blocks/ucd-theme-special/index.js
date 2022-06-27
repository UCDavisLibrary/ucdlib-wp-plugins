import { html } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';
import Save from './save';

const name = 'ucd-theme/collection';
const settings = {
  api_version: 2,
	title: 'Special Collection',
	description: 'Search for ua_collections and manuscripts to create a special collection post type',
  icon: html`<ucdlib-icon style=${{marginLeft: '8px', width: '12px', minWidth: '12px'}} icon="ucd-public:fa-file-invoice"></ucdlib-icon>`,
	category: 'ucd-layout',
	keywords: [ 'special', 'collection', 'manuscript' ],
  supports: {
    'html': false,
    'customClassName': false
  },
  attributes: {
    description: {
      type: 'string',
      default: ''
    },
    callNumber: {
      type: 'string',
      default: ''
    },
    almaRecordId: {
      type: 'string',
      default: ''
    },
    featuredImage: {
      type: 'string',
      default: ''
    },
    extent: {
      type: 'string',
      default: ''
    },
    extentUnit: {
      type: 'string',
      default: ''
    },
    findingAid: {
      type: 'string',
      default: ''
    },
    permalink: {
      type: 'string',
      default: ''
    },
    history: {
      type: 'string',
      default: ''
    }
  },
  edit: Edit,
  save: Save
};

export default { name, settings };