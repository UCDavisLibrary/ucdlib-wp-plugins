import { Fragment } from "@wordpress/element";
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { useDispatch } from "@wordpress/data";
import { 
  ToggleControl,
  TextareaControl,
  TextControl } from '@wordpress/components';
import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";

const name = 'ucdlib-locations-hours';

const Edit = () => {

  // get metadata
  const isLocation = SelectUtils.editedPostAttribute('type') === 'location';
  const meta = SelectUtils.editedPostAttribute('meta');
  const hideHours = meta.hideHours ? true : false;
  const hasDescriptonDisplay = meta.hasDescriptonDisplay ? true : false;
  const descriptionDisplay = meta.descriptionDisplay ? meta.descriptionDisplay : {};
  const hasOperatingHours = meta.has_operating_hours ? true : false;
  const hasAppointments = meta.has_appointments ? true : false;
  const appointments = meta.appointments ? meta.appointments : {};
  const hasOccupancy = meta.has_occupancy ? true : false;
  const occupancy = meta.occupancy ? meta.occupancy : {};
  const hasPlaceholder = meta.has_hours_placeholder ? true : false;
  const placeholderText = meta.hours_placeholder ? meta.hours_placeholder : '';
  const libcalId = meta.libcal_id ? meta.libcal_id : '';
  const openPrefix = meta.open_prefix ? meta.open_prefix :'';
  const watchedVars = [
    hasDescriptonDisplay,
    hideHours,
    descriptionDisplay,
    hasOperatingHours,
    hasAppointments,
    appointments,
    hasOccupancy,
    occupancy,
    hasPlaceholder,
    placeholderText,
    openPrefix
  ];
  const { editPost } = useDispatch( 'core/editor', watchedVars );

  return html`
    <${Fragment}>
      ${isLocation && html`
        <${PluginDocumentSettingPanel}
          className=${name}
          icon=${html`<ucdlib-icon style=${{marginLeft: '8px', width: '15px', minWidth: '15px'}} icon="ucd-public:fa-clock"></ucdlib-icon>`}
          title="Hours and Occupancy">
          <${ToggleControl} 
            label="Display Operating Hours"
            checked=${hasOperatingHours}
            onChange=${() => editPost({meta: { has_operating_hours: !hasOperatingHours}})}
          />
          ${hasOperatingHours && html`
            <div>
              <${TextControl} 
                label="Libcal ID"
                value=${libcalId}
                onChange=${libcal_id => editPost({meta: {libcal_id}})}
                help="Can be found here: https://ucdavis.libcal.com/admin/hours"
              />
              <${TextControl} 
                label="Today's Hours Prefix Label"
                value=${openPrefix}
                onChange=${open_prefix => editPost({meta: {open_prefix}})}
                help="Displays before open hours on any Today's Hours widget."
              />
            </div>
          `}
          <${ToggleControl} 
            label="Display Description in Hours page"
            checked=${hasDescriptonDisplay}
            onChange=${() => editPost({meta: { hasDescriptonDisplay: !hasDescriptonDisplay}})}
          />
          ${hasDescriptonDisplay && html`
            <div>
              <${TextControl} 
                label="Description (html allowed)"
                value=${descriptionDisplay.linkUrl}
                onChange=${linkUrl => editPost({meta: {descriptionDisplay: {...descriptionDisplay, linkUrl}}})}
              />
            </div>
          `}
          <${ToggleControl} 
            label="Hide Hours on Hours page"
            checked=${hideHours}
            onChange=${() => editPost({meta: { hideHours: !hideHours}})}
          />
          <${ToggleControl} 
            label="Has Appointments"
            checked=${hasAppointments}
            onChange=${() => editPost({meta: { has_appointments: !hasAppointments}})}
          />
          ${hasAppointments && html`
            <div>
              <${TextControl} 
                label="Link Text"
                value=${appointments.linkText}
                onChange=${linkText => editPost({meta: {appointments: {...appointments, linkText}}})}
              />
              <${TextControl} 
                label="Link Url"
                value=${appointments.linkUrl}
                onChange=${linkUrl => editPost({meta: {appointments: {...appointments, linkUrl}}})}
              />
            </div>
          `}
          ${!hasOperatingHours && html`
            <div>
            <${ToggleControl} 
              label="Display Placeholder Message"
              checked=${hasPlaceholder}
              onChange=${() => editPost({meta: { has_hours_placeholder: !hasPlaceholder}})}
              help="Will display custom text instead of location hours on hours page."
            />
            ${hasPlaceholder && html`
              <${TextareaControl} 
                label="Placeholder Text"
                value=${placeholderText}
                onChange=${hours_placeholder => editPost({meta: {hours_placeholder}})}
              />
            `}
            </div>
          `}
          <${ToggleControl} 
            label="Display Current Occupancy"
            checked=${hasOccupancy}
            onChange=${() => editPost({meta: { has_occupancy: !hasOccupancy}})}
          />
          ${hasOccupancy && html`
            <div>
              <${TextControl} 
                label="Max Capacity"
                value=${occupancy.capacity}
                onChange=${capacity => editPost({meta: {occupancy: {...occupancy, capacity}}})}
              />
              <${TextControl} 
                label="Safespace Id"
                value=${occupancy.safespaceId}
                onChange=${safespaceId => editPost({meta: {occupancy: {...occupancy, safespaceId}}})}
                help="Go to https://vea.sensourceinc.com/#/login to find the id for a location."
              />
            </div>
          `}
        </${PluginDocumentSettingPanel}>
      `}
    </${Fragment}>
  `
}

const settings = {render: Edit};
export default { name, settings };