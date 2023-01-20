<?php

require_once( dirname(__FILE__, 2) . '/utils.php' );
echo "Deleting transients...";
UCDLibPluginLocationsUtils::deleteTransients();
echo "\nComplete\n";