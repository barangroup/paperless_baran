Tokenize
==========

jQuery Tokenize is a plugin which allows your users to select multiple items from a predefined list or ajax, using autocompletion as they type to find each item. You may have seen a similar type of text entry when filling in the recipients field sending messages on facebook or tags on tumblr.

 - Intuitive UI for selecting multiple items from a large list
 - Easy to skin / style purely in css, no images required
 - Supports any backend which can generate JSON, including PHP, Rails, Django, ASP.net
 - Callbacks when items are added or removed from the list
 - Select, delete and navigate items using the mouse or keyboard
 - Sortable items
 - Support jQuery 1.11+ and jQuery 2+

Documentation and Demo : [http://projects.zellerda.com/tokenize](http://projects.zellerda.com/tokenize)

Changelog
---------
jQuery Tokenize 2.4.1 - 1 June 2015
 - [Issue #36] Fix jquery exception when enter doubles quotes
 - [Issue #35] Fix debounce function
 
jQuery Tokenize 2.4 - 18 May 2015
 - Add sortable option (experimental)
 - [Issue #31] Add new event when an element is added to dropdown

jQuery Tokenize 2.3.2 - 28 April 2015
 - Fix clear method

jQuery Tokenize 2.3.1 - 24 April 2015
 - [Issue #22] Add debounce options for Ajax queries
 - [Issue #21] Add current tokenize object for all callback function with e parameter

jQuery Tokenize 2.3 - 09 February 2015
 - [Issue #15] Add enable and disable method for api
 
jQuery Tokenize 2.2.2 - 29 December 2014
 - [Issue #14] Fix adding tokens from Ajax when newElements is false
 - [Issue #13] Add clear method
 - Change search input background color to transparent
 - Add placeholder and displayDropdownOnFocus options
 - Remove maxlength option to the input if searchMaxLength is 0
 
jQuery Tokenize 2.2.1 - 21 October 2014
 - [Issue #3] Fix whitespace in code

jQuery Tokenize 2.2 - 21 October 2014
 - [Issue #1] Fix maxElements configuration was enforced across all objects in document
 - [Issue #2] Fix the display of "x" for non UTF-8 websites

jQuery Tokenize 2.1 - 7 August 2014
 - Fix loading of multiple dom elements
 - Add JSONP support
 - Add options to personalize fields
 - Add loop when move in drop down
 - Remove validator option

jQuery Tokenize 2.0 - 7 October 2013
 - Add callbacks
 - Add maxElements option
 - Fix missing add token on click when only one element
 - Fix box width - Use css instead
 - Fix add default token execute onAddToken

jQuery Tokenize 1.0 - 26 February 2013
 - Fix backspace key to close the drop down
 - Fix dropdown background
 - Fix drop down item height when is less than options.size
 - Fix click event out off the control
 - Fix click on input when the last pending delete is deleted

jQuery Tokenize beta-0.1 - 3 April 2012
 - First version