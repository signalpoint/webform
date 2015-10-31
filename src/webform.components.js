/**
 * Component Widgets
 */

/**
 *
 */
function webform_component_date_widget_form(form, form_state, entity, entity_type, bundle, component, element) {
  try {
    // We'll turn this element into a hidden field, and use children to
    // make the widget(s) to power this component.
    var element_id = element.options.attributes.id;
    element.type = 'hidden';
    // Month field.
    var month = {
      title: element.title, // Place the title on the first child since the parent is hidden.
      type: 'select',
      options: {
        1: 'Jan',
        2: 'Feb',
        3: 'Mar',
        4: 'Apr',
        5: 'May',
        6: 'Jun',
        7: 'Jul',
        8: 'Aug',
        9: 'Sep',
        10: 'Oct',
        11: 'Nov',
        12: 'Dec',
        attributes: {
          id: element_id + '-month',
          onchange: "_webform_date_component_onchange('month', '" + element_id + "');"
        }
      }
    };
    // Day field.
    var day = {
      type: 'select',
      options: {
        attributes: {
          id: element_id + '-day',
          onchange: "_webform_date_component_onchange('day', '" + element_id + "');"
        }
      }
    };
    for (var i = 1; i <= 31; i++) { day.options[i] = i; }
    // Year field.
    var year = {
      options: {
        attributes: {
          id: element_id + '-year',
          onchange: "_webform_date_component_onchange('year', '" + element_id + "');"
        }
      }
    };
    if (component.extra.year_textfield) { year.type = 'number'; }
    else {
      year.type = 'select';
      // Figure out the range of years for the select options.
      var range = webform_date_component_parse_range(component);
      if (range) {
        if (range.start_date.interval != range.end_date.interval) {
          console.log('WARNING: webform_form() - only matching start/end intervals supported (' + range.start_date.interval + ' != ' + range.end_date.interval + ')');
        }
        var low = null;
        var high = null;
        var current_year = parseInt(date('Y'));
        switch (range.start_date.interval) {
          case 'year':
          case 'years':
            low = current_year + range.start_date.value; // Value is negative here, so we add it to get the low.
            high = current_year + range.end_date.value;
            break;
          default:
            console.log('WARNING: webform_form() - unsupported date interval (' + range.start_date.interval + ')');
            break;
        }
      }
      for (var i = low; i <= high; i++) { year.options[i] = i; }
    }
    // Push the children onto the element.
    element.children.push(month);
    element.children.push(day);
    element.children.push(year);
  }
  catch (error) { console.log('webform_component_date_widget_form - ' + error); }
}

/**
 *
 */
function webform_component_fieldset_widget_form(form, form_state, entity, entity_type, bundle, component, element) {
  try {
    element.type = 'hidden';
  }
  catch (error) { console.log('webform_component_fieldset_widget_form - ' + error); }
}

/**
 *
 */
function webform_component_grid_widget_form(form, form_state, entity, entity_type, bundle, component, element) {
  try {
    var element_id = element.options.attributes.id;
    // We'll turn this element into a hidden field, and use children to
    // make the widget(s) to power this component.
    element.type = 'hidden';
    // Attach a value_callback so we can assemble the user's input into a JSON
    // object for the element's form state value.
    element.value_callback = 'webform_component_grid_value_callback';
    // Extract the options and questions.
    var options = component.extra.options.split('\n');
    var questions = component.extra.questions.split('\n');
    for (var i = 0; i < questions.length; i++) {
      var question = questions[i].split('|');
      if (question.length != 2) { continue; }
      var child = {
        type: 'radios',
        title: question[1],
        prefix: '<fieldset data-role="controlgroup" data-type="horizontal">',
        suffix: '</fieldset>',
        options: {
          attributes: {
            id: element_id + '-question-' + i
          }
        }
      };
      for (var j = 0; j < options.length; j++) {
        var option = options[j].split('|');
        if (option.length != 2) { continue; }
        child.options[option[0]] = option[1];
      }
      element.children.push(child);
    }
  }
  catch (error) { console.log('webform_component_grid_widget_form - ' + error); }
}

/**
 *
 */
function webform_component_markup_widget_form(form, form_state, entity, entity_type, bundle, component, element) {
  try {
    var element_id = element.options.attributes.id;
    element.type = null;
    element.title = '';
    element.markup = component.value;
  }
  catch (error) { console.log('webform_component_markup_widget_form - ' + error); }
}

/**
 *
 */
function webform_component_multifile_widget_form(form, form_state, entity, entity_type, bundle, component, element) {
  try {
    element.type = 'hidden';
  }
  catch (error) { console.log('webform_component_multifile_widget_form - ' + error); }
}

/**
 *
 */
function webform_component_number_widget_form(form, form_state, entity, entity_type, bundle, component, element) {
  try {
    var element_id = element.options.attributes.id;
    // If it is not set to an integer, turn it into a textfield. If it
    // is an int, then set the step, min and max if they are provided.
    if (!component.extra.integer) { element.type = 'textfield'; }
    else {
      if (!empty(component.extra.min)) { element.options.attributes.min = component.extra.min; }
      if (!empty(component.extra.max)) { element.options.attributes.max = component.extra.max; }
      if (!empty(component.extra.step)) { element.options.attributes.step = component.extra.step; }
    }
  }
  catch (error) { console.log('webform_component_number_widget_form - ' + error); }
}

