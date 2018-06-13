<?php
// http://stackoverflow.com/questions/29056472/google-recaptcha-2-fatal-error-class-recaptcha-requestmethod-post-not-found
/**
 * Use to autoload needed classes without Composer.
 *
 * @param string $class The fully-qualified class name.
 * @return void
 */
spl_autoload_register(function ($class) {
    // project-specific namespace prefix
    //$prefix = 'Abraham\\TwitterOAuth\\';
		$prefix = 'ReCaptcha\\';
		
    // base directory for the namespace prefix
    //$base_dir = __DIR__ . '/src/';
		$base_dir = __DIR__ . '\\src\\ReCaptcha\\';
		
    // does the class use the namespace prefix?
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        // no, move to the next registered autoloader
        return;
    }
    // get the relative class name
    $relative_class = substr($class, $len);
    // replace the namespace prefix with the base directory, replace namespace
    // separators with directory separators in the relative class name, append
    // with .php
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
    // if the file exists, require it
    if (file_exists($file)) {
        require $file;
    }
});