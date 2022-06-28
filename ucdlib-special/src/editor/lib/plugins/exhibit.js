import { Fragment } from "@wordpress/element";
import { PluginPostStatusInfo } from '@wordpress/edit-post';
import { useDispatch } from "@wordpress/data";
import { 
  CheckboxControl,
  DatePicker,
  Dropdown,
  SelectControl, 
  TextControl,
  __experimentalText as Text,
  ToggleControl,
  Modal, 
  Button } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";

const name = 'ucdlib-special-exhibit';

const Edit = () => {

  // bail if not exhibit
  const isExhibit = SelectUtils.editedPostAttribute('type') === 'exhibit';
  if ( !isExhibit )  return html`<${Fragment} />`;

  // get various select options
  const curatorOrgs = SelectUtils.terms('curator', {per_page: '-1', orderby: 'name', order: 'asc'});

  const {editEntityRecord} = useDispatch( 'core' );

  const [ modalIsOpen, setModalOpen ] = useState( false );
	const openModal = () => {
    if ( !topExhibit ) {
      setExhibitTitle(postTitle);
    }
    setModalOpen( true )
  };
	const closeModal = () => setModalOpen( false );

  // set default metadata to current page
  const postTitle = SelectUtils.editedPostAttribute('title');
  const postMeta = SelectUtils.editedPostAttribute('meta');
  const postCuratorOrgs = SelectUtils.editedPostAttribute('curator');
  const watchedVars = [
    postTitle,
    postMeta.isOnline,
    postMeta.isPhysical,
    postMeta.isPermanent,
    postMeta.dateFrom,
    postMeta.dateTo,
    postCuratorOrgs
  ];
  const { editPost } = useDispatch( 'core/editor', watchedVars );
  const [ exhibitTitle, setExhibitTitle ] = useState( postTitle );
  const [ exhibitIsOnline, setExhibitIsOnline ] = useState( postMeta.isOnline );
  const [ exhibitIsPhysical, setExhibitIsPhysical ] = useState( postMeta.isPhysical );
  const [ exhibitIsPermanent, setExhibitIsPermanent ] = useState( postMeta.isPermanent );
  const [ exhibitDateFrom, setExhibitDateFrom ] = useState( postMeta.dateFrom );
  const [ exhibitDateTo, setExhibitDateTo ] = useState( postMeta.dateTo );
  const [ exhibitCuratorOrgs, setExhibitCuratorOrgs] = useState(postCuratorOrgs);

  // write metadata to current page or top-level parent
  const saveMetadata = () => {
    const data = {
      title: exhibitTitle,
      curator: exhibitCuratorOrgs,
      meta: {
        isOnline: exhibitIsOnline,
        isPhysical: exhibitIsPhysical,
        isPermanent: exhibitIsPhysical ? exhibitIsPermanent : false,
        dateFrom: (exhibitIsPhysical && !exhibitIsPermanent) ? exhibitDateFrom : null,
        dateTo: (exhibitIsPhysical && !exhibitIsPermanent) ? exhibitDateTo : null,
      }
    }
    if ( topExhibit ) {
      editEntityRecord('postType', 'exhibit', topExhibit, data);
    } else {
      editPost(data);
    }
    closeModal();
  }


  // retrieve metadata from parent if applicable
  const parent = SelectUtils.editedPostAttribute('parent') || 0;
  const [ parentError, setParentError ] = useState( false );
  const [ topExhibit, setTopExhibit ] = useState( 0 );
  useEffect(() => {
    if ( !parent ) {
      setParentError(false);
      setTopExhibit(0);
      return;
    }
    const path = `ucdlib-special/exhibit-page/${parent}`;
    apiFetch( {path} ).then( 
      ( r ) => {
        setParentError(false);
        setTopExhibit(r.exhibitId);
        setExhibitTitle(r.exhibitTitle);
        setExhibitIsOnline(r.exhibitIsOnline);
        setExhibitIsPhysical(r.exhibitIsPhysical);
        setExhibitDateFrom(r.exhibitDateFrom);
        setExhibitDateTo(r.exhibitDateTo);
        setExhibitCuratorOrgs(r.exhibitCuratorOrgs.map(org => org.term_id));
      }, 
      (error) => {
        setParentError(true);
      })

  }, [parent]);

  const datePickerDropdown = (onClose, field) => {
    const setter = field == 'from' ? setExhibitDateFrom : setExhibitDateTo;
    const value = field == 'from' ? exhibitDateFrom : exhibitDateTo;
    const onChange = (v) => {
      setter(v.split('T')[0].replace(/-/g, ''));
      onClose();
    }
    const onReset = () => {
      setter(null);
      onClose(); 
    }
    return html`
      <div>
        <${DatePicker} currentDate=${value} onChange=${onChange} />
        ${value && html`
          <${Button} variant='link' isDestructive=${true} onClick=${onReset}>Reset</${Button}>
        `}
      </div>
    `
  }

  const toggleArrayMember = (needle, haystack) => {
    if ( haystack.includes(needle) ) {
      return haystack.filter(v => v != needle );
    }
    return [...haystack, needle];
  }

  return html`

    <${PluginPostStatusInfo}
      className=${name}
      icon=${html`<ucdlib-icon style=${{marginLeft: '8px', width: '12px', minWidth: '12px'}} icon="ucd-public:fa-image"></ucdlib-icon>`}
      title="This Exhibit">
        <div>
          <${Button} onClick=${openModal} variant="primary">Edit Exhibit Metadata</${Button}>
          ${modalIsOpen && html`
            <${Modal} title='Exhibit Metadata' onRequestClose=${closeModal}>
              ${parentError ? html`
                <div><p>There was an error when retrieving exhibit metadata. Please try again later.</p></div>
              ` : html`
                <div>
                  <div style=${{marginBottom: '15px'}}>
                    <${TextControl} 
                      label='Exhibit Title'
                      value=${exhibitTitle}
                      onChange=${(v) => setExhibitTitle(v)}
                    />
                  </div>
                  <${ToggleControl} 
                    label='Exhibit has an Online Component'
                    checked=${exhibitIsOnline}
                    onChange=${() => {setExhibitIsOnline(!exhibitIsOnline)}}
                  />
                  <${ToggleControl} 
                    label='Exhibit has/had a Physical Installation'
                    checked=${exhibitIsPhysical}
                    onChange=${() => {setExhibitIsPhysical(!exhibitIsPhysical)}}
                  />
                  ${ exhibitIsPhysical && html`
                    <${ToggleControl} 
                      label='Exhibit is a Permanent Installation'
                      checked=${exhibitIsPermanent}
                      onChange=${() => {setExhibitIsPermanent(!exhibitIsPermanent)}}
                    />
                  `}
                  ${(exhibitIsPhysical && !exhibitIsPermanent) && html`
                    <div>
                      <h3>Dates</h3>
                      <div style=${{margin: '10px 0'}}>
                        <${Dropdown} 
                          renderToggle=${({onToggle }) => html`
                            <div onClick=${onToggle} style=${{cursor:'pointer'}}> 
                              <span>Start: </span>
                              <span>${exhibitDateFrom || 'Not Set'}</span>
                            </div>
                          `}
                          renderContent=${({ onClose }) => datePickerDropdown(onClose, 'from')}
                        />
                      </div>
                      <div style=${{margin: '10px 0'}}>
                        <${Dropdown} 
                          renderToggle=${({onToggle }) => html`
                            <div onClick=${onToggle} style=${{cursor:'pointer'}}> 
                              <span>End: </span>
                              <span>${exhibitDateTo || 'Not Set'}</span>
                            </div>
                          `}
                          renderContent=${({ onClose }) => datePickerDropdown(onClose, 'to')}
                        />
                      </div>
                    </div>
                  `}

                  <div>
                    <h3>Curators</h3>
                    <div style=${{marginBottom: '10px'}}>
                      <h4>Curating Organizations:</h4>
                      ${curatorOrgs.map(org => html`
                        <div key=${org.id}>
                          <${CheckboxControl} 
                            label=${org.name}
                            checked=${exhibitCuratorOrgs.includes(org.id)}
                            onChange=${ () => setExhibitCuratorOrgs(toggleArrayMember(org.id, exhibitCuratorOrgs))}
                          />
                        </div>
                      `)}
                    </div>
                  </div>


                  <div style=${{margin: '10px 0'}}>
                    <${Button} onClick=${saveMetadata} variant="primary">Save</${Button}>
                    <${Button} onClick=${closeModal} variant="secondary">Close</${Button}>
                  </div>
                  ${topExhibit != 0 && html`
                    <${Text} isBlock variant='muted'>After saving changes, you must still 'Update' this page for your changes to take effect.</${Text}>
                  `}
                </div>
              `}
            </${Modal}>
          `}

        </div>
    </${PluginPostStatusInfo}>

  `
}

const settings = {render: Edit};
export default { name, settings };