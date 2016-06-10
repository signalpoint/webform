var webform_hybrid_components = {};

/**
 *
 */
function webform_component_is_hybrid(component) {
  try {
    //dpm('webform_component_is_hybrid');
    //console.log(component);
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
function webform_hybrid_component_select_widget_form(form, form_state, entity, entity_type, bundle, component, element) {
  try {
    //dpm('webform_hybrid_component_select_widget_form');
    //console.log(arguments);
    
    var nid = component.nid;
    var cid = component.cid;
    
    // Load the hybrid component.
    var hybrid_component = webform_hybrid_load(nid);
    
    // Then place this component into the object.
    hybrid_component.components[cid] = component;
    
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
    
    // Extract and add the items (allowed values) to the hybrid element, sort
    // the options alphabetically for this component.
    // @WARNING this sort is a bit hacky, if a label has ridiculous characters
    // in it, this may break.
    var options = webform_select_component_get_options(component);
    var _options = { };
    $.each(options, function(value, label) { _options[label] = value; });
    $.each(_options, function(label, value) {
        form.elements['webform_hybrid_component'].items.push({
          value: value,
          label: label,
          attributes: {
            cid: component.cid
          }
      });
    });
    
    // Now add a collapsible item for this component.
    hybrid_component.collapsible_items.push({
        header: component.name,
        content: '<p></p>',
        attributes: {
          cid: cid,
          'class': 'webform_hybrid_component'
        }
    });
    
    // Remove the original component's element from the form.
    delete form.elements[component.form_key];
    
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

var _webform_hybrid_expanding = false; // Helps stop a double collapse/expand event on the jQM collapsible.

/**
 *
 */
function webform_hybrid_component_pageshow(options) {
  try {
    var nid = options.nid;
    
    // When a collapsed header is clicked, inject the component options into the
    // expanded widget as checkboxes.
    // @TODO - add radio support
    $('.webform_hybrid_component').on("collapsibleexpand", function(event, ui) {

      if (_webform_hybrid_expanding) { return; }

        var cid = $(event.target).attr('cid');
        
        // Load the options for this component.
        var component = webform_hybrid_load_component(nid, cid);
        var options = webform_select_component_get_options(component);
        //console.log(component, options);
        
        // If there are any options, build an item list of checkboxes, one for
        // each option, then inject the list into the expanded widget's
        // container.
        if (options) {
          var items = [];
          
          // Build the checkboxes.
          $.each(options, function(value, label) {

              // Build the checkbox.
              var checkbox = {
                title: label,
                attributes: {
                  id: nid + '-' + cid + '-' + value,
                  value: value,
                  onclick: 'webform_hybrid_checkbox_click(this)'
                }
              };
              //console.log(value, label);
              //console.log(component.extra.drupalgap_webform_hybrid_values);
              //console.log(typeof component.extra.drupalgap_webform_hybrid_values);

            var is_array = $.isArray(component.extra.drupalgap_webform_hybrid_values);
              
              // Determine if the box is checked or not.
              // @WARNING when the values come back from Drupal they are in an
              // object, but when they come back from the hybrid component in
              // the app, they are in an array, so we cover both cases here.
              if (is_array && in_array(value, component.extra.drupalgap_webform_hybrid_values)) {
                checkbox.attributes.checked = '';
              }
              else if (!is_array && typeof component.extra.drupalgap_webform_hybrid_values === 'object') {
                $.each(component.extra.drupalgap_webform_hybrid_values, function(_index, _value) {
                    if (_index == value && _value != '0') {
                      checkbox.attributes.checked = '';
                      return false;
                    }
                });
              }

              // Build the checkbox label.
              var checkbox_label = { element: checkbox };
              checkbox_label.element.id = checkbox.attributes.id;

              // Render the checkbox and label, then stick it on the items list.
              items.push(
                theme('checkbox', checkbox) +
                theme('form_element_label', checkbox_label)
              );

          });
          
          // Finally, inject the item list into the container.
          _webform_hybrid_expanding = true;
          setTimeout(function() {
            $(event.target).find('p').html(theme('jqm_item_list', {
              items: items,
              attributes: {
                'data-theme': 'b'
              }
            })).trigger('create');
            _webform_hybrid_expanding = false;
          }, 50);

        }
        
    });

  }
  catch (error) { console.log('webform_hybrid_component_pageshow - ' + error); }
}


/**
 * Handles clicks on an autocomplete result item.
 */
function webform_hybrid_component_select_item_onclick(id, item) {
  try {
    var value = $(item).attr('value');
    var cid = $(item).attr('cid');
    //console.log('List id: ' + id + ', value: ' + value + ', cid: ' + cid);
    var page_id = drupalgap_get_page_id();
    
    // Locate the collapsible widget for this option's parent component.
    var collapsible = $('#' + page_id + ' div[cid="' + cid + '"]');
    //$(collapsible).collapsible( "option", "collapsed", false );
    $(collapsible).collapsible("expand");

    setTimeout(function() {
      // Locate the checkbox.
      var selector = '#' + page_id + ' input#' + _webform_hybrid_nid + '-' + cid + '-' + value;
      var checkbox = $(selector);
      //$(checkbox).prop('checked', true).checkboxradio('refresh');;

      // Scroll to the checkbox.
      var input_height = 84; // @TODO needs to by dynamic based on height.
      $('html, body').animate({ scrollTop: $(checkbox).offset().top - input_height }, 1000);

    }, 50);

  }
  catch (error) { console.log('webform_hybrid_component_select_item_onclick - ' + error); }
}

/**
 * Handles clicks on checkboxes inside the collapsibles.
 */
function webform_hybrid_checkbox_click(_checkbox) {
  try {
    
    // Prep the checkbox and determine its checked status.
    var checkbox = $(_checkbox);
    var checked = checkbox.is(':checked');
    
    // Extract the nid, cid and value.
    var parts = checkbox.attr('id').split('-');
    var nid = parts[0];
    var cid = parts[1];
    var value = parts[2];
    
    // Load up the hybrid's component.
    var hybrid = webform_hybrid_load_component(nid, cid);
    
    // Init the hybrid values if they don't exist.
    if (typeof hybrid.extra.drupalgap_webform_hybrid_values === 'undefined') {
      hybrid.extra.drupalgap_webform_hybrid_values = {};
    }
    
    if (checked) {

      // The box is checked...

      // Add the value to the drupalgap_webform_hybrid_values array inside the
      // hybrid component.
      if ($.isArray(hybrid.extra.drupalgap_webform_hybrid_values)) {
        hybrid.extra.drupalgap_webform_hybrid_values.push(value);
      }
      else if (typeof hybrid.extra.drupalgap_webform_hybrid_values === 'object') {
        hybrid.extra.drupalgap_webform_hybrid_values[value] = '' + value;
      }

    }
    else {

      // The box is unchecked...

      // Remove the value from the drupalgap_webform_hybrid_values array
      // inside the hybrid component.
      if ($.isArray(hybrid.extra.drupalgap_webform_hybrid_values)) {
        var index = hybrid.extra.drupalgap_webform_hybrid_values.indexOf(value);
        if (index != -1) { hybrid.extra.drupalgap_webform_hybrid_values.splice(index, 1); }
      }
      else if (typeof hybrid.extra.drupalgap_webform_hybrid_values === 'object') {
        hybrid.extra.drupalgap_webform_hybrid_values[value] = '0';
      }

    }

    //console.log('drupalgap_webform_hybrid_values', hybrid.extra.drupalgap_webform_hybrid_values);

    module_invoke_all('webform_hybrid_checkbox_click', _checkbox);
    
    // Submit the form.
    //$('.webform .dg_form_submit_button').click();
    
  }
  catch (error) { console.log('webform_hybrid_checkbox_click - ' + error); }
}
