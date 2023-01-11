<?php

require_once( dirname(__FILE__, 2) . '/utils.php' );
echo "Refreshing hours cache. This can take up to 30 seconds...\n";
echo json_encode(UCDLibPluginLocationsUtils::refreshAllHours(), JSON_PRETTY_PRINT);
echo "\nComplete\n";