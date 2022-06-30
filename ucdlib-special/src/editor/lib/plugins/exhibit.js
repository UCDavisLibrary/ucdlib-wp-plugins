import { Fragment } from "@wordpress/element";
import { PluginPostStatusInfo } from '@wordpress/edit-post';
import { useDispatch } from "@wordpress/data";
import { 
  CheckboxControl,
  DatePicker,
  Dropdown,
  FormTokenField,
  SelectControl,
  TextControl,
  TextareaControl,
  __experimentalText as Text,
  ToggleControl,
  Modal, 
  Button } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { ImagePicker } from "@ucd-lib/brand-theme-editor/lib/block-components";

/**
 * Allows user to set metadata for an exhibit 
 * by clicking a button in the publish panel that will open a modal.
 * If the current exhbit page is a child, metadata will be read from and written to the top-level ancestor.
 */
const name = 'ucdlib-special-exhibit';
const Edit = () => {

  // bail if not exhibit
  const isExhibit = SelectUtils.editedPostAttribute('type') === 'exhibit';
  if ( !isExhibit )  return html`<${Fragment} />`;

  // get various select options
  const curatorOrgs = SelectUtils.terms('curator', {per_page: '-1', orderby: 'name', order: 'asc'});
  const locations = SelectUtils.terms('exhibit-location', {per_page: '-1', orderby: 'name', order: 'asc'});
  const locationOptions = [
    {value: '', label: 'Select a location', disabled: true},
    ...locations.map(l => {return {value: l.id, label: l.name}})
  ];
  const [ peoplePosts, setPeoplePosts ] = useState( [] );
  useEffect(() => {
    const path = `ucdlib-directory/people`;
    apiFetch( {path} ).then( 
      ( r ) => {
        setPeoplePosts(r);
      }, 
      (error) => {
        setPeoplePosts([]);
        console.warn(error);
      })

  }, []);

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
  const postLocations = SelectUtils.editedPostAttribute('exhibit-location');
  const watchedVars = [
    postTitle,
    postMeta.isOnline,
    postMeta.isPhysical,
    postMeta.isPermanent,
    postMeta.dateFrom,
    postMeta.dateTo,
    postMeta.curators,
    postMeta.locationDirections,
    postMeta.locationMap,
    postCuratorOrgs,
    postLocations
  ];
  const { editPost } = useDispatch( 'core/editor', watchedVars );
  const [ exhibitTitle, setExhibitTitle ] = useState( postTitle );
  const [ exhibitIsOnline, setExhibitIsOnline ] = useState( postMeta.isOnline );
  const [ exhibitIsPhysical, setExhibitIsPhysical ] = useState( postMeta.isPhysical );
  const [ exhibitIsPermanent, setExhibitIsPermanent ] = useState( postMeta.isPermanent );
  const [ exhibitDateFrom, setExhibitDateFrom ] = useState( postMeta.dateFrom );
  const [ exhibitDateTo, setExhibitDateTo ] = useState( postMeta.dateTo );
  const [ exhibitCuratorOrgs, setExhibitCuratorOrgs] = useState(postCuratorOrgs);
  const [ exhibitCurators, setExhibitCurators] = useState(postMeta.curators);
  const [ exhibitLocations, setExhibitLocations] = useState(postLocations);
  const [ exhibitLocationDirections, setExhibitLocationDirections] = useState(postMeta.locationDirections);
  const [ exhibitLocationMap, setExhibitLocationMap ] = useState(postMeta.locationMap);

  const setStateFromCurrentPage = () => {
    setTopExhibit(0);
    setExhibitTitle(postTitle);
    setExhibitIsOnline(postMeta.isOnline);
    setExhibitIsPhysical(postMeta.isPhysical);
    setExhibitIsPermanent(postMeta.isPermanent);
    setExhibitDateFrom(postMeta.dateFrom);
    setExhibitDateTo(postMeta.dateTo);
    setExhibitCuratorOrgs(postCuratorOrgs);
    setExhibitCurators(postMeta.curators);
    setExhibitLocations(postLocations);
    setExhibitLocationDirections( postMeta.locationDirections );
    setExhibitLocationMap(postMeta.locationMap)
  }

  // format people the way selector likes
  const people = (() => {
    const out = {
      names: [],
      byId: {},
      byName: {},
      curators: []
    }
    peoplePosts.forEach(p => {
      p.name = `${p.name_first} ${p.name_last}`.trim();
      if ( name && p.id ) {
        out.names.push(p.name);
        out.byId[p.id] = p;
        out.byName[p.name] = p
        if ( exhibitCurators.includes(p.id) ) out.curators.push(p.name);
      }
    })
    return out;
  })();

  const exhibitLocationMapObject = SelectUtils.image(exhibitLocationMap);

  // write metadata to current page or top-level parent
  const saveMetadata = () => {
    const data = {
      title: exhibitTitle,
      curator: exhibitCuratorOrgs,
      'exhibit-location': exhibitLocations,
      meta: {
        isOnline: exhibitIsOnline ? true : false,
        isPhysical: exhibitIsPhysical? true : false,
        isPermanent: exhibitIsPhysical ? exhibitIsPermanent : false,
        dateFrom: (exhibitIsPhysical && !exhibitIsPermanent) ? exhibitDateFrom : null,
        dateTo: (exhibitIsPhysical && !exhibitIsPermanent) ? exhibitDateTo : null,
        curators: exhibitCurators,
        locationDirections: exhibitLocationDirections,
        locationMap: exhibitLocationMap
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
      setStateFromCurrentPage();
      return;
    }
    const path = `ucdlib-special/exhibit-page/${parent}`;
    apiFetch( {path} ).then( 
      ( r ) => {
        setParentError(false);
        setTopExhibit(r.exhibitId);
        setExhibitTitle(r.exhibitTitle);
        setExhibitIsOnline(r.exhibitIsOnline);
        setExhibitIsPermanent(r.exhibitIsPermanent);
        setExhibitIsPhysical(r.exhibitIsPhysical);
        setExhibitDateFrom(r.exhibitDateFrom);
        setExhibitDateTo(r.exhibitDateTo);
        setExhibitCuratorOrgs(r.exhibitCuratorOrgs.map(org => org.term_id));
        setExhibitCurators(r.exhibitCurators);
        setExhibitLocations(r.exhibitLocations.map(loc => loc.term_id));
        setExhibitLocationDirections( r.exhibitLocationDirections);
        setExhibitLocationMap(r.exhibitLocationMap.id)
      }, 
      (error) => {
        setParentError(true);
        setStateFromCurrentPage();
      })

  }, [parent]);

  // exhibit to/from date picker
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
  const dateLabel = (d) => {
    if ( !d ) return 'Not Set';
    return `${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6)}`;
  }

  const toggleArrayMember = (needle, haystack) => {
    if ( haystack.includes(needle) ) {
      return haystack.filter(v => v != needle );
    }
    return [...haystack, needle];
  }

  const onIndividualCuratorChange = (curators) => {
    curators = curators.map(c => people.byName[c]).filter(c => c != undefined).map(c => c.id);
    setExhibitCurators(curators);
  }

  return html`

    <${PluginPostStatusInfo}
      className=${name}
      icon=${html`<ucdlib-icon style=${{marginLeft: '8px', width: '12px', minWidth: '12px'}} icon="ucd-public:fa-image"></ucdlib-icon>`}
      title="This Exhibit">
        <div>
          <${Button} onClick=${openModal} variant="primary">Edit Exhibit Metadata</${Button}>
          ${modalIsOpen && html`
            <${Modal} title='Exhibit Metadata' onRequestClose=${closeModal} shouldCloseOnClickOutside=${false}>
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
                              <span>${dateLabel(exhibitDateFrom)}</span>
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
                              <span>${dateLabel(exhibitDateTo)}</span>
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
                    <div>
                      <h4>Individual Curators</h4>
                      <${FormTokenField}
                        label='Add Curator'
                        value=${ people.curators }
                        suggestions=${ people.names }
                        onChange=${ onIndividualCuratorChange }
                      />
                    </div>
                  </div>
                  ${exhibitIsPhysical && html`
                    <div>
                      <h3>Exhibit Location</h3>
                      <div style=${{marginBottom: '10px'}}>
                        <${SelectControl} 
                          options=${locationOptions}
                          value=${exhibitLocations.length ? exhibitLocations[0] : ''}
                          onChange=${id => setExhibitLocations([id])}
                        />
                        <${TextareaControl}
                          label="Directions to Exhibit"
                          help="Brief blurb to help patrons find this exhibit in the specified location."
                          value=${exhibitLocationDirections}
                          onChange=${setExhibitLocationDirections}
                          placeholder='This exhibit is located...'
                        />
                        <h4>Directional Map</h4>
                        <${ImagePicker} 
                          notPanel=${true}
                          imageId=${exhibitLocationMap}
                          image=${exhibitLocationMapObject}
                          onSelect=${(image) => setExhibitLocationMap(image.id)}
                          onRemove=${() => setExhibitLocationMap(0)}
                        />
                      </div>
                    </div>
                  `}


                  <div style=${{marginTop: '20px', marginBottom: '10px'}}>
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