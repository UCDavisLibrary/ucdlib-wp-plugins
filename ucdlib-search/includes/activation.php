<?php

class UCDLibPluginSearchActivation {
  public function __construct( $config, $doHooks=true ){
    $this->config = $config;
    $this->config['logTableSuffix'] = "ucdlib_post_updates_log";
    $this->config['updateTriggerName'] = "wp_posts_update_log_trigger";
    $this->config['insertTriggerName'] = "wp_posts_insert_log_trigger";

    if ( $doHooks ) {
      register_activation_hook( $config['entryPoint'], array($this, 'onActivation') );
      register_deactivation_hook( $config['entryPoint'], array($this, 'onDeactivation') );
    }
  }

  // Is called when this plugin is activated
  public function onActivation(){
    $this->createPostUpdatesLogTable();
    $this->createPostUpdatesTriggers();
  }

  // Is called when this plugin is deactivated
  public function onDeactivation(){
    $this->dropPostUpdatesTriggers();
  }

  // Will create/modify post updates log table
  public function createPostUpdatesLogTable(){
    global $wpdb;

    $table_name = $wpdb->prefix . $this->config['logTableSuffix'];
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
      id bigint(20) NOT NULL AUTO_INCREMENT,
      post_modified datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
      post_id bigint NOT NULL,
      PRIMARY KEY  (id)
    ) $charset_collate;";
    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sql );
  }

  // Creates triggers that populate the post updates log table
  public function createPostUpdatesTriggers(){
    global $wpdb;
    $table_name = $wpdb->prefix . $this->config['logTableSuffix'];
    $updateTriggerName = $this->config['updateTriggerName'];
    $insertTriggerName = $this->config['insertTriggerName'];

    // Limit trigger to specific post types
    $post_types = get_field('post_types' ,$this->config['slug']);
    $post_type_condition = '';
    if ( $post_types && is_array($post_types) ) {
      $post_type_condition = " AND new.post_type IN ('" . implode("','", $post_types) . "')";
    } 

    $this->dropPostUpdatesTriggers();

    $sql = "create trigger $insertTriggerName after insert on $wpdb->posts
      for each row
      begin
        if new.post_status = 'publish' $post_type_condition then
          insert into $table_name(post_id, post_modified) values (new.ID, new.post_modified);
        end if;
      end;
    ";
    $wpdb->query($sql);

    $sql = "create trigger $updateTriggerName after update on $wpdb->posts
      for each row
      begin
        if new.post_status = 'publish' $post_type_condition then
          insert into $table_name(post_id, post_modified) values (new.ID, new.post_modified);
        end if;
      end;
    ";
    $wpdb->query($sql);

  }

  public function dropPostUpdatesTriggers(){
    global $wpdb;
    foreach ([$this->config['updateTriggerName'], $this->config['insertTriggerName']] as $name) {
      $sql = "DROP TRIGGER IF EXISTS $name";
      $wpdb->query($sql);
    }

  }

}