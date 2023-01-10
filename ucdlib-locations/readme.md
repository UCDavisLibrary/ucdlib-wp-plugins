# UCD Library Locations

## Library Hours

Hours are populated using Springshare Libcal and can be configured in Wordpress by 
1. Creating a location with a libcal id metafield
2. Ensuring all global settings are correct in `Locations->Settings`. 
3. There are several hours blocks that can then be placed in any WP page.

When a range of hours for a location are retrieved, they are cached as long-lived WP transients. A WP cron runs periodically (time specified in settings) that hits the libcal API, and replaces the transient if a 200 response is returned. The cron simply kicks off a http request to `/wp-json/ucdlib-locations/refresh-hours`, which you can manually hit if you want to refresh the hours cache yourself.

When developing on localhost, wp cron does NOT spawn jobs according to the specified schedule, so your hours will not update. You have a couple options to get around this:
   
1. To get the cron to work, you must change your `HOST_PORT` to 80 and the `siteurl` and `home` wp_options to `http://localhost`. 
2. If you want to test the cron job without changing your port, you can use the WP CLI with `wp --allow-root cron event list` and `wp --allow-root cron event run <name of cron>` from either the wp or utils container.
3. Go to the `refresh-hours` endpoint yourself to refresh the hours manually.