/**
 *
 */
function webform_component_phone_widget_form(form, form_state, entity, entity_type, bundle, component, element) {
  try {
    element.type = 'textfield';
  }
  catch (error) { console.log('webform_component_phone_widget_form - ' + error); }
}

/**
 *
 */
function webform_component_select_widget_form(form, form_state, entity, entity_type, bundle, component, element) {
  try {
    var element_id = element.options.attributes.id;
    var select_list = component.extra.aslist;
    // Extract the items (allowed values).
    var items = component.extra.items.split('\n');
    if (select_list) {
      var text = element.required ? t('- Select -') : t('- None -');
      element.options[''] = text;
    }
    // @TODO - The shuffle function works, but the DG Forms API places
    // the options in order of e.g. an int value.
    if (component.extra.optrand) { items = shuffle(items); }
    for (var i = 0; i < items.length; i++) {
      var parts = items[i].split('|');
      if (parts.length != 2) { continue; }
      element.options[parts[0]] = parts[1];
    }
    // A select list.
    if (select_list) {
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
  catch (error) { console.log('webform_component_select_widget_form - ' + error); }
}

/**
 *
 */
function webform_component_time_widget_form(form, form_state, entity, entity_type, bundle, component, element) {
  try {
    // We'll turn this element into a hidden field, and use children to
    // make the widget(s) to power this component.
    element.type = 'hidden';
    var element_id = element.options.attributes.id;
    // Hours
    var hours = {
      type: 'select',
      title: element.title, // Place the title on the first child since the parent is hidden.
      options: {
        attributes: {
          id: element_id + '-hours',
          onchange: "_webform_time_component_onchange('hours', '" + element_id + "');"
        }
      }
    };
    var time_format = null;
    if (component.extra.hourformat == '12-hour') {
      for (var i = 1; i <= 12; i++) { hours.options[i] = i; }
      time_format = {
        type: 'radios',
        value: 'am',
        options: {
          am: 'am',
          pm: 'pm',
          attributes: {
            id: element_id + '-ampm',
            onchange: "_webform_time_component_onchange('ampm', '" + element_id + "');"
          }
        }
      }
    }
    else if (component.extra.hourformat == '24-hour') {
      for (var i = 0; i <= 23; i++) { hours.options[i] = i; }
    }
    // Minutes
    var minutes = {
      type: 'select',
      options: {
        attributes: {
          id: element_id + '-minutes',
          onchange: "_webform_time_component_onchange('minutes', '" + element_id + "');"
        }
      }
    }
    for (var i = 0; i < 60; i += parseInt(component.extra.minuteincrements)) {
      var value = i;
      var label = '' + i;
      if (label.length == 1) { label = "0" + label; }
      minutes.options[value] = label;
    }
    // Add the children.
    element.children.push(hours);
    element.children.push(minutes);
    if (time_format) { element.children.push(time_format); }
  }
  catch (error) { console.log('webform_component_time_widget_form - ' + error); }
}

/**
 * Form Helpers
 */

/**
 *
 */
function _webform_date_component_onchange(which, input) {
  try {
    // @TODO - change this to a value_callback.
    var year = $('#' + input + '-year').val();
    var month = $('#' + input + '-month').val(); if (month.length == 1) { month = "0" + month; }
    var day = $('#' + input + '-day').val(); if (day.length == 1) { day = "0" + day; }
    var date = year + '-' + month + '-' + day;
    $('#' + input).val(date);
  }
  catch (error) { console.log('_webform_date_component_onchange - ' + error); }
}

/**
 *
 */
function _webform_time_component_onchange(which, input) {
  try {
    // @TODO - change this to a value_callback.
    var ampm = $('input[name="' + input + '-ampm"]:checked', 'form#webform_form').val();
    var hours = $('#' + input + '-hours').val();
    if (ampm && ampm == 'pm') { hours = (parseInt(hours) + 12) % 24; }
    var minutes = $('#' + input + '-minutes').val(); if (minutes.length == 1) { minutes = "0" + minutes; }
    var date = hours + ':' + minutes + ':00';
    $('#' + input).val(date);
  }
  catch (error) { console.log('_webform_time_component_onchange - ' + error); }
}

/**
 *
 */
function webform_component_grid_value_callback(id, element) {
  try {
    var value = {};
    var options = element.component.extra.options.split('\n');
    var questions = element.component.extra.questions.split('\n');
    for (var i = 0; i < questions.length; i++) {
      var question = questions[i].split('|');
      value[question[0]] = $('input[name="' + id + '-question-' + i + '"]:checked', 'form#webform_form').val();
    }
    if (empty(value)) { return null; }
    return value;
  }
  catch (error) { console.log('webform_component_grid_value_callback - ' + error); }
}

