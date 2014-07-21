/**
 * Creates a webform_submission.
 * @param {Number} nid
 * @param {Object} webform_submission
 * @param {Object} options
 */
function webform_submission_create(nid, webform_submission, options) {
  try { 
    options.method = 'POST';
    options.data = JSON.stringify({
      nid: nid,
      webform_submission: webform_submission
    });
    options.path = 'webform_submission.json';
    options.service = 'webform_submission';
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
  }
  catch (error) { console.log('webform_submission_retrieve - ' + error); }
}

/**
 * Update a webform_submission.
 * @param {Number} nid
 * @param {Number} sid
 * @param {Object} webform_submission
 * @param {Object} options
 */
function webform_submission_update(nid, sid, webform_submission, options) {
  try {
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
  }
  catch (error) { console.log('webform_submission_delete - ' + error); }
}

/**
 * Perform a webform_submission index.
 * @param {Object} query
 * @param {Object} options
 */
function webform_submission_index(query, options) {
  try {
  }
  catch (error) { console.log('webform_submission_index - ' + error); }
}
