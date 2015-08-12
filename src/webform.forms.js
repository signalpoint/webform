/**
 * The form builder function for a webform.
 */
function webform_form(form, form_state, entity, entity_type, bundle) {
  try {

    // @TODO Add support for component weight (ordering), why doesn't the DGFAPI
    //       handle this? It should, but maybe it only supports fields and extra
    //       fields.
    
    form.options.attributes['class'] += ' webform ';

    /**
     * SUPPORTED COMPONENTS
     * [x] Date
     * [x] E-mail
     * [ ] Fieldset
     * [ ] File
     * [x] Grid
     * [x] Hidden
     * [x] Markup
     * [x] Number
     * [ ] Page break
     * [x] Select
     * [x] Textarea
     * [x] Textfield
     * [x] Time
     */

    //dpm('webform_form');
    //dpm(entity.webform);
    //console.log(entity.webform);
    
    // Append the entity type and id to the form id, otherwise we won't have a
    // unique form id when loading multiple webforms across multiple pages.
    form.id += '_' + entity_type + '_' + entity[entity_primary_key(entity_type)];

    // Attach the webform and the uuid to the form.
    form.webform = entity.webform;
    form.uuid = entity.uuid;

    // Place each webform components on the form.
    $.each(entity.webform.components, function(cid, component) {

        //dpm(component.name);
        //dpm(component);

        // Preset some component element variables.
        var title = component.name;
        if (component.extra.title_display == 'none') { title = ''; }
        var required = parseInt(component.required) == 1 ? true : false;
        var markup = null;
        var access = (component.extra['private'] && !user_access('access all webform results')) ? false : true;
        
        // Build the form element basics.
        form.elements[component.form_key] = {
          component: component,
          type: component.type,
          title: title,
          required: required,
          value: webform_tokens_replace(component.value),
          description: webform_tokens_replace(component.extra.description),
          disabled: component.extra.disabled,
          access: access,
          options: {
            attributes: {
              id: drupalgap_form_get_element_id(component.form_key, form.id) // without this, does the DGFAPI add an id?
            }
          },
          children: [],
          weight: parseInt(component.weight) // Not working...
        };
        
        // Some component types map cleanly, others do not. For those that don't
        // send them off to the component widget form handler.
        var function_name = 'webform_component_' + component.type + '_widget_form';
        if (function_exists(function_name)) {
          var fn = window[function_name];
          fn(form, form_state, entity, entity_type, bundle, component, form.elements[component.form_key]);
        }

    });
    
    if (typeof form.elements['webform_hybrid_component']) {
      dpm('hybrid element present');
      var hybrid_component = webform_hybrid_load(entity.nid);
      console.log(hybrid_component);
      form.elements['webform_hybrid_component'].children.push({
        markup:
          theme('collapsibleset', {
            items: hybrid_component.collapsible_items,
            attributes: {
              'class': 'webform_hybrid_component'
            }
          }) +
          drupalgap_jqm_page_event_script_code({
              page_id: drupalgap_get_page_id(),
              jqm_page_event: 'pageshow',
              jqm_page_event_callback: 'webform_hybrid_component_pageshow',
              jqm_page_event_args: JSON.stringify({ })
          })
      });
    }

    // Submit button.    
    var submit_text = empty(entity.webform.submit_text) ? 'Submit' : entity.webform.submit_text;
    form.elements['submit'] = {
      type: 'submit',
      value: submit_text
    };
    
    return form;
  }
  catch (error) { console.log('webform_form - ' + error); }
}

/**
 *
 */
function webform_form_pageshow(options) {
  try {
    //return; // temporarily disabled while we work on local_forms
    
    // Has the user already submitted the form?
    var query = {
      parameters: {
        uid: Drupal.user.uid
      }
    };
    webform_submissions(options.uuid, query, {
        success: function(submissions) {
          dpm('webform_submissions');
          console.log(submissions);
        }
    });
  }
  catch (error) { console.log('webform_form_pageshow - ' + error); }
}

/**
 * 
 */
function webform_form_submit(form, form_state) {
  try {

    //dpm('webform_form_submit');
    //console.log(form);
    //console.log(form_state);

    var submission = {
      uid: Drupal.user.uid, // @TODO not sure if this is used server side, yet.
      data: { }
    };
    $.each(form.webform.components, function(cid, component) {

        // Attach the form state values to the submission data. We need to
        // wrap string values in an array for whatever reason(s).
        var values = form_state['values'][component.form_key];
        if (typeof values === 'string') { values = [values]; }
        submission.data[cid] = { values: values };

    });

    webform_submission_create(form.uuid, submission, {
        success: function(result) {
          //console.log(result);

          // Depending on the webform's "Redirection location" settings, move
          // the user along and notify them accordingly.
          switch (form.webform.redirect_url) {
            //case '<confirmation>': // Confirmation page
            //case '<none>': // No redirect (reload current page)
            default:
              var msg = form.webform.confirmation;
              if (!empty(msg)) { drupalgap_set_message(msg); }
              drupalgap_goto(drupalgap_path_get(), { reloadPage: true });
              break;
          }

        },
        error: function(xhr, status, message) {
          message = JSON.parse(message);
          if (message && message.form_errors) {
            var _messages = '';
            $.each(message.form_errors, function(component, _message) {
                _messages += _message + '\n';
            });
            drupalgap_alert(_messages);
          }
          else { drupalgap_alert(message); }
        }
    });

  }
  catch (error) { console.log('webform_form_submit - ' + error); }
}

