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
function webform_hybrid_load(nid) {
  try {
    // Set up a object to house the hybrid components for this node, if it
    // hasn't been already. 
    if (typeof webform_hybrid_components[nid] === 'undefined') {
      webform_hybrid_components[nid] = {
        components: { },
        items: {},
        collapsible_items: []
      };
    }
    return webform_hybrid_components[nid];
  }
  catch (error) { console.log('webform_hybrid_load - ' + error); }
}

/**
 *
 */
function webform_hybrid_load_component(nid, cid) {
  try {
    var hybrid_component = webform_hybrid_load(nid);
    return typeof hybrid_component.components[cid] === 'undefined' ?
      null : hybrid_component.components[cid];
  }
  catch (error) { console.log('webform_hybrid_load_component - ' + error); }
}

/**
 *
 */
function webform_hybrid_component_pageshow(options) {
  try {
    $('.webform_hybrid_component').on("collapsibleexpand", function(event, ui) {
        var cid = $(event.target).attr('cid');
        console.log(cid);
    });
  }
  catch (error) { console.log('webform_hybrid_component_pageshow - ' + error); }
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
    
    // Load the hybrid component.
    var hybrid_component = webform_hybrid_load(nid);
    
    // Then place this component into the object.
    hybrid_component.components[cid] = component;
    
    // Now add this component's items key and labels to the object.
    // @START HERE!
    hybrid_component.items[cid] = {};
    
    // Place the component 
    
    // Borrowed from webform_component_select_widget_form()....
    
    // Set up the hybrid form element, if it wasn't already.
    if (typeof form.elements['webform_hybrid_component'] === 'undefined') {
      form.elements['webform_hybrid_component'] = {
        type: 'autocomplete',
        items: [],
        weight: element.weight - 1,
        item_onclick: 'webform_hybrid_component_select_item_onclick',
        children: []
      };
    }
    
    // Extract and add the items (allowed values) to the hybrid element.
    var items = component.extra.items.split('\n');
    for (var i = 0; i < items.length; i++) {
      var parts = items[i].split('|');
      if (parts.length != 2) { continue; }
      form.elements['webform_hybrid_component'].items.push({
          value: parts[0],
          label: parts[1],
          attributes: {
            cid: cid
          }
      });
      
    }
    
    // Now add a collapsible item for this component.
    hybrid_component.collapsible_items.push({
        header: component.name,
        content: '<p>Hello</p>',
        attributes: {
          cid: cid
        }
    });
    
    //var element_id = element.options.attributes.id;

    // A select list.
    /*if (component.extra.aslist) {
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
    }*/

  }
  catch (error) { console.log('webform_hybrid_component_select_widget_form - ' + error); }
}


/**
 *
 */
function webform_hybrid_component_select_item_onclick(id, item) {
  try {
    var value = $(item).attr('value');
    var cid = $(item).attr('cid');
    console.log('List id: ' + id + ', value: ' + value + ', cid: ' + cid);
  }
  catch (error) { console.log('webform_hybrid_component_select_item_onclick - ' + error); }
}

