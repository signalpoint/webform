/**
 * SERVICES
 */

/**
 * Creates a webform_submission.
 * @param {Number} uuid
 * @param {Object} submission
 * @param {Object} options
 */
function webform_submission_create(uuid, submission, options) {
  try {
    options.method = 'POST';
    options.data = JSON.stringify({
      webform: uuid,
      submission: submission
    });
    options.path = 'submission.json';
    options.service = 'submission';
    options.resource = 'create';
    Drupal.services.call(options);
  }
  catch (error) { console.log('webform_submission_create - ' + error); }
}

/**
 * Retrieves a webform_submission.
 * @param {Number} nid
 * @param {Number} sid
 * @param {Object} options
 */
function webform_submission_retrieve(nid, sid, options) {
  try {
    options.method = 'GET';
    options.path = 'webform_submission/' + nid + '/' + sid + '.json';
    options.service = 'submission';
    options.resource = 'retrieve';
    Drupal.services.call(options);
  }
  catch (error) { console.log('webform_submission_retrieve - ' + error); }
}

/**
 * Update a webform_submission.
 * @param {String} uuid
 * @param {Object} submission
 * @param {Object} options
 */
function webform_submission_update(uuid, submission, options) {
  try {
    options.method = 'PUT';
    options.data = JSON.stringify({
      submission: submission
    });
    options.path = 'submission/' + uuid + '.json';
    options.service = 'submission';
    options.resource = 'update';
    Drupal.services.call(options);
  }
  catch (error) { console.log('webform_submission_update - ' + error); }
}

/**
 * Delete a webform_submission.
 * @param {Number} nid
 * @param {Number} sid
 * @param {Object} options
 */
function webform_submission_delete(nid, sid, options) {
  try {
    console.log('WARNING: webform_submission_delete() not implemented yet!');
  }
  catch (error) { console.log('webform_submission_delete - ' + error); }
}

/**
 *
 */
function webform_submissions(uuid, query, options) {
  try {
    options.method = 'GET';
    options.path = 'webform/' + uuid + '/submissions.json' + webform_prepare_query_string(query);
    options.service = 'webform';
    options.resource = 'submissions';
    Drupal.services.call(options);
  }
  catch (error) { console.log('webform_submissions - ' + error); }
}

/**
 * Perform a webform_submission index.
 * @deprecated
 * @param {Object} query
 * @param {Object} options
 */
function webform_submission_index(query, options) {
  try {
    alert('webform_submission_index is deprecated! Use webform_submissions() instead.');
    return;
    var query_string = webform_prepare_query_string(query);
    Drupal.services.call({
        method: 'GET',
        path: 'submission.json' + query_string,
        service: 'submission',
        resource: 'index',
        success: function(result) {
          try {
            if (options.success) { options.success(result); }
          }
          catch (error) { console.log('entity_index - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('entity_index - error - ' + error); }
        }
    });
  }
  catch (error) { console.log('webform_submission_index - ' + error); }
}

/**
 *
 */
function webform_prepare_query_string(query) {
  try {
    var query_string = '';
    if (typeof query === 'object') {
      query_string = entity_index_build_query_string(query);
    }
    else if (typeof query === 'string') {
      query_string = query;
    }
    if (query_string) { query_string = '&' + query_string; }
    else { query_string = ''; }
    return query_string;
  }
  catch (error) { console.log('webform_prepare_query_string - ' + error); }
}
