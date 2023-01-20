# UCD Library Locations

## Library Hours

Hours are populated using Springshare Libcal and can be configured in Wordpress by 
1. Creating a location with a libcal id metafield
2. Ensuring all global settings are correct in `Locations->Settings`. 
3. There are several hours blocks that can then be placed in any WP page.

When a range of hours for a location are retrieved, they are cached as long-lived WP transients. A WP cron runs periodically (time specified in settings) that hits the libcal API, and replaces the transient if a 200 response is returned. To manually refresh the cache, you can either:
1. Hit 'Update' on the `Locations->Settings` page, which will schedule and immediately execute a new cron process.
2. Use the wp cli with `docker compose exec wordpress` and then `wp --allow-root eval-file ./wp-content/plugins/ucdlib-locations/includes/cli/refresh-hours.php`. This method has the advantage of showing the status of each cache request.

The cron job should delete past transients, but if this process fails (or if you are in development), you can completely clear the transients by using the wp cli command `wp --allow-root eval-file ./wp-content/plugins/ucdlib-locations/includes/cli/delete-transients.php`. 

When developing on localhost, wp cron does NOT spawn jobs according to the specified schedule, so your hours will not automatically update. You have a couple options to get around this:
   
1. To get the cron to work, you must change your `HOST_PORT` to 80 and the `siteurl` and `home` wp_options to `http://localhost`. 
2. If you want to test the cron job without changing your port, you can use the WP CLI with `wp --allow-root cron event list` and `wp --allow-root cron event run <name of cron>` from either the wp or utils container.
3. Use the WP CLI `eval-file` script listed above.