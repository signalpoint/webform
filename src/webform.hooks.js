/**
 * Implements hook_menu().
 */
function webform_menu() {
  try {
    var items = {};
    items['node/%/webform-results'] = {
      title: 'Results',
      page_callback: 'webform_results_page',
      pageshow: 'webform_results_pageshow',
      page_arguments: [1],
      weight: 10,
      type: 'MENU_LOCAL_TASK',
      access_callback: 'user_access',
      access_arguments: ['access all webform results']
    };
    // @TODO - Once DrupalGap core supports non consecutive argument
    // placeholders, we can use the same page paths that the webform module uses
    // in Drupal (e.g. node/%/submission/%). But until then we need to use a
    // custom path with consecutive argument placeholders
    items['webform/submission/%/%/%'] = {
      title: 'Submission',
      page_callback: 'webform_submission_page',
      pageshow: 'webform_submission_pageshow',
      page_arguments: [2, 3, 4],
      access_callback: 'user_access',
      access_arguments: ['access all webform results']
    };
    return items;
  }
  catch (error) { console.log('webform_menu - ' + error); }
}

/**
 * Implements hook_entity_post_render_content().
 */
function webform_entity_post_render_content(entity, entity_type, bundle) {
  try {
    if (typeof entity.webform !== 'undefined') {
      //dpm('webform_entity_post_render_content');
      //dpm('webform_entity_post_render_content');
      //console.log(entity);
      entity.content +=
        drupalgap_form_render(
          drupalgap_form_load('webform_form', entity, entity_type, bundle)
        ) +
        drupalgap_jqm_page_event_script_code({
            page_id: drupalgap_get_page_id(),
            jqm_page_event: 'pageshow',
            jqm_page_event_callback: 'webform_form_pageshow',
            jqm_page_event_args: JSON.stringify({
                nid: entity.nid,
                uuid: entity.uuid
            })
        });
    }
    else {
      console.log('webform was undefined for ' + bundle + ' ' + entity.nid);
    }
  }
  catch (error) {
    console.log('webform_entity_post_render_content - ' + error);
  }
}

/**
 * Implements hook_services_preprocess().
 */
function webform_services_preprocess(options) {
  try {
    // When creating or updating a submission, replace empty array values with an empty object, or the value won't get
    // saved properly in Drupal.
    if (options.service == 'submission' && in_array(options.resource, ['create', 'update'])) {
      var data = JSON.parse(options.data);
      $.each(data.submission.data, function(cid, _data) {
        if ($.isArray(_data.values) && _data.values.length == 0) {
          data.submission.data[cid] = {};
        }
      });
      options.data = JSON.stringify(data);
    }
  }
  catch (error) { console.log('webform_services_preprocess - ' + error); }
}

/**
 * Implements hook_services_postprocess().
 */
function webform_services_postprocess(options, result) {
  try {
    if (options.service == 'webform' && options.resource == 'submissions') {

      //console.log('webform_services_postprocess', result);

      // @NOTE - this is only used to handle hybrid component submission values
      // at this time...
      
      if (result.length == 0) { return; }
      
      // Warn if there is more than one submission, we only handle one at this
      // point.
      if (result.length > 1) {
        console.log('NOTE: webform_services_postprocess only handles the first submission');
      }
      
      // Grab the webform node.
      var webform = webform_load_from_current_page();
      //console.log(webform);
      
      // Extract the submission then iterate over each component.
      var submission = result[0];
      //console.log(submission);
      $.each(submission.data, function(cid, data) {

          //console.log(data.type, data.form_key, data);
          
          // Get the full component from the webform, then pull out the values
          // from this result. If the component fails to load, or it is not
          // a hybrid component then skip it. Then load the hybrid component.
          var component = webform_load_component(webform, data.cid);
          if (!component || !webform_component_is_hybrid(component)) { return; }
          var values = data.values;
          var hybrid = webform_hybrid_load_component(webform.nid, component.cid);
          hybrid.extra.drupalgap_webform_hybrid_values = []; // Make an empty array by default.
          
          // Skip any empty values.
          if (webform_submission_result_is_empty(values)) { return; }
          
          // Place the values onto the hybrid component.
          hybrid.extra.drupalgap_webform_hybrid_values = values;
          
      });
    }
  }
  catch (error) { console.log('webform_services_postprocess - ' + error); }
}
