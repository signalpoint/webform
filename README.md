webform
=======

The Webform module for DrupalGap. When viewing a webform enabled node in
DrupalGap, this module will automatically display the webform in the app.

Installation
============

## Download and enable the 7.x-4.x version of the Webform Service module:

- https://www.drupal.org/project/webform_service

## Patch the Webform Service module with the following patch:

- https://www.drupal.org/node/2452085#comment-9718545

Then in Drupal, go to admin/structure/services/list/drupalgap/resources and enable
   your desired service resources under "webforms" and "submissions". We recommend
   enabling at least the "create", "retrieve" and "index" resources. Visit the
   admin/people/permissions page in Drupal, and review the permissions you have
   set for Webform module. That will give you a better idea of what service
   resources you should consider enabling.

After enabling the service resources, it's a good idea to the clear all the
   caches in Drupal.
