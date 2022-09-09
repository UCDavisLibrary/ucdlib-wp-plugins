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
  const hasAppointmentDisplay = meta.hasAppointmentDisplay ? true : false;
  const appointmentDisplay = meta.appointmentDisplay ? meta.appointmentDisplay : {};
  const hasOperatingHours = meta.has_operating_hours ? true : false;
  const hasAppointments = meta.has_appointments ? true : false;
  const appointments = meta.appointments ? meta.appointments : {};
  const hasOccupancy = meta.has_occupancy ? true : false;
  const occupancy = meta.occupancy ? meta.occupancy : {};
  const hasPlaceholder = meta.has_hours_placeholder ? true : false;
  const placeholderText = meta.hours_placeholder ? meta.hours_placeholder : '';
  const libcalId = meta.libcal_id ? meta.libcal_id : '';
  const watchedVars = [
    hasAppointmentDisplay,
    hideHours,
    appointmentDisplay,
    hasOperatingHours,
    hasAppointments,
    appointments,
    hasOccupancy,
    occupancy,
    hasPlaceholder,
    placeholderText
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
            <${TextControl} 
              label="Libcal ID"
              value=${libcalId}
              onChange=${libcal_id => editPost({meta: {libcal_id}})}
              help="Can be found here: https://ucdavis.libcal.com/admin/hours"
            />
          `}

          <!-- Added for hide hours toggle and adding appointment description -->
          <${ToggleControl} 
            label="Display Appointments Description in Hours page"
            checked=${hasAppointmentDisplay}
            onChange=${() => editPost({meta: { hasAppointmentDisplay: !hasAppointmentDisplay}})}
          />
          ${hasAppointmentDisplay && html`
            <div>
              <${TextControl} 
                label="Appointment Href Link"
                value=${appointmentDisplay.linkUrl}
                onChange=${linkUrl => editPost({meta: {appointmentDisplay: {...appointmentDisplay, linkUrl}}})}
                help="Format as a sentence with 'a' tag, ie This is an <a>appointment</a> link"
              />
            </div>
          `}
          <${ToggleControl} 
            label="Hide Hours on Hours page"
            checked=${hideHours}
            onChange=${() => editPost({meta: { hideHours: !hideHours}})}
          />
          <!-- Added for hide hours toggle and adding appointment description -->

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