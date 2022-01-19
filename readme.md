# UC Davis Library Wordpress Plugins

This repository contains Wordpress plugins used for the [main UC Davis Library site](https://github.com/UCDavisLibrary/main-wp-website) and other Library WP properties. These plugins are designed to integrate with the [UC Davis theme](https://github.com/UCDavisLibrary/ucdlib-theme-wp).

For a nice dockerized deployment pattern, see the [main website deployment repo](https://github.com/UCDavisLibrary/main-wp-website-deployment). As a rule, [Timber](https://timber.github.io/docs/v2/installation/) is a dependency for these plugins. Refer to the [UCD theme](https://github.com/UCDavisLibrary/main-wp-website-deployment) for the exact version number.

For general information on writing a plugin, refer to the [Wordpress Plugin Handbook](https://developer.wordpress.org/plugins). However, since these plugins are designed to be used with the UCD theme, you can take advantage of some custom development patterns listed in this readme.

## Twig Basics
Since [twig](https://twig.symfony.com/doc/3.x/) is used by the UCD theme, feel free to use this templating language in your plugin.

### Registering a namespace
You should [namespace](https://timber.github.io/docs/v2/guides/template-locations/#register-your-own-namespaces) your plugin's views directory by hooking onto the `timber/locations`.

### Theme Macros
The UCD theme contains many [twig macros](https://github.com/UCDavisLibrary/ucdlib-theme-wp/tree/main/views/macros) for displaying stylized components. You can import and use these in your plugin views:
```twig
{% from getUcdMacro('cards') import marketing_highlight %}
{{ marketing_highlight({post}) }}
```

## Wordpress Filters
The UC Davis theme has [hook filters](https://developer.wordpress.org/plugins/hooks/custom-hooks/) on the  context and twig variables for every [template file](https://developer.wordpress.org/themes/basics/template-files/#template-files) that it uses. Plugins can hook into these filters to modify the routing behavior of a site. The slug format is as follows:
| Slug Format | Filtered Variable |
| ----------- | -------- |
| ucd-theme_templates_<template_file> | `$templates` | 
| ucd-theme_context_<template_file> | `$context` |

### Examples

Let's say you registered a custom post type called `book`. You can have complete control over how these pages display:
```php
function pass_new_variables_to_the_template( $context ) {             
    if ( $context['post']->post_type == 'book' ){
        $context['title'] = "This is a single book page";
    }
    return $context;
} 
add_filter( 'ucd-theme_context_single', 'pass_new_variables_to_the_template' );

function show_custom_template( $templates, $context ) {             
    if ( $context['post']->post_type == 'book' ){
        $templates = array("@my-plugin/book.twig");
    }
    return $templates;
} 
add_filter( 'ucd-theme_templates_single', 'show_custom_template', 10, 2 );
```

## Advanced Custom Fields (ACF)
Many of these plugins require that [ACF](https://www.advancedcustomfields.com) be installed and activated. If you want to edit the custom fields of a plugin, you have to move your ACF JSON files from the theme to your plugin since ACF can have multiple load points but only a single save point.
1. Create a folder in `ucdlib-theme-wp/theme` called `acf-json`. This is where your changes will be saved to (as JSON files).
2. Copy the JSON file you edited over into `ucdlib-wp-plugins/<plugin-you're-working-on>/wp-json`

To ensure that there is no data loss when editing:
1. Increment the `modified` field in the JSON file before editing
2. Synchronize the field in the admin dashboard. This ensures that the version-controlled JSON file is the source of truth, and not whatever happens to be in the database.