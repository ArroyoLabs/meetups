# ToroPHP

Toro is a tiny framework for PHP that lets you prototype web applications quickly.

* [Toro Home Page](http://toroweb.org)

## The Primordial Application

The canonical "Hello, world" example:

    require_once 'toro.php';
    
    class MainHandler extends ToroHandler {
        public function get() { 
            echo 'Hello, world';
        }
    }
    
    $site = new ToroApplication(array(
        array('/', 'MainHandler')
    ));
    
    $site->serve();

## A Substantial Application

Here is a slightly more advanced application garnished with pseudocode:

    require_once 'toro.php';

    class BlogHandler extends ToroHandler {
        public function get() { 
            echo 'This the front page of the blog. Load all articles.';
        }

        public function get_mobile() {
            // _mobile => fires if iPhone/Android/webOS is detected
            echo 'Load a subset of the articles.';
        }
    }

    class ArticleHandler extends ToroHandler {
        public function get($slug) {
            echo 'Load an article that matches the slug: ' . $slug;
        }
    }

    class CommentHandler extends ToroHandler {
        public function post($slug) {
            echo 'Validate slug - redirect if not found.';
            echo 'Peek into $_POST, save the comment, and redirect.';
        }

        public function post_xhr($slug) {
            // _xhr => fires if XHR request is detected
            echo 'Validate, save, and return a JSON blob.';
        }
    }

    class SyndicationHandler extends ToroHandler {
        public function get() {
            echo 'Display some recent entries in RSS/Atom.';
        }
    }

    $site = new ToroApplication(array(
        array('/', 'BlogHandler'),
        array('article/([a-zA-Z0-9_]+)', 'ArticleHandler'),
        array('comment/([a-zA-Z0-9_]+)', 'CommentHandler'),
        array('feed', 'SyndicationHandler')
    ));

    $site->serve();


## Toro Hooks

There are 4 possible hooks (callbacks).

    ToroHook::add('before_request', function() {});
    ToroHook::add('before_handler', function() {});
    ToroHook::add('after_handler',  function() {});
    ToroHook::add('after_request',  function() {});

While you can hook before\_handler and after\_handler anywhere, like index.php, most people will probably want to use it in a handler's constructor:

    class SomeHandler extends ToroHandler {
        public function __construct() {
            ToroHook::add('before_handler', function() { echo 'before'; });
            ToroHook::add('after_handler', function() { echo 'after'; });
        }

        public function get() {
            echo 'I am some handler.';
        }
    }

Adding a hook pushes the function into an array. When a particular hook is fired, all of the functions are fired in the appropriate order. 

ToroHook was provided by [Danillo César de O. Melo](https://github.com/danillos/fire_event/blob/master/Event.php). ToroHook will be the foundation for the future plugin system.

## Installation

Grab the source and copy toro.php to your htdocs or lib directory directory.

Couch the following in your Apache configuration or .htaccess:

    RewriteEngine on
    RewriteCond $1 !^(index\.php)
    RewriteRule ^(.*)$ index.php/$1 [L]

## Roadmap

The immediate plan is to complete the following:

* Add more example projects.
* Add more documentation.
* Setup a mailing list.

Toro is intended to be a minimal framework to help you organize and prototype your next PHP application. One of the project's goals is to make sure the source stays lean.