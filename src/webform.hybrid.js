var webform_hybrid_components = {};

/**
 *
 */
function webform_component_is_hybrid(component) {
  try {
    if (typeof component.extra.drupalgap_webform_select_hybrid !== 'undefined') {
      return component.extra.drupalgap_webform_select_hybrid;
    }
    return false;
  }
  catch (error) { console.log('webform_component_is_hybrid - ' + error); }
}

/**
 *
 */
function webform_hybrid_component_select_widget_form(form, form_state, entity, entity_type, bundle, component, element) {
  try {
    dpm('webform_hybrid_component_select_widget_form');
    console.log(arguments);
    
    var nid = component.nid;
    var cid = component.cid;
    
    // Set up a object to house the hybrid components for this node, if it
    // hasn't been already. Then place this component into the object.
    if (typeof webform_hybrid_components[nid] === 'undefined') {
      webform_hybrid_components[nid] = {
        components: { },
        items: {}
      };
    }
    webform_hybrid_components[nid].components[cid] = component;
    
    // Now add this component's items key and labels to the object.
    // @START HERE!
    webform_hybrid_components[nid].items[cid] = {};
    
    // Place the component 
    
    // Borrowed from webform_component_select_widget_form()....
    
    
    var element_id = element.options.attributes.id;
    // Extract the items (allowed values).
    var items = component.extra.items.split('\n');
    // @TODO - The shuffle function works, but the DG Forms API places
    // the options in order of e.g. an int value.
    if (component.extra.optrand) { items = shuffle(items); }
    for (var i = 0; i < items.length; i++) {
      var parts = items[i].split('|');
      if (parts.length != 2) { continue; }
      element.options[parts[0]] = parts[1];
    }
    // A select list.
    if (component.extra.aslist) {
      if (component.extra.multiple) {
        // @TODO - when this component is required, the fake 'required'
        // option comes up in the jQM multiple select widget. We need to
        // prevent that from happening, in DrupalGap core.
        // @UPDATE - I think this has been taken care of now that we are
        // using an empty string for the fake value.
        element.options.attributes['data-native-menu'] = 'false';
        element.options.attributes['multiple'] = 'multiple';
      }
    }
    // Not a select list.
    else {
      if (component.extra.multiple) { element.type = 'checkboxes'; }
      else { element.type = 'radios'; }
    }
  }
  catch (error) { console.log('webform_hybrid_component_select_widget_form - ' + error); }
}

