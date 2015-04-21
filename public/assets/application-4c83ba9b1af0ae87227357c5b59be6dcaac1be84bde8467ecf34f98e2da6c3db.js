/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
/* =============================================================
 * bootstrap-typeahead.js v2.3.1-j6
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    if (this.options.target) this.$target = $(this.options.target)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.source = this.options.source
    this.strict = this.options.strict
    this.$menu = $(this.options.menu)
    this.shown = false

    if (typeof this.source == 'string') {
        this.url = this.source
        this.source = this.searchAjax
    }
    
    if (element.nodeName == 'SELECT') this.replaceSelect()

    this.text = this.$element.val()
    
    this.$element
      .attr('data-text', this.value)
      .attr('autocomplete', "off")
      
    if (typeof this.$target != 'undefined') this.$element.attr('data-value', this.$target.val())
      else if (typeof this.$element.attr('data-value') == 'undefined') this.$element.attr('data-value', this.strict ? '' : this.value)
    
    this.$menu.css('min-width', this.$element.width() + 12)

    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , replaceSelect: function () {
      this.$target = this.$element
      this.$element = $('<input type="text" />')
      
      this.source = {}
      this.strict = true
      
      var options = this.$target.find('option')
      var $option;
      for (var i=0; i<options.length; i++) {
        $option = $(options[i]);
        if ($option.val() === '') {
          this.$element.attr('placeholder', $option.html());
          continue;
        }
        
        this.source[$option.val()] = $option.html()
        if (this.$target.val() == $option.val()) this.$element.val($option.html())
      }
      
      var attr = this.$target[0].attributes
      for (i=0; i<attr.length; i++) {
        if (attr[i].nodeName != 'type' && attr[i].nodeName != 'name' && attr[i].nodeName != 'id' && attr[i].nodeName != 'data-provide' && !attr[i].nodeName.match(/^on/)) {
          this.$element.attr(attr[i].nodeName, attr[i].nodeValue)
        }
      }

      this.$element.insertAfter(this.$target)
      if (this.$target.attr('autofocus')) this.$element.trigger('focus').select()
      this.$target.attr('autofocus', false)
      this.$target.hide()
    }
  
  , destroyReplacement: function () {
      // Detroy replacement element, so it doesn't mess up the browsers autofill on refresh
      if (typeof this.$target != 'undefined' && this.$target[0].nodeName == 'SELECT') {
        this.$element.replaceWith('');
      }
    }
  
  , select: function () {
      var li = this.$menu.find('.active')
        , val = li.attr('data-value')
        , text = li.find('.item-text').length > 0 ? li.find('.item-text').text() : li.text()

      val = this.updater(val, 'value')
      text = this.updater(text, 'text')

      this.$element
        .val(text)
        .attr('data-value', val)
      
      this.text = text
      
      if (typeof this.$target != 'undefined') {
        this.$target
          .val(val)
          .trigger('change')
      }
      
      this.$element.trigger('change')
      
      return this.hide()
    }

  , updater: function (text, type) {
      return text
    }

  , show: function () {
      var pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu
        .insertAfter(this.$element)
        .css({
          top: pos.top + pos.height
        , left: pos.left
        })
        .show()

      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var items

      this.query = this.$element.val()

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source
      
      return items ? this.process(items) : this
    }

  , process: function (items) {
      return $.isArray(items) ? this.processArray(items) : this.processObject(items)
    }
    
  , processArray: function (items) {
      var that = this

      items = $.grep(items, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , processObject: function (itemsIn) {
      var that = this
        , items = {}
        , i = 0

      $.each(itemsIn, function (key, item) {
        if (that.matcher(item)) items[key] = item
      })

      items = this.sorter(items)

      if ($.isEmptyObject(items)) {
        return this.shown ? this.hide() : this
      }
      
      $.each(items, function(key, item) {
        if (i++ >= that.options.items) delete items[key]
      })
      
      return this.render(items).show()
    }

  , searchAjax: function (query, process) {
      var that = this
      
      if (this.ajaxTimeout) clearTimeout(this.ajaxTimeout)

      this.ajaxTimeout = setTimeout(function () {
        if (that.ajaxTimeout) clearTimeout(that.ajaxTimeout)

        if (query === "") {
          that.hide()
          return
        }

        $.get(that.url, {'q': query, 'limit': that.options.items }, function (items) {
          if (typeof items == 'string') items = JSON.parse(items)
          process(items)
        })
      }, this.options.ajaxdelay)
  }
  
  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      return $.isArray(items) ? this.sortArray(items) : this.sortObject(items)  
    }

  , sortArray: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , sortObject: function (items) {
      var sorted = {}
        , key;
        
      for (key in items) {
        if (!items[key].toLowerCase().indexOf(this.query.toLowerCase())) {
          sorted[key] = items[key];
          delete items[key]
        }
      }
      
      for (key in items) {
        if (~items[key].indexOf(this.query)) {
          sorted[key] = items[key];
          delete items[key]
        }
      }

      for (key in items) {
        sorted[key] = items[key]
      }

      return sorted
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this
        , list = $([])
      
      $.map(items, function (item, value) {
        if (list.length >= that.options.items) return
        
        var li
          , a
        
        if ($.isArray(items)) value = item
        
        li = $(that.options.item)
        a = li.find('a').length ? li.find('a') : li
        a.html(that.highlighter(item))
        
        li.attr('data-value', value)
        if (li.find('a').length === 0) li.addClass('dropdown-header')
        
        list.push(li[0])
      })

      list.not('.dropdown-header').first().addClass('active')
      
      this.$menu.html(list)
      
      return this
    }
    
  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.nextAll('li:not(.dropdown-header)').first()

      if (!next.length) {
        next = $(this.$menu.find('li:not(.dropdown-header)')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prevAll('li:not(.dropdown-header)').first()

      if (!prev.length) {
        prev = this.$menu.find('li:not(.dropdown-header)').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('change',   $.proxy(this.change, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        .on('mouseleave', 'li', $.proxy(this.mouseleave, this))
        
      $(window).on('unload', $.proxy(this.destroyReplacement, this))
    }

  , eventSupported: function(eventName) {
      var isSupported = eventName in this.$element
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;')
        isSupported = typeof this.$element[eventName] === 'function'
      }
      return isSupported
    }

  , move: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break
          
        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27])
      this.move(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return
      this.move(e)
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , change: function (e) {
      var value
      
      if (this.$element.val() != this.text) {
        value = this.$element.val() === '' || this.strict ? '' : this.$element.val()
            
        this.$element.val(value)
        this.$element.attr('data-value', value)
        this.text = value
        if (typeof this.$target != 'undefined') this.$target.val(value)
      }
    }

  , focus: function (e) {
      this.focused = true
    }
    
  , blur: function (e) {
      this.focused = false
      if (!this.mousedover && this.shown) this.hide()
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
      this.$element.focus()
    }

  , mouseenter: function (e) {
      this.mousedover = true
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  , mouseleave: function (e) {
      this.mousedover = false
      if (!this.focused && this.shown) this.hide()
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  var old = $.fn.typeahead

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  , ajaxdelay: 400
  , minLength: 1
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD NO CONFLICT
  * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old
    return this
  }


 /* TYPEAHEAD DATA-API
  * ================== */

  $(document)
    .off('focus.typeahead.data-api')  // overwriting Twitter's typeahead 
    .on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
      var $this = $(this)
      if ($this.data('typeahead')) return
      if ($this.is('select')) $this.attr('autofocus', true)
      e.preventDefault()
      $this.typeahead($this.data())
  })

}(window.jQuery);
/* ===========================================================
 * bootstrap-inputmask.js j2
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Based on Masked Input plugin by Josh Bush (digitalbush.com)
 * ===========================================================
 * Copyright 2012 Jasny BV, Netherlands.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

!function ($) {

  "use strict"; // jshint ;_;

  var isIphone = (window.orientation !== undefined),
      isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1


 /* INPUTMASK PUBLIC CLASS DEFINITION
  * ================================= */

  var Inputmask = function (element, options) {
    if (isAndroid) return // No support because caret positioning doesn't work on Android
    
    this.$element = $(element)
    this.options = $.extend({}, $.fn.inputmask.defaults, options)
    this.mask = String(options.mask)
    
    this.init()
    this.listen()
        
    this.checkVal() //Perform initial check for existing values
  }

  Inputmask.prototype = {
    
    init: function() {
      var defs = this.options.definitions
      var len = this.mask.length

      this.tests = [] 
      this.partialPosition = this.mask.length
      this.firstNonMaskPos = null

      $.each(this.mask.split(""), $.proxy(function(i, c) {
        if (c == '?') {
          len--
          this.partialPosition = i
        } else if (defs[c]) {
          this.tests.push(new RegExp(defs[c]))
          if(this.firstNonMaskPos === null)
            this.firstNonMaskPos =  this.tests.length - 1
        } else {
          this.tests.push(null)
        }
      }, this))

      this.buffer = $.map(this.mask.split(""), $.proxy(function(c, i) {
        if (c != '?') return defs[c] ? this.options.placeholder : c
      }, this))
      
      this.focusText = this.$element.val()

      this.$element.data("rawMaskFn", $.proxy(function() {
        return $.map(this.buffer, function(c, i) {
          return this.tests[i] && c != this.options.placeholder ? c : null
        }).join('')
      }, this))
    },
    
    listen: function() {
      if (this.$element.attr("readonly")) return

      var pasteEventName = (navigator.userAgent.match(/msie/i) ? 'paste' : 'input') + ".mask"

      this.$element
        .on("unmask", $.proxy(this.unmask, this))
        
        .on("focus.mask", $.proxy(this.focusEvent, this))
        .on("blur.mask", $.proxy(this.blurEvent, this))
        
        .on("keydown.mask", $.proxy(this.keydownEvent, this))
        .on("keypress.mask", $.proxy(this.keypressEvent, this))

        .on(pasteEventName, $.proxy(this.pasteEvent, this))
    },

    //Helper Function for Caret positioning
    caret: function(begin, end) {
      if (this.$element.length === 0) return
      if (typeof begin == 'number') {
        end = (typeof end == 'number') ? end : begin
        return this.$element.each(function() {
          if (this.setSelectionRange) {
            this.setSelectionRange(begin, end)
          } else if (this.createTextRange) {
            var range = this.createTextRange()
            range.collapse(true)
            range.moveEnd('character', end)
            range.moveStart('character', begin)
            range.select()
          }
        })
      } else {
        if (this.$element[0].setSelectionRange) {
          begin = this.$element[0].selectionStart
          end = this.$element[0].selectionEnd
        } else if (document.selection && document.selection.createRange) {
          var range = document.selection.createRange()
          begin = 0 - range.duplicate().moveStart('character', -100000)
          end = begin + range.text.length
        }
        return {
          begin: begin, 
          end: end
        }
      }
    },
    
    seekNext: function(pos) {
      var len = this.mask.length
      while (++pos <= len && !this.tests[pos]);
      
      return pos
    },
    
    seekPrev: function(pos) {
      while (--pos >= 0 && !this.tests[pos]);
      
      return pos
    },

    shiftL: function(begin,end) {
      var len = this.mask.length
      
      if(begin<0) return
      
      for (var i = begin,j = this.seekNext(end); i < len; i++) {
        if (this.tests[i]) {
          if (j < len && this.tests[i].test(this.buffer[j])) {
            this.buffer[i] = this.buffer[j]
            this.buffer[j] = this.options.placeholder
          } else
            break
          j = this.seekNext(j)
        }
      }
      this.writeBuffer()
      this.caret(Math.max(this.firstNonMaskPos, begin))
    },

    shiftR: function(pos) {
      var len = this.mask.length
      
      for (var i = pos, c = this.options.placeholder; i < len; i++) {
        if (this.tests[i]) {
          var j = this.seekNext(i)
          var t = this.buffer[i]
          this.buffer[i] = c
          if (j < len && this.tests[j].test(t))
            c = t
          else
            break
        }
      }
    },

    unmask: function() {
      this.$element
        .unbind(".mask")
        .removeData("inputmask")
    },
    
    focusEvent: function() {
      this.focusText = this.$element.val()
      var len = this.mask.length 
      var pos = this.checkVal()
      this.writeBuffer()

      var that = this
      var moveCaret = function() {
        if (pos == len)
          that.caret(0, pos)
        else
          that.caret(pos)
      }

      if ($.browser.msie)
        moveCaret()
      else
        setTimeout(moveCaret, 0)
    },
    
    blurEvent: function() {
      this.checkVal()
      if (this.$element.val() != this.focusText)
        this.$element.trigger('change')
    },
        
    keydownEvent: function(e) {
      var k=e.which

      //backspace, delete, and escape get special treatment
      if (k == 8 || k == 46 || (isIphone && k == 127)) {
        var pos = this.caret(),
        begin = pos.begin,
        end = pos.end
						
        if (end-begin === 0) {
          begin = k!=46 ? this.seekPrev(begin) : (end=this.seekNext(begin-1))
          end = k==46 ? this.seekNext(end) : end
        }
        this.clearBuffer(begin, end)
        this.shiftL(begin,end-1)

        return false
      } else if (k == 27) {//escape
        this.$element.val(this.focusText)
        this.caret(0, this.checkVal())
        return false
      }
    },

    keypressEvent: function(e) {
      var len = this.mask.length
      
      var k = e.which,
      pos = this.caret()

      if (e.ctrlKey || e.altKey || e.metaKey || k<32)  {//Ignore
        return true
      } else if (k) {
        if (pos.end - pos.begin !== 0) {
          this.clearBuffer(pos.begin, pos.end)
          this.shiftL(pos.begin, pos.end-1)
        }

        var p = this.seekNext(pos.begin - 1)
        if (p < len) {
          var c = String.fromCharCode(k)
          if (this.tests[p].test(c)) {
            this.shiftR(p)
            this.buffer[p] = c
            this.writeBuffer()
            var next = this.seekNext(p)
            this.caret(next)
          }
        }
        return false
      }
    },

    pasteEvent: function() {
      var that = this
      
      setTimeout(function() {
        that.caret(that.checkVal(true))
      }, 0)
    },
    
    clearBuffer: function(start, end) {
      var len = this.mask.length
      
      for (var i = start; i < end && i < len; i++) {
        if (this.tests[i])
          this.buffer[i] = this.options.placeholder
      }
    },

    writeBuffer: function() {
      return this.$element.val(this.buffer.join('')).val()
    },

    checkVal: function(allow) {
      var len = this.mask.length
      //try to place characters where they belong
      var test = this.$element.val()
      var lastMatch = -1
      
      for (var i = 0, pos = 0; i < len; i++) {
        if (this.tests[i]) {
          this.buffer[i] = this.options.placeholder
          while (pos++ < test.length) {
            var c = test.charAt(pos - 1)
            if (this.tests[i].test(c)) {
              this.buffer[i] = c
              lastMatch = i
              break
            }
          }
          if (pos > test.length)
            break
        } else if (this.buffer[i] == test.charAt(pos) && i != this.partialPosition) {
          pos++
          lastMatch = i
        }
      }
      if (!allow && lastMatch + 1 < this.partialPosition) {
        this.$element.val("")
        this.clearBuffer(0, len)
      } else if (allow || lastMatch + 1 >= this.partialPosition) {
        this.writeBuffer()
        if (!allow) this.$element.val(this.$element.val().substring(0, lastMatch + 1))
      }
      return (this.partialPosition ? i : this.firstNonMaskPos)
    }
  }

  
 /* INPUTMASK PLUGIN DEFINITION
  * =========================== */

  $.fn.inputmask = function (options) {
    return this.each(function () {
      var $this = $(this)
      , data = $this.data('inputmask')
      if (!data) $this.data('inputmask', (data = new Inputmask(this, options)))
    })
  }

  $.fn.inputmask.defaults = {
    mask: "",
    placeholder: "_",
    definitions: {
      '9': "[0-9]",
      'a': "[A-Za-z]",
      '?': "[A-Za-z0-9]",
      '*': "."
    }
  }

  $.fn.inputmask.Constructor = Inputmask


 /* INPUTMASK DATA-API
  * ================== */

  $(document).on('focus.inputmask.data-api', '[data-mask]', function (e) {
    var $this = $(this)
    if ($this.data('inputmask')) return
    e.preventDefault()
    $this.inputmask($this.data())
  })

}(window.jQuery);
/* ============================================================
 * bootstrap-rowlink.js j1
 * http://jasny.github.com/bootstrap/javascript.html#rowlink
 * ============================================================
 * Copyright 2012 Jasny BV, Netherlands.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */

!function ($) {
  
  "use strict"; // jshint ;_;

  var Rowlink = function (element, options) {
    options = $.extend({}, $.fn.rowlink.defaults, options)
    var tr = element.nodeName.toLowerCase() == 'tr' ? $(element) : $(element).find('tr:has(td)')
    
    tr.each(function() {
      var link = $(this).find(options.target).first()
      if (!link.length) return
      
      var href = link.attr('href')

      $(this).find('td').not('.nolink').click(function() {
        window.location = href;
      })

      $(this).addClass('rowlink')
      link.replaceWith(link.html())
    })
  }

  
 /* ROWLINK PLUGIN DEFINITION
  * =========================== */

  $.fn.rowlink = function (options) {
    return this.each(function () {
      var $this = $(this)
      , data = $this.data('rowlink')
      if (!data) $this.data('rowlink', (data = new Rowlink(this, options)))
    })
  }

  $.fn.rowlink.defaults = {
    target: "a"
  }

  $.fn.rowlink.Constructor = Rowlink


 /* ROWLINK DATA-API
  * ================== */

  $(function () {
    $('[data-provide="rowlink"],[data-provides="rowlink"]').each(function () {
      $(this).rowlink($(this).data())
    })
  })
  
}(window.jQuery);
/* ===========================================================
 * bootstrap-fileupload.js j2
 * http://jasny.github.com/bootstrap/javascript.html#fileupload
 * ===========================================================
 * Copyright 2012 Jasny BV, Netherlands.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

!function ($) {

  "use strict"; // jshint ;_

 /* FILEUPLOAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Fileupload = function (element, options) {
    this.$element = $(element)
    this.type = this.$element.data('uploadtype') || (this.$element.find('.thumbnail').length > 0 ? "image" : "file")
      
    this.$input = this.$element.find(':file')
    if (this.$input.length === 0) return

    this.name = this.$input.attr('name') || options.name

    this.$hidden = this.$element.find('input[type=hidden][name="'+this.name+'"]')
    if (this.$hidden.length === 0) {
      this.$hidden = $('<input type="hidden" />')
      this.$element.prepend(this.$hidden)
    }

    this.$preview = this.$element.find('.fileupload-preview')
    var height = this.$preview.css('height')
    if (this.$preview.css('display') != 'inline' && height != '0px' && height != 'none') this.$preview.css('line-height', height)

    this.original = {
      'exists': this.$element.hasClass('fileupload-exists'),
      'preview': this.$preview.html(),
      'hiddenVal': this.$hidden.val()
    }
    
    this.$remove = this.$element.find('[data-dismiss="fileupload"]')

    this.$element.find('[data-trigger="fileupload"]').on('click.fileupload', $.proxy(this.trigger, this))

    this.listen()
  }
  
  Fileupload.prototype = {
    
    listen: function() {
      this.$input.on('change.fileupload', $.proxy(this.change, this))
      $(this.$input[0].form).on('reset.fileupload', $.proxy(this.reset, this))
      if (this.$remove) this.$remove.on('click.fileupload', $.proxy(this.clear, this))
    },
    
    change: function(e, invoked) {
      if (invoked === 'clear') return
      
      var file = e.target.files !== undefined ? e.target.files[0] : (e.target.value ? { name: e.target.value.replace(/^.+\\/, '') } : null)
      
      if (!file) {
        this.clear()
        return
      }
      
      this.$hidden.val('')
      this.$hidden.attr('name', '')
      this.$input.attr('name', this.name)

      if (this.type === "image" && this.$preview.length > 0 && (typeof file.type !== "undefined" ? file.type.match('image.*') : file.name.match(/\.(gif|png|jpe?g)$/i)) && typeof FileReader !== "undefined") {
        var reader = new FileReader()
        var preview = this.$preview
        var element = this.$element

        reader.onload = function(e) {
          preview.html('<img src="' + e.target.result + '" ' + (preview.css('max-height') != 'none' ? 'style="max-height: ' + preview.css('max-height') + ';"' : '') + ' />')
          element.addClass('fileupload-exists').removeClass('fileupload-new')
        }

        reader.readAsDataURL(file)
      } else {
        this.$preview.text(file.name)
        this.$element.addClass('fileupload-exists').removeClass('fileupload-new')
      }
    },

    clear: function(e) {
      this.$hidden.val('')
      this.$hidden.attr('name', this.name)
      this.$input.attr('name', '')

      //ie8+ doesn't support changing the value of input with type=file so clone instead
      if (navigator.userAgent.match(/msie/i)){ 
          var inputClone = this.$input.clone(true);
          this.$input.after(inputClone);
          this.$input.remove();
          this.$input = inputClone;
      }else{
          this.$input.val('')
      }

      this.$preview.html('')
      this.$element.addClass('fileupload-new').removeClass('fileupload-exists')

      if (e) {
        this.$input.trigger('change', [ 'clear' ])
        e.preventDefault()
      }
    },
    
    reset: function(e) {
      this.clear()
      
      this.$hidden.val(this.original.hiddenVal)
      this.$preview.html(this.original.preview)
      
      if (this.original.exists) this.$element.addClass('fileupload-exists').removeClass('fileupload-new')
       else this.$element.addClass('fileupload-new').removeClass('fileupload-exists')
    },
    
    trigger: function(e) {
      this.$input.trigger('click')
      e.preventDefault()
    }
  }

  
 /* FILEUPLOAD PLUGIN DEFINITION
  * =========================== */

  $.fn.fileupload = function (options) {
    return this.each(function () {
      var $this = $(this)
      , data = $this.data('fileupload')
      if (!data) $this.data('fileupload', (data = new Fileupload(this, options)))
      if (typeof options == 'string') data[options]()
    })
  }

  $.fn.fileupload.Constructor = Fileupload


 /* FILEUPLOAD DATA-API
  * ================== */

  $(document).on('click.fileupload.data-api', '[data-provides="fileupload"]', function (e) {
    var $this = $(this)
    if ($this.data('fileupload')) return
    $this.fileupload($this.data())
      
    var $target = $(e.target).closest('[data-dismiss="fileupload"],[data-trigger="fileupload"]');
    if ($target.length > 0) {
      $target.trigger('click.fileupload')
      e.preventDefault()
    }
  })

}(window.jQuery);
/*
 * It gets all the information for the selected provider
 * The provider is selected through a checkbox with id [providers_list]
 * Last update: 2015-02-19 by @thiago
 */

var adminShowUpProvider = function() {
  clearMessage("top_page_message");
  var provider_id = $("#providers_list").val();
  cleanUpProvider();
  if (provider_id == "0") {
    return;
  }
  $.ajax({
    type: 'GET',
    url: '/provider_info',
    dataType: "json",
    data: { 
    	'provider_id': provider_id
    },
    success: function(data) {
      if (data.status == "success") {
      	/* picture info begin */
        $("#provider_image_container").hide();
        $("#provider_picture_spin_container").show();
        var image = document.getElementById("provider_main_image");
        image.onload = function() { // always fires the event.
          $("#provider_picture_spin_container").hide();  
          $("#provider_image_container").show();
        };
        image.onerror = function(){
          image.src = "../assets/img/profile_pic/provider_without_picture.png";
        };
        image.src = data.provider.picture_path;
        /* picture info end */
        
        /* personal info begin */
        $("#provider_first_name").val(data.provider.first_name);
        $("#provider_last_name").val(data.provider.last_name);
        $("#provider_expertise").val(data.provider.expertise);
        $("#provider_email").val(data.provider.email);
        $("#provider_phone").val(data.provider.phone);
        $("#provider_abstract").val(data.provider.abstract);
        $("#provider_about").val(data.provider.about);
        $("#provider_admin").prop("checked", data.provider.admin);
        /* personal info end */
        
        /* specialties begin */
        $("#provider_specialty_text").val(data.provider.specialty_text);
				showSpecialties(provider_id);
				/* specialties end */
				
				/* services begin */
        $("#provider_service_text").val(data.provider.service_text);
				showServices(provider_id);
				/* services end */
				
				/* certifications end */
        showCertifications(provider_id);
				/* certifications end */
				
				/* areas end */
        showAreas(provider_id);
				/* areas end */
				
				/* reviews end */
        showReviews(provider_id);
				/* reviews end */
				
				/* policies begin */
        $("#provider_policies").val(data.provider.policies);
        /* policies end */
        
        /* password begin */
        $("#provider_password").val("");
        $("#provider_password_confirmation").val("");
        /* password end */
        
        /* provider schedule begin */
        weekProviderSchedule(data.current_week, data.current_year, provider_id);
        /* provider schedule end */
        
        /* provider active begin */
        $('#provider_active_radio').empty().append(
        	$('<div/>').addClass('btn-group').attr('data-toggle', 'buttons').append(
        		$('<label/>').prop('id', 'provider_active_true').addClass('btn btn-primary ' + (data.provider.active ? 'active' : '')).append(' Active').click(function() {
							$.ajax({
								type: 'GET',
								url: '/toggle_provider_state',
								dataType: "json",
								data: { 
									'provider_id': provider_id,
									'active': 'true'
								},
								success: function(data) {
									if (data.status == "success") {
										$('#provider_active_false').removeClass('active');
										$('#provider_active_true').addClass('active');
									}
									else if (data.status == "fail") {
										alertMessage("top_page_message", "Please, try again.", "warning", false);
									}
								},
								error: function(data) {
									console.log("error");
									console.log(data);
									alertMessage("top_page_message", "Some error happened.", "danger", false);
								}
							});
						})
        	)
        ).append(
        	$('<div/>').addClass('btn-group').attr('data-toggle', 'buttons').append(
        		$('<label/>').prop('id', 'provider_active_false').addClass('btn btn-primary ' + (!data.provider.active ? 'active' : '')).append('Disabled').click(function() {
							$.ajax({
								type: 'GET',
								url: '/toggle_provider_state',
								dataType: "json",
								data: { 
									'provider_id': provider_id,
									'active': 'false'
								},
								success: function(data) {
									if (data.status == "success") {
										$('#provider_active_true').removeClass('active');
										$('#provider_active_false').addClass('active');
									}
									else if (data.status == "fail") {
										alertMessage("top_page_message", "Please, try again.", "warning", false);
									}
								},
								error: function(data) {
									console.log("error");
									console.log(data);
									alertMessage("top_page_message", "Some error happened.", "danger", false);
								}
							});
						})
        	)
        );
        /* provider active end */
        
    	}
    	else if (data.status == "fail") {
    	  alertMessage("top_page_message", "Provider not found.", "warning", false);
    	}
    },
    error: function(data) {
      alertMessage("top_page_message", "Some error happened.", "danger", false);
    	console.log("error");
    	console.log(data);
    }
  });
};

/**
 * if the admin is trying to change the time availability of
 * one provider, so this function is used, basicaly, it substitutes
 * the provider_id for a value in a select, which is the current provider
 * being edited
 * 
 * @params: [provider_id] the provider's id
 *          [cell_id] the time in the shape W_HH_MM, w is the weekday, sunday = 0
 * 
 * @author: Thiago Melo
 * @version: 2015-03-21
 */
var switchProviderTimeAvailabilityAdmin = function(cell_id) {
  if ($("#providers_list").val() != "0") {
    switchProviderTimeAvailability($("#providers_list").val(), cell_id);
  }
  else {
    clearAvailabilityTable();
  }
};

/**
 * this function clears all the time availability table
 * 
 * @params: there is no params
 * 
 * @author: Thiago Melo
 * @version: 2015-03-21
 */
var clearAvailabilityTable = function() {
  var i = 0;
  var j = 0;
  for (i = 6; i <= 20; i++) {
    for (j = 0; j < 7; j++) {
      var hour = i >= 10 ? i.toString() : "0" + i.toString();
      var cell_id_1 = j.toString() + "_" + hour + "_00";
      var cell_id_2 = j.toString() + "_" + hour + "_30";
      $("#" + cell_id_1).addClass("schedule-free");
      $("#" + cell_id_1).removeClass("schedule-blocked").removeClass("danger");
      $("#" + cell_id_2).addClass("schedule-free");
      $("#" + cell_id_2).removeClass("schedule-blocked").removeClass("danger");
    }
  }
};

/**
 * this function fills all the time availability table for a provider
 * 
 * please, don't use this in a provider/client perspective
 * 
 * @params: [provider_id] the provider's id
 * 
 * @author: Thiago Melo
 * @version: 2015-03-21
 */
var fillAvailabilityTable = function(provider_id) {
	if (provider_id != "0") {
    $.ajax({
  		type: 'GET',
  		url: '/provider_time_availability',
  		dataType: "json",
  		data: {
  			'provider_id': provider_id
  		},
  		success: function(data) {
  			if (data.status == "success") {
  				$.each(data.slots_unavailable, function(index, slot) {
				  	$("#" + slot.time).removeClass("schedule-free");
	          $("#" + slot.time).addClass("schedule-blocked").addClass("danger");
				  });
  			}
  			else if (data.status == "fail") {
  				console.log("rapaz, voce ta fazendo merda em algum lugar ai...");
  			}
  		},
  		error: function(data) {
  			console.log("error");
  			console.log(data);
  			alertMessage("top_page_message", "Error, please contact us.", "danger", false);
  		}
  	});
  }
  else {
    clearAvailabilityTable();
  }
};

/*
 * It saves the provider's specialty text under the admin dashboard
 * this is a single field in providers table
 * the text to be saved is in a text input with id [provider_specialty_text]
 * Last update: 2015-02-19 by @thiago
 */
var saveProviderSpecialtyText = function() {
	var provider_id = $("#providers_list").val();
	if ($("#provider_specialty_text").val() === "" || $("#provider_specialty_text").val() === undefined || provider_id == "0") {
		alertMessage("add_specialty_alert", "Please, type the specialty.", "warning", false);
		$("#provider_specialty_text").focus();
		return;
	}
  $.ajax({
		type: 'GET',
		url: '/update_specialty_text',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
			'specialty_text': $("#provider_specialty_text").val()
		},
		success: function(data) {
			if (data.status == "success") {
				enableEditSpecialties();
			}
			else if (data.status == "fail") {
				alertMessage("top_page_message", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("top_page_message", "Some error happened.", "danger", false);
		}
	});
};

/*
 * It saves the provider's service text under the admin dashboard
 * this is a single field in providers table
 * the text to be saved is in a text input with id [provider_service_text]
 * Last update: 2015-02-19 by @thiago
 */
var saveProviderServiceText = function() {
	var provider_id = $("#providers_list").val();
	if ($("#provider_service_text").val() === "" || $("#provider_service_text").val() === undefined || provider_id == "0") {
		alertMessage("add_service_alert", "Please, type the service.", "warning", false);
		$("#provider_service_text").focus();
		return;
	}
  $.ajax({
		type: 'GET',
		url: '/update_service_text',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
			'service_text': $("#provider_service_text").val()
		},
		success: function(data) {
			if (data.status == "success") {
				enableEditServices();
			}
			else if (data.status == "fail") {
				alertMessage("top_page_message", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("top_page_message", "Some error happened.", "danger", false);
		}
	});
};

/*
 * It saves the provider's policies text under the admin dashboard
 * this is a single field in providers table
 * the text to be saved is in a text input with id [provider_policies]
 * Last update: 2015-02-19 by @thiago
 */
var saveProviderPoliciesText = function() {
	var provider_id = $("#providers_list").val();
	if ($("#provider_policies").val() === "" || $("#provider_policies").val() === undefined || provider_id == "0") {
		alertMessage("add_service_alert", "Please, type the payment & policies text.", "warning", false);
		$("#provider_policies").focus();
		return;
	}
  $.ajax({
		type: 'GET',
		url: '/update_policies_text',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
			'policies': $("#provider_policies").val()
		},
		success: function(data) {
			if (data.status == "success") {
				enableEditPolicies();
			}
			else if (data.status == "fail") {
				alertMessage("top_page_message", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("top_page_message", "Some error happened.", "danger", false);
		}
	});
};

/*
 * When no one client is selected, the fields must remain empty
 * this is most used when the empty option is used in the
 * selectbox is chosen
 * it will basically clear all the fields under provider's tab in the
 * admin dashboard
 * Last update: 2015-02-19 by @thiago
 */
var cleanUpProvider = function() {
  /* picture */
  var image = document.getElementById("provider_main_image");
  image.src = "../assets/img/profile_pic/provider_without_picture.png";
  /* personal */
  $("#provider_first_name").val("");
  $("#provider_last_name").val("");
  $("#provider_expertise").val("");
  $("#provider_email").val("");
  $("#provider_phone").val("");
  $("#provider_abstract").val("");
  $("#provider_about").val("");
  $("#provider_admin").prop("checked", false);
  /* specialties */
  $("#provider_specialty_text").val("");
  $("#specialties_list").html("");
  /* services */
  $("#provider_service_text").val("");
  $("#services_list").html("");
  /* certifications */
  $("#certifications_list").html("");
  /* areas */
  $("#areas_list").html("");
  /* reviews */
  $("#reviews_list").html("");
  /* policies */
  $("#provider_policies").val("");
  /* password */
  $("#provider_password").val("");
  $("#provider_password_confirmation").val("");
  clearAvailabilityTable();
};

/*
 * This is used only in the admin's dashboard
 * it is the final step of upload a picture.
 * it differs from the provider's dashboard behavior, here it'll be need
 * two steps:
 * 1 - choose the picture and get a preview
 * 2 - upload the picture (which is what this method does)
 * Last update: 2015-02-19 by @thiago
 */
var uploadProviderPicture = function() {
  clearMessage("top_page_message");
  var input_pictures = document.getElementById('provider_picture_file').files;
  var provider_id = $("#providers_list").val();
  if (provider_id == "0") {
    cleanUpProvider();
    return;
  }
  if (!!input_pictures[0].type.match(/image.*/)) {
		var formData = new FormData();
		formData.append("provider_id", provider_id);
		formData.append("image", input_pictures[0]);
		$("#upload_button").html("<i class=\"fa fa-spinner fa-spin\"></i> Uploading");
		/* big master pog ever in my life, I've no idea wtf is this */
		document.getElementById("upload_button").style.left = document.getElementById("upload_button").offsetLeft;
		$.ajax({
			url: "/upload_provider_picture",
			type: 'POST',
			data: formData,
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			beforeSend: function(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')) },
			success: function(response) {
				if (response.status == "success") {
					alertMessage("top_page_message", "Provider picture updated.", "success", false);
				}
				else if (response.status == "fail") {
					alertMessage("top_page_message", "Try again.", "warning", false);
					console.log(response.error);
				}
				$("#upload_button").html("<i class=\"fa fa-cloud-upload\"></i> Upload Picture");
			},
			error: function(response) {
				console.log("error");
				console.log(response);
				alertMessage("top_page_message", "A huge error happened.", "danger", false);
				console.log(response.error);
			}
		});
	}
};

/*
 * When something is changed in the subtab personal info, under provider's tab
 * in the admin's dashboard, this is the methos called for the [save] button
 * if some other field [new_field] is created, the following pattern:
 * 'provider[new_field]': $("#provider_new_field").val(),
 * must be used
 * Last update: 2015-02-19 by @thiago
 */
var saveProviderPersonalInfo = function() {
  clearMessage("top_page_message");
  if (validateProviderEdit()) {
    $.ajax({
      type: 'GET',
      url: '/update_provider_info',
      dataType: "json",
      data: { 
      	'provider_id': $("#providers_list").val(),
      	'provider[first_name]': $("#provider_first_name").val(),
      	'provider[last_name]': $("#provider_last_name").val(),
      	'provider[email]': $("#provider_email").val(),
      	'provider[phone]': $("#provider_phone").val(),
      	'provider[expertise]': $("#provider_expertise").val(),
      	'provider[abstract]': $("#provider_abstract").val(),
      	'provider[about]': $("#provider_about").val(),
      	'provider[admin]': ($("#provider_admin").prop("checked") ? "true" : "false")
      },
      success: function(data) {
        if (data.status == "success") {
          alertMessage("top_page_message", "Provider updated.", "success", false);
      	}
      	else if (data.status == "fail") {
      	  alertMessage("top_page_message", "Provider not found.", "warning", false);
      	}
      },
      error: function(data) {
        alertMessage("top_page_message", "Some error happened.", "danger", false);
      	console.log("error");
      	console.log(data);
      }
    });
  }
};

/*
 * It is used to save a provider's password, since it is under the admin's
 * dashboard, the current password is not asked
 * there are admin's authentication in the server side before execute this
 * action
 * Last update: 2015-02-19 by @thiago
 */
var changeProviderPassword = function() {
	clearMessage("top_page_message");
	if (!validPassword($("#provider_password").val()) || !validPassword($("#provider_password_confirmation").val()) || $("#provider_password").val() != $("#provider_password_confirmation").val()) {
		$("#provider_password_confirmation").val("");
		$("#provider_password").val("");
		$("#provider_password").focus();
		alertMessage("top_page_message", "Invalid passwords.", "warning", false);
		return;
	}
	
	$.ajax({
    type: 'GET',
    url: '/change_provider_password',
    dataType: "json",
    data: { 
    	'provider_id': $("#providers_list").val(),
    	'provider[password]': $("#provider_password").val(),
    	'provider[password_confirmation]': $("#provider_password_confirmation").val()
    },
    success: function(data) {
      if (data.status == "success") {
        alertMessage("top_page_message", "Provider password updated.", "success", false);
    	}
    	else if (data.status == "fail") {
    	  alertMessage("top_page_message", "Provider not found.", "warning", false);
    	}
    	$("#provider_password").val("");
  		$("#provider_password_confirmation").val("");
    },
    error: function(data) {
      alertMessage("top_page_message", "Some error happened.", "danger", false);
    	console.log("error");
    	console.log(data);
    }
  });
};


/*
 * It generates a 6 character length string, only numbers from 0 to 9
 * Last update: 2015-02-19 by @thiago
 */
var generatePasswordProvider = function() {
	var password = getRandomArbitrary(0, 9) + getRandomArbitrary(0, 9) + getRandomArbitrary(0, 9) + 
									getRandomArbitrary(0, 9) + getRandomArbitrary(0, 9) + getRandomArbitrary(0, 9);
	$("#provider_password").val(password);
	$("#provider_password_confirmation").val(password);
};

/*
 * It generates a random number between min and max (params)
 * ->the returned value is a string
 *
 * params:
 * @min integer
 * @mas integer
 * Last update: 2015-02-19 by @thiago
 */
var getRandomArbitrary = function(min, max) {
  var number = Math.random() * (max - min) + min;
  number = parseInt(number, 10);
  return number.toString();
};


var current_provider_input;
var current_provider_id;
var uploadProviderPictureSelf = function(provider_id, input) {
	current_provider_input = input;
	current_provider_id = provider_id;
	showImageToProvider(input);
	$("#provider_image_container_buttons").show();
	//$("#provider_image_preview_modal").modal("show");
};
	
var uploadProviderPictureSelfCancel = function() {
	$('#provider_main_image').attr('src', current_provider_image);
	$("#provider_image_container_buttons").hide();
};

var uploadProviderPictureSelfGo = function() {
	var input = current_provider_input;
	var provider_id = current_provider_id;
	//$("#provider_image_preview_modal").modal("hide");
  clearMessage("top_page_message");
  //showImageToProvider(input);
  //alert("OK 1")
  $("#provider_image_container").hide();
  //alert("OK 2")
  $("#provider_picture_spin_container").html("<i class=\"fa fa-spinner fa-spin fa-5x\"></i>");
  //alert("OK 3")
  //show();
  
  var input_pictures = document.getElementById('provider_picture_file').files;
  if (provider_id == "0") {
    cleanUpProvider();
    return;
  }
  if (!!input_pictures[0].type.match(/image.*/)) {
		var formData = new FormData();
		formData.append("provider_id", provider_id);
		formData.append("image", input_pictures[0]);
		$.ajax({
			url: "/upload_provider_picture",
			type: 'POST',
			data: formData,
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			beforeSend: function(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')) },
			success: function(response) {
				if (response.status == "success") {
					alertMessage("top_page_message", "Provider picture updated.", "success", false);
					$("#provider_image_container_buttons").hide();
					//showImageToProvider(input);
  				$("#provider_picture_spin_container").hide();
          $("#provider_image_container").show();
				}
				else if (response.status == "fail") {
					alertMessage("top_page_message", "Try again.", "warning", false);
					console.log(response.error);
				}
			},
			error: function(response) {
				console.log("error");
				console.log(response);
				alertMessage("top_page_message", "A huge error happened.", "danger", false);
				console.log(response.error);
			}
		});
	}
};



/* ---------------------------------------------------------------------- */

var showSpecialties = function(provider_id) {
	$.ajax({
		type: 'GET',
		url: '/provider_specialties',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
		},
		success: function(data) {
			if (data.status == "success") {
				var content = "";
				content = content + "<div class=\"col-sm-5 col-sm-offset-1\">";
				$.each(data.specialties, function(i, specialty) {
					if (i < data.specialties.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + specialty.specialty;
						content = content + "	<button type=\"button\" onclick=\"deleteSpecialtyToProvider(" + specialty.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				content = content + "<div class=\"col-sm-5\">";
				$.each(data.specialties, function(i, specialty) {
					if (i >= data.specialties.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + specialty.specialty;
						content = content + "	<button type=\"button\" onclick=\"deleteSpecialtyToProvider(" + specialty.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				$("#specialties_list").html(content);
			}
			else if (data.status == "fail") {
				alertMessage("top_page_message", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("top_page_message", "Some error happened.", "danger", false);
		}
	});
};

var addSpecialtyToProvider = function() {
	var provider_id = $("#providers_list").val();
	if ($("#new_specialty").val() === "" || $("#new_specialty").val() === undefined || provider_id == "0") {
		alertMessage("add_specialty_alert", "Please, type the specialty.", "warning", false);
		$("#new_specialty").focus();
		return;
	}
	clearMessage("add_specialty_alert");
	var specialty = $("#new_specialty").val();
	$("#new_specialty").val("");
	$.ajax({
		type: 'GET',
		url: '/add_specialty_ajax',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
			'specialty': specialty
		},
		success: function(data) {
			if (data.status == "success") {
				showSpecialties(provider_id);
			}
			else if (data.status == "fail") {
				alertMessage("add_specialty_alert", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("add_specialty_alert", "Some error happened.", "danger", false);
		}
	});
};

var deleteSpecialtyToProvider = function(specialty_id) {
	var provider_id = $("#providers_list").val();
	$.ajax({
		type: 'GET',
		url: '/delete_specialty_ajax',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
			'specialty_id': specialty_id
		},
		success: function(data) {
			if (data.status == "success") {
				showSpecialties(provider_id);
			}
			else if (data.status == "fail") {
				alertMessage("add_specialty_alert", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("add_specialty_alert", "Some error happened.", "danger", false);
		}
	});
};



var showServices = function(provider_id) {
	$.ajax({
		type: 'GET',
		url: '/provider_services',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
		},
		success: function(data) {
			if (data.status == "success") {
				var content = "";
				content = content + "<div class=\"col-sm-5 col-sm-offset-1\">";
				$.each(data.services, function(i, service) {
					if (i < data.services.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + service.service;
						content = content + "	<button type=\"button\" onclick=\"deleteServiceToProvider(" + service.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				content = content + "<div class=\"col-sm-5\">";
				$.each(data.services, function(i, service) {
					if (i >= data.services.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + service.service;
						content = content + "	<button type=\"button\" onclick=\"deleteServiceToProvider(" + service.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				$("#services_list").html(content);
			}
			else if (data.status == "fail") {
				alertMessage("top_page_message", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("top_page_message", "Some error happened.", "danger", false);
		}
	});
};

var addServiceToProvider = function() {
	var provider_id = $("#providers_list").val();
	if ($("#new_service").val() === "" || $("#new_service").val() === undefined || provider_id == "0") {
		alertMessage("add_service_alert", "Please, type the service.", "warning", false);
		$("#new_service").focus();
		return;
	}
	clearMessage("add_service_alert");
	var service = $("#new_service").val();
	$("#new_service").val("");
	$.ajax({
		type: 'GET',
		url: '/add_service_ajax',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
			'service': service
		},
		success: function(data) {
			if (data.status == "success") {
				showServices(provider_id);
			}
			else if (data.status == "fail") {
				alertMessage("add_service_alert", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("add_service_alert", "Some error happened.", "danger", false);
		}
	});
};

var deleteServiceToProvider = function(service_id) {
	var provider_id = $("#providers_list").val();
	$.ajax({
		type: 'GET',
		url: '/delete_service_ajax',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
			'service_id': service_id
		},
		success: function(data) {
			if (data.status == "success") {
				showServices(provider_id);
			}
			else if (data.status == "fail") {
				alertMessage("add_service_alert", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("add_service_alert", "Some error happened.", "danger", false);
		}
	});
};



var showCertifications = function(provider_id) {
	$.ajax({
		type: 'GET',
		url: '/provider_certifications',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
		},
		success: function(data) {
			if (data.status == "success") {
				var content = "";
				content = content + "<div class=\"col-sm-5 col-sm-offset-1\">";
				$.each(data.certifications, function(i, certification) {
					if (i < data.certifications.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + certification.certification;
						content = content + "	<button type=\"button\" onclick=\"deleteCertificationToProvider(" + certification.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				content = content + "<div class=\"col-sm-5\">";
				$.each(data.certifications, function(i, certification) {
					if (i >= data.certifications.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + certification.certification;
						content = content + "	<button type=\"button\" onclick=\"deleteCertificationToProvider(" + certification.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				$("#certifications_list").html(content);
			}
			else if (data.status == "fail") {
				alertMessage("top_page_message", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("top_page_message", "Some error happened.", "danger", false);
		}
	});
};

var addCertificationToProvider = function() {
	var provider_id = $("#providers_list").val();
	if ($("#new_certification").val() === "" || $("#new_certification").val() === undefined || provider_id == "0") {
		alertMessage("add_certification_alert", "Please, type the certification.", "warning", false);
		$("#new_certification").focus();
		return;
	}
	clearMessage("add_certification_alert");
	var certification = $("#new_certification").val();
	$("#new_certification").val("");
	$.ajax({
		type: 'GET',
		url: '/add_certification_ajax',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
			'certification': certification
		},
		success: function(data) {
			if (data.status == "success") {
				showCertifications(provider_id);
			}
			else if (data.status == "fail") {
				alertMessage("add_certification_alert", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("add_certification_alert", "Some error happened.", "danger", false);
		}
	});
};

var deleteCertificationToProvider = function(certification_id) {
	var provider_id = $("#providers_list").val();
	$.ajax({
		type: 'GET',
		url: '/delete_certification_ajax',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
			'certification_id': certification_id
		},
		success: function(data) {
			if (data.status == "success") {
				showCertifications(provider_id);
			}
			else if (data.status == "fail") {
				alertMessage("add_certification_alert", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("add_certification_alert", "Some error happened.", "danger", false);
		}
	});
};


var showAreas = function(provider_id) {
	$.ajax({
		type: 'GET',
		url: '/provider_areas',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
		},
		success: function(data) {
			if (data.status == "success") {
				var content = "";
				content = content + "<div class=\"col-sm-5 col-sm-offset-1\">";
				$.each(data.areas, function(i, area) {
					if (i < data.areas.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + area.area;
						content = content + "	<button type=\"button\" onclick=\"deleteAreaToProvider(" + area.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				content = content + "<div class=\"col-sm-5\">";
				$.each(data.areas, function(i, area) {
					if (i >= data.areas.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + area.area;
						content = content + "	<button type=\"button\" onclick=\"deleteAreaToProvider(" + area.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				$("#areas_list").html(content);
			}
			else if (data.status == "fail") {
				alertMessage("top_page_message", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("top_page_message", "Some error happened.", "danger", false);
		}
	});
};

var addAreaToProvider = function() {
	var provider_id = $("#providers_list").val();
	if ($("#new_area").val() === "" || $("#new_area").val() === undefined || provider_id == "0") {
		alertMessage("add_area_alert", "Please, type the area.", "warning", false);
		$("#new_area").focus();
		return;
	}
	clearMessage("add_area_alert");
	var area = $("#new_area").val();
	$("#new_area").val("");
	$.ajax({
		type: 'GET',
		url: '/add_area_ajax',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
			'area': area
		},
		success: function(data) {
			if (data.status == "success") {
				showAreas(provider_id);
			}
			else if (data.status == "fail") {
				alertMessage("add_area_alert", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("add_area_alert", "Some error happened.", "danger", false);
		}
	});
};

var deleteAreaToProvider = function(area_id) {
	var provider_id = $("#providers_list").val();
	$.ajax({
		type: 'GET',
		url: '/delete_area_ajax',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
			'area_id': area_id
		},
		success: function(data) {
			if (data.status == "success") {
				showAreas(provider_id);
			}
			else if (data.status == "fail") {
				alertMessage("add_area_alert", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("add_area_alert", "Some error happened.", "danger", false);
		}
	});
};

var showReviews = function(provider_id) {
	$.ajax({
		type: 'GET',
		url: '/provider_reviews',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
		},
		success: function(data) {
			if (data.status == "success") {
				var content = "";
				content = content + "<div class=\"col-sm-5 col-sm-offset-1\">";
				$.each(data.reviews, function(i, review) {
					if (i < data.reviews.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<button type=\"button\" onclick=\"deleteReviewToProvider(" + review.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "	<blockquote>";
						content = content + "		<p class=\"paragraph_bottom\">" + review.review + "</p>";
						content = content + "		<footer>" + review.author + "</footer>";
						content = content + "	</blockquote>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				content = content + "<div class=\"col-sm-5\">";
				$.each(data.reviews, function(i, review) {
					if (i >= data.reviews.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<button type=\"button\" onclick=\"deleteReviewToProvider(" + review.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "	<blockquote>";
						content = content + "		<p class=\"paragraph_bottom\">" + review.review + "</p>";
						content = content + "		<footer>" + review.author + "</footer>";
						content = content + "	</blockquote>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				$("#reviews_list").html(content);
			}
			else if (data.status == "fail") {
				alertMessage("top_page_message", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("top_page_message", "Some error happened.", "danger", false);
		}
	});
};

var addReviewToProvider = function() {
	var provider_id = $("#providers_list").val();
	if ($("#new_review_review").val() === "" || $("#new_review_review").val() === undefined || provider_id == "0") {
		alertMessage("add_review_alert", "Please, type the review.", "warning", false);
		$("#new_review_author").focus();
		return;
	}
	if ($("#new_review_author").val() === "" || $("#new_review_author").val() === undefined || provider_id == "0") {
		alertMessage("add_review_alert", "Please, type the author.", "warning", false);
		$("#new_review_author").focus();
		return;
	}
	clearMessage("add_review_alert");
	var review = $("#new_review_review").val();
	var author = $("#new_review_author").val();
	$("#new_review_review").val("");
	$("#new_review_author").val("");
	$("#new_review").val("");
	$.ajax({
		type: 'GET',
		url: '/add_review_ajax',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
			'review': review,
			'author': author
		},
		success: function(data) {
			if (data.status == "success") {
				
				showReviews(provider_id);
			}
			else if (data.status == "fail") {
				alertMessage("add_review_alert", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("add_review_alert", "Some error happened.", "danger", false);
		}
	});
};

var deleteReviewToProvider = function(review_id) {
	var provider_id = $("#providers_list").val();
	$.ajax({
		type: 'GET',
		url: '/delete_review_ajax',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
			'review_id': review_id
		},
		success: function(data) {
			if (data.status == "success") {
				showReviews(provider_id);
			}
			else if (data.status == "fail") {
				alertMessage("add_review_alert", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("add_review_alert", "Some error happened.", "danger", false);
		}
	});
};


/* create some .... */
var passwordRecovery = function() {
	if (!validEmail($("#password_recovery_email").val())) {
		alertMessage("password_recovery_alert", "Email invalid.", "danger", false);
		return;
	}
	
	$.ajax({
		type: 'GET',
		url: '/password_recovery',
		dataType: "json",
		data: {
			'email': $("#password_recovery_email").val()
		},
		success: function(data) {
			if (data.status == "success") {
				alertMessage("password_recovery_alert", "An email has been sent to you.", "success", false);
			}
			else if (data.status == "fail") {
				alertMessage("password_recovery_alert", "Email not found, please check the spelling.", "danger", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("password_recovery_alert", "Error, please contact us.", "danger", false);
		}
	});
};
/* Appointment */


function Appointment(id, provider_id, client_id, start, end, accepted, client_observation, created_at, updated_at) {
	this.id = id;
	this.provider_id = provider_id;
	this.client_id = client_id;
	this.start = this.parseDate(start);
	this.end = this.parseDate(end);
	this.accepted = accepted;
	this.client_observation = client_observation;
	this.created_at = created_at;
	this.updated_at = updated_at;
}

Appointment.prototype.parseDate = function (dateTime) {
	var yyyy = dateTime.substr(0, 4);
    var mm = dateTime.substr(5, 2);
    var dd = dateTime.substr(8, 2);

    var h = dateTime.substr(11, 2);
    var m = dateTime.substr(14, 2);
    var s = dateTime.substr(17, 2); 
    return new Date(yyyy, parseInt(mm) - 1,dd,h,m,s);
};

/* Schedule Magic */

function Schedule() {
	
}

Schedule.prototype.monthly = function (provider_id, date) {
	var d_month = date.getMonth();
	var d_year = date.getFullYear();
	
	this.provider_id = provider_id;
	this.m_first_day = new Date(d_year, d_month, 1);
	this.c_first_day = new Date(d_year, d_month, 1 - this.m_first_day.getDay());
	this.m_last_day = new Date(d_year, d_month + 1, 0);
	this.c_last_day = new Date(d_year, d_month + 1, 6 - this.m_last_day.getDay());
	this.get_schedule(this.provider_id, this.c_first_day, this.c_last_day, this.callback_month, this);
};

Schedule.prototype.callback_month = function(appointments, self) {
	var o_month = new Monthly(appointments, self.m_first_day, self.m_last_day, self.c_first_day, self.c_last_day);
	o_month.print();
};

Schedule.prototype.weekly = function (provider_id, date) {
	var d_day = date.getDate();
	var d_weekday = date.getDay();

	var d_month = date.getMonth();
	var d_year = date.getFullYear();
	
	this.provider_id = provider_id;

	/* month first day */
	this.m_first_day = new Date(d_year, d_month, 1);
	this.m_last_day = new Date(d_year, d_month + 1, 0);

	this.c_first_day = new Date(d_year, d_month, d_day - d_weekday);
	this.c_last_day = new Date(d_year, d_month, d_day + 6 - d_weekday);

	this.get_schedule(this.provider_id, this.c_first_day, this.c_last_day, this.callback_week, this);
};

Schedule.prototype.callback_week = function(appointments, self) {
	var o_week = new Weekly(appointments, self.m_first_day, self.m_last_day, self.c_first_day, self.c_last_day);
	o_week.print();
};

Schedule.prototype.daily = function (provider_id, date) {
	var d_day = date.getDate();
	var d_weekday = date.getDay();
	var d_month = date.getMonth();
	var d_year = date.getFullYear();
	
	this.provider_id = provider_id;
	this.m_first_day = new Date(d_year, d_month, 1);
	this.c_first_day = new Date(d_year, d_month, d_day);
	this.m_last_day = new Date(d_year, d_month + 1, 0);
	this.c_last_day = new Date(d_year, d_month + 1, d_day);
	this.get_schedule(this.provider_id, this.c_first_day, this.c_last_day, this.callback_day, this);
};

Schedule.prototype.callback_day = function(appointments, self) {
	var o_day = new Daily(appointments, self.m_first_day, self.m_last_day, self.c_first_day, self.c_last_day);
	o_day.print();
};

Schedule.prototype.get_schedule = function(provider_id, datetime_start, datetime_end, callback, self) {
	var appointments = [];

	var s_start = datetime_start.getFullYear() + "-" + ("0" + (datetime_start.getMonth() + 1)).slice(-2) + "-" + ("0" + datetime_start.getDate()).slice(-2) + " 00:00:00"
	var s_end = datetime_end.getFullYear() + "-" + ("0" + (datetime_end.getMonth() + 1)).slice(-2) + "-" + ("0" + datetime_end.getDate()).slice(-2) + " 23:59:59"

	$.ajax({
		type: 'GET',
		url: '/appointments_ajax',
		dataType: "json",
		data: { 
			'id': provider_id,
			'start': s_start,
			'end': s_end
		},
		success: function(data) {
			if (data.status == "success") {
				$.each(data.appointments, function(i, appointment) {
					var s_appointment = new Appointment(appointment.id, appointment.provider_id, appointment.client_id, appointment.start, appointment.end, appointment.accepted, appointment.client_observation, appointment.created_at, appointment.updated_at);
					appointments.push(s_appointment);
				});
				callback(appointments, self);
			}
			else if (data.status == "fail") {
				alertMessage("schedules_body_alert", "Fail loading the appointments, please try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("schedules_body_alert", "Error, please contact us.", "danger", false);
		}
	});
};

/* screens */

function Screens() {
	
}

Screens.prototype.weekday_short = function(day) {
	switch (day) {
		case 0:
			return "Sun";
		case 1:
			return "Mon";
		case 2:
			return "Tue";
		case 3:
			return "Wed";
		case 4:
			return "Thu";
		case 5:
			return "Fri";
		case 6:
			return "Sat";
		default:
			return "Error!";
	}
};

Screens.prototype.month = function(month) {
	switch (parseInt(month)) {
		case 1:
			return "January";
		case 2:
			return "February";
		case 3:
			return "March";
		case 4:
			return "April";
		case 5:
			return "May";
		case 6:
			return "June";
		case 7:
			return "July";
		case 8:
			return "August";
		case 9:
			return "September";
		case 10:
			return "October";
		case 11:
			return "November";
		case 12:
			return "December";
		default:
			return "Error!";
	}
};

Screens.prototype.month_short = function(month) {
	month = parseInt(month);
	if (month >= 1 && month <= 12) {
		return this.month(month).substr(0, 3);
	}
	return this.month(month);
};

Screens.prototype.handle_date_time = function(date, time) {
	var date_part = date.substr(6, 4) + "-" + date.substr(3, 2) + "-" + date.substr(0, 2);
	var time_part = time.substr(0,2) + ":" + time.substr(3, 2);
	return date_part + " " + time_part;
};

/* Monthly */

function Monthly(appointments, m_first_day, m_last_day, c_first_day, c_last_day) {
	//Screens.call(this);
	this.appointments = appointments;
	this.m_first_day = m_first_day;
	this.m_last_day = m_last_day;
	this.c_first_day = c_first_day;
	this.c_last_day = c_last_day;
}

//Monthly.prototype = Object.create(Screen.prototype);

Monthly.prototype.print = function() {
	
	var content = "";
	var a_len = this.appointments.length;
	var o_screen = new Screens();
	var today = new Date();
	today.setHours(0, 0, 0, 0);

	content = content + "<div class=\"table-responsive\">";
	content = content + "	<table class=\"table table-striped table-hover text-center table-bordered\">";
	content = content + "		<thead>";
	content = content + "			<tr>";
	content = content + "				<th class=\"text-center\"><a href=\"javascript: lastSchedule();\"><span class=\"glyphicon glyphicon-chevron-left\"></span></a>";
	content = content + "				</th>";
	content = content + "				<th class=\"text-center\" colspan=\"5\">" + o_screen.month(this.m_first_day.getMonth() + 1) + " of " + this.m_first_day.getFullYear() + "</th>";
	content = content + "				<th class=\"text-center\"><a href=\"javascript: nextSchedule();\"><span class=\"glyphicon glyphicon-chevron-right\"></span></a>";
	content = content + "				</th>";
	content = content + "			</tr>";
	content = content + "			<tr>";
	content = content + "				<th class=\"text-center\">Sun</th>";
	content = content + "				<th class=\"text-center\">Mon</th>";
	content = content + "				<th class=\"text-center\">Tue</th>";
	content = content + "				<th class=\"text-center\">Wed</th>";
	content = content + "				<th class=\"text-center\">Thu</th>";
	content = content + "				<th class=\"text-center\">Fri</th>";
	content = content + "				<th class=\"text-center\">Sat</th>";
	content = content + "			</tr>";
	content = content + "		</thead>";
	content = content + "		<tbody>";
	
	while (this.c_first_day <= this.c_last_day) {
		content = content + "		<tr>";
		for (i = 0; i < 7; i++) {
			var how_many = 0;
			/* Please, change it as soon as possible */
			var dummy_1 = new Date(this.c_first_day.getTime());
			dummy_1.setHours(0, 0, 0, 0);
			var dummy_2 = new Date(this.c_first_day.getTime());
			dummy_2.setHours(23, 59, 59, 0);

			//content = content + "		<td>";
			for (j = 0; j < a_len; j++) {
				if (this.appointments[j].start >= dummy_1 && dummy_2 >= this.appointments[j].end) {
					how_many++;
				}
			}
			
			this.c_first_day.setHours(0, 0, 0, 0);
			//if (how_many < 12 && this.c_first_day.getTime() >= today.getTime()) {
			if (this.c_first_day.getTime() >= today.getTime()) {
				if (this.c_first_day.getTime() == today.getTime()) {
					content = content + "        <td onClick=\"showDate(" + dummy_1.getTime() + ");\" class=\"date_available today\"><b>" + this.c_first_day.getDate() + "</b></td>";
				}
				else if (this.c_first_day >= this.m_first_day && this.c_first_day <= this.m_last_day) {
					content = content + "        <td onClick=\"showDate(" + dummy_1.getTime() + ");\" class=\"date_available\"><b>" + this.c_first_day.getDate() + "</b></td>";
					//content = content + "		<a href=\"javascript: showDate(" + dummy_1.getTime() + ");\"><b>" + this.c_first_day.getDate() + "</b></a>";	
				}
				else {
					content = content + "        <td onClick=\"showDate(" + dummy_1.getTime() + ");\" class=\"date_available\">" + this.c_first_day.getDate() + "</td>";
					//content = content + "		<a href=\"javascript: showDate(" + dummy_1.getTime() + ");\">" + this.c_first_day.getDate() + "</a>";	
				}
			}
			else if (this.c_first_day.getTime() <= today.getTime()) {
				//content = content + "        <td onClick=\"showDate(" + dummy_1.getTime() + ");\" class=\"past_day\">" + this.c_first_day.getDate() + "</td>";
				content = content + "        <td class=\"past_day\">" + this.c_first_day.getDate() + "</td>";
				//content = content + "		<a href=\"javascript: showDate(" + dummy_1.getTime() + ");\">" + this.c_first_day.getDate() + "</a>";	
			}
			
			//content = content + "		</td>";
			this.c_first_day.setDate(this.c_first_day.getDate() + 1);
		}
		content = content + "		</tr>";
	}

	content = content + "		</tbody>";
	content = content + "	</table>";
	content = content + "</div>";
	$("#schedules_container").html(content);
	
};

/* Weekly */

function Weekly(appointments, m_first_day, m_last_day, c_first_day, c_last_day) {
	//Screens.call(this);
	this.appointments = appointments;
	this.m_first_day = m_first_day;
	this.m_last_day = m_last_day;
	this.c_first_day = c_first_day;
	this.c_last_day = c_last_day;
}

//Weekly.prototype = Object.create(Screen.prototype);

Weekly.prototype.print = function() {
	var o_screen = new Screens();
	var content = "";
	var a_len = this.appointments.length;
	var today = new Date();
	var i, j, k, l;

	var c_date = new Date(this.c_first_day.getTime());
	
	content = content + "<div class=\"table-responsive\">";
	
	//content = content + "<div style=\"overflow: scroll; overflow-y: scroll; overflow-x: hidden;\">";
	
	content = content + "	<table class=\"table table-hover text-center table-bordered\">";
	content = content + "		<thead>";
	content = content + "			<tr>";
	content = content + "				<th class=\"text-center\" style=\"width: 12.5%;\"><a href=\"javascript: lastSchedule();\"><span class=\"glyphicon glyphicon-chevron-left\"></span></a>";
	content = content + "				</th>";
	content = content + "				<th class=\"text-center\" colspan=\"6\">";
	content = content + "				" + c_date.getDate() + " " + o_screen.month_short(c_date.getMonth() + 1) + " - " + this.c_last_day.getDate() + " " + o_screen.month_short(this.c_last_day.getMonth() + 1);
	content = content + "				</th>";
	content = content + "				<th style=\"width: 12.5%;\" class=\"text-center\"><a href=\"javascript: nextSchedule();\"><span class=\"glyphicon glyphicon-chevron-right\"></span></a>";
	content = content + "				</th>";
	content = content + "			</tr>";
	content = content + "			<tr>";
	content = content + "				<th style=\"width: 12.5%;\">";
	content = content + "				</th>";
	for (i = 0; i < 7; i++) {
		content = content + "		<th class=\"text-center\" style=\"width: 12.5%;\">" + o_screen.weekday_short(c_date.getDay());
		content = content + "			<br>" + c_date.getDate() + " " + o_screen.month_short(c_date.getMonth() + 1);
		content = content + "		</th>";
		c_date.setDate(c_date.getDate() + 1);
	}
	
	content = content + "			</tr>";
	content = content + "		</thead>";
	//content = content + "  </table>";
	
	//content = content + "</div>";
	
	//content = content + "<div style=\"overflow: scroll; overflow-y: auto; overflow-x: hidden; max-height: 50vh; border-bottom: 1.0px solid #CCC\">";
	
	//content = content + "	<table class=\"table table-striped table-hover text-center table-bordered\">";
	
	
	content = content + "		<tbody>";
	
	for (i = 6; i < 21; i++) {
		for (j = 0; j < 60; j = j + 30) {
			var label = [];
			var time_start = new Date();
			var time_end = new Date();
			var time_next = new Date();

			var cur_day =  new Date(this.c_first_day.getTime());
			for (k = 0; k < 7; k++) {
				var has_event = false;
				var useless = false;
				time_start = new Date(cur_day.getTime());
				time_end = new Date(cur_day.getTime());
				time_next = new Date(cur_day.getTime());
				time_start.setHours(i, j, 0, 0);
				time_end.setHours(i, j + 30, 0, 0);
				time_next.setHours(i, j + 60, 0, 0);
				for (l = 0; l < a_len; l++) {
					if ((this.appointments[l].start <= time_start && this.appointments[l].end >= time_end) ||
						(this.appointments[l].start >= time_start && this.appointments[l].start <= time_end) ||
						(this.appointments[l].end >= time_start && this.appointments[l].end <= time_end)) {
						has_event = true;
						l = a_len;
					}
					else if(this.appointments[l].start >= time_start && this.appointments[l].start >= time_end && this.appointments[l].start <= time_next) {
						useless = true;
					}
				}
				
				if (!has_event && !useless && time_start.getTime() > today.getTime()) {
					label.push("date_available");
				}
				else if (has_event && time_start.getTime() < today.getTime()) {
					label.push("date_unavailable past_day_white");
				}
				else if (has_event) {
					label.push("date_unavailable");
				}
				else if(useless && time_start.getTime() > today.getTime()) {
					label.push("date_useless");	
				}
				else {
					label.push("past_day_white");	
				}
				cur_day.setDate(cur_day.getDate() + 1);
			}

			content = content + "		<tr>";
			if (j == 0 || j  == 0) {
				content = content + "		<td rowspan=\"2\" style=\"width: 12.5%;\" class=\"active\">";
				content = content + "			" + (i < 10 ? "0" + i : i) + ":" + (j < 10 ? "0" + j : j);
				content = content + "		</td>";
			}

			cur_day =  new Date(this.c_first_day.getTime());
			for (k = 0; k < 7; k++) {
				time_start = new Date(cur_day.getTime());
				time_end = new Date(cur_day.getTime());
				time_start.setHours(i, j, 0, 0);
				time_end.setHours(i, j + 15, 0, 0);
				var onClick = "";
				if (label[k] == "date_available") {
					onClick = "onClick=\"$('#appointment_type').val(-1);requestAppointment(" + time_start.getTime() + ")\"";
				}
				
				var time_id = [];
				time_id.push(cur_day.getUTCFullYear());
        time_id.push(cur_day.getUTCMonth() + 1 > 9 ? cur_day.getUTCMonth() + 1 : '0' + (cur_day.getUTCMonth() + 1).toString());
        time_id.push(cur_day.getUTCDate() > 9 ? cur_day.getUTCDate() : '0' + (cur_day.getUTCDate()).toString());
        time_id.push(k.toString());
				
				
				content = content + "			<td  style=\"width: 12.5%;\" id=\"" + time_id.join("_") + "_" + (i < 10 ? "0" + i : i) + "_" + (j < 10 ? "0" + j : j) + "\" " + onClick + " class=\"" + label[k] + "\">";
				content = content + "				";
				content = content + "			</td>";
				cur_day.setDate(cur_day.getDate() + 1);
			}

			content = content + "		</tr>";
		}
	}
	//content = content + "			</tr>";
	content = content + "		</tbody>";
	content = content + "	</table>";
	
	//content = content + "</div>";
	
	content = content + "</div>";
	
	// invalid not available slots
	invalidNotAvailableSlots();
	$("#schedules_container").html(content);	
};

/**
 * this function invalid the time slots where the provider is not available
 * 
 * @params: it is going to access global variables
 * 
 * @author: Thiago Melo (not proud of that)
 * @version: 2015-03-22
 * 
 */
var invalidNotAvailableSlots = function() {
	var provider_id = $("#c_provider_id").val();
	if (provider_id != "0") {
		
		var year = m_current_date.getFullYear();
		var week = getWeekNumber(m_current_date)[1];
		
		var first_day = firstDayOfWeek(year, week);
	  var last_day = new Date(first_day.getTime());
	  last_day.setDate(last_day.getDate() + 6);
	  
		
		$.ajax({
  		type: 'GET',
  		url: '/provider_time_availability',
  		dataType: "json",
  		data: {
  			'provider_id': provider_id,
  			'start': first_day.getTime(),
				'end': last_day.getTime()
  		},
  		success: function(data) {
  			if (data.status == "success") {

  				var i, j;
				  for (i = 6; i <= 20; i++) {
				  	var other_day = new Date(first_day.getTime());
				    for (j = 0; j < 7; j++) {
							var time_id = [];
	            time_id.push(other_day.getUTCFullYear());
	            time_id.push(other_day.getUTCMonth() + 1 > 9 ? other_day.getUTCMonth() + 1 : '0' + (other_day.getUTCMonth() + 1).toString());
	            time_id.push(other_day.getUTCDate() > 9 ? other_day.getUTCDate() : '0' + (other_day.getUTCDate()).toString());
	            time_id.push(j.toString());
	            time_id.push((i > 9 ? '' : '0') + i.toString());
	            var cell_id_1 = time_id.join('_') + '_00';
	            var cell_id_2 = time_id.join('_') + '_30';		    	
				    	var available_1 = true;
				      var available_2 = true;
				      
				      $.each(data.slots_unavailable, function(index, slot) {
						  	if (slot.timeid == cell_id_1) {
						  		available_1 = false;
						  	}
						  	else if (slot.timeid == cell_id_2) {
						  		available_2 = false;
						  	}
						  });
						  
				      if (!available_1) {
				      	$("#" + cell_id_1).removeClass("date_available").addClass("date_unavailable").attr('onclick','').unbind('click');
				      }
				      if (!available_2) {
				      	$("#" + cell_id_2).removeClass("date_available").addClass("date_unavailable").attr('onclick','').unbind('click');
				      }
				      other_day.setDate(other_day.getDate() + 1);
				    }
				  }
  			}
  			else if (data.status == "fail") {
  				console.log("rapaz, voce ta fazendo merda em algum lugar ai...");
  			}
  		},
  		error: function(data) {
  			console.log("error");
  			console.log(data);
  			alertMessage("top_page_message", "Error, please contact us.", "danger", false);
  		}
  	});
	}
};

/* Daily */

function Daily(appointments, m_first_day, m_last_day, c_first_day, c_last_day) {
	this.appointments = appointments;
	this.m_first_day = m_first_day;
	this.m_last_day = m_last_day;
	this.c_first_day = c_first_day;
	this.c_last_day = c_last_day;
}

Daily.prototype.print = function() {
	var o_screen = new Screens();
	var content = "";
	var c_date = new Date(this.c_first_day.getFullYear(), this.c_first_day.getMonth(), this.c_first_day.getDate());
	
	content = content + "<div class=\"table-responsive\">";
	content = content + "	<table class=\"table table-striped table-hover text-center\">";
	content = content + "		<thead>";
	content = content + "			<tr>";
	content = content + "				<th class=\"text-center\"><a href=\"javascript: lastSchedule();\"><span class=\"glyphicon glyphicon-chevron-left\"></span></a>";
	content = content + "				</th>";
	content = content + "				<th class=\"text-center\" colspan=\"5\">" + c_date.getDate() + " de " + o_screen.month(c_date.getMonth() + 1) + " de " + c_date.getFullYear() + "</th>";
	content = content + "				<th class=\"text-center\"><a href=\"javascript: nextSchedule();\"><span class=\"glyphicon glyphicon-chevron-right\"></span></a>";
	content = content + "				</th>";
	content = content + "			</tr>";
	content = content + "		</thead>";
	content = content + "		<tbody>";
	
	for (var i = 6; i < 22; i++) {
		content = content + "		<tr>";
		content = content + "			<td colspan=\"2\">";
		content = content + "				" + (i < 10 ? "0" + i : i) + ":00";
		content = content + "			</td>";
		content = content + "			<td colspan=\"4\">";
		content = content + "				";
		content = content + "			</td>";
		content = content + "			<td>";
		content = content + "				";
		content = content + "			</td>";
		content = content + "		</tr>";
		content = content + "		<tr>";
		content = content + "			<td colspan=\"2\">";
		content = content + "				" + (i < 10 ? "0" + i : i) + ":30";
		content = content + "			</td>";
		content = content + "			<td colspan=\"4\">";
		content = content + "				";
		content = content + "			</td>";
		content = content + "			<td>";
		content = content + "				";
		content = content + "			</td>";
		content = content + "		</tr>";
	}
	
	content = content + "		</tbody>";
	content = content + "	</table>";
	content = content + "</div>";
	$("#schedules_container").html(content);	
};

/* working */

var m_current_date;
var o_schedule = new Schedule();
var request_option = "signup";
var m_is_admin = false;

var loadSchedule = function() {
	if ($("#is_admin").val() == "1") {
		m_is_admin = true;
	}
	m_current_date = m_current_date === undefined ? new Date() : m_current_date;
	var provider_id = $("#c_provider_id").val();
	var periodicity = parseInt($("input[name=periodicity]:checked", "#schedules_periodicity").val(), 10);
	switch (periodicity) {
		case 1:
			$("#periodicity_options").hide();
			o_schedule.monthly(provider_id, m_current_date);
			break;
		case 2:
			$("#periodicity_options").show();
			o_schedule.weekly(provider_id, m_current_date);
			break;
		case 3:
			o_schedule.daily(provider_id, m_current_date);
			break;
	}
};

var nextSchedule = function() {
	var provider_id = $("#c_provider_id").val();
	var periodicity = parseInt($("input[name=periodicity]:checked", "#schedules_periodicity").val(), 10);
	switch (periodicity) {
		case 1:
			m_current_date.setMonth(m_current_date.getMonth() + 1);
			o_schedule.monthly(provider_id, m_current_date);
			break;
		case 2:
			//console.log(m_current_date);
			m_current_date.setDate(m_current_date.getDate() + 7);
			//console.log(m_current_date);
			o_schedule.weekly(provider_id, m_current_date);
			break;
		case 3:
			m_current_date.setDate(m_current_date.getDate() + 1);
			o_schedule.daily(provider_id, m_current_date);
			break;
	}
};

var lastSchedule = function() {
	var provider_id = $("#c_provider_id").val();
	var periodicity = parseInt($("input[name=periodicity]:checked", "#schedules_periodicity").val(), 10);
	switch (periodicity) {
		case 1:
			m_current_date.setMonth(m_current_date.getMonth() - 1);
			o_schedule.monthly(provider_id, m_current_date);
			break;
		case 2:
			m_current_date.setDate(m_current_date.getDate() - 7);
			o_schedule.weekly(provider_id, m_current_date);
			break;
		case 3:
			m_current_date.setDate(m_current_date.getDate() - 1);
			o_schedule.daily(provider_id, m_current_date);
			break;
	}
};

var showDate = function(date) {
	m_current_date = new Date(date);
	$('#p_weekly').attr('checked',true);
	loadSchedule();
};

var appointment_types = [];
appointment_types[0] = "Pregnancy Massage";
appointment_types[1] = "Lactation Consultation";
appointment_types[2] = "Birth Doula Consultation";
appointment_types[3] = "PostPartum Doula Consultation";
appointment_types[4] = "Follow-up Visit";

var setAppointmentType = function() {
	$.each(appointment_types, function(index, type) {
		if ($("#appointment_type_" + index).is(":checked")) {
			$("#appointment_type").val(index);
		}
	});
};

var requestAppointment = function(datetime) {
	var q_screens = new Screens();
	var content = "";
	var today = new Date();
	var appointment_type = $("#appointment_type").val();
	
	m_current_date = new Date(datetime);
	
	$("#schedules_title").html("Appointment requesting");

	if (m_current_date.getTime() < today.getTime()) {
		content = content + "        <div class=\"row margin-bottom-30\">";
		content = content + "            <div class=\"col-md-10 col-md-offset-1 mb-margin-bottom-30\">";
		content = content + "                <div class=\"headline\"><h2>Invalid date</h2></div>";
		content = content + "                <p class=\"lead\">This date in valid, please, try another one.<p>";
		content = content + "           </div>";
		content = content + "        </div>";
		$("#schedules_modal_action").html("Close Frame");
		$("#schedules_modal_action").attr("data-dismiss", "modal");
	}
	else if ($("#appointment_type").val() == -1) {
		appointment_type = 0;
		$("#appointment_type").val(0);
		var appointment_types_options = $("<div/>");
		
		$.each(appointment_types, function(index, type) {
			appointment_types_options.append(
				$("<p/>").append(
					$("<label/>").append(
						$("<input/>").prop("type", "radio").prop("id", "appointment_type_" + index).prop("name", "appointment_type_chosen").change(function() {
							setAppointmentType();
						}).attr("checked", appointment_type == index || (appointment_type == -1 && index == 0))
					).append(" " + type)
				)
			);
		});
		
		content = $("<div/>").addClass("row").append(
			$("<div/>").addClass("col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1").append(
				$("<div/>").addClass("headline").append(
					$("<h2/>").append("Booking type")
				)
			).append($("<p/>").append("Please choose the booking type:")).append(appointment_types_options)
		);
		
		$("#c_client_info_filled").val(0);
		$("#schedules_modal_action").html("Continue");
		$("#schedules_modal_action").attr("href", "javascript: requestAppointment(" + datetime + ");");
	}
	else if ($("#c_client_id").val() == "0" && $("#c_client_complete").val() == "0" && m_is_admin) {
		buildNonClientVersion(datetime);
		return;
	}
	else if ($("#c_client_id").val() != "0" && ($("#c_client_complete").val() == "0" || $("#c_client_info_filled").val() == "0")) {
		
		content = content + "        <div class=\"row margin-bottom-30\">";
		content = content + "            <div class=\"col-md-10 col-md-offset-1 mb-margin-bottom-30\">";
		content = content + "                <div class=\"headline\"><h2>Confirm personal information</h2></div>";
		content = content + "                <p class=\"lead\">Please confirm your personal information in order to continue:<p>";
		content = content + "                <form action=\"request_appointment_confirm_info\" method=\"post\">";
		
		
		if ($("#c_client_first_name").val() == "" || $("#c_client_last_name").val() == "") {
			content = content + "                    <div class=\"row margin-bottom-20\">";
			content = content + "                        <div class=\"col-md-5 col-md-offset-1\">";
			content = content + "                            <label for=\"first_name\">First name <i class=\"fa fa-asterisk\"></i></label>"; 
			content = content + "                            <input type=\"text\" name=\"client[first_name]\" id=\"first_name\" class=\"form-control\" placeholder=\"First name\" value=\"" + $("#c_client_first_name").val() + "\" required>";
			content = content + "                        </div>";
			content = content + "                        <div class=\"col-md-5 col-md-offset-0\">";
			content = content + "                            <label for=\"last_name\">Last name <i class=\"fa fa-asterisk\"></i></label>";
			content = content + "                            <input type=\"text\" name=\"client[last_name]\" id=\"last_name\" class=\"form-control\" placeholder=\"Last name\" value=\"" + $("#c_client_last_name").val() + "\" required>";
			content = content + "                        </div>";
			content = content + "                    </div>";	
		}
		else {
			content = content + "                    <div class=\"row margin-bottom-20\">";
			content = content + "                        <div class=\"col-md-5 col-md-offset-1\">";
			content = content + "                            <label for=\"first_name\">First name <i class=\"fa fa-asterisk\"></i></label>"; 
			content = content + "                            <input type=\"text\" name=\"client[first_name]\" id=\"first_name\" class=\"form-control\" placeholder=\"First name\" value=\"" + $("#c_client_first_name").val() + "\" disabled required>";
			content = content + "                        </div>";
			content = content + "                        <div class=\"col-md-5 col-md-offset-0\">";
			content = content + "                            <label for=\"last_name\">Last name <i class=\"fa fa-asterisk\"></i></label>";
			content = content + "                            <input type=\"text\" name=\"client[last_name]\" id=\"last_name\" class=\"form-control\" placeholder=\"Last name\" value=\"" + $("#c_client_last_name").val() + "\" disabled required>";
			content = content + "                        </div>";
			content = content + "                    </div>";	
		}
		
		
		content = content + "                    <div class=\"row margin-bottom-20\">";
		content = content + "                        <div class=\"col-md-10 col-md-offset-1\">";
		content = content + "                            <label for=\"address\">Address <i class=\"fa fa-asterisk\"></i></label>";
		content = content + "                            <input type=\"text\" name=\"client[address]\" id=\"address\" class=\"form-control\" placeholder=\"Address\" value=\"" + $("#c_client_address").val() + "\" required>";
		content = content + "                        </div>";
		content = content + "                    </div>";
		content = content + "                    <div class=\"row margin-bottom-20\">";
		content = content + "												 <div class=\"col-md-5 col-md-offset-1\">";
		content = content + "                            <label for=\"phone\">Phone <i class=\"fa fa-asterisk\"></i></label>";
		content = content + "                            <input type=\"text\" name=\"client[phone]\" id=\"phone\" class=\"form-control\" data-mask=\"(999) 999-9999\" placeholder=\"Phone\" value=\"" + $("#c_client_phone").val() + "\" required>";
		content = content + "                        </div>";
		content = content + "                        <div class=\"col-md-5\">";
		content = content + "                            <label for=\"weeks_pregnant\">Weeks pregnant <i class=\"fa fa-asterisk\"></i></label>";
		content = content + "                            <input type=\"text\" name=\"client[weeks_pregnant]\" id=\"weeks_pregnant\" class=\"form-control\" placeholder=\"Weeks pregnant\" value=\"" + $("#c_client_weeks_pregnant").val() + "\" required>";
		content = content + "                        </div>";
		content = content + "                    </div>";
		content = content + "									</form>";
		content = content + "           </div>";
		content = content + "        </div>";

		$("#schedules_modal_action").html("Confirm Info");
		$("#schedules_modal_action").attr("href", "javascript: updateInfo(" + datetime + ");");
	}
	else if ($("#c_client_id").val() != "0") {
		$("#schedules_title").html("<h3>Booking Confirmation</h3>");
		content = content + "        <div class=\"row margin-bottom-30\">";
		content = content + "            <div class=\"col-md-10 col-md-offset-1 mb-margin-bottom-30\">";
		content = content + "  					<p class=\"lead\">You are about to book an appointment with  " + $("#c_provider_first_name").val() + " " + $("#c_provider_last_name").val() + ".<p>";
		content = content + "       		   <p><strong>Date & Time:</strong> " +  m_current_date.getHours() + ":" + ("0" + m_current_date.getMinutes()).slice(-2) + (m_current_date.getHours() < 12 ? " AM" : " PM") + " on " + q_screens.month(m_current_date.getMonth() + 1) + " " + m_current_date.getDate() + "th, " + m_current_date.getFullYear() +" </p>";
		content = content + "           	   <p><strong>Location:</strong> " +  $("#c_client_address").val() + "</p>";	
		content = content + "                <form action=\"request_appointment\" method=\"post\">";
		content = content + "                    <div class=\"row margin-bottom-20\">";
		content = content + "                        <div class=\"col-md-12 col-md-offset-0\">";
		content = content + "                            <textarea name=\"client_observation\" id=\"client_observation\" rows=4 class=\"form-control\" placeholder=\"Don't forget to mention your special requests to " + $("#c_provider_first_name").val() + "\"></textarea>";
		content = content + "                        </div>";
		content = content + "                    </div>";
		content = content + "               </form>";
		content = content + "           </div>";
		content = content + "        </div>";

		$("#schedules_modal_action").html("Confirm");
		$("#schedules_modal_action").attr("href", "javascript: sendRequest(" + datetime + ");");
	}
	else if ($("#c_client_id").val() == "0" && request_option == "signin") {
		content = content + "        <div class=\"row margin-bottom-30\">";
		content = content + "            <div class=\"col-md-10 col-md-offset-1 mb-margin-bottom-30\">";
		content = content + "               <div class=\"alert alert-info\" role=\"alert\"><span class=\"glyphicon glyphicon-hand-right\"></span> <strong>Booking for: </strong> " + m_current_date.getHours() + "h" + ("0" + m_current_date.getMinutes()).slice(-2) + (m_current_date.getHours() < 12 ? " (am)" : "") + " on " + q_screens.month(m_current_date.getMonth() + 1) + " " + m_current_date.getDate() + "th, " + m_current_date.getFullYear();
		content = content + "                   <button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
		content = content + "               </div>";
		content = content + "            	<div class=\"headline\"><h2>Sign In</h2></div>";
		content = content + "                <form action=\"request_appointment_signin\" method=\"post\">";
		content = content + "										<div class=\"row margin-bottom-20\">";
		content = content + "                    	 <div class=\"col-md-10 col-md-offset-1\">";
		content = content + "                           <span class=\"pull-right\">Haven't you already registered? <a href=\"javascript: signInUp('signup', " + datetime + ");\" >Sign Up</a></span>";
		content = content + "                        </div>";
		content = content + "                    </div>";
		content = content + "                    <div class=\"row margin-bottom-20\">";
		content = content + "                        <div class=\"col-md-10 col-md-offset-1\">";
		content = content + "                            <label for=\"email\">Email</label>";
		content = content + "                            <input type=\"text\" name=\"email\" id=\"email\" class=\"form-control\" placeholder=\"Email\" required>";
		content = content + "                        </div>";
		content = content + "                    </div>";
		content = content + "                    <div class=\"row margin-bottom-20\">";
		content = content + "                        <div class=\"col-md-10 col-md-offset-1\">";
		content = content + "                            <label for=\"password\">Password</label>";
		content = content + "                            <input type=\"password\" name=\"password\" id=\"password\" class=\"form-control\" placeholder=\"Password\" required>";
		content = content + "                        </div>";
		content = content + "                    </div>";
		
		content = content + "										<div class=\"row\">";
		content = content + "                    	 <div class=\"col-md-10 col-md-offset-1\">";
		content = content + "                           <a href=\"javascript: window.open('/password_recovery');\">Forgot your password?</a>";
		content = content + "                        </div>";
		content = content + "                    </div>";
		
		content = content + "								</form>";
		content = content + "            </div>";
		content = content + "        </div>";

		$("#schedules_modal_action").html("Sign In");
		$("#schedules_modal_action").attr("href", "javascript: signin(" + datetime + ");");
	}
	else if ($("#c_client_id").val() == "0" && request_option == "signup") {
		content = content + "        <div class=\"row margin-bottom-30\">";
		content = content + "            <div class=\"col-md-10 col-md-offset-1 mb-margin-bottom-30\">";
		content = content + "               <div class=\"alert alert-info\" role=\"alert\"><span class=\"glyphicon glyphicon-hand-right\"></span> <strong>Booking for: </strong> " + m_current_date.getHours() + "h" + ("0" + m_current_date.getMinutes()).slice(-2) + (m_current_date.getHours() < 12 ? " (am)" : "") + " on " + q_screens.month(m_current_date.getMonth() + 1) + " " + m_current_date.getDate() + "th, " + m_current_date.getFullYear();
		content = content + "                   <button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
		content = content + "               </div>";
		content = content + "            	<div class=\"headline\"><h2>Sign Up</h2></div>";
		content = content + "                <form action=\"request_appointment_signup\" method=\"post\">";
		
			
		content = content + "					<div class=\"row margin-bottom-20\">";
		content = content + "                    	 <div class=\"col-md-10 col-md-offset-1\">";
		content = content + "                           <span class=\"pull-right\">Have you already registered? <a href=\"javascript: signInUp('signin', " + datetime + ");\" >Sign In</a></span>";
		content = content + "                        </div>";
		content = content + "                    </div>";


		content = content + "					<div class=\"row margin-bottom-20\">";
		content = content + "						<div class=\"col-md-5 col-md-offset-1\">";
		content = content + "                            <label for=\"first_name\">First name <i class=\"fa fa-asterisk\"></i></label>";
		content = content + "                            <input type=\"text\" name=\"first_name\" id=\"first_name\" class=\"form-control\" placeholder=\"First name\" required>";
		content = content + "                        </div>";
		content = content + "                        <div class=\"col-md-5\">";
		content = content + "                            <label for=\"last_name\">Last name<i class=\"fa fa-asterisk\"></i></label>";
		content = content + "                            <input type=\"text\" name=\"last_name\" id=\"last_name\" class=\"form-control\" placeholder=\"Last name\" required>";
		content = content + "                        </div>";
		content = content + "         </div>";
		
		
		content = content + "					<div class=\"row margin-bottom-20\">";
		content = content + "                    	<div class=\"col-md-10 col-md-offset-1\">";
		content = content + "                            <label for=\"email\">Email <i class=\"fa fa-asterisk\"></i></label>";
		content = content + "                            <input type=\"text\" name=\"email\" id=\"email\" class=\"form-control\" placeholder=\"Email\" required>";
		content = content + "                        </div>";
		content = content + "                    </div>";
		content = content + "                    <div class=\"row margin-bottom-20\">";
		content = content + "                        <div class=\"col-md-10 col-md-offset-1\">";
		content = content + "                            <label for=\"address\">Address <i class=\"fa fa-asterisk\"></i></label>";
		content = content + "                            <input type=\"text\" name=\"address\" id=\"address\" class=\"form-control\" placeholder=\"Address\" required>";
		content = content + "                        </div>";
		content = content + "                    </div>";
		content = content + "                    <div class=\"row margin-bottom-20\">";
		content = content + "						<div class=\"col-md-5 col-md-offset-1\">";
		content = content + "                            <label for=\"phone\">Phone <i class=\"fa fa-asterisk\"></i></label>";
		content = content + "                            <input type=\"text\" name=\"phone\" id=\"phone\" class=\"form-control\" data-mask=\"(999) 999-9999\" placeholder=\"Phone\" required>";
		content = content + "                        </div>";
		content = content + "                        ";
		content = content + "                        <div class=\"col-md-5\">";
		content = content + "                            <label for=\"weeks_pregnant\">Weeks pregnant <i class=\"fa fa-asterisk\"></i></label>";
		content = content + "                            <input type=\"text\" name=\"weeks_pregnant\" id=\"weeks_pregnant\" class=\"form-control\" placeholder=\"Weeks pregnant\" required>";
		content = content + "                        </div>";
		content = content + "                    </div>";
		content = content + "                    <div class=\"row margin-bottom-20\">";
		content = content + "                        <div class=\"col-md-5 col-md-offset-1\">";
		content = content + "                            <label for=\"password\">Password <i class=\"fa fa-asterisk\"></i></label>";
		content = content + "                            <input type=\"password\" name=\"password\" id=\"password\" class=\"form-control\" placeholder=\"Password\" required>";
		content = content + "                        </div>";
		content = content + "                        <div class=\"col-md-5\">";
		content = content + "                            <label for=\"password_confirmation\">Password confirmation <i class=\"fa fa-asterisk\"></i></label>";
		content = content + "                            <input type=\"password\" name=\"password_confirmation\" id=\"password_confirmation\" class=\"form-control\" placeholder=\"Password confirmation\" required>";
		content = content + "                        </div>";
		content = content + "                    </div>";
		content = content + "				</form>";
		content = content + "            </div>";
		content = content + "        </div>";

		$("#schedules_modal_action").html("Create my account");
		$("#schedules_modal_action").attr("href", "javascript: signup(" + datetime + ");");
	}
	
	$("#schedules_modal_action").blur();
	$("#schedulse_modal_content").html(content);
	$('#schedules_modal').modal('show');
};

var requestAppointmentPOG = function(datetime) {
	var q_screens = new Screens();
	var content = "";
	
	m_current_date = new Date(datetime);
	
	$("#schedules_title").html("Appointment requesting");

	$("#schedules_title").html("<h3>Booking Confirmation</h3>");
	content = content + "        <div class=\"row margin-bottom-30\">";
	content = content + "            <div class=\"col-md-10 col-md-offset-1 mb-margin-bottom-30\">";
	content = content + "  					<p class=\"lead\">You are about to book an appointment with  " + $("#c_provider_first_name").val() + " " + $("#c_provider_last_name").val() + ".<p>";
	content = content + "       		   <p><strong>Date & Time:</strong> " +  m_current_date.getHours() + ":" + ("0" + m_current_date.getMinutes()).slice(-2) + (m_current_date.getHours() < 12 ? " AM" : " PM") + " on " + q_screens.month(m_current_date.getMonth() + 1) + " " + m_current_date.getDate() + "th, " + m_current_date.getFullYear() +" </p>";
	content = content + "           	   <p><strong>Location:</strong> " +  $("#c_client_address").val() + "</p>";	
	content = content + "                <form action=\"request_appointment\" method=\"post\">";
	content = content + "                    <div class=\"row margin-bottom-20\">";
	content = content + "                        <div class=\"col-md-12 col-md-offset-0\">";
	content = content + "                            <textarea name=\"client_observation\" id=\"client_observation\" rows=4 class=\"form-control\" placeholder=\"Don't forget to mention your special requests to " + $("#c_provider_first_name").val() + "\"></textarea>";
	content = content + "                        </div>";
	content = content + "                    </div>";
	content = content + "               </form>";
	content = content + "           </div>";
	content = content + "        </div>";

	$("#schedules_modal_action").html("Confirm");
	$("#schedules_modal_action").attr("href", "javascript: sendRequest(" + datetime + ");");
	$("#schedules_modal_action").blur();
	$("#schedulse_modal_content").html(content);
	$('#schedules_modal').modal('show');
};

var signInUp = function(option, date) {
	request_option = option;
	requestAppointment(date);
};

var signin = function(date) {
	clearMessage("schedules_alert");

	if (!validateEmail($("#email").val())) {
		alertMessage("schedules_alert", "Email invalid.", "danger", false);
		$("#email").focus();
			return;
	}
	if (!validatePassword($("#password").val())) {
		alertMessage("schedules_alert", "Password empty.", "danger", false);
		$("#password").focus();
		return;
	}

	$.ajax({
		type: 'GET',
		url: '/csignin_ajax',
		dataType: "json",
		data: { 
			'email': $("#email").val(),
			'password': $("#password").val()
		},
		success: function(data) {
			if (data.status == "success") {
				
				console.log(data);
				$("#c_client_id").val(data.client.id);
				$("#c_client_first_name").val(data.client.first_name);
				$("#c_client_last_name").val(data.client.last_name);
				$("#c_client_address").val(data.client.address);
				$("#c_client_phone").val(data.client.phone);
				$("#c_client_weeks_pregnant").val(data.client.weeks_pregnant);
				
				clearMessages();
				changeNavLinksSignedIn(data.client.profile);
				requestAppointment(date);
			}
			else if (data.status == "fail") {
				$("#password").val("");
				alertMessage("schedules_alert", "Fail sign in, please try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("schedules_alert", "Please contact us directly.", "danger", false);
		}
	});
};

var working_on_signup = false;
var signup = function(date) {
	if (!working_on_signup) {
		clearMessage("schedules_alert");
	
		if (!validateName($("#first_name").val()) || validAnyNumber($("#first_name").val())) {
			alertMessage("schedules_alert", "First name empty.", "danger", false);
			$("#first_name").focus();
			return;
		}
	
		if (!validateName($("#last_name").val()) || validAnyNumber($("#last_name").val())) {
			alertMessage("schedules_alert", "Last name empty.", "danger", false);
			$("#last_name").focus();
			return;
		}
	
		if (!validateEmail($("#email").val())) {
			alertMessage("schedules_alert", "Email invalid.", "danger", false);
			$("#email").focus();
			return;
		}
	
		if (!validatePhone($("#phone").val())) {
			alertMessage("schedules_alert", "Phone invalid.", "danger", false);
			$("#phone").focus();
			return;
		}
	
		if (!validateAddress($("#address").val())) {
			alertMessage("schedules_alert", "Address empty.", "danger", false);
			$("#address").focus();
			return;
		}
	
		if (!validateWeeksPregnant($("#weeks_pregnant").val())) {
			alertMessage("schedules_alert", "Invalid number of weeks pregnant.", "danger", false);
			$("#weeks_pregnant").focus();
			return;
		}
		
		if (!validatePassword($("#password").val())) {
			alertMessage("schedules_alert", "Password empty.", "danger", false);
			$("#password").focus();
			return;
		}
	
		if (!validatePassword($("#password_confirmation").val())) {
			alertMessage("schedules_alert", "Password confirmation empty.", "danger", false);
			$("#password_confirmation").focus();
			return;
		}
	
		if ($("#password").val() != $("#password_confirmation").val()) {
			$("#password").val("");
			$("#password_confirmation").val("");
			alertMessage("schedules_alert", "Passwords don't match.", "danger", false);
			$("#password").focus();
			return;
		}
	
		if ($("#password").val().length < 6) {
			$("#password").val("");
			$("#password_confirmation").val("");
			alertMessage("schedules_alert", "Password too short (minimum 6 digits).", "danger", false);
			$("#password").focus();
			return;
		}
	
		working_on_signup = true;
		$("#schedules_modal_action").html("<i class=\"fa fa-cog fa-spin\"></i> Processing");
		$("#schedules_modal_action").blur();
		$.ajax({
			type: 'GET',
			url: '/csignup_ajax',
			dataType: "json",
			data: { 
				'email': $("#email").val(),
				'client[first_name]': $("#first_name").val(),
				'client[last_name]': $("#last_name").val(),
				'client[email]': $("#email").val(),
				'client[password]': $("#password").val(),
				'client[password_confirmation]': $("#password_confirmation").val(),
				'client[phone]': $("#phone").val(),
				'client[address]': $("#address").val(),
				'client[weeks_pregnant]': $("#weeks_pregnant").val()
			},
			success: function(data) {
				if (data.status == "success") {
					
					//$("#c_client_id").val(data.client.id);
					//$("#c_client_first_name").val(data.client.first_name);
					//$("#c_client_last_name").val(data.client.last_name);
					//$("#c_client_address").val(data.client.address);
					//$("#c_client_phone").val(data.client.phone);
					//$("#c_client_weeks_pregnant").val(data.client.weeks_pregnant);
					clearMessages();
					//changeNavLinksSignedIn(data.client.profile);
					
					//requestAppointment(date);
					working_on_signup = false;
					signInUp("signin", date);
					alertMessage("schedules_alert", "Welcome to CareForMe! Please check your email to proced.", "success", false);
				}
				else if (data.status == "email_exists") {
					$("#password").val("");
					$("#password_confirmation").val("");
					alertMessage("schedules_alert", "Email already registered. <a href=\"javascript: window.open('/password_recovery');\">Forgot your password?</a>", "warning", false);
					working_on_signup = false;
				}
				else if (data.status == "fail") {
					$("#password").val("");
					$("#password_confirmation").val("");
					alertMessage("schedules_alert", "Fail sign in, please try again.", "warning", false);
					working_on_signup = false;
				}
			},
			error: function(data) {
				console.log("error");
				console.log(data);
				alertMessage("schedules_alert", "Please contact us directly.", "danger", false);
				working_on_signup = false;
			}
		});
	}
};


var updateInfo = function(date) {
	clearMessage("schedules_alert");

	if (!validNotEmpty($("#first_name").val()) || validAnyNumber($("#first_name").val())) {
		alertMessage("schedules_alert", "First name invalid.", "warning", false);
		$("#first_name").focus();
		return;
	}

	if (!validNotEmpty($("#last_name").val()) || validAnyNumber($("#last_name").val())) {
		alertMessage("schedules_alert", "Last name invalid.", "warning", false);
		$("#last_name").focus();
		return;
	}
	
	if (!validateAddress($("#address").val())) {
		alertMessage("schedules_alert", "Address empty.", "warning", false);
		$("#address").focus();
		return;
	}
	
	if (!validatePhone($("#phone").val())) {
		alertMessage("schedules_alert", "Phone invalid.", "warning", false);
		$("#phone").focus();
		return;
	}

	if (!validateWeeksPregnant($("#weeks_pregnant").val())) {
		alertMessage("schedules_alert", "Invalid number of weeks pregnant.", "warning", false);
		$("#weeks_pregnant").focus();
		return;
	}

	$.ajax({
		type: 'GET',
		url: '/update_info_ajax',
		dataType: "json",
		data: { 
			'client[first_name]': $("#first_name").val(),
			'client[last_name]': $("#last_name").val(),
			'client[phone]': $("#phone").val(),
			'client[address]': $("#address").val(),
			'client[weeks_pregnant]': $("#weeks_pregnant").val()
		},
		success: function(data) {
			if (data.status == "success") {
				$("#c_client_id").val(data.client.id);
				$("#c_client_first_name").val(data.client.first_name);
				$("#c_client_last_name").val(data.client.last_name);
				$("#c_client_address").val(data.client.address);
				clearMessages();
				requestAppointmentPOG(date);
			}
			else if (data.status == "fail") {
				alertMessage("schedules_alert", "Fail to update info, please try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("schedules_alert", "Please contact us directly.", "danger", false);
		}
	});
};

var working_on_request = false;

var sendRequest = function(date) {
	if (!working_on_request) {
		$("#schedules_modal_action").html("<i class=\"fa fa-cog fa-spin\"></i> Confirm");
		$("#schedules_modal_action").blur();
		working_on_request = true;
		setTimeout(function(){ sendRequestPOG(date); }, 1000);
	}
};

var sendRequestPOG = function(date) {
	m_current_date = new Date(date);
	var MS_PER_MINUTE = 60000;
	var datestart = new Date(date - 20 * MS_PER_MINUTE);
	var dateend = new Date(date + 80 * MS_PER_MINUTE);
	var d_start = datestart.getFullYear() + "-" + ("0" + (datestart.getMonth() + 1)).slice(-2) + "-" + ("0" + datestart.getDate()).slice(-2) + " " + ("0" + datestart.getHours()).slice(-2) + ":" + ("0" + datestart.getMinutes()).slice(-2) + ":00";
	var d_end = dateend.getFullYear() + "-" + ("0" + (dateend.getMonth() + 1)).slice(-2) + "-" + ("0" + dateend.getDate()).slice(-2) + " " + ("0" + dateend.getHours()).slice(-2) + ":" + ("0" + dateend.getMinutes()).slice(-2) + ":00";
	var send_confirmation = $('#send_confirmation').prop('checked');
	$.ajax({
		type: 'GET',
		url: '/request_appointment_ajax',
		dataType: "json",
		data: { 
			'appointment[start]': d_start,
			'appointment[end]': d_end,
			'appointment[provider_id]': $("#c_provider_id").val(),
			'appointment[client_id]': $("#c_client_id").val(),
			'appointment[client_observation]': $("#client_observation").val(),
			'appointment[accepted]': 0,
			'appointment[appointment_type]': $("#appointment_type").val(),
			'send_confirmation': send_confirmation
		},
		success: function(data) {
			if (data.status == "success") {
				$("#schedules_modal").modal("hide");
				$('.modal-backdrop').remove();
				alertMessage("schedules_body_alert", "Thank you for requesting an appointment. You will be contacted within a few hours about a confirmation.", "success", false);
				$('html, body').animate({ scrollTop: $("#schedules_body_alert").offset().top }, 2000);
				
				//$('#p_weekly').attr('checked',true);
				loadSchedule();
			}
			else if (data.status == "fail") {
				alertMessage("schedules_alert", "Fail to update info, please try again.", "warning", false);
			}
			working_on_request = false;
			$("#appointment_type").val(-1);
			$("#c_client_info_filled").val(0);
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("schedules_alert", "Please contact us directly.", "danger", false);
			working_on_request = false;
			$("#appointment_type").val(-1);
		}
	});
}

var buildNonClientVersion = function(datetime) {
	var q_screens = new Screens();
	var content = "";
	m_current_date = new Date(datetime);
	$("#schedules_title").html("Appointment requesting");

	$.ajax({
		type: 'GET',
		url: '/get_clients_ajax',
		dataType: "json",
		success: function(data) {
			if (data.status == "success") {
				console.log(data);
				content = content + "        <div class=\"row margin-bottom-30\">";
				content = content + "            <div class=\"col-md-10 col-md-offset-1 mb-margin-bottom-30\">";
				content = content + "                <div class=\"headline\"><h2>Select the client</h2></div>";
				content = content + "				 <div class=\"row margin-bottom-20\">";
				content = content + "                    <div class=\"col-md-6 col-md-offset-0\">";
				content = content + "                		<select name=\"c_client_id_temp\" id=\"c_client_id_temp\" class=\"form-control\" onchange=\"fetchClientInformation();\">";
				content = content + "                	 		<option value=\"\"></option>";
				$.each(data.clients, function(i, client) {
					content = content + "                		<option value=\"" + client.id + "\">" + client.first_name + " " + client.last_name + "</options>";	
				});
				content = content + "                	 	</select>";
				content = content + "                    </div>";
				content = content + "                    <div class=\"col-md-6 col-md-offset-0 vcenter\">";
				content = content + "                       <span class=\"pull-right\">New client? <a href=\"javascript: \" >Create</a></span>";
				content = content + "                    </div>";
				content = content + "                </div>";
				content = content + "           </div>";
				content = content + "        </div>";

				content = content + "        <div id=\"c_client_information\"></div>";

				$("#schedules_modal_action").html("Create Appointment");
				$("#schedules_modal_action").attr("href", "javascript: ");

				$("#schedulse_modal_content").html(content);
				$('#schedules_modal').modal('show');
			}
			else if (data.status == "fail") {
				alertMessage("schedules_body_alert", "Be cool, don't dismiss Thiago yet.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("schedules_body_alert", "A big problem is going on, dismiss Thiago.", "danger", false);
		}
	});		
};

var adminSubmitRequest = function() {
	
};

var fetchClientInformation = function() {
	var client_id = $("#c_client_id_temp").val();
	if (client_id !== undefined && client_id !== "") {
		var content = "";

		$.ajax({
			type: 'GET',
			url: '/get_client_information_ajax',
			dataType: "json",
			data: {
				'id': client_id
			},
			success: function(data) {
				if (data.status == "success") {
					content = content + "<div class=\"row margin-bottom-20\">";
					content = content + "    <div class=\"col-md-5 col-md-offset-1\">";
					content = content + "        <label for=\"first_name\">First name <i class=\"fa fa-asterisk\"></i></label>";
					content = content + "        <input type=\"text\" value=\"" + data.client.first_name + "\" name=\"first_name\" id=\"first_name\" class=\"form-control\" placeholder=\"First name\" required>";
					content = content + "    </div>";
					content = content + "    <div class=\"col-md-5\">";
					content = content + "        <label for=\"last_name\">Last name<i class=\"fa fa-asterisk\"></i></label>";
					content = content + "        <input type=\"text\" value=\"" + data.client.last_name + "\" name=\"last_name\" id=\"last_name\" class=\"form-control\" placeholder=\"Last name\" required>";
					content = content + "    </div>";
					content = content + "</div>";
					content = content + "<div class=\"row margin-bottom-20\">";
					content = content + "    <div class=\"col-md-10 col-md-offset-1\">";
					content = content + "        <label for=\"address\">Address <i class=\"fa fa-asterisk\"></i></label>";
					content = content + "        <input type=\"text\" value=\"" + data.client.email + "\" name=\"email\" id=\"email\" class=\"form-control\" placeholder=\"Email\" required>";
					content = content + "    </div>";
					content = content + "</div>";
					content = content + "<div class=\"row margin-bottom-20\">";
					content = content + "    <div class=\"col-md-10 col-md-offset-1\">";
					content = content + "        <label for=\"address\">Address <i class=\"fa fa-asterisk\"></i></label>";
					content = content + "        <input type=\"text\" value=\"" + data.client.address + "\" name=\"address\" id=\"address\" class=\"form-control\" placeholder=\"Address\" required>";
					content = content + "    </div>";
					content = content + "</div>";
					content = content + "<div class=\"row margin-bottom-20\">";
					content = content + "    <div class=\"col-md-5 col-md-offset-1\">";
					content = content + "        <label for=\"phone\">Phone <i class=\"fa fa-asterisk\"></i></label>";
					content = content + "        <input type=\"text\" value=\"" + data.client.phone + "\" name=\"phone\" id=\"phone\" class=\"form-control\" data-mask=\"(999) 999-9999\" placeholder=\"Phone\" required>";
					content = content + "    </div>";
					content = content + "    <div class=\"col-md-5\">";
					content = content + "        <label for=\"weeks_pregnant\">Weeks pregnant <i class=\"fa fa-asterisk\"></i></label>";
					content = content + "        <input type=\"text\" value=\"" + data.client.weeks_pregnant + "\" name=\"weeks_pregnant\" id=\"weeks_pregnant\" class=\"form-control\" placeholder=\"Weeks pregnant\" required>";
					content = content + "    </div>";
					content = content + "</div>";
					$("#c_client_information").html(content);
				}
				else if (data.status == "fail") {
					alertMessage("schedules_alert", "Be cool, don't dismiss Thiago yet.", "warning", false);
				}
			},
			error: function(data) {
				console.log("error");
				console.log(data);
				alertMessage("schedules_alert", "A big problem is going on, dismiss Thiago.", "danger", false);
			}
		});
	}
};

var validateEmail = function(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

var validatePhone = function(phone) { 
    if (phone !== undefined && phone !== "") {
		return true;
	}
    return false;
};

var validatePassword = function(password) {
	if (password !== undefined && password !== "") {
		return true;
	}
    return false;
};

var validateAddress = function(address) {
	if (address !== undefined && address !== "") {
		return true;
	}
    return false;
};

var validateWeeksPregnant = function(weeks_pregnant) {
	var re = /^\d+$/;
	if (weeks_pregnant !== undefined && weeks_pregnant !== "" && re.test(weeks_pregnant)) {
		return true;
	}
    return false;
};

var validateName = function(name) {
	if (name !== undefined && name !== "") {
		return true;
	}
    return false;
};

var changeNavLinksSignedIn = function(profile) {
	var content = "";
	content = content + "<ul class=\"nav navbar-nav\">";
	content = content + "	<li><a href=\"/" + profile + "\"><i class=\"fa fa-home\"></i>&nbsp;Home</a></li>";
	content = content + "    <li><a data-method=\"delete\" href=\"/signout\" rel=\"nofollow\"><i class=\"fa fa-sign-out\"></i>&nbsp;Sign Out</a></li>";
    content = content + "</ul>";
    $("#nav_links").html(content);
};


var current_messages = [];
var alertMessage = function (id, message, type, append) {
	var message_to_show = "";
	var message_call = "";
	var icon = "";
	clearMessages();
	append = append === undefined ? false : append;
	switch (type) {
		case "success":
			message_call = "Success";
			icon = "ok";
			break;
		case "warning":
			message_call = "Warning";
			icon = "warning-sign";
			break;
		case "info":
			message_call = "Info";
			icon = "info-sign";
			break;
		case "danger":
			message_call = "Error";
			icon = "remove";
			break;
		default:
			message_call = "Warning";
			type = "warning";
			icon = "exclamation-sign";
	}
	//message_to_show = message_to_show + "<div class=\"alert alert-" + type + "\" role=\"alert\"><i class=\"fa fa-" + icon + "\"></i> <strong>" + message_call + "!</strong> " + message;
	message_to_show = message_to_show + "<div class=\"alert alert-" + type + "\" role=\"alert\"><strong>" + message_call + "!</strong> " + message;
	message_to_show = message_to_show + "	<button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
	message_to_show = message_to_show + "</div>";
	current_messages.push(id);
	if (append) {
		$("#" + id).append(message_to_show);
	}
	else {
		$("#" + id).html(message_to_show);
	}
	$('html, body').animate({
    	scrollTop: $("#" + id).offset().top - 60
  	}, 500);
};

var clearMessage = function(id) {
	$("#" + id).html("");
	clearMessages();
};

var clearMessages = function() {
	var i = 0;
	for (i = 0; i < current_messages.length; i++) {
		$("#" + current_messages[i]).html("");
	}
	current_messages = [];
};

var get_nth_suffix = function(date) {
   switch (date) {
     case 1:
     case 21:
     case 31:
        return 'st';
     case 2:
     case 22:
        return 'nd';
     case 3:
     case 23:
        return 'rd';
     default:
        return 'th';
   }
 };
 
 /* For a given date, get the ISO week number
 *
 * Based on information at:
 *
 *    http://www.merlyn.demon.co.uk/weekcalc.htm#WNR
 *
 * Algorithm is to find nearest thursday, it's year
 * is the year of the week number. Then get weeks
 * between that date and the first day of that year.
 *
 * Note that dates in one year can be weeks of previous
 * or next year, overlap is up to 3 days.
 *
 * e.g. 2014/12/29 is Monday in week  1 of 2015
 *      2012/1/1   is Sunday in week 52 of 2011
 */
function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(+d);
    d.setHours(0,0,0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(),0,1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
    // Return array of year and week number
    return [d.getFullYear(), weekNo];
}
;
/**
 * this function opens a modal containing a form for the client
 * request a new time for the provider
 * 
 * @params: [appointment_id] is the underlying appointment's id
 * @author: Thiago Melo
 * @version: 2015-03-15
 */

var reschedule = function(appointment_id) {
	clearMessages();
	$("#reschedules_modal_content")
		.html(
			$("<div/>")
				.append(
					$('<div/>')
						.addClass('row')
						.append(
							$('<div/>')
								.addClass('col-md-10 col-md-offset-1')
								.append(
									$('<p/>').append(
										'Please use the following field to request a new appointment, we are going to get in touch with you as soon as possible.'
									)
								)
								.append(
									$('<p/>').append(
										$('<strong/>')
											.append(
												'We are going to keep your appointment until you agree in change it to another time.'
											)
									)
								)
								.append(
									$('<textarea/>')
										.addClass('form-control')
										.prop('name', 'reschedule_message')
										.prop('id', 'reschedule_message')
										.prop('placeholder', 'Reschedule message')
										.prop('rows', '3')
								)
								
						)
				)
				.append($('<br>'))
				.append(
					$('<div/>')
						.addClass('row')
						.append(
							$('<div/>')
								.addClass('col-md-10 col-md-offset-1')
								.append(
									$('<a/>')
										.addClass('btn btn-danger pull-right')
										.click(function() {
											sendRescheduleRequest(appointment_id);
										})
										.append('Send request')
								)
						)
				)
				.append($('<hr>'))
				.append(
					$('<div/>')
						.addClass('row')
						.append(
							$('<div/>')
								.addClass('col-md-10 col-md-offset-1')
								.append(
									$('<p/>')
										.append(
											'If you prefer, you can just cancel the appointment.'
										)
									)
								.append(
									$('<p/>')
										.append(
											$('<strong/>')
												.append(
													'After canceling, this time will be available and can be booked for someone else.'
												)
										)
								)
						)
				)
				.append(
					$('<div/>')
						.addClass('row')
						.append(
							$('<div/>')
								.addClass('col-md-10 col-md-offset-1')
								.append(
									$('<a/>')
										.addClass('btn btn-danger pull-right')
										.click(function() {
											askCancelingAgreement(appointment_id);
										})
										.append('Cancel appointment')
								)
						)
				)
		);
	$("#reschedules_title").html("Rescheduling appointment");
	$('#reschedules_modal').modal('show');
};

/**
 * this function should change the reschedule box to a message showing 
 * the current appointment and asking if the client agree with
 * the canceling poins
 * 
 * @params: [appointment_id] is the corresponding appointment's id
 * 
 * @author: Thiago Melo
 * @version: 2015-03-16
 */
var askCancelingAgreement = function(appointment_id) {
	clearMessages();
	$('#reschedules_modal_content')
		.empty()
		.append(
			$('<div/>')
				.addClass('row')
				.append(
					$('<div/>')
						.addClass('col-md-10 col-md-offset-1')
						.append(
							$('<p/>').append(
								$('<strong/>')
									.append(
										'By canceling this booking, you agree in left it available to be booked by someone else.'
									)
							)
						)
						.append($('<br>'))
						.append(
							$('<a/>')
								.addClass('btn btn-default pull-left')
								.click(function() {
								  $('#reschedules_modal').modal('hide');
								})
								.append('Keep my booking')
						)
						.append(
							$('<a/>')
								.addClass('btn btn-danger pull-right')
								.click(function() {
									cancelAppointment(appointment_id);
								})
								.append('Yes, cancel my booking')
						)
				)
		);
	
	$("#reschedules_title").html('Canceling booking');
	$('#reschedules_modal').modal('show');
};

/**
 * this functions should perform an ajax request with must cancel the
 * appointment
 * 
 * the [working_on_canceling_appointment] is a variable that avoids
 * the method to be executed twice
 * 
 * @params: [appointment_id] the corresponding appointment's id
 * 
 * @author: Thiago Melo
 * @version: 2015-03-16
 * 
 */
var working_on_canceling_appointment = false;
var cancelAppointment = function(appointment_id) {
	if (!working_on_canceling_appointment) {
		working_on_canceling_appointment = true;
		$.ajax({
			type: 'GET',
			url: '/cancel_appointment_by_client',
			dataType: "json",
			data: {
				'appointment_id': appointment_id
			},
			success: function(data) {
				if (data.status == "success") {
					$('#reschedule_message').val("");
					alertMessage("reschedules_alert", "Your booking has been canceled.", "success", false);
					setTimeout(function(){ location.reload(); }, 3000);
				}
				else if (data.status == "fail") {
					alertMessage("reschedules_alert", "Please try again.", "warning", false);
				}
				else if (data.status == "not_found") {
					alertMessage("reschedules_alert", "Appointment not found.", "warning", false);
				}
				else if (data.status == "not_allowed") {
					alertMessage("reschedules_alert", "You have no permission to reschedule this appointment.", "warning", false);
				}
				working_on_canceling_appointment = false;
			},
			error: function(data) {
				console.log("error");
				console.log(data);
				alertMessage("reschedules_alert", "Error, please contact us.", "danger", false);
				working_on_canceling_appointment = false;
			}
		});
	}
};

/**
 * send the reschedule request message
 * 
 * it is going to access the parameter with id [reschedule_message]
 * in the reschedule window
 * 
 * it would be better if the [reschedule_message] was a parameter
 * to this function, do this later if you could.
 * 
 * the variable [working_on_reschedule_request] avoids the message to be
 * send twice due to some delay, it means, due to some delay, sometimes
 * the user clicks again and the message could be sent twice
 * it would be better if there was some loading wheel spinning
 * 
 * @params: [appointment_id] is the underlying appointment's id
 * @author: Thiago Melo
 * @version: 2015-03-16
 *
 */
var working_on_reschedule_request = false;
var sendRescheduleRequest = function(appointment_id) {
	var reschedule_message = $('#reschedule_message').val();
	if (validNotEmpty(reschedule_message)) {
		if (!working_on_reschedule_request) {
			working_on_reschedule_request = true;
			$.ajax({
				type: 'GET',
				url: '/reschedule_request_by_client',
				dataType: "json",
				data: {
					'appointment_id': appointment_id,
					'reschedule_message': reschedule_message
				},
				success: function(data) {
					if (data.status == "success") {
						$('#reschedule_message').val("");
						alertMessage("reschedules_alert", "Your reschedule message has been sent. Please wait for our contact.", "success", false);
					}
					else if (data.status == "fail") {
						alertMessage("reschedules_alert", "Please try again.", "warning", false);
					}
					else if (data.status == "not_found") {
						alertMessage("reschedules_alert", "Appointment not found.", "warning", false);
					}
					else if (data.status == "not_allowed") {
						alertMessage("reschedules_alert", "You have no permission to reschedule this appointment.", "warning", false);
					}
					working_on_reschedule_request = false;
				},
				error: function(data) {
					console.log("error");
					console.log(data);
					alertMessage("reschedules_alert", "Error, please contact us.", "danger", false);
					working_on_reschedule_request = false;
				}
			});
		}
	}
	else {
		alertMessage("reschedules_alert", "Please fill out some reschedule message.", "warning", false);
	}
};

var newAppointment = function(appointment_id) {
	
};

var changeAppointment = function(appointment_id) {
	
};

var deleteAppointment = function(appointment_id) {
	
	$.ajax({
		type: 'GET',
		url: '/client_delete_appointment_ajax',
		dataType: "json",
		data: {
			'appointment_id': appointment_id
		},
		success: function(data) {
			if (data.status == "success") {
				$("#appointment_" + appointment_id).animate( {backgroundColor:'yellow'}, 1000).fadeOut(1000,function() {
					$("#appointment_" + appointment_id).remove();
				});
				alertMessage("client_edit_alert", "Appointment successfully removed.", "success", false);
			}
			else if (data.status == "fail") {
				alertMessage("client_edit_alert", "Fail delete appointment, please try again.", "danger", false);
			}
			else if (data.status == "not_found") {
				alertMessage("client_edit_alert", "Appointment not found.", "warning", false);
			}
			else if (data.status == "not_allowed") {
				alertMessage("client_edit_alert", "You have no permission to delete this appointment.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("client_edit_alert", "Error, please contact us.", "danger", false);
		}
	});
};

/* ------------------------------------------------------------------- */

var enableEditClient = function() {
	if ($("#client_address").prop("disabled")) {
		$("#client_first_name").prop("disabled", false);
		$("#client_last_name").prop("disabled", false);
		$("#client_address").prop("disabled", false);
		$("#client_phone").prop("disabled", false);
		$("#client_weeks_pregnant").prop("disabled", false);
		
		$("#edit_client_button").html("<i class=\"fa fa-toggle-on\"></i> Cancel");
		$("#save_client_button").show();
	}
	else {
		resetClientInfo();
		$("#client_first_name").prop("disabled", true);
		$("#client_last_name").prop("disabled", true);
		
		$("#client_address").prop("disabled", true);
		$("#client_phone").prop("disabled", true);
		$("#client_weeks_pregnant").prop("disabled", true);
		
		$("#edit_client_button").html("<i class=\"fa fa-toggle-off\"></i> Edit Info");
		$("#save_client_button").hide();
	}
};

var saveEditClient = function() {
	if (!$("#client_address").prop("disabled") && validateClientUpdateInfoShort()) {
		$.ajax({
			type: 'GET',
			url: '/update_client_information',
			dataType: "json",
			data: {
				'client_id': $("#client_id").val(),
				'client[first_name]': $("#client_first_name").val(),
				'client[last_name]': $("#client_last_name").val(),
				'client[address]': $("#client_address").val(),
				'client[phone]': $("#client_phone").val(),
				'client[weeks_pregnant]': $("#client_weeks_pregnant").val()
			},
			success: function(data) {
				if (data.status == "success") {
					enableEditClient();
				}
				else if (data.status == "fail") {
					alertMessage("client_edit_alert", "Please, try again.", "warning", false);
				}
			},
			error: function(data) {
				console.log("error");
				console.log(data);
				alertMessage("client_edit_alert", "Error, please contact us.", "danger", false);
			}
		});
	}
};

var resetClientInfo = function() {
	if (!$("#client_address").prop("disabled")) {
		$.ajax({
		type: 'GET',
		url: '/client_simple_info',
		dataType: "json",
		data: {
			'client_id': $("#client_id").val()
		},
		success: function(data) {
			if (data.status == "success") {
				$("#client_first_name").val(data.client.first_name);
				$("#client_last_name").val(data.client.last_name);
				
				$("#client_address").val(data.client.address);
				$("#client_phone").val(data.client.phone);
				$("#client_weeks_pregnant").val(data.client.weeks_pregnant);
				
				$("#client_first_name").prop("disabled", true);
				$("#client_last_name").prop("disabled", true);
				$("#client_address").prop("disabled", true);
				$("#client_phone").prop("disabled", true);
				$("#client_weeks_pregnant").prop("disabled", true);
				
				$("#edit_client_button").html("<i class=\"fa fa-toggle-off\"></i> Edit Info");
				$("#save_client_button").hide();
			}
			else if (data.status == "fail") {
				alertMessage("client_edit_alert", "Please try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("client_edit_alert", "Error, please contact us.", "danger", false);
		}
	});
	}
};

(function() {


}).call(this);
var filterAction = function(e) {
  var content = "";
  if (e.value !== "" && e.value !== undefined) {
    $.ajax({
      type: 'GET',
      url: '/filter_provider_ajax',
      dataType: "json",
      data: { 
      	'filter': e.value
      },
      success: function(data) {
        content = content + "<div class=\"row\">";
        content = content + "    <div class=\"col-md-10 col-md-offset-1 fadeInLeft\">";
        content = content + "        <div class=\"panel panel-profile\">";
      	if (data.status == "success") {
          content = content + "<table class=\"table table-hover\">";
          $.each(data.categories, function(i, category) {
            content = content + "    <thead>";
            content = content + "        <tr>";
            content = content + "            <th>";
            content = content + "                " + category;
            content = content + "            </th>";
            content = content + "        </tr>";
            content = content + "    </thead>";
            content = content + "    <tbody>";
            $.each(data.results, function(i, result) {
              if (result.category == category) {
                content = content + "        <tr class=\"filtered-line\">";
                content = content + "            <td>";
                content = content + "                " + result.text;// + ", ids: " + result.id;
                content = content + "            </td>";
                content = content + "        </tr>";
              }
    				});
            content = content + "    </tbody>";
          });
          content = content + "</table>";
      	}
      	else if (data.status == "fail") {
      	  content = content + "<table class=\"table table-hover\">";
          content = content + "    <thead>";
          content = content + "        <tr>";
          content = content + "            <th>";
          content = content + "                Sorry, no patters match...";
          content = content + "            </th>";
          content = content + "        </tr>";
          content = content + "    </thead>";
          content = content + "    <tbody>";
          content = content + "        <tr class=\"filtered_line\">";
          content = content + "            <td>";
          content = content + "                <b>&#8230;</b>";
          content = content + "            </td>";
          content = content + "        </tr>";
          content = content + "    </tbody>";
          content = content + "</table>";
      	}
      	content = content + "        </div>";
        content = content + "    </div>";
        content = content + "</div>";
      	
      	$("#filter_results").html(content);
      },
      error: function(data) {
      	console.log("error");
      	console.log(data);
      }
    });
    return;
  }
  $("#filter_results").html(content);
};
/*
 * Template Name: Unify - Responsive Bootstrap Template
 * Description: Business, Corporate, Portfolio and Blog Theme.
 * Version: 1.4
 * Author: @htmlstream
 * Website: http://htmlstream.com
*/


var App = function () {

    function handleIEFixes() {
        //fix html5 placeholder attribute for ie7 & ie8
        if (jQuery.browser.msie && jQuery.browser.version.substr(0, 1) < 9) { // ie7&ie8
            jQuery('input[placeholder], textarea[placeholder]').each(function () {
                var input = jQuery(this);

                jQuery(input).val(input.attr('placeholder'));

                jQuery(input).focus(function () {
                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                    }
                });

                jQuery(input).blur(function () {
                    if (input.val() == '' || input.val() == input.attr('placeholder')) {
                        input.val(input.attr('placeholder'));
                    }
                });
            });
        }
    }

    function handleBootstrap() {
        /*Bootstrap Carousel*/
        jQuery('.carousel').carousel({
            interval: 15000,
            pause: 'hover'
        });

        /*Tooltips*/
        jQuery('.tooltips').tooltip();
        jQuery('.tooltips-show').tooltip('show');      
        jQuery('.tooltips-hide').tooltip('hide');       
        jQuery('.tooltips-toggle').tooltip('toggle');       
        jQuery('.tooltips-destroy').tooltip('destroy');       

        /*Popovers*/
        jQuery('.popovers').popover();
        jQuery('.popovers-show').popover('show');
        jQuery('.popovers-hide').popover('hide');
        jQuery('.popovers-toggle').popover('toggle');
        jQuery('.popovers-destroy').popover('destroy');
    }

    function handleSearch() {    
        jQuery('.search').click(function () {
            if(jQuery('.search-btn').hasClass('fa-search')){
                jQuery('.search-open').fadeIn(500);
                jQuery('.search-btn').removeClass('fa-search');
                jQuery('.search-btn').addClass('fa-times');
            } else {
                jQuery('.search-open').fadeOut(500);
                jQuery('.search-btn').addClass('fa-search');
                jQuery('.search-btn').removeClass('fa-times');
            }   
        }); 
    }

    function handleToggle() {
        jQuery('.list-toggle').on('click', function() {
            jQuery(this).toggleClass('active');
        });

        /*
        jQuery('#serviceList').on('shown.bs.collapse'), function() {
            jQuery(".servicedrop").addClass('glyphicon-chevron-up').removeClass('glyphicon-chevron-down');
        }

        jQuery('#serviceList').on('hidden.bs.collapse'), function() {
            jQuery(".servicedrop").addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-up');
        }
        */
    }

    function handleSwitcher() {    
        var panel = jQuery('.style-switcher');

        jQuery('.style-switcher-btn').click(function () {
            jQuery('.style-switcher').show();
        });

        jQuery('.theme-close').click(function () {
            jQuery('.style-switcher').hide();
        });
        
        jQuery('li', panel).click(function () {
            var color = jQuery(this).attr("data-style");
            var data_header = jQuery(this).attr("data-header");
            setColor(color, data_header);
            jQuery('.list-unstyled li', panel).removeClass("theme-active");
            jQuery(this).addClass("theme-active");
        });

        var setColor = function (color, data_header) {
            jQuery('#style_color').attr("href", "assets/css/themes/" + color + ".css");
            if(data_header == 'light'){
                jQuery('#style_color-header-1').attr("href", "assets/css/themes/headers/header1-" + color + ".css");
                jQuery('#logo-header').attr("src", "assets/img/logo1-" + color + ".png");
                jQuery('#logo-footer').attr("src", "assets/img/logo2-" + color + ".png");
            } else if(data_header == 'dark'){
                jQuery('#style_color-header-2').attr("href", "assets/css/themes/headers/header2-" + color + ".css");
                jQuery('#logo-header').attr("src", "assets/img/logo1-" + color + ".png");
                jQuery('#logo-footer').attr("src", "assets/img/logo2-" + color + ".png");
            }
        }
    }

    function handleBoxed() {
        jQuery('.boxed-layout-btn').click(function(){
            jQuery(this).addClass("active-switcher-btn");
            jQuery(".wide-layout-btn").removeClass("active-switcher-btn");
            jQuery("body").addClass("boxed-layout container");
        });
        jQuery('.wide-layout-btn').click(function(){
            jQuery(this).addClass("active-switcher-btn");
            jQuery(".boxed-layout-btn").removeClass("active-switcher-btn");
            jQuery("body").removeClass("boxed-layout container");
        });
    }

    function handleHeader() {
         jQuery(window).scroll(function() {
            if (jQuery(window).scrollTop()>100){
                jQuery(".header-fixed .header").addClass("header-fixed-shrink");
            }
            else {
                jQuery(".header-fixed .header").removeClass("header-fixed-shrink");
            }
        });
    }

    return {
        init: function () {
            handleBootstrap();
            handleIEFixes();
            handleSearch();
            handleToggle();
            handleSwitcher();
            handleBoxed();
            handleHeader();
        },

        initSliders: function () {
            jQuery('#clients-flexslider').flexslider({
                animation: "slide",
                easing: "swing",
                animationLoop: true,
                itemWidth: 1,
                itemMargin: 1,
                minItems: 2,
                maxItems: 9,
                controlNav: false,
                directionNav: false,
                move: 2
            });
            
            jQuery('#clients-flexslider1').flexslider({
                animation: "slide",
                easing: "swing",
                animationLoop: true,
                itemWidth: 1,
                itemMargin: 1,
                minItems: 2,
                maxItems: 5,
                controlNav: false,
                directionNav: false,
                move: 2
            });
            
            jQuery('#photo-flexslider').flexslider({
                animation: "slide",
                controlNav: false,
                animationLoop: false,
                itemWidth: 80,
                itemMargin: 0
            }); 
            
            jQuery('#testimonal_carousel').collapse({
                toggle: false
            });
        },

        initFancybox: function () {
            jQuery(".fancybox-button").fancybox({
            groupAttr: 'data-rel',
            prevEffect: 'none',
            nextEffect: 'none',
            closeBtn: true,
            helpers: {
                title: {
                    type: 'inside'
                    }
                }
            });

            jQuery(".iframe").fancybox({
                maxWidth    : 800,
                maxHeight   : 600,
                fitToView   : false,
                width       : '70%',
                height      : '70%',
                autoSize    : false,
                closeClick  : false,
                openEffect  : 'none',
                closeEffect : 'none'
            });            
        },

        initBxSlider: function () {
            jQuery('.bxslider').bxSlider({
                maxSlides: 4,
                minSlides: 4,
                slideWidth: 360,
                slideMargin: 10,
            });            

            jQuery('.bxslider1').bxSlider({
                minSlides: 3,
                maxSlides: 3,
                slideWidth: 360,
                slideMargin: 10
            });            

            jQuery('.bxslider2').bxSlider({
                minSlides: 2,
                maxSlides: 2,
                slideWidth: 360,
                slideMargin: 10
            });            
        },

        initCounter: function () {
            jQuery('.counter').counterUp({
                delay: 10,
                time: 1000
            });
        },

        initParallaxBg: function () {
            jQuery('.parallaxBg').parallax("50%", 0.2);
            jQuery('.parallaxBg1').parallax("50%", 0.4);
        },

    };

}();
var CheckoutForm = function () {

    return {
        
        //Checkout Form
        initCheckoutForm: function () {
	        // Masking
	        $('#cvv').mask('999', {placeholder:'X'});
	        $('#card').mask('9999-9999-9999-9999', {placeholder:'X'});
	        $('#year').mask('2099', {placeholder:'X'});
	        
	        // Add validation method
	        $.validator.addMethod("creditcard", function(value, element, param) {
	            if( /[^0-9\-]+/.test(value) )
	            {
	                return false;
	            }
	        },
	        $.validator.format('Please enter a valid credit card number.'));
	        
	        // Validation
	        $('#sky-form').validate({
	            // Rules for form validation
	            rules:
	            {
	                fname:
	                {
	                    required: true
	                },
	                lname:
	                {
	                    required: true
	                },
	                email:
	                {
	                    required: true,
	                    email: true
	                },
	                phone:
	                {
	                    required: true
	                },
	                country:
	                {
	                    required: true
	                },
	                city:
	                {
	                    required: true
	                },
	                code:
	                {
	                    required: true,
	                    digits: true
	                },
	                address:
	                {
	                    required: true
	                },
	                name:
	                {
	                    required: true
	                },
	                card:
	                {
	                    required: true,
	                    creditcard: true
	                },
	                cvv:
	                {
	                    required: true,
	                    digits: true
	                },
	                month:
	                {
	                    required: true
	                },
	                year:
	                {
	                    required: true,
	                    digits: true
	                }
	            },
	                                
	            // Messages for form validation
	            messages:
	            {
	                fname:
	                {
	                    required: 'Please enter your first name'
	                },
	                lname:
	                {
	                    required: 'Please enter your last name'
	                },
	                email:
	                {
	                    required: 'Please enter your email address',
	                    email: 'Please enter a VALID email address'
	                },
	                phone:
	                {
	                    required: 'Please enter your phone number'
	                },
	                country:
	                {
	                    required: 'Please select your country'
	                },
	                city:
	                {
	                    required: 'Please enter your city'
	                },
	                code:
	                {
	                    required: 'Please enter code',
	                    digits: 'Digits only please'
	                },
	                address:
	                {
	                    required: 'Please enter your full address'
	                },
	                name:
	                {
	                    required: 'Please enter name on your card'
	                },
	                card:
	                {
	                    required: 'Please enter your card number'
	                },
	                cvv:
	                {
	                    required: 'Enter CVV2',
	                    digits: 'Digits only'
	                },
	                month:
	                {
	                    required: 'Select month'
	                },
	                year:
	                {
	                    required: 'Enter year',
	                    digits: 'Digits only please'
	                }
	            },                  
	            
	            // Do not change code below
	            errorPlacement: function(error, element)
	            {
	                error.insertAfter(element.parent());
	            }
	        });
        }

    };

}();
var CommentForm = function () {

    return {
        
        //Comment Form
        initCommentForm: function () {
    	    // Validation
	        $("#sky-form4").validate({
	            // Rules for form validation
	            rules:
	            {
	                name:
	                {
	                    required: true
	                },
	                email:
	                {
	                    required: true,
	                    email: true
	                },
	                url:
	                {
	                    url: true
	                },
	                comment:
	                {
	                    required: true
	                },
	                captcha:
	                {
	                    required: true,
	                    remote: 'assets/plugins/sky-forms/version-2.0.1/captcha/process.php'
	                }
	            },
	                                
	            // Messages for form validation
	            messages:
	            {
	                name:
	                {
	                    required: 'Enter your name',
	                },
	                email:
	                {
	                    required: 'Enter your email address',
	                    email: 'Enter a VALID email'
	                },
	                url:
	                {
	                    email: 'Enter a VALID url'
	                },
	                comment:
	                {
	                    required: 'Please enter your comment'
	                },
	                captcha:
	                {
	                    required: 'Please enter characters',
	                    remote: 'Correct captcha is required'
	                }
	            },
	                                
	            // Ajax form submition                  
	            submitHandler: function(form)
	            {
	                $(form).ajaxSubmit(
	                {
	                    beforeSend: function()
	                    {
	                        $('#sky-form4 button[type="submit"]').attr('disabled', true);
	                    },
	                    success: function()
	                    {
	                        $("#sky-form4").addClass('submited');
	                    }
	                });
	            },
	            
	            // Do not change code below
	            errorPlacement: function(error, element)
	            {
	                error.insertAfter(element.parent());
	            }
	        });
        }

    };
    
}();
var ContactForm = function () {

    return {
        
        //Contact Form
        initContactForm: function () {
	        // Validation
	        $("#sky-form3").validate({
	            // Rules for form validation
	            rules:
	            {
	                name:
	                {
	                    required: true
	                },
	                email:
	                {
	                    required: true,
	                    email: true
	                },
	                message:
	                {
	                    required: true,
	                    minlength: 10
	                },
	                captcha:
	                {
	                    required: true,
	                    remote: 'assets/plugins/sky-forms/version-2.0.1/captcha/process.php'
	                }
	            },
	                                
	            // Messages for form validation
	            messages:
	            {
	                name:
	                {
	                    required: 'Please enter your name',
	                },
	                email:
	                {
	                    required: 'Please enter your email address',
	                    email: 'Please enter a VALID email address'
	                },
	                message:
	                {
	                    required: 'Please enter your message'
	                },
	                captcha:
	                {
	                    required: 'Please enter characters',
	                    remote: 'Correct captcha is required'
	                }
	            },
	                                
	            // Ajax form submition                  
	            submitHandler: function(form)
	            {
	                $(form).ajaxSubmit(
	                {
	                    beforeSend: function()
	                    {
	                        $('#sky-form3 button[type="submit"]').attr('disabled', true);
	                    },
	                    success: function()
	                    {
	                        $("#sky-form3").addClass('submited');
	                    }
	                });
	            },
	            
	            // Do not change code below
	            errorPlacement: function(error, element)
	            {
	                error.insertAfter(element.parent());
	            }
	        });
        }

    };
    
}();
var LoginForm = function () {

    return {
        
        //Masking
        initLoginForm: function () {
	        // Validation for login form
	        $("#sky-form1").validate({
	            // Rules for form validation
	            rules:
	            {
	                email:
	                {
	                    required: true,
	                    email: true
	                },
	                password:
	                {
	                    required: true,
	                    minlength: 3,
	                    maxlength: 20
	                }
	            },
	                                
	            // Messages for form validation
	            messages:
	            {
	                email:
	                {
	                    required: 'Please enter your email address',
	                    email: 'Please enter a VALID email address'
	                },
	                password:
	                {
	                    required: 'Please enter your password'
	                }
	            },                  
	            
	            // Do not change code below
	            errorPlacement: function(error, element)
	            {
	                error.insertAfter(element.parent());
	            }
	        });
	        
	        // Validation for recovery form
	        $("#sky-form2").validate({
	            // Rules for form validation
	            rules:
	            {
	                email:
	                {
	                    required: true,
	                    email: true
	                }
	            },
	                                
	            // Messages for form validation
	            messages:
	            {
	                email:
	                {
	                    required: 'Please enter your email address',
	                    email: 'Please enter a VALID email address'
	                }
	            },
	                                
	            // Ajax form submition                  
	            submitHandler: function(form)
	            {
	                $(form).ajaxSubmit(
	                {
	                    success: function()
	                    {
	                        $("#sky-form2").addClass('submited');
	                    }
	                });
	            },              
	            
	            // Do not change code below
	            errorPlacement: function(error, element)
	            {
	                error.insertAfter(element.parent());
	            }
	        });
        }

    };

}();
var OrderForm = function () {

    return {
        
        //Order Form
        initOrderForm: function () {
	        // Datepickers
	        $('#start').datepicker({
	            dateFormat: 'dd.mm.yy',
	            prevText: '<i class="icon-chevron-left"></i>',
	            nextText: '<i class="icon-chevron-right"></i>',
	            onSelect: function( selectedDate )
	            {
	                $('#finish').datepicker('option', 'minDate', selectedDate);
	            }
	        });
	        $('#finish').datepicker({
	            dateFormat: 'dd.mm.yy',
	            prevText: '<i class="icon-chevron-left"></i>',
	            nextText: '<i class="icon-chevron-right"></i>',
	            onSelect: function( selectedDate )
	            {
	                $('#start').datepicker('option', 'maxDate', selectedDate);
	            }
	        });
	        
	        // Validation
	        $("#sky-form1").validate({
	            // Rules for form validation
	            rules:
	            {
	                name:
	                {
	                    required: true
	                },
	                email:
	                {
	                    required: true,
	                    email: true
	                },
	                phone:
	                {
	                    required: true
	                },
	                interested:
	                {
	                    required: true
	                },
	                budget:
	                {
	                    required: true
	                }
	            },
	                                
	            // Messages for form validation
	            messages:
	            {
	                name:
	                {
	                    required: 'Please enter your name'
	                },
	                email:
	                {
	                    required: 'Please enter your email address',
	                    email: 'Please enter a VALID email address'
	                },
	                phone:
	                {
	                    required: 'Please enter your phone number'
	                },
	                interested:
	                {
	                    required: 'Please select interested service'
	                },
	                budget:
	                {
	                    required: 'Please select your budget'
	                }
	            },

	            // Ajax form submition
	            submitHandler: function(form)
	            {
	                $(form).ajaxSubmit(
	                {
	                    beforeSend: function()
	                    {
	                        $('#sky-form1 button[type="submit"]').addClass('button-uploading').attr('disabled', true);
	                    },
	                uploadProgress: function(event, position, total, percentComplete)
	                {
	                    $("#sky-form1 .progress").text(percentComplete + '%');
	                },
	                    success: function()
	                    {
	                        $("#sky-form1").addClass('submited');
	                        $('#sky-form1 button[type="submit"]').removeClass('button-uploading').attr('disabled', false);
	                    }
	                });
	            },  
	            
	            // Do not change code below
	            errorPlacement: function(error, element)
	            {
	                error.insertAfter(element.parent());
	            }
	        });
        }

    };

}();
var RegForm = function () {

    return {
        
        //Registration Form
        initRegForm: function () {
	        // Validation       
	        $("#sky-form4").validate({                   
	            // Rules for form validation
	            rules:
	            {
	                username:
	                {
	                    required: true
	                },
	                email:
	                {
	                    required: true,
	                    email: true
	                },
	                password:
	                {
	                    required: true,
	                    minlength: 3,
	                    maxlength: 20
	                },
	                passwordConfirm:
	                {
	                    required: true,
	                    minlength: 3,
	                    maxlength: 20,
	                    equalTo: '#password'
	                },
	                firstname:
	                {
	                    required: true
	                },
	                lastname:
	                {
	                    required: true
	                },
	                gender:
	                {
	                    required: true
	                },
	                terms:
	                {
	                    required: true
	                }
	            },
	            
	            // Messages for form validation
	            messages:
	            {
	                login:
	                {
	                    required: 'Please enter your login'
	                },
	                email:
	                {
	                    required: 'Please enter your email address',
	                    email: 'Please enter a VALID email address'
	                },
	                password:
	                {
	                    required: 'Please enter your password'
	                },
	                passwordConfirm:
	                {
	                    required: 'Please enter your password one more time',
	                    equalTo: 'Please enter the same password as above'
	                },
	                firstname:
	                {
	                    required: 'Please select your first name'
	                },
	                lastname:
	                {
	                    required: 'Please select your last name'
	                },
	                gender:
	                {
	                    required: 'Please select your gender'
	                },
	                terms:
	                {
	                    required: 'You must agree with Terms and Conditions'
	                }
	            },                  
	            
	            // Do not change code below
	            errorPlacement: function(error, element)
	            {
	                error.insertAfter(element.parent());
	            }
	        });
        }

    };
}();
var ReviewForm = function () {

    return {
        
        //Review Form
        initReviewForm: function () {
	        // Validation
	        $("#sky-form2").validate({
	            // Rules for form validation
	            rules:
	            {
	                name:
	                {
	                    required: true
	                },
	                email:
	                {
	                    required: true,
	                    email: true
	                },
	                review:
	                {
	                    required: true,
	                    minlength: 20
	                },
	                quality:
	                {
	                    required: true
	                },
	                reliability:
	                {
	                    required: true
	                },
	                overall:
	                {
	                    required: true
	                }
	            },
	                                
	            // Messages for form validation
	            messages:
	            {
	                name:
	                {
	                    required: 'Please enter your name'
	                },
	                email:
	                {
	                    required: 'Please enter your email address',
	                    email: 'Please enter a VALID email address'
	                },
	                review:
	                {
	                    required: 'Please enter your review'
	                },
	                quality:
	                {
	                    required: 'Please rate quality of the product'
	                },
	                reliability:
	                {
	                    required: 'Please rate reliability of the product'
	                },
	                overall:
	                {
	                    required: 'Please rate the product'
	                }
	            },                  
	            
	            // Do not change code below
	            errorPlacement: function(error, element)
	            {
	                error.insertAfter(element.parent());
	            }
	        });
        }

    };

}();
/**
 * Base js functions
 */


$(document).ready(function(){
    var $container = $('.grid-boxes');

    var gutter = 30;
    var min_width = 300;
    $container.imagesLoaded( function(){
        $container.masonry({
            itemSelector : '.grid-boxes-in',
            gutterWidth: gutter,
            isAnimated: true,
              columnWidth: function( containerWidth ) {
                var box_width = (((containerWidth - 2*gutter)/3) | 0) ;

                if (box_width < min_width) {
                    box_width = (((containerWidth - gutter)/2) | 0);
                }

                if (box_width < min_width) {
                    box_width = containerWidth;
                }

                $('.grid-boxes-in').width(box_width);

                return box_width;
              }
        });
    });
});
var Index = function () {

    return {
        
        //Parallax Slider
        initParallaxSlider: function () {
			$(function() {
				$('#da-slider').cslider();
			});
        },

        //Layer Slider
        initLayerSlider: function () {
		    $(document).ready(function(){
		        jQuery("#layerslider").layerSlider({
			        skin: 'fullwidth',
			        responsive : true,
			        responsiveUnder : 960,
			        layersContainer : 960,
			        skinsPath: 'assets/plugins/layer-slider/layerslider/skins/'
			    });
		    });     
        },

        //Revolution Slider
        initRevolutionSlider: function () {
		    var revapi;
	        jQuery(document).ready(function() {
	            revapi = jQuery('.tp-banner').revolution(
	            {
	                delay:9000,
	                startwidth:1170,
	                startheight:500,
	                hideThumbs:10
	            });
	        });
        }

    };
}();
var ContactPage = function () {

    return {
        
    	//Basic Map
        initMap: function () {
			var map;
			$(document).ready(function(){
			  map = new GMaps({
				div: '#map',
				lat: 40.748866,
				lng: -73.988366
			  });
			  
			  var marker = map.addMarker({
				lat: 40.748866,
				lng: -73.988366,
	            title: 'Company, Inc.'
		       });
			});
        },

        //Panorama Map
        initPanorama: function () {
		    var panorama;
		    $(document).ready(function(){
		      panorama = GMaps.createPanorama({
		        el: '#panorama',
		        lat : 40.748866,
		        lng : -73.988366
		      });
		    });
		}        

    };
}();
var PortfolioPage = function () {


    return {

        init: function () {
            $('.sorting-grid').mixitup();
        }

    };

}();

    // Bind normal buttons
    Ladda.bind( '.ladda-btn button', { timeout: 2000 } );

    // Bind progress buttons and simulate loading progress
    Ladda.bind( '.ladda-p-btn button', {
        callback: function( instance ) {
            var progress = 0;
            var interval = setInterval( function() {
                progress = Math.min( progress + Math.random() * 0.1, 1 );
                instance.setProgress( progress );

                if( progress === 1 ) {
                    instance.stop();
                    clearInterval( interval );
                }
            }, 200 );
        }
    } );

    // You can control loading explicitly using the JavaScript API
    // as outlined below:

    // var l = Ladda.create( document.querySelector( 'button' ) );
    // l.start();
    // l.stop();
    // l.toggle();
    // l.isLoading();
    // l.setProgress( 0-1 );
var CirclesMaster = function () {

    return {

        //Circles Master v1
        initCirclesMaster1: function () {
        	//Circles 1
		    Circles.create({
		        id:         'circle-1',
		        percentage: 87,
		        radius:     80,
		        width:      8,
		        number:     87,
		        text:       '%',
		        colors:     ['#eee', '#72c02c'],
		        duration:   2000
		    })

        	//Circles 2
		    Circles.create({
		        id:         'circle-2',
		        percentage: 74,
		        radius:     80,
		        width:      8,
		        number:     74,
		        text:       '%',
		        colors:     ['#eee', '#72c02c'],
		        duration:   2000
		    })

        	//Circles 3
		    Circles.create({
		        id:         'circle-3',
		        percentage: 65,
		        radius:     80,
		        width:      8,
		        number:     65,
		        text:       '%',
		        colors:     ['#eee', '#72c02c'],
		        duration:   2000
		    })

		    //Circles 4
		    Circles.create({
		        id:         'circle-4',
		        percentage: 69,
		        radius:     35,
		        width:      2,
		        number:     69,
		        text:       '%',
		        colors:     ['#eee', '#72c02c'],
		        duration:   2000
		    })

		    //Circles 5
		    Circles.create({
		        id:         'circle-5',
		        percentage: 82,
		        radius:     35,
		        width:      2,
		        number:     82,
		        text:       '%',
		        colors:     ['#eee', '#9B6BCC'],
		        duration:   2000
		    })

		    //Circles 6
		    Circles.create({
		        id:         'circle-6',
		        percentage: 87,
		        radius:     80,
		        width:      3,
		        number:     87,
		        text:       '%',
		        colors:     ['#eee', '#72c02c'],
		        duration:   2000
		    })

        	//Circles 7
		    Circles.create({
		        id:         'circle-7',
		        percentage: 74,
		        radius:     80,
		        width:      3,
		        number:     74,
		        text:       '%',
		        colors:     ['#eee', '#72c02c'],
		        duration:   2000
		    })

        	//Circles 8
		    Circles.create({
		        id:         'circle-8',
		        percentage: 65,
		        radius:     80,
		        width:      3,
		        number:     65,
		        text:       '%',
		        colors:     ['#eee', '#72c02c'],
		        duration:   2000
		    })

		    //Circles 9
		    Circles.create({
		        id:         'circle-9',
		        percentage: 91,
		        radius:     80,
		        width:      3,
		        number:     91,
		        text:       '%',
		        colors:     ['#eee', '#72c02c'],
		        duration:   2000
		    })
        },
        
        //Circles Master v2
        initCirclesMaster2: function () {
		    var colors = [
		        ['#D3B6C6', '#9B6BCC'], ['#C9FF97', '#72c02c'], ['#BEE3F7', '#3498DB'], ['#FFC2BB', '#E74C3C']
		    ];

		    for (var i = 1; i <= 4; i++) {
		        var child = document.getElementById('circles-' + i),
		            percentage = 45 + (i * 9);
		            
		        Circles.create({
		            id:         child.id,
		            percentage: percentage,
		            radius:     70,
		            width:      2,
		            number:     percentage / 1,
		            text:       '%',
		            colors:     colors[i - 1],
		            duration:   2000,
		        });
		    }	    
        }

    };
    
}();
var Datepicker = function () {

    return {
        
        //Datepickers
        initDatepicker: function () {
	        // Regular datepicker
	        $('#date').datepicker({
	            dateFormat: 'dd.mm.yy',
	            prevText: '<i class="fa fa-angle-left"></i>',
	            nextText: '<i class="fa fa-angle-right"></i>'
	        });
	        
	        // Date range
	        $('#start').datepicker({
	            dateFormat: 'dd.mm.yy',
	            prevText: '<i class="fa fa-angle-left"></i>',
	            nextText: '<i class="fa fa-angle-right"></i>',
	            onSelect: function( selectedDate )
	            {
	                $('#finish').datepicker('option', 'minDate', selectedDate);
	            }
	        });
	        $('#finish').datepicker({
	            dateFormat: 'dd.mm.yy',
	            prevText: '<i class="fa fa-angle-left"></i>',
	            nextText: '<i class="fa fa-angle-right"></i>',
	            onSelect: function( selectedDate )
	            {
	                $('#start').datepicker('option', 'maxDate', selectedDate);
	            }
	        });
	        
	        // Inline datepicker
	        $('#inline').datepicker({
	            dateFormat: 'dd.mm.yy',
	            prevText: '<i class="fa fa-angle-left"></i>',
	            nextText: '<i class="fa fa-angle-right"></i>'
	        });
	        
	        // Inline date range
	        $('#inline-start').datepicker({
	            dateFormat: 'dd.mm.yy',
	            prevText: '<i class="fa fa-angle-left"></i>',
	            nextText: '<i class="fa fa-angle-right"></i>',
	            onSelect: function( selectedDate )
	            {
	                $('#inline-finish').datepicker('option', 'minDate', selectedDate);
	            }
	        });
	        $('#inline-finish').datepicker({
	            dateFormat: 'dd.mm.yy',
	            prevText: '<i class="fa fa-angle-left"></i>',
	            nextText: '<i class="fa fa-angle-right"></i>',
	            onSelect: function( selectedDate )
	            {
	                $('#inline-start').datepicker('option', 'maxDate', selectedDate);
	            }
	        });
        }

    };
}();
var FormSliders = function () {

    return {
        
        //Form Sliders
        initFormSliders: function () {
	        // Regular slider
	        $('#slider1').slider({
		      min: 0,
		      max: 500,
		      slide: function(event, ui)
		      {
		        $('#slider1-value').text(ui.value);
		      }
	        });
	        
	        // Range slider
	        $('#slider2').slider({
		      min: 0,
		      max: 500,
		      range: true,
		      values: [75, 300],
		      slide: function(event, ui)
		      {
		        $('#slider2-value1').text(ui.values[0]);
		        $('#slider2-value2').text(ui.values[1]);
		      }
	        });
	        
	        // Step slider
	        $('#slider3').slider({
		      min: 0,
		      max: 500,
		      step: 100,
		      slide: function(event, ui)
		      {
		        $('#slider3-value').text(ui.value);
		      }
	        });

	         // Rounded Regular slider
	        $('#slider1-rounded').slider({
		      min: 0,
		      max: 500,
		      slide: function(event, ui)
		      {
		        $('#slider1-value-rounded').text(ui.value);
		      }
	        });
	        
	        // Rounded Range slider
	        $('#slider2-rounded').slider({
		      min: 0,
		      max: 500,
		      range: true,
		      values: [75, 300],
		      slide: function(event, ui)
		      {
		        $('#slider2-value1-rounded').text(ui.values[0]);
		        $('#slider2-value2-rounded').text(ui.values[1]);
		      }
	        });
	        
	        // Rounded Step slider
	        $('#slider3-rounded').slider({
		      min: 0,
		      max: 500,
		      step: 100,
		      slide: function(event, ui)
		      {
		        $('#slider3-value-rounded').text(ui.value);
		      }
	        });
        }

    };
    
}();
var Masking = function () {

    return {
        
        //Masking
        initMasking: function () {
	        $("#date1").mask('99/99/9999', {placeholder:'X'});
	        $("#phone").mask('(999) 999-9999', {placeholder:'X'});
	        $("#card").mask('9999-9999-9999-9999', {placeholder:'X'});
	        $("#serial").mask('***-***-***-***-***-***', {placeholder:'_'});
	        $("#tax").mask('99-9999999', {placeholder:'X'});
        }

    };
    
}();
var OwlCarousel = function () {

    return {
        
        //Owl Carousel
        initOwlCarousel: function () {
		    jQuery(document).ready(function() {
		        //Owl Slider v1
		        var owl = jQuery(".owl-slider");
		            owl.owlCarousel({
		                itemsDesktop : [1000,4], //5 items between 1000px and 901px
		                itemsDesktopSmall : [900,4], //4 items betweem 900px and 601px
		                itemsTablet: [600,3], //3 items between 600 and 0;
		                itemsMobile : [479,2] //2 itemsMobile disabled - inherit from itemsTablet option
		            });

		            // Custom Navigation Events
		            jQuery(".next-v1").click(function(){
		                owl.trigger('owl.next');
		            })
		            jQuery(".prev-v1").click(function(){
		                owl.trigger('owl.prev');
		            })
		        });

		        //Owl Slider v2
		        jQuery(document).ready(function() {
		        var owl = jQuery(".owl-slider-v2");
		            owl.owlCarousel({
		            	items: [4],
		                itemsDesktop : [1000,5], //5 items between 1000px and 901px
		                itemsDesktopSmall : [900,4], //4 items betweem 900px and 601px
		                itemsTablet: [600,3], //3 items between 600 and 0;
		                itemsMobile : [479,2], //2 itemsMobile disabled - inherit from itemsTablet option
		                slideSpeed: 1000
		            });

		            // Custom Navigation Events
		            jQuery(".next-v2").click(function(){
		                owl.trigger('owl.next');
		            })
		            jQuery(".prev-v2").click(function(){
		                owl.trigger('owl.prev');
		            })
		        });

		        //Owl Slider v3
		        jQuery(document).ready(function() {
		        var owl = jQuery(".owl-slider-v3");
		            owl.owlCarousel({
		            	items : 9,
		            	autoPlay : 5000,
						itemsDesktop : [1000,5], //5 items between 1000px and 901px
						itemsDesktopSmall : [900,4], // betweem 900px and 601px
						itemsTablet: [600,3], //2 items between 600 and 0
						itemsMobile : [300,2] //2 itemsMobile disabled - inherit from itemsTablet option
		            });
		        });

		        //Owl Slider v4
		        jQuery(document).ready(function() {
		        var owl = jQuery(".owl-slider-v4");
		            owl.owlCarousel({
		                items:3,
		                itemsDesktop : [1000,3], //3 items between 1000px and 901px
		                itemsTablet: [600,2], //2 items between 600 and 0;
		                itemsMobile : [479,1] //1 itemsMobile disabled - inherit from itemsTablet option
		            });
		    });
		}
    };
    
}();
var Validation = function () {

    return {
        
        //Validation
        initValidation: function () {
	        $("#sky-form1").validate({                   
	            // Rules for form validation
	            rules:
	            {
	                required:
	                {
	                    required: true
	                },
	                email:
	                {
	                    required: true,
	                    email: true
	                },
	                url:
	                {
	                    required: true,
	                    url: true
	                },
	                date:
	                {
	                    required: true,
	                    date: true
	                },
	                min:
	                {
	                    required: true,
	                    minlength: 5
	                },
	                max:
	                {
	                    required: true,
	                    maxlength: 5
	                },
	                range:
	                {
	                    required: true,
	                    rangelength: [5, 10]
	                },
	                digits:
	                {
	                    required: true,
	                    digits: true
	                },
	                number:
	                {
	                    required: true,
	                    number: true
	                },
	                minVal:
	                {
	                    required: true,
	                    min: 5
	                },
	                maxVal:
	                {
	                    required: true,
	                    max: 100
	                },
	                rangeVal:
	                {
	                    required: true,
	                    range: [5, 100]
	                }
	            },
	                                
	            // Messages for form validation
	            messages:
	            {
	                required:
	                {
	                    required: 'Please enter something'
	                },
	                email:
	                {
	                    required: 'Please enter your email address'
	                },
	                url:
	                {
	                    required: 'Please enter your URL'
	                },
	                date:
	                {
	                    required: 'Please enter some date'
	                },
	                min:
	                {
	                    required: 'Please enter some text'
	                },
	                max:
	                {
	                    required: 'Please enter some text'
	                },
	                range:
	                {
	                    required: 'Please enter some text'
	                },
	                digits:
	                {
	                    required: 'Please enter some digits'
	                },
	                number:
	                {
	                    required: 'Please enter some number'
	                },
	                minVal:
	                {
	                    required: 'Please enter some value'
	                },
	                maxVal:
	                {
	                    required: 'Please enter some value'
	                },
	                rangeVal:
	                {
	                    required: 'Please enter some value'
	                }
	            },                  
	            
	            // Do not change code below
	            errorPlacement: function(error, element)
	            {
	                error.insertAfter(element.parent());
	            }
	        });
        }

    };
}();
var VectorMap = function () {

    return {

        //Markers Vector Map
        initMarkerVectorMap: function () {
		    jQuery.noConflict();
		    jQuery(function(){
		      var $ = jQuery;

		      $('#focus-single').click(function(){
		        $('#map-markers').vectorMap;
		      });
		      $('#map-markers').vectorMap({
		        map: 'world_mill_en',
		        scaleColors: ['#C8EEFF', '#0071A4'],
		        normalizeFunction: 'polynomial',
		        hoverOpacity: 0.7,
		        hoverColor: false,
		        markerStyle: {
		          initial: {
		            fill: '#F8E23B',
		            stroke: '#383f47'
		          }
		        },
		        backgroundColor: '#383f47',
		        markers: [
		          {latLng: [41.90, 12.45], name: 'Vatican City'},
		          {latLng: [43.73, 7.41], name: 'Monaco'},
		          {latLng: [-0.52, 166.93], name: 'Nauru'},
		          {latLng: [-8.51, 179.21], name: 'Tuvalu'},
		          {latLng: [43.93, 12.46], name: 'San Marino'},
		          {latLng: [47.14, 9.52], name: 'Liechtenstein'},
		          {latLng: [7.11, 171.06], name: 'Marshall Islands'},
		          {latLng: [17.3, -62.73], name: 'Saint Kitts and Nevis'},
		          {latLng: [3.2, 73.22], name: 'Maldives'},
		          {latLng: [35.88, 14.5], name: 'Malta'},
		          {latLng: [12.05, -61.75], name: 'Grenada'},
		          {latLng: [13.16, -61.23], name: 'Saint Vincent and the Grenadines'},
		          {latLng: [13.16, -59.55], name: 'Barbados'},
		          {latLng: [17.11, -61.85], name: 'Antigua and Barbuda'},
		          {latLng: [-4.61, 55.45], name: 'Seychelles'},
		          {latLng: [7.35, 134.46], name: 'Palau'},
		          {latLng: [42.5, 1.51], name: 'Andorra'},
		          {latLng: [14.01, -60.98], name: 'Saint Lucia'},
		          {latLng: [6.91, 158.18], name: 'Federated States of Micronesia'},
		          {latLng: [1.3, 103.8], name: 'Singapore'},
		          {latLng: [1.46, 173.03], name: 'Kiribati'},
		          {latLng: [-21.13, -175.2], name: 'Tonga'},
		          {latLng: [15.3, -61.38], name: 'Dominica'},
		          {latLng: [-20.2, 57.5], name: 'Mauritius'},
		          {latLng: [26.02, 50.55], name: 'Bahrain'},
		          {latLng: [0.33, 6.73], name: 'São Tomé and Príncipe'}
		        ]
		      });
		    })
        },
        
        //Vector Map
        initVectorMap: function () {
		    jQuery.noConflict();
		    jQuery(function(){
		      var $ = jQuery;

		      $('#focus-single').click(function(){
		        $('#map1').vectorMap('set', 'focus', 'AU');
		      });
		      $('#focus-multiple').click(function(){
		        $('#map1').vectorMap('set', 'focus', ['AU', 'JP']);
		      });
		      $('#focus-init').click(function(){
		        $('#map1').vectorMap('set', 'focus', 1, 0, 0);
		      });
		      $('#map1').vectorMap({
		        map: 'world_mill_en',
		        focusOn: {
		          x: 0.5,
		          y: 0.5,
		          scale: 2
		        },
		        series: {
		          regions: [{
		            scale: ['#C8EEFF', '#0071A4'],
		            normalizeFunction: 'polynomial',
		            values: {
		              "AF": 16.63,
		              "AL": 11.58,
		              "DZ": 158.97,
		              "AO": 85.81,
		              "AG": 1.1,
		              "AR": 351.02,
		              "AM": 8.83,
		              "AU": 1219.72,
		              "AT": 366.26,
		              "AZ": 52.17,
		              "BS": 7.54,
		              "BH": 21.73,
		              "BD": 105.4,
		              "BB": 3.96,
		              "BY": 52.89,
		              "BE": 461.33,
		              "BZ": 1.43,
		              "BJ": 6.49,
		              "BT": 1.4,
		              "BO": 19.18,
		              "BA": 16.2,
		              "BW": 12.5,
		              "BR": 2023.53,
		              "BN": 11.96,
		              "BG": 44.84,
		              "BF": 8.67,
		              "BI": 1.47,
		              "KH": 11.36,
		              "CM": 21.88,
		              "CA": 1563.66,
		              "CV": 1.57,
		              "CF": 2.11,
		              "TD": 7.59,
		              "CL": 199.18,
		              "CN": 5745.13,
		              "CO": 283.11,
		              "KM": 0.56,
		              "CD": 12.6,
		              "CG": 11.88,
		              "CR": 35.02,
		              "CI": 22.38,
		              "HR": 59.92,
		              "CY": 22.75,
		              "CZ": 195.23,
		              "DK": 304.56,
		              "DJ": 1.14,
		              "DM": 0.38,
		              "DO": 50.87,
		              "EC": 61.49,
		              "EG": 216.83,
		              "SV": 21.8,
		              "GQ": 14.55,
		              "ER": 2.25,
		              "EE": 19.22,
		              "ET": 30.94,
		              "FJ": 3.15,
		              "FI": 231.98,
		              "FR": 2555.44,
		              "GA": 12.56,
		              "GM": 1.04,
		              "GE": 11.23,
		              "DE": 3305.9,
		              "GH": 18.06,
		              "GR": 305.01,
		              "GD": 0.65,
		              "GT": 40.77,
		              "GN": 4.34,
		              "GW": 0.83,
		              "GY": 2.2,
		              "HT": 6.5,
		              "HN": 15.34,
		              "HK": 226.49,
		              "HU": 132.28,
		              "IS": 12.77,
		              "IN": 1430.02,
		              "ID": 695.06,
		              "IR": 337.9,
		              "IQ": 84.14,
		              "IE": 204.14,
		              "IL": 201.25,
		              "IT": 2036.69,
		              "JM": 13.74,
		              "JP": 5390.9,
		              "JO": 27.13,
		              "KZ": 129.76,
		              "KE": 32.42,
		              "KI": 0.15,
		              "KR": 986.26,
		              "KW": 117.32,
		              "KG": 4.44,
		              "LA": 6.34,
		              "LV": 23.39,
		              "LB": 39.15,
		              "LS": 1.8,
		              "LR": 0.98,
		              "LY": 77.91,
		              "LT": 35.73,
		              "LU": 52.43,
		              "MK": 9.58,
		              "MG": 8.33,
		              "MW": 5.04,
		              "MY": 218.95,
		              "MV": 1.43,
		              "ML": 9.08,
		              "MT": 7.8,
		              "MR": 3.49,
		              "MU": 9.43,
		              "MX": 1004.04,
		              "MD": 5.36,
		              "MN": 5.81,
		              "ME": 3.88,
		              "MA": 91.7,
		              "MZ": 10.21,
		              "MM": 35.65,
		              "NA": 11.45,
		              "NP": 15.11,
		              "NL": 770.31,
		              "NZ": 138,
		              "NI": 6.38,
		              "NE": 5.6,
		              "NG": 206.66,
		              "NO": 413.51,
		              "OM": 53.78,
		              "PK": 174.79,
		              "PA": 27.2,
		              "PG": 8.81,
		              "PY": 17.17,
		              "PE": 153.55,
		              "PH": 189.06,
		              "PL": 438.88,
		              "PT": 223.7,
		              "QA": 126.52,
		              "RO": 158.39,
		              "RU": 1476.91,
		              "RW": 5.69,
		              "WS": 0.55,
		              "ST": 0.19,
		              "SA": 434.44,
		              "SN": 12.66,
		              "RS": 38.92,
		              "SC": 0.92,
		              "SL": 1.9,
		              "SG": 217.38,
		              "SK": 86.26,
		              "SI": 46.44,
		              "SB": 0.67,
		              "ZA": 354.41,
		              "ES": 1374.78,
		              "LK": 48.24,
		              "KN": 0.56,
		              "LC": 1,
		              "VC": 0.58,
		              "SD": 65.93,
		              "SR": 3.3,
		              "SZ": 3.17,
		              "SE": 444.59,
		              "CH": 522.44,
		              "SY": 59.63,
		              "TW": 426.98,
		              "TJ": 5.58,
		              "TZ": 22.43,
		              "TH": 312.61,
		              "TL": 0.62,
		              "TG": 3.07,
		              "TO": 0.3,
		              "TT": 21.2,
		              "TN": 43.86,
		              "TR": 729.05,
		              "TM": 0,
		              "UG": 17.12,
		              "UA": 136.56,
		              "AE": 239.65,
		              "GB": 2258.57,
		              "US": 14624.18,
		              "UY": 40.71,
		              "UZ": 37.72,
		              "VU": 0.72,
		              "VE": 285.21,
		              "VN": 101.99,
		              "YE": 30.02,
		              "ZM": 15.69,
		              "ZW": 5.57
		            }
		          }]
		        }
		      });
		    })
        }

    };
}();
if(typeof jQuery=="undefined"){throw new Error("jQuery is not loaded")}$.fn.zabuto_calendar=function(b){var c=$.extend({},$.fn.zabuto_calendar_defaults(),b);var a=$.fn.zabuto_calendar_language(c.language);c=$.extend({},c,a);this.each(function(){var u=$(this);u.attr("id","zabuto_calendar_"+Math.floor(Math.random()*99999).toString(36));u.data("initYear",c.year);u.data("initMonth",c.month);u.data("monthLabels",c.month_labels);u.data("weekStartsOn",c.weekstartson);u.data("navIcons",c.nav_icon);u.data("dowLabels",c.dow_labels);u.data("showToday",c.today);u.data("showDays",c.show_days);u.data("showPrevious",c.show_previous);u.data("showNext",c.show_next);u.data("cellBorder",c.cell_border);u.data("ajaxSettings",c.ajax);u.data("legendList",c.legend);u.data("actionFunction",c.action);u.data("actionNavFunction",c.action_nav);e();function e(){var w=parseInt(u.data("initYear"));var y=parseInt(u.data("initMonth"))-1;var z=new Date(w,y,1,0,0,0,0);u.data("initDate",z);var A=(u.data("cellBorder")===true)?" table-bordered":"";$tableObj=$('<table class="table'+A+'"></table>');$tableObj=r(u,$tableObj,z.getFullYear(),z.getMonth());$legendObj=g(u);var x=$('<div class="zabuto_calendar" id="'+u.attr("id")+'"></div>');x.append($tableObj);x.append($legendObj);u.append(x)}function r(y,A,x,z){var w=new Date(x,z,1,0,0,0,0);y.data("currDate",w);A.empty();A=q(y,A,x,z);A=n(y,A);A=s(y,A,x,z);v(y,x,z);return A}function g(y){var w=$('<div class="legend" id="'+y.attr("id")+'_legend"></div>');var x=y.data("legendList");if(typeof(x)=="object"&&x.length>0){$(x).each(function(C,E){if(typeof(E)=="object"){if("type" in E){var D="";if("label" in E){D=E.label}switch(E.type){case"text":if(D!==""){var B="";if("badge" in E){if(typeof(E.classname)==="undefined"){var F="badge-event"}else{var F=E.classname}B='<span class="badge '+F+'">'+E.badge+"</span> "}w.append('<span class="legend-'+E.type+'">'+B+D+"</span>")}break;case"block":if(D!==""){D="<span>"+D+"</span>"}if(typeof(E.classname)==="undefined"){var A="event"}else{var A="event-styled "+E.classname}w.append('<span class="legend-'+E.type+'"><ul class="legend"><li class="'+A+'"></li></u>'+D+"</span>");break;case"list":if("list" in E&&typeof(E.list)=="object"&&E.list.length>0){var z=$('<ul class="legend"></u>');$(E.list).each(function(H,G){z.append('<li class="'+G+'"></li>')});w.append(z)}break;case"spacer":w.append('<span class="legend-'+E.type+'"> </span>');break}}}})}return w}function q(L,z,I,G){var H=L.data("navIcons");var E=$('<span><span class="glyphicon glyphicon-chevron-left"></span></span>');var F=$('<span><span class="glyphicon glyphicon-chevron-right"></span></span>');if(typeof(H)==="object"){if("prev" in H){E.html(H.prev)}if("next" in H){F.html(H.next)}}var K=L.data("showPrevious");if(typeof(K)==="number"||K===false){K=h(L.data("showPrevious"),true)}var J=$('<div class="calendar-month-navigation"></div>');J.attr("id",L.attr("id")+"_nav-prev");J.data("navigation","prev");if(K!==false){prevMonth=(G-1);prevYear=I;if(prevMonth==-1){prevYear=(prevYear-1);prevMonth=11}J.data("to",{year:prevYear,month:(prevMonth+1)});J.append(E);if(typeof(L.data("actionNavFunction"))==="function"){J.click(L.data("actionNavFunction"))}J.click(function(N){r(L,z,prevYear,prevMonth)})}var D=L.data("showNext");if(typeof(D)==="number"||D===false){D=h(L.data("showNext"),false)}var B=$('<div class="calendar-month-navigation"></div>');B.attr("id",L.attr("id")+"_nav-next");B.data("navigation","next");if(D!==false){nextMonth=(G+1);nextYear=I;if(nextMonth==12){nextYear=(nextYear+1);nextMonth=0}B.data("to",{year:nextYear,month:(nextMonth+1)});B.append(F);if(typeof(L.data("actionNavFunction"))==="function"){B.click(L.data("actionNavFunction"))}B.click(function(N){r(L,z,nextYear,nextMonth)})}var M=L.data("monthLabels");var C=$("<th></th>").append(J);var w=$("<th></th>").append(B);var A=$("<span>"+M[G]+" "+I+"</span>");A.dblclick(function(){var N=L.data("initDate");r(L,z,N.getFullYear(),N.getMonth())});var x=$('<th colspan="5"></th>');x.append(A);var y=$('<tr class="calendar-month-header"></tr>');y.append(C,x,w);z.append(y);return z}function n(z,B){if(z.data("showDays")===true){var w=z.data("weekStartsOn");var x=z.data("dowLabels");if(w===0){var A=$.extend([],x);var C=new Array(A.pop());x=C.concat(A)}var y=$('<tr class="calendar-dow-header"></tr>');$(x).each(function(D,E){y.append("<th>"+E+"</th>")});B.append(y)}return B}function s(E,D,G,L){var C=E.data("ajaxSettings");var F=o(G,L);var w=k(G,L);var B=i(G,L,1);var N=i(G,L,w);var A=1;var z=E.data("weekStartsOn");if(z===0){if(N==6){F++}if(B==6&&(N==0||N==1||N==5)){F--}B++;if(B==7){B=0}}for(var y=0;y<F;y++){var x=$('<tr class="calendar-dow"></tr>');for(var I=0;I<7;I++){if(I<B||A>w){x.append("<td></td>")}else{var M=E.attr("id")+"_"+t(G,L,A);var K=M+"_day";var J=$('<div id="'+K+'" class="day" >'+A+"</div>");J.data("day",A);if(E.data("showToday")===true){if(l(G,L,A)){J.html('<span class="badge badge-today">'+A+"</span>")}}var H=$('<td id="'+M+'"></td>');H.append(J);H.data("date",t(G,L,A));H.data("hasEvent",false);if(typeof(E.data("actionFunction"))==="function"){H.addClass("dow-clickable");H.click(function(){E.data("selectedDate",$(this).data("date"))});H.click(E.data("actionFunction"))}x.append(H);A++}if(I==6){B=0}}D.append(x)}return D}function p(z,F,E,H){var G=$('<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>');var y=$('<h4 class="modal-title" id="'+z+'_modal_title">'+F+"</h4>");var I=$('<div class="modal-header"></div>');I.append(G);I.append(y);var D=$('<div class="modal-body" id="'+z+'_modal_body">'+E+"</div>");var C=$('<div class="modal-footer" id="'+z+'_modal_footer"></div>');if(typeof(H)!=="undefined"){var x=$("<div>"+H+"</div>");C.append(x)}var A=$('<div class="modal-content"></div>');A.append(I);A.append(D);A.append(C);var w=$('<div class="modal-dialog"></div>');w.append(A);var B=$('<div class="modal fade" id="'+z+'_modal" tabindex="-1" role="dialog" aria-labelledby="'+z+'_modal_title" aria-hidden="true"></div>');B.append(w);B.data("dateId",z);B.attr("dateId",z);return B}function v(x,w,A){var z=x.data("ajaxSettings");x.data("events",false);if(z===false){return true}if(typeof(z)!="object"||typeof(z.url)=="undefined"){alert("Invalid calendar event settings");return false}var y={year:w,month:(A+1)};$.ajax({type:"GET",url:z.url,data:y,dataType:"json"}).done(function(B){var C=[];$.each(B,function(E,D){C.push(B[E])});x.data("events",C);j(x)})}function j(x){var y=x.data("ajaxSettings");var w=x.data("events");if(w!==false){$(w).each(function(B,F){var G=x.attr("id")+"_"+F.date;var C=$("#"+G);var A=$("#"+G+"_day");C.data("hasEvent",true);if(typeof(F.title)!=="undefined"){C.attr("title",F.title)}if(typeof(F.classname)==="undefined"){C.addClass("event")}else{C.addClass("event-styled");A.addClass(F.classname)}if(typeof(F.badge)!=="undefined"&&F.badge!==false){var E=(F.badge===true)?"":" badge-"+F.badge;var D=A.data("day");A.html('<span class="badge badge-event'+E+'">'+D+"</span>")}if(typeof(F.body)!=="undefined"){if("modal" in y&&(y.modal===true)){C.addClass("event-clickable");var z=p(G,F.title,F.body,F.footer);$("body").append(z);$("#"+G).click(function(){$("#"+G+"_modal").modal()})}}})}}function l(y,z,x){var A=new Date();var w=new Date(y,z,x);return(w.toDateString()==A.toDateString())}function t(x,y,w){d=(w<10)?"0"+w:w;m=y+1;m=(m<10)?"0"+m:m;return x+"-"+m+"-"+d}function i(y,z,x){var w=new Date(y,z,x,0,0,0,0);var A=w.getDay();if(A==0){A=6}else{A--}return A}function k(x,y){var w=28;while(f(x,y+1,w+1)){w++}return w}function o(y,A){var w=k(y,A);var C=i(y,A,1);var z=i(y,A,w);var B=w;var x=(C-z);if(x>0){B+=x}return Math.ceil(B/7)}function f(z,w,x){return w>0&&w<13&&z>0&&z<32768&&x>0&&x<=(new Date(z,w,0)).getDate()}function h(y,A){if(y===false){y=0}var z=u.data("currDate");var x=u.data("initDate");var w;w=(x.getFullYear()-z.getFullYear())*12;w-=z.getMonth()+1;w+=x.getMonth();if(A===true){if(w<(parseInt(y)-1)){return true}}else{if(w>=(0-parseInt(y))){return true}}return false}});return this};$.fn.zabuto_calendar_defaults=function(){var a=new Date();var c=a.getFullYear();var e=a.getMonth()+1;var b={language:false,year:c,month:e,show_previous:true,show_next:true,cell_border:false,today:false,show_days:true,weekstartson:1,nav_icon:false,ajax:false,legend:false,action:false,action_nav:false};return b};$.fn.zabuto_calendar_language=function(a){if(typeof(a)=="undefined"||a===false){a="en"}switch(a.toLowerCase()){case"de":return{month_labels:["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],dow_labels:["Mo","Di","Mi","Do","Fr","Sa","So"]};break;case"en":return{month_labels:["January","February","March","April","May","June","July","August","September","October","November","December"],dow_labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]};break;case"es":return{month_labels:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],dow_labels:["Lu","Ma","Mi","Ju","Vi","Sá","Do"]};break;case"fr":return{month_labels:["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],dow_labels:["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"]};break;case"it":return{month_labels:["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"],dow_labels:["Lun","Mar","Mer","Gio","Ven","Sab","Dom"]};break;case"nl":return{month_labels:["Januari","Februari","Maart","April","Mei","Juni","Juli","Augustus","September","Oktober","November","December"],dow_labels:["Ma","Di","Wo","Do","Vr","Za","Zo"]};break;case"pt":return{month_labels:["Janeiro","Fevereiro","Marco","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],dow_labels:["S","T","Q","Q","S","S","D"]};break}};
/**
 * when someone intends to become a provider, is sends the email
 * to the admin
 * 
 * there are two fields which can be filled with the provider candidate
 * email, so:
 * 
 * @params [field] contains the number 1 or 2, to identify which
 *        field the provider candidate has filled
 *
 */

var sendNoteToBecomePartner = function(field) {
  var email = $("#provider_email_" + field).val();
  // this uses a function to validate if the email is a valid email
  if (validEmail(email)) {
    $.ajax({
      type: 'GET',
      url: '/provider_intention_note',
      dataType: "json",
      data: { 
      	'email': email
      },
      success: function(data) {
        if (data.status == "success") {
          alertMessage("become_a_partner_alert_" + field, "Thank you for your interest in become our partner. We are going to contact you as soon as possible.", "success", false);
          $("#provider_email_" + field).val("");
      	}
      	else if (data.status == "fail") {
      	  alertMessage("become_a_partner_alert_" + field, "Please try again with an valid email", "warning", false);
      	}
      },
      error: function(data) {
        alertMessage("become_a_partner_alert_" + field, "Sorry, something went wrong.", "warning", false);
      	console.log("error");
      	console.log(data);
      }
    });
  }
  else {
    alertMessage("become_a_partner_alert_" + field, "Please use a valid email.", "warning", false);
    $("#provider_email_" + field).focus();
  }
};
(function() {


}).call(this);
/*
$("#mainImage").change(function(){
    readURL(this, "mainImagePreview");
});

var pictureChange = function(picture_id) {
	if (picture_id === 0) {
		$("#mainImageLabel").val($("#provider_picture").val());
	}
	else {
		$("#pictureLabelToChange" + picture_id).val($("#pictureToChange" + picture_id).val());
	}
};*/


var readURL = function (input, img_id) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#' + img_id).attr('src', e.target.result);
			$('#' + img_id).removeClass("hidden");
			uploadProviderPictureSelf($("#provider_id").val());
        };
        reader.readAsDataURL(input.files[0]);
    }
    pictureChange(0);
};

var current_provider_image = "";
var showImageToProvider = function (input) {
    current_provider_image = $('#provider_main_image').attr('src');
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#provider_main_image').attr('src', e.target.result);
            console.log(e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
};

var current_provider_image = "";
var showImageToProviderModal = function (input) {
    current_provider_image = $('#provider_main_image').attr('src');
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#provider_main_image').attr('src', e.target.result);
            console.log(e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
};
/*
 * 
 */

 
var resetProviderDashBoard = function() {
  clearMessages();
};
 
var showAppointmentDetail = function(appointment_id, type, past) {
  past = typeof past !== 'undefined' ? past : false;
  $.ajax({
    type: 'GET',
    url: '/appointment_detail',
    dataType: "json",
    data: { 
    	'appointment_id': appointment_id
    },
    success: function(data) {
      if (data.status == "success") {
        var content = "";
        var footer = "";
        /*
        content += "<div class=\"row\">";
        content += "  <div class=\"col-md-10 col-md-offset-1\">";
        content += "    <div class=\"headline\"><h2>Appointment details</h2></div>";
        content += "  </div>";
        content += "</div>";
        */
        switch (type) {
          case 0:
            content = $('<div/>').append(
              $('<div/>').addClass('row').append(
                $('<div/>').addClass('col-md-10 col-md-offset-1').append(
                  $('<h2/>').append('Client Info')
                )
              )
            ).append(
              $('<div/>').addClass('row').append(
                $('<div/>').addClass('col-md-10 col-md-offset-1').append(
                  $('<label/>').append('Appontment type')
                ).append($('<br>')).append(appointment_types[data.appointment.appointment_type])
              )
            ).append($('<br>')).append(
              $('<div/>').addClass('row').append(
                $('<div/>').addClass('col-md-5 col-md-offset-1').append(
                  $('<label/>').append('Client')
                ).append($('<br>')).append(data.client.first_name + " " + data.client.last_name)
              ).append(
                $('<div/>').addClass('col-md-5 col-md-offset-0').append(
                  $('<label/>').append('Weeks pregnant')
                ).append($('<br>')).append(data.client.weeks_pregnant)
              )
            ).append($('<br>')).append(
              $('<div/>').addClass('row').append(
                $('<div/>').addClass('col-md-5 col-md-offset-1').append(
                  $('<label/>').append('Email')
                ).append($('<br>')).append(data.client.email)
              ).append(
                $('<div/>').addClass('col-md-5 col-md-offset-0').append(
                  $('<label/>').append('Phone')
                ).append($('<br>')).append(data.client.phone)
              )
            ).append($('<br>')).append(
              $('<div/>').addClass('row').append(
                $('<div/>').addClass('col-md-10 col-md-offset-1').append(
                  $('<label/>').append('Address')
                ).append($('<br>')).append(data.client.address)
              )
            ).append($('<hr>')).append(
              $('<div/>').addClass('row').append(
                $('<div/>').addClass('col-md-10 col-md-offset-1').append(
                  $('<h2/>').append('Provider Info')
                )
              )
            ).append(
              $('<div/>').addClass('row').append(
                $('<div/>').addClass('col-md-5 col-md-offset-1').append(
                  $('<label/>').append('Provider')
                ).append($('<br>')).append(data.provider.first_name + " " + data.provider.last_name)
              ).append(
                $('<div/>').addClass('col-md-5 col-md-offset-0').append(
                  $('<label/>').append('Expertise')
                ).append($('<br>')).append(data.provider.expertise)
              )
            ).append($('<br>')).append(
              $('<div/>').addClass('row').append(
                $('<div/>').addClass('col-md-5 col-md-offset-1').append(
                  $('<label/>').append('Email')
                ).append($('<br>')).append(data.provider.email)
              ).append(
                $('<div/>').addClass('col-md-5 col-md-offset-0').append(
                  $('<label/>').append('Phone')
                ).append($('<br>')).append(data.provider.phone)
              )
            ).append($('<hr>')).append(
              $('<div/>').addClass('row').append(
                $('<div/>').addClass('col-md-10 col-md-offset-1').append(
                  $('<h2/>').append('Appointment Info')
                )
              )
            ).append(
              $('<div/>').addClass('row').append(
                $('<div/>').addClass('col-md-5 col-md-offset-1').append(
                  $('<label/>').append('Date')
                ).append($('<br>')).append(data.date)
              ).append(
                $('<div/>').addClass('col-md-5 col-md-offset-0').append(
                  $('<label/>').append('Address')
                ).append($('<br>')).append(data.client.address)
              )
            ).append($('<br>')).append(
              $('<div/>').addClass('row').append(
                $('<div/>').addClass('col-md-10 col-md-offset-1').append(
                  $('<label/>').append('Observation')
                ).append($('<br>')).append(data.appointment.client_observation)
              )
            );
            footer = $('<button/>').addClass('btn btn-default').prop('type', 'button').append(
              $('<i/>').addClass('fa fa-remove')
            ).append(' Close').click(function() {
              $('#generic_modal').modal('hide');
            });
            break;
          case 1:
            content += "<div class=\"row\">";
            content += "  <div class=\"col-md-10 col-md-offset-1\">";
            content += "    <label>Appointment type:</label> " + appointment_types[data.appointment.appointment_type];
            content += "  </div>";
            content += "</div>";
            
            content += "<div class=\"row\">";
            content += "  <div class=\"col-md-5 col-md-offset-1\">";
            content += "    <label>Client:</label> " + data.client.first_name + " " + data.client.last_name;
            content += "  </div>";
            content += "  <div class=\"col-md-5\">";
            content += "    <label>Weeks pregnant:</label> " + data.client.weeks_pregnant;
            content += "  </div>";
            content += "</div>";
            content += "<div class=\"row\">";
            content += "  <div class=\"col-md-10 col-md-offset-1\">";
            content += "    <label>When:</label> " + data.date;
            content += "  </div>";
            content += "</div>";
            content += "<div class=\"row\">";
            content += "  <div class=\"col-md-10 col-md-offset-1\">";
            content += "    <label>Observations:</label>";
        		content += "    <p class=\"well\">" + data.appointment.client_observation + "</p>";
            content += "  </div>";
            content += "</div>";
            content += "<div class=\"row\">";
            content += "  <div class=\"col-md-10 col-md-offset-1\">";
            content += "    <p class=\"lead\">Contact Info</p>";
            content += "  </div>";
            content += "</div>";
            content += "<div class=\"row\">";
            content += "  <div class=\"col-md-10 col-md-offset-1\">";
            content += "    <label>Phone:</label> " + data.client.phone;
            content += "  </div>";
            content += "</div>";
            content += "<div class=\"row\">";
            content += "  <div class=\"col-md-10 col-md-offset-1\">";
            content += "    <label>Email:</label> " + data.client.email;
            content += "  </div>";
            content += "</div>";
            content += "<div class=\"row\">";
            content += "  <div class=\"col-md-10 col-md-offset-1\">";
            content += "    <label>Address:</label> " + data.client.address;
            content += "  </div>";
            content += "</div>";
            footer += "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\"><i class=\"fa fa-remove\"></i> Close</button>";
            if (!past) {
              footer += "<a href=\"javascript: acceptAppointmentWizard(" + appointment_id + "," + type + ");\" class=\"btn btn-primary\" ><i class=\"fa fa-thumbs-o-up\"></i> Accept</a>";
              footer += "<a href=\"javascript: denyAppointmentWizard(" + appointment_id + "," + type + ");\" class=\"btn btn-danger\" ><i class=\"fa fa-thumbs-o-down\"></i> Deny</a>";
              //footer += "<a href=\"javascript: rescheduleAppointmentWizard(" + appointment_id + "," + type + ");\" class=\"btn btn-warning\" ><i class=\"fa fa-clock-o\"></i> Reschedule</a>";
            }
            break;
          case 2:
            // code
            break;
        }
        $("#generic_modal_title").html("Appointment details");
        $("#generic_modal_body").html(content);
        $("#generic_modal_footer").html(footer);
        $("#generic_modal").modal("show");
    	}
    	else if (data.status == "fail") {
    	  alertMessage("top_page_message", "Appointment not found.", "warning", false);
    	}
    },
    error: function(data) {
      alertMessage("top_page_message", "Some error happened.", "danger", false);
    	console.log("error");
    	console.log(data);
    }
  });
};

var working_on_accepting = false;
var acceptAppointmentWizard = function(appointment_id, type) {
  $("#generic_modal").modal("hide");
  if (!working_on_accepting) {
    working_on_accepting = true;
    $.ajax({
      type: 'GET',
      url: '/accept_appointment',
      dataType: "json",
      data: { 
      	'appointment_id': appointment_id
      },
      success: function(data) {
        if (data.status == "success") {
          $("#generic_modal").modal("hide");
          switch (type) {
            case 0:
              reloadAdminAppointments();
              break;
            case 1:
              reloadProviderAppointments();
              break;
            case 2:
              // code
              break;
          }
      	}
      	else if (data.status == "fail") {
      	  alertMessage("top_page_message", "Appointment not found.", "warning", false);
      	}
      	working_on_accepting = false;
      },
      error: function(data) {
        alertMessage("top_page_message", "Some error happened.", "danger", false);
      	console.log("error");
      	console.log(data);
      	working_on_accepting = false;
      }
    });
  }
};

var denyAppointmentWizard = function(appointment_id, type) {
  var content = "";
  var footer = "";
  content += "<div class=\"row\">";
  content += "  <div class=\"col-md-10 col-md-offset-1\">";
  content += "    <p class=\"lead\">Please, give a brief explanation about why you are canceling this appointment:</p>";
  content += "    <textarea class=\"form-control\" id=\"deny_explanation\" placeholder=\"Brief explanation\" rows=\"8\"></textarea>"
  content += "  </div>";
  content += "</div>";
  footer += "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\"><i class=\"fa fa-remove\"></i> Close</button>";
  footer += "<a href=\"javascript: denyAppointment(" + appointment_id + "," + type + ");\" class=\"btn btn-danger\" >OK</a>";
  $("#generic_modal_title").html("Cancel appointment");
  $("#generic_modal_body").html(content);
  $("#generic_modal_footer").html(footer);
  $("#generic_modal").modal("show");
};

var working_on_denying = false;
var denyAppointment = function(appointment_id, type) {
  clearMessage();
  if (!validNotEmpty($("#deny_explanation").val())) {
    alertMessage("generic_modal_alert", "Please, give an explanation about why you are canceling this appointment.", "warning", false);
    $("#deny_explanation").focus();
  }
  else {
    if (!working_on_denying) {
      working_on_denying = true;
      $.ajax({
        type: 'GET',
        url: '/deny_appointment',
        dataType: "json",
        data: { 
        	'appointment_id': appointment_id,
        	'deny_explanation': $("#deny_explanation").val()
        },
        success: function(data) {
          if (data.status == "success") {
            $("#generic_modal").modal("hide");
            $("#deny_explanation").val("");
            switch (type) {
              case 0:
                reloadAdminAppointments();
                break;
              case 1:
                reloadProviderAppointments();
                break;
              case 2:
                // code
                break;
            }
        	}
        	else if (data.status == "fail") {
        	  alertMessage("generic_modal_alert", "Appointment not found.", "warning", false);
        	}
        	working_on_denying = false;
        },
        error: function(data) {
          alertMessage("generic_modal_alert", "Some error happened.", "danger", false);
        	console.log("error");
        	console.log(data);
        	working_on_denying = false;
        }
      });
    }
  }
};

var rescheduleAppointmentWizard = function(appointment_id, type) {
  var content = "";
  var footer = "";
  content += "<div class=\"row\">";
  content += "  <div class=\"col-md-10 col-md-offset-1\">";
  content += "    <p class=\"lead\">These must be used only in <span class=\"test-danger\"><b>URGENT</b></span> cases.</p>";
  content += "    <p class=\"lead\">Please, use the field below to suggest a new schedule for your client.</p>";
  content += "    <textarea class=\"form-control\" id=\"reschedule_explanation\" placeholder=\"Schedule suggestion\" rows=\"8\"></textarea>"
  content += "    <br>";
  content += "    <p class=\"lead\"><i class=\"fa fa-asterisk\"></i> These appointment will be canceled.</p>";
  content += "  </div>";
  content += "</div>";
  footer += "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\"><i class=\"fa fa-remove\"></i> Close</button>";
  footer += "<a href=\"javascript: rescheduleAppointment(" + appointment_id + "," + type + ");\" class=\"btn btn-warning\" ><i class=\"fa fa-clock-o\"></i> Reschedule</a>";
  $("#generic_modal_title").html("Reschedule appointment");
  $("#generic_modal_body").html(content);
  $("#generic_modal_footer").html(footer);
  $("#generic_modal").modal("show");
};

var working_on_rescheduling = false;
var rescheduleAppointment = function(appointment_id, type) {
  clearMessage();
  if (!validNotEmpty($("#reschedule_explanation").val())) {
    alertMessage("generic_modal_alert", "Please, give a suggestion of schedule this appointment.", "warning", false);
    $("#reschedule_explanation").focus();
  }
  else {
    if (!working_on_rescheduling) {
      working_on_rescheduling = true;
      $.ajax({
        type: 'GET',
        url: '/reschedule_appointment',
        dataType: "json",
        data: { 
        	'appointment_id': appointment_id,
        	'reschedule_explanation': $("#reschedule_explanation").val()
        },
        success: function(data) {
          if (data.status == "success") {
            $("#generic_modal").modal("hide");
            $("#reschedule_explanation").val("");
            switch (type) {
              case 0:
                reloadAdminAppointments();
                break;
              case 1:
                reloadProviderAppointments();
                break;
              case 2:
                // code
                break;
            }
        	}
        	else if (data.status == "fail") {
        	  alertMessage("generic_modal_alert", "Appointment not found.", "warning", false);
        	}
        	working_on_rescheduling = false;
        },
        error: function(data) {
          alertMessage("generic_modal_alert", "Some error happened.", "danger", false);
        	console.log("error");
        	console.log(data);
        	working_on_rescheduling = false;
        }
      });
    }
  }
};


/**
 * this function should reload the appointments
 * in the admin's dashboard
 * 
 * @author: Thiago Melo
 * @version: 2015-03-17
 */
var reloadAdminAppointments = function() {
  $.ajax({
    type: 'GET',
    url: '/provider_appointments',
    dataType: "json",
    data: { 
    	'provider_id': "0"
    },
    success: function(data) {
      var tbody_pending = $('<tbody/>');
      var tbody_confirmed = $('<tbody/>');
      var tbody_denied = $('<tbody/>');
      var has_pending = false;
      var has_confirmed = false;
      var has_denied = false;
      
      if (data.status == "success") {
        $.each(data.appointments, function(i, appointment) {
    		  if (appointment.accepted == 0) {
    		    has_pending = true;
    		    tbody_pending.append(
    		      $('<tr/>').append(
    		        $('<td/>').append(data.full_providers[i].first_name + " " + data.full_providers[i].last_name)
    		      ).append(
    		        $('<td/>').append(data.full_clients[i].first_name + " " + data.full_clients[i].last_name)
    		      ).append(
    		        $('<td/>').append(data.full_clients[i].email)
    		      ).append(
    		        $('<td/>').append(data.full_clients[i].phone)
    		      ).append(
    		        $('<td/>').append(data.dates[i])
    		      ).append(
    		        $('<td/>').prop('align', 'center').append(
    		          $('<a/>').addClass('text-primary').click(function() {
    		            acceptAppointmentWizard(appointment.id, 0);
    		          }).append($('<i/>').addClass('fa fa-thumbs-o-up'))
    		        )
    		      ).append(
    		        $('<td/>').prop('align', 'center').append(
    		          $('<a/>').addClass('text-danger').click(function() {
    		            denyAppointmentWizard(appointment.id, 0);
    		          }).append($('<i/>').addClass('fa fa-thumbs-o-down'))
    		        )
    		      ).append(
    		        $('<td/>').prop('align', 'center').append(
    		          $('<a/>').addClass('text-primary').click(function() {
    		            showAppointmentDetail(appointment.id, 0);
    		          }).append($('<i/>').addClass('fa fa-arrow-circle-right'))
    		        )
    		      )
    		    );
    		  }
    		  else if (appointment.accepted == 1) {
    		    has_confirmed = true;
    		    tbody_confirmed.append(
    		      $('<tr/>').append(
    		        $('<td/>').append(data.full_providers[i].first_name + " " + data.full_providers[i].last_name)
    		      ).append(
    		        $('<td/>').append(data.full_clients[i].first_name + " " + data.full_clients[i].last_name)
    		      ).append(
    		        $('<td/>').append(data.full_clients[i].email)
    		      ).append(
    		        $('<td/>').append(data.full_clients[i].phone)
    		      ).append(
    		        $('<td/>').append(data.dates[i])
    		      ).append(
    		        $('<td/>').prop('align', 'center').append(
    		          $('<a/>').addClass('text-danger').click(function() {
    		            denyAppointmentWizard(appointment.id, 0);
    		          }).append($('<i/>').addClass('fa fa-thumbs-o-down'))
    		        )
    		      ).append(
    		        $('<td/>').prop('align', 'center').append(
    		          $('<a/>').addClass('text-primary').click(function() {
    		            showAppointmentDetail(appointment.id, 0);
    		          }).append($('<i/>').addClass('fa fa-arrow-circle-right'))
    		        )
    		      )
    		    );
    		  }
    		  else if (appointment.accepted == 2) {
    		    has_denied = true;
    		    tbody_denied.append(
    		      $('<tr/>').append(
    		        $('<td/>').append(data.full_providers[i].first_name + " " + data.full_providers[i].last_name)
    		      ).append(
    		        $('<td/>').append(data.full_clients[i].first_name + " " + data.full_clients[i].last_name)
    		      ).append(
    		        $('<td/>').append(data.full_clients[i].email)
    		      ).append(
    		        $('<td/>').append(data.full_clients[i].phone)
    		      ).append(
    		        $('<td/>').append(data.dates[i])
    		      ).append(
    		        $('<td/>').prop('align', 'center').append(
    		          $('<a/>').addClass('text-primary').click(function() {
    		            acceptAppointmentWizard(appointment.id, 0);
    		          }).append($('<i/>').addClass('fa fa-thumbs-o-up'))
    		        )
    		      ).append(
    		        $('<td/>').prop('align', 'center').append(
    		          $('<a/>').addClass('text-primary').click(function() {
    		            showAppointmentDetail(appointment.id, 0);
    		          }).append($('<i/>').addClass('fa fa-arrow-circle-right'))
    		        )
    		      )
    		    );
    		  }
				});
				
        if (has_pending) {
          $("#pending_appointments").empty().append(
  		      $('<h2/>').append('Pending appointments')
  		    ).append(
		        $('<table/>').addClass('table table-striped table-hover').append(
	            $('<thead/>').append(
                $('<tr/>')
                  .append($('<th/>').append('Provider'))
                  .append($('<th/>').append('Client'))
                  .append($('<th/>').append('Email'))
                  .append($('<th/>').append('Phone'))
                  .append($('<th/>').append('Date '))
                  .append($('<th/>').prop('align', 'center').append('Accept'))
                  .append($('<th/>').prop('align', 'center').append('Deny'))
                  .append($('<th/>').prop('align', 'center').append('Details'))
              )
	          ).append(tbody_pending)
		      ).append($('<hr>'));
        }
        else {
          $("#pending_appointments").html("");
          $("#no_pending_appointments").html("<br><br><h2>There is no pending appointments.</h2>");
        }
        
        if (has_confirmed) {
          $("#confirmed_appointments").empty().append(
  		      $('<h2/>').append('Upcoming appointments')
  		    ).append(
		        $('<table/>').addClass('table table-striped table-hover').append(
	            $('<thead/>').append(
                $('<tr/>')
                  .append($('<th/>').append('Provider'))
                  .append($('<th/>').append('Client'))
                  .append($('<th/>').append('Email'))
                  .append($('<th/>').append('Phone'))
                  .append($('<th/>').append('Date '))
                  .append($('<th/>').prop('align', 'center').append('Deny'))
                  .append($('<th/>').prop('align', 'center').append('Details'))
              )
	          ).append(tbody_confirmed)
		      ).append($('<hr>'));
        }
        else {
          $("#confirmed_appointments").html("");
          $("#no_confirmed_appointments").html("<br><br><h2>There is no confirmed appointments.</h2>");
        }
        
        if (has_denied) {
          $("#denied_appointments").empty().append(
  		      $('<h2/>').append('Denied appointments')
  		    ).append(
		        $('<table/>').addClass('table table-striped table-hover').append(
	            $('<thead/>').append(
                $('<tr/>')
                  .append($('<th/>').append('Provider'))
                  .append($('<th/>').append('Client'))
                  .append($('<th/>').append('Email'))
                  .append($('<th/>').append('Phone'))
                  .append($('<th/>').append('Date '))
                  .append($('<th/>').prop('align', 'center').append('Accept'))
                  .append($('<th/>').prop('align', 'center').append('Details'))
              )
	          ).append(tbody_denied)
		      ).append($('<hr>'));
        }
        else {
          $("#denied_appointments").html("");
          $("#no_denied_appointments").html("<br><br><h2>There is no denied appointments.</h2>");
        }
    	}
    	else if (data.status == "fail") {
    	  alertMessage("top_page_message", "Appointment not found.", "warning", false);
    	}
    },
    error: function(data) {
      alertMessage("top_page_message", "Some error happened.", "danger", false);
    	console.log("error");
    	console.log(data);
    }
  });
}

var reloadProviderAppointments = function() {
  $.ajax({
    type: 'GET',
    url: '/provider_appointments',
    dataType: "json",
    data: { 
    	'provider_id': $("#provider_id").val()
    },
    success: function(data) {
      if (data.status == "success") {
        var content_pending = "";
        var content_confirmed = "";
        var has_pending = false;
        var has_confirmed = false;
        content_confirmed += "<br><br>";
    		content_confirmed += "<h1><i class=\"fa fa-thumbs-o-up\"></i> Confirmed</h1>";
    		content_confirmed += "<table class=\"table table-striped table-hover\">";
    		content_confirmed += "	<thead>";
    		content_confirmed += "		<tr>";
    		content_confirmed += "			<th>Client</th>";
    		content_confirmed += "			<th>Date</th>";	
    		content_confirmed += "			<th align=\"center\">Deny</th>";
    		//content_confirmed += "			<th align=\"center\">Reschedule</th>";
    		content_confirmed += "		</tr>";
    		content_confirmed += "	</thead>";
    		content_confirmed += "	<tbody>";
    		
    		content_pending += "<br><br>";
    		content_pending += "<h1><i class=\"fa fa-inbox\"></i> Pending</h1>";
    		content_pending += "<table class=\"table table-striped table-hover\">";
    		content_pending += "	<thead>";
    		content_pending += "		<tr>";
    		content_pending += "			<th>Client</th>";
    		content_pending += "			<th>Date</th>";	
    		content_pending += "			<th align=\"center\">Accept</th>";
    		content_pending += "			<th align=\"center\">Deny</th>";
    		//content_pending += "			<th align=\"center\">Reschedule</th>";
    		content_pending += "		</tr>";
    		content_pending += "	</thead>";
    		content_pending += "	<tbody>";
    		$.each(data.appointments, function(i, appointment) {
    		  if (appointment.accepted == 0) {
    		    has_pending = true;
    		    content_pending += "<tr class=\"lead\">";
    				content_pending += "	<td><a href=\"javascript: showAppointmentDetail(" + appointment.id + ", 1);\" class=\"text-primary\">" + data.clients[i] + "</a></td>";
    				content_pending += "	<td>" + data.dates[i] + "</td>";
    				content_pending += "	<td align=\"center\"><a href=\"javascript: acceptAppointmentWizard(" + appointment.id + ", 1);\" class=\"text-primary\"><i class=\"fa fa-thumbs-o-up\"></i></a></td>";
    				content_pending += "	<td align=\"center\"><a href=\"javascript: denyAppointmentWizard(" + appointment.id + ", 1);\" class=\"text-danger\"><i class=\"fa fa-thumbs-o-down\"></i></a></td>";
    				//content_pending += "	<td align=\"center\"><a href=\"javascript: rescheduleAppointmentWizard(" + appointment.id + ", 1);\" class=\"text-warning\"><i class=\"fa fa-clock-o\"></i></a></td>";
    				content_pending += "</tr>";
    		  }
    		  else if (appointment.accepted == 1) {
    		    has_confirmed = true;
    		    content_confirmed += "<tr class=\"lead\">";
    				content_confirmed += "	<td><a href=\"javascript: showAppointmentDetail(" + appointment.id + ", 1);\" class=\"text-primary\">" + data.clients[i] + "</a></td>";
    				content_confirmed += "	<td>" + data.dates[i] + "</td>";
    				content_confirmed += "	<td align=\"center\"><a href=\"javascript: denyAppointmentWizard(" + appointment.id + ", 1);\" class=\"text-danger\"><i class=\"fa fa-thumbs-o-down\"></i></a></td>";
    				//content_confirmed += "	<td align=\"center\"><a href=\"javascript: rescheduleAppointmentWizard(" + appointment.id + ", 1);\" class=\"text-warning\"><i class=\"fa fa-clock-o\"></i></a></td>";
    				content_confirmed += "</tr>";
    		  }
				});
    		content_confirmed += "	</tbody>";
    		content_confirmed += "</table>";
        content_pending += "	</tbody>";
    		content_pending += "</table>";
        if (has_confirmed || has_pending) {
          $("#pending_appointments").html(has_pending ? content_pending : "");
          $("#confirmed_appointments").html(has_confirmed ? content_confirmed : "");
          $("#no_appointments").html("");
        }
        else {
          $("#pending_appointments").html("");
          $("#confirmed_appointments").html("");
          var no_appointments = "";
          no_appointments += "<br><br>";
          no_appointments += "<h1>You have no appointments booked.</h1>";
          $("#no_appointments").html(no_appointments);
        }
        
    	}
    	else if (data.status == "fail") {
    	  alertMessage("top_page_message", "Appointment not found.", "warning", false);
    	}
    },
    error: function(data) {
      alertMessage("top_page_message", "Some error happened.", "danger", false);
    	console.log("error");
    	console.log(data);
    }
  });
};

/*
 * It is used for the provider change her or his password, it requires the
 * provider to be logged in to perform the change
 * Last update: 2015-02-19 by @thiago
 */
var selfChangeProviderPassword = function() {
	clearMessage("top_page_message");
	
	// validate password
	if (!validPassword($("#provider_old_password").val()) || !validPassword($("#provider_password").val()) || !validPassword($("#provider_password_confirmation").val())) {
		$("#provider_old_password").val("");
		$("#provider_password_confirmation").val("");
		$("#provider_password").val("");
		$("#provider_password").focus();
		alertMessage("top_page_message", "Invalid passwords. Password must be at least 6 characters long.", "warning", false);
		return;
	}
	
	if ($("#provider_password").val() != $("#provider_password_confirmation").val()) {
		$("#provider_old_password").val("");
		$("#provider_password_confirmation").val("");
		$("#provider_password").val("");
		$("#provider_password").focus();
		alertMessage("top_page_message", "Password don't match.", "warning", false);
		return;
	}
	
	$.ajax({
    type: 'GET',
    url: '/self_change_provider_password',
    dataType: "json",
    data: { 
    	'provider_id': $("#providers_list").val(),
    	'provider[old_password]': $("#provider_old_password").val(),
    	'provider[password]': $("#provider_password").val(),
    	'provider[password_confirmation]': $("#provider_password_confirmation").val()
    },
    success: function(data) {
      if (data.status == "success") {
        alertMessage("top_page_message", "Password updated.", "success", false);
    	}
    	else if (data.status == "fail") {
    	  alertMessage("top_page_message", "Provider not found.", "warning", false);
    	}
    	$("#provider_old_password").val("");
    	$("#provider_password").val("");
  		$("#provider_password_confirmation").val("");
    },
    error: function(data) {
      alertMessage("top_page_message", "Some error happened.", "danger", false);
    	console.log("error");
    	console.log(data);
    }
  });
};

/* -------------------------------------------------------------------------- */

var enableEditProvider = function() {
	if ($("#provider_first_name").prop("disabled")) {
		$("#provider_first_name").prop("disabled", false);
		$("#provider_last_name").prop("disabled", false);
		$("#provider_email").prop("disabled", false);
		$("#provider_phone").prop("disabled", false);
		$("#provider_expertise").prop("disabled", false);
		$("#provider_abstract").prop("disabled", false);
		$("#provider_about").prop("disabled", false);
		
		$("#edit_provider_button").html("<i class=\"fa fa-toggle-on\"></i> Cancel");
		$("#save_provider_button").show();
	}
	else {
		resetProviderInfo();
		$("#provider_first_name").prop("disabled", true);
		$("#provider_last_name").prop("disabled", true);
		$("#provider_email").prop("disabled", true);
		$("#provider_phone").prop("disabled", true);
		$("#provider_expertise").prop("disabled", true);
		$("#provider_abstract").prop("disabled", true);
		$("#provider_about").prop("disabled", true);
		
		$("#edit_provider_button").html("<i class=\"fa fa-toggle-off\"></i> Edit Info");
		$("#save_provider_button").hide();
	}
};

var saveEditProvider = function() {
	
	var dataToSend = [];
	
	dataToSend["provider_id"] = $("#provider_id").val();
	dataToSend["provider[first_name]"] = $("#provider_first_name").val();
	dataToSend["provider[last_name]"] = $("#provider_last_name").val();
	dataToSend["provider[email]"] = $("#provider_email").val();
	dataToSend["provider[phone]"] = $("#provider_phone").val();
	dataToSend["provider[expertise]"] = $("#provider_expertise").val();
	dataToSend["provider[about]"] = $("#provider_about").val();
	dataToSend["provider[abstract]"] = $("#provider_abstract").val();
	
	var formData = new FormData();
	formData.append("provider_id", $("#provider_id").val());
	formData.append("provider[first_name]", $("#provider_first_name").val());
	formData.append("provider[last_name]", $("#provider_last_name").val());
	formData.append("provider[email]", $("#provider_email").val());
	formData.append("provider[phone]", $("#provider_phone").val());
	formData.append("provider[expertise]", $("#provider_expertise").val());
	formData.append("provider[about]", $("#provider_about").val());
	formData.append("provider[abstract]", $("#provider_abstract").val());
	
	if (!$("#provider_first_name").prop("disabled") && validateProviderUpdateInfoShort()) {
		$.ajax({
			type: 'post',
			url: '/update_provider_information',
			data: formData,
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			success: function(data) {
				if (data.status == "success") {
					enableEditProvider();
				}
				else if (data.status == "fail") {
					alertMessage("provider_edit_alert", "Please, try again.", "warning", false);
				}
			},
			error: function(data) {
				console.log("error");
				console.log(data);
				alertMessage("provider_edit_alert", "Error, please contact us.", "danger", false);
			}
		});
	}
};

var resetProviderInfo = function() {
	if (!$("#provider_first_name").prop("disabled")) {
		$.ajax({
		type: 'GET',
		url: '/provider_simple_info',
		dataType: "json",
		data: {
			'provider_id': $("#provider_id").val()
		},
		success: function(data) {
			if (data.status == "success") {
				$("#provider_first_name").val(data.provider.first_name);
				$("#provider_last_name").val(data.provider.last_name);
				$("#provider_phone").val(data.provider.phone);
				$("#provider_email").val(data.provider.email);
				$("#provider_expertise").val(data.provider.expertise);
				$("#provider_about").val(data.provider.about);
				$("#provider_abstract").val(data.provider.abstract);
				
				$("#provider_first_name").prop("disabled", true);
				$("#provider_last_name").prop("disabled", true);
				$("#provider_email").prop("disabled", true);
				$("#provider_phone").prop("disabled", true);
				$("#provider_expertise").prop("disabled", true);
				$("#provider_abstract").prop("disabled", true);
				$("#provider_about").prop("disabled", true);
				
				$("#edit_provider_button").html("<i class=\"fa fa-toggle-off\"></i> Edit Info");
				$("#save_provider_button").hide();
			}
			else if (data.status == "fail") {
				alertMessage("provider_edit_alert", "Please try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("provider_edit_alert", "Error, please contact us.", "danger", false);
		}
	});
	}
};

/* -------------------------------------------------------------------------- */

var enableEditPolicies = function() {
	if ($("#provider_policies").prop("disabled")) {
		$("#provider_policies").prop("disabled", false);
		
		$("#edit_policies_button").html("<i class=\"fa fa-toggle-on\"></i> Cancel");
		$("#save_policies_button").show();
	}
	else {
		resetPoliciesInfo();
		$("#provider_policies").prop("disabled", true);
		
		$("#edit_policies_button").html("<i class=\"fa fa-toggle-off\"></i> Edit Policies");
		$("#save_policies_button").hide();
	}
};

var resetPoliciesInfo = function() {
	if (!$("#provider_policies").prop("disabled")) {
		$.ajax({
		type: 'GET',
		url: '/provider_simple_info',
		dataType: "json",
		data: {
			'provider_id': $("#provider_id").val()
		},
		success: function(data) {
			if (data.status == "success") {
				$("#provider_policies").val(data.provider.policies);
				$("#provider_policies").prop("disabled", true);
				
				$("#edit_policies_button").html("<i class=\"fa fa-toggle-off\"></i> Edit Policies");
				$("#save_policies_button").hide();
			}
			else if (data.status == "fail") {
				alertMessage("provider_edit_alert", "Please try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("provider_edit_alert", "Error, please contact us.", "danger", false);
		}
	});
	}
};


/* -------------------------------------------------------------------------- */

var enableEditServices = function() {
	if ($("#provider_service_text").prop("disabled")) {
		$("#provider_service_text").prop("disabled", false);
		
		$("#edit_services_button").html("<i class=\"fa fa-toggle-on\"></i> Cancel");
		$("#save_services_button").show();
	}
	else {
		resetServicesInfo();
		$("#provider_service_text").prop("disabled", true);
		
		$("#edit_services_button").html("<i class=\"fa fa-toggle-off\"></i> Edit Services");
		$("#save_services_button").hide();
	}
};

var resetServicesInfo = function() {
	if (!$("#provider_service_text").prop("disabled")) {
		$.ajax({
		type: 'GET',
		url: '/provider_simple_info',
		dataType: "json",
		data: {
			'provider_id': $("#provider_id").val()
		},
		success: function(data) {
			if (data.status == "success") {
				$("#provider_service_text").val(data.provider.service_text);
				$("#provider_service_text").prop("disabled", true);
				
				$("#edit_services_button").html("<i class=\"fa fa-toggle-off\"></i> Edit Services");
				$("#save_services_button").hide();
			}
			else if (data.status == "fail") {
				alertMessage("provider_edit_alert", "Please try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("provider_edit_alert", "Error, please contact us.", "danger", false);
		}
	});
	}
};

/* -------------------------------------------------------------------------- */

var enableEditSpecialties = function() {
	if ($("#provider_specialty_text").prop("disabled")) {
		$("#provider_specialty_text").prop("disabled", false);
		
		$("#edit_specialties_button").html("<i class=\"fa fa-toggle-on\"></i> Cancel");
		$("#save_specialties_button").show();
	}
	else {
		resetSpecialtiesInfo();
		$("#provider_specialty_text").prop("disabled", true);
		
		$("#edit_specialties_button").html("<i class=\"fa fa-toggle-off\"></i> Edit Specialties");
		$("#save_specialties_button").hide();
	}
};

var resetSpecialtiesInfo = function() {
	if (!$("#provider_specialty_text").prop("disabled")) {
		$.ajax({
  		type: 'GET',
  		url: '/provider_simple_info',
  		dataType: "json",
  		data: {
  			'provider_id': $("#provider_id").val()
  		},
  		success: function(data) {
  			if (data.status == "success") {
  				$("#provider_specialty_text").val(data.provider.specialty_text);
  				$("#provider_specialty_text").prop("disabled", true);
  				
  				$("#edit_specialties_button").html("<i class=\"fa fa-toggle-off\"></i> Edit Specialties");
  				$("#save_specialties_button").hide();
  			}
  			else if (data.status == "fail") {
  				alertMessage("provider_edit_alert", "Please try again.", "warning", false);
  			}
  		},
  		error: function(data) {
  			console.log("error");
  			console.log(data);
  			alertMessage("provider_edit_alert", "Error, please contact us.", "danger", false);
  		}
  	});
	}
};


/*
 *
 */
 
var parseDate = function (dateTime) {
	var yyyy = dateTime.substr(0, 4);
    var mm = dateTime.substr(5, 2);
    var dd = dateTime.substr(8, 2);

    var h = dateTime.substr(11, 2);
    var m = dateTime.substr(14, 2);
    var s = dateTime.substr(17, 2); 
    return new Date(yyyy, parseInt(mm, 10) - 1,dd,h,m,s);
};


/**
 * this function should switch the provider availability
 * for an specific time
 * 
 * @params: [provider_id] the provider's id
 *          [cell_id] the time in the shape W_HH_MM, w is the weekday, sunday = 0
 * 
 * @author: Thiago Melo
 * @version: 2015-03-21
 */
var switchProviderTimeAvailability = function(provider_id, cell_id) {
  var next = nextTimeCellID(cell_id);
  var prev = prevTimeCellID(cell_id);
  
  var prev_prev = prevTimeCellID(prevTimeCellID(cell_id));
  var next_next = nextTimeCellID(nextTimeCellID(cell_id));
  
  if ($("#" + cell_id).hasClass("schedule-free")) {
    $("#" + cell_id).removeClass("schedule-free");
    $("#" + cell_id).addClass("schedule-blocked").addClass("danger");
    
    if ($("#" + next_next).hasClass("schedule-blocked")) {
      $("#" + next).removeClass("schedule-free");
      $("#" + next).addClass("schedule-blocked").addClass("danger");
    }
    if ($("#" + prev_prev).hasClass("schedule-blocked")) {
      $("#" + prev).removeClass("schedule-free");
      $("#" + prev).addClass("schedule-blocked").addClass("danger");
    }
  } 
  else {
    $("#" + cell_id).addClass("schedule-free");
    $("#" + cell_id).removeClass("schedule-blocked").removeClass("danger");
    $("#" + next).addClass("schedule-free");
    $("#" + next).removeClass("schedule-blocked").removeClass("danger");
  }
  $.ajax({
		type: 'GET',
		url: '/toogle_provider_time_availability',
		dataType: "json",
		data: {
			'provider_id': provider_id,
			'timeid': cell_id
		},
		success: function(data) {
			if (data.status == "success") {
				
			}
			else if (data.status == "fail") {
				console.log("rapaz, voce ta fazendo merda em algum lugar ai...");
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("top_page_message", "Error, please contact us.", "danger", false);
		}
	});
};

/**
 * for an entry YYYY_MM_DD_ID_HH_MM
 * it return the ID of half hour before
 * 
 * For 2015_04_03_1_13_30, it returns 2015_04_03_1_13_00
 * For 2015_04_03_1_13_00, it returns 2015_04_03_1_12_30
 * 
 * @params: [id] the id of a cell to get the id of the cell before
 * 
 * @author: Thiago Melo
 * @version: 2015-03-21
 */
var prevTimeCellID = function(id) {
  var parts = id.split("_");
  var minutes = parseInt(parts.pop(), 10);
  var hour = parseInt(parts.pop(), 10);
  
  hour = minutes == 0 ? hour - 1 : hour;
  hour = hour >= 10 ? hour.toString() : "0" + hour.toString();
  minutes = minutes == 0 ? 30 : 0;
  minutes = minutes >= 10 ? minutes.toString() : "0" + minutes.toString();
  return parts.join('_') + "_" + hour + "_" + minutes;
};

/**
 * for an entry YYYY_MM_DD_ID_HH_MM
 * it return the ID of half hour after
 * 
 * For 2015_04_03_1_13_30, it returns 2015_04_03_1_14_00
 * For 2015_04_03_1_13_00, it returns 2015_04_03_1_13_30
 * 
 * @params: [id] the id of a cell to get the id of the cell after
 * 
 * @author: Thiago Melo
 * @version: 2015-03-21
 */
var nextTimeCellID = function(id) {
  var parts = id.split("_");
  var minutes = parseInt(parts.pop(), 10);
  var hour = parseInt(parts.pop(), 10);
  
  hour = minutes == 0 ? hour : hour + 1;
  hour = hour >= 10 ? hour.toString() : "0" + hour.toString();
  minutes = minutes == 0 ? 30 : 0;
  minutes = minutes >= 10 ? minutes.toString() : "0" + minutes.toString();
  return parts.join('_') + "_" + hour + "_" + minutes;
};

/**
 * this function should replace the current provider's schedule been
 * shown by its next orprevious week
 * 
 * @params: [week] next week number (1..54)
 *          [year] the year
 * 
 * @author: Thiago Melo
 * @version: 2015-04-03
 */
var weekProviderSchedule = function(week, year, provider_id) {
  // erase the current desktop
  var provider_weekly_schedule_desktop = $('#provider_weekly_schedule_desktop').empty();
  // get date of first week's day
  var first_day = firstDayOfWeek(year, week);
  var last_day = new Date(first_day.getTime());
  last_day.setDate(last_day.getDate() + 6);
  
  var possible_hours = [];
  var possible_weekdays = [];
  for (var i = 6; i < 21; i++) {
    possible_hours.push(i);
  }
  for (var j = 0; j < 7; j++) {
    possible_weekdays.push(j);
  }
  
  $.ajax({
		type: 'GET',
		url: '/provider_schedules_appointments',
		dataType: "json",
		data: {
			'provider_id': provider_id,
			'start': first_day.getTime(),
			'end': last_day.getTime()
		},
		success: function(data) {
			if (data.status == "success") {
			  $.each(possible_hours, function(i_index, i) {
		      var first_row = $('<tr/>').append($('<td/>').prop('rowspan', '2').append((i > 9 ? '' : '0') + i.toString() + ':00'));
          var second_row = $('<tr/>');
          var other_day = new Date(first_day.getTime());
          $.each(possible_weekdays, function(j_index, j) {
            var time_id = [];
            time_id.push(other_day.getUTCFullYear());
            time_id.push(other_day.getUTCMonth() + 1 > 9 ? other_day.getUTCMonth() + 1 : '0' + (other_day.getUTCMonth() + 1).toString());
            time_id.push(other_day.getUTCDate() > 9 ? other_day.getUTCDate() : '0' + (other_day.getUTCDate()).toString());
            time_id.push(j.toString());
            time_id.push((i > 9 ? '' : '0') + i.toString());
            var time_id_f = time_id.join('_') + '_00';
            var time_id_s = time_id.join('_') + '_30';
            
            var f_available = true;
            var s_available = true;
            $.each(data.schedules, function(s_index, schedule) {
              if (schedule.unavailable && schedule.timeid == time_id_f) {
                f_available = false;
              } else if (schedule.unavailable && schedule.timeid == time_id_s) {
                s_available = false;
              }
            });
            
            var has_appointment_f = false;
            var has_appointment_s = false;
            
            var time_start_f_1 = new Date(other_day.getTime());
            var time_end_f_1 = new Date(other_day.getTime());
            var time_start_f_2 = new Date(other_day.getTime());
            var time_end_f_2 = new Date(other_day.getTime());
            time_start_f_1.setHours(i - 1, 35, 0);
            time_start_f_2.setHours(i - 1, 45, 0);
            time_end_f_1.setHours(i, 45, 0, 0);
            time_end_f_2.setHours(i, 55, 0, 0);
            
            var time_start_s_1 = new Date(other_day.getTime());
            var time_end_s_1 = new Date(other_day.getTime());
            var time_start_s_2 = new Date(other_day.getTime());
            var time_end_s_2 = new Date(other_day.getTime());
            time_start_s_1.setHours(i, 5, 0);
            time_start_s_2.setHours(i, 15, 0);
            time_end_s_1.setHours(i + 1, 15, 0, 0);
            time_end_s_2.setHours(i + 1, 25, 0, 0);
            
            $.each(data.appointments, function(appointment_index, appointment) {
              
              var my_appoint = new Appointment(appointment.id, appointment.provider_id, appointment.client_id, appointment.start, appointment.end, appointment.accepted, appointment.client_observation, appointment.created_at, appointment.updated_at);
              
              var appointment_start = my_appoint.start;
              var appointment_end = my_appoint.end;
              
              if ((appointment_start >= time_start_f_1 && appointment_start <= time_start_f_2) || (appointment_end >= time_end_f_1 && appointment_end <= time_end_f_2)) {
                has_appointment_f = true;
              }
              
              if ((appointment_start >= time_start_s_1 && appointment_start <= time_start_s_2) || (appointment_end >= time_end_s_1 && appointment_end <= time_end_s_2)) {
                has_appointment_s = true;
              }
              
            });
            
            if (has_appointment_f) {
              first_row.append($('<td/>').addClass("schedule-blocked-appointment"));
            } else {
              first_row.append(
                $('<td/>').addClass(f_available ? "schedule-free" : "schedule-blocked danger").css('cursor', 'pointer').prop('id', time_id_f).on('click', function() {
                  switchProviderTimeAvailability(provider_id, time_id_f);
                })
              );
            }
            if (has_appointment_s) {
              second_row.append($('<td/>').addClass("schedule-blocked-appointment"));
            } else {
              second_row.append(
                $('<td/>').addClass(s_available ? "schedule-free" : "schedule-blocked danger").css('cursor', 'pointer').prop('id', time_id_s).on('click', function() {
                  switchProviderTimeAvailability(provider_id, time_id_s);
                })
              );
            }
            
            $('#weekday_' + j).empty().append((other_day.getUTCMonth() + 1) + '/' + other_day.getUTCDate());
            other_day.setDate(other_day.getDate() + 1);
          });
          provider_weekly_schedule_desktop.append(first_row).append(second_row);  
			  });
			  
        $('#provider_prev_week_button').prop('href', 'javascript: weekProviderSchedule(' + (week - 1) + ', ' + year + ', ' + provider_id + ')');
        $('#provider_next_week_button').prop('href', 'javascript: weekProviderSchedule(' + (week + 1) + ', ' + year + ', ' + provider_id + ')');
        $('#provider_month_year_display').empty().append(monthName(first_day.getUTCMonth() + 1) + ' ' + year);
			}
			else if (data.status == "fail") {
				console.log("rapaz, voce ta fazendo merda em algum lugar ai...");
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("top_page_message", "Error, please contact us.", "danger", false);
		}
	});
};

/**
 * this function receives a week number and the year and returns
 * the date of the first day of this week
 * 
 * @params: [week] prev week number (1..54)
 *          [year] the year 
 * 
 * @author: http://stackoverflow.com/questions/7580824/how-to-convert-a-week-number-to-a-date-in-javascript
 * @version: 2015-04-03
 */
var firstDayOfWeek = function(year, week) {

    // Jan 1 of 'year'
    var d = new Date(year, 0, 1),
        offset = d.getTimezoneOffset();

    // ISO: week 1 is the one with the year's first Thursday 
    // so nearest Thursday: current date + 4 - current day number
    // Sunday is converted from 0 to 7
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));

    // 7 days * (week - overlapping first week)
    d.setTime(d.getTime() + 7 * 24 * 60 * 60 * 1000 
        * (week + (year == d.getFullYear() ? -1 : 0 )));

    // daylight savings fix
    d.setTime(d.getTime() 
        + (d.getTimezoneOffset() - offset) * 60 * 1000);

    // back to Sunday (from Thursday)
    d.setDate(d.getDate() - 4);

    return d;
};

/**
 * month name (1..12)
 */
var monthName = function(month) {
  switch (month) {
    case 1:
      return 'January';
    case 2:
      return 'February';
    case 3:
      return 'March';
    case 4:
      return 'April';
    case 5:
      return 'May';
    case 6:
      return 'June';
    case 7:
      return 'July';
    case 8:
      return 'August';
    case 9:
      return 'September';
    case 10:
      return 'October';
    case 11:
      return 'November';
    case 12:
      return 'December';
  }
};
(function() {


}).call(this);
(function() {


}).call(this);
var validEmail = function(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};

var validAnyNumber = function(word) {
	var re = /[0-9]/;
	return re.test(word);
};

var validPassword = function(password) {
	if (!validNotEmpty(password) || password.length < 6) {
		return false;
	}
	return true;
};

var validNotEmpty = function (string) {
	if (string === "" || string === undefined) {
		return false;
	}
	return true;	
}

var validNumber = function(number) {
	var re = /^\d+$/;
	if (number !== undefined && number !== "" && re.test(number)) {
		return true;
	}
    return false;
}

var validateSign = function() {
	var email = $("#session_email").val();
	var password = $("#session_password").val();

	if (!validEmail(email)) {
		alertMessage("signin_alert_message", "Invalid email.", "danger", false);
		$("#session_email").focus();
		return false;
	}
	if (!validPassword(password)) {
		alertMessage("signin_alert_message", "Invalid password.", "danger", false);
		$("#session_password").focus();
		return false;
	}
};

var validateClientSignupPop  = function() {
	var client_email = $("#client_email").val();
	var client_password = $("#client_password").val();
	
	clearMessage("client_signup_alert");
	
	if (!validEmail(client_email)) {
		alertMessage("client_signup_alert", "Invalid email.", "danger", false);
		$("#client_email").focus();
		return false;
	}
	
	if (!validPassword(client_password)) {
		alertMessage("client_signup_alert", "Invalid password. Password must be at least 6 characters.", "danger", false);
		$("#client_password").val("");
		$("#client_password").focus();
		return false;
	}
};

var validateClientSignup = function() {
	var client_first_name = $("#client_first_name").val();
	var client_last_name = $("#client_last_name").val();
	var client_email = $("#client_email").val();
	var client_password = $("#client_password").val();
	var client_password_confirmation = $("#client_password_confirmation").val();
	
	clearMessage("client_signup_alert");
	if (!validNotEmpty(client_first_name) || validAnyNumber(client_first_name)) {
		alertMessage("client_signup_alert", "Type your first name (Only letters).", "danger", false);
		$("#client_first_name").focus();
		return false;
	}
	
	if (!validNotEmpty(client_last_name) || validAnyNumber(client_last_name)) {
		alertMessage("client_signup_alert", "Type your last name (Only letters).", "danger", false);
		$("#client_last_name").focus();
		return false;
	}
	
	if (!validEmail(client_email)) {
		alertMessage("client_signup_alert", "Invalid email.", "danger", false);
		$("#client_email").focus();
		return false;
	}
	
	
	if (!validPassword(client_password)) {
		alertMessage("client_signup_alert", "Invalid password. Password must be at least 6 characters.", "danger", false);
		$("#client_password").val("");
		$("#client_password_confirmation").val("");
		$("#client_password").focus();
		return false;
	}
	if (!validPassword(client_password_confirmation)) {
		alertMessage("client_signup_alert", "Invalid password. Password must be at least 6 characters.", "danger", false);
		$("#client_password").val("");
		$("#client_password_confirmation").val("");
		$("#client_password").focus();
		return false;
	}
	if (client_password != client_password_confirmation) {
		alertMessage("client_signup_alert", "Passwords don't match.", "danger", false);
		$("#client_password").val("");
		$("#client_password_confirmation").val("");
		$("#client_password").focus();
		return false;
	}
};

var validateProviderSignup = function() {
	provider_first_name = $("#provider_first_name").val();
	provider_last_name = $("#provider_last_name").val();
	provider_email = $("#provider_email").val();
	provider_password = $("#provider_password").val();
	provider_password_confirmation = $("#provider_password_confirmation").val();
	
	clearMessage("provider_signup_alert");
	if (!validNotEmpty(provider_first_name) || validAnyNumber(provider_first_name)) {
		alertMessage("provider_signup_alert", "Type your first name (Only letters).", "danger", false);
		$("#provider_first_name").focus();
		return false;
	}
	if (!validNotEmpty(provider_last_name) || validAnyNumber(provider_last_name)) {
		alertMessage("provider_signup_alert", "Type your last name (Only letters).", "danger", false);
		$("#provider_last_name").focus();
		return false;
	}
	if (!validEmail(provider_email)) {
		alertMessage("provider_signup_alert", "Invalid email.", "danger", false);
		$("#provider_email").focus();
		return false;
	}
	if (!validPassword(provider_password)) {
		alertMessage("provider_signup_alert", "Invalid password.", "danger", false);
		$("#provider_password").val("");
		$("#provider_password_confirmation").val("");
		$("#provider_password").focus();
		return false;
	}
	if (!validPassword(provider_password_confirmation)) {
		alertMessage("provider_signup_alert", "Invalid password confirmation.", "danger", false);
		$("#provider_password").val("");
		$("#provider_password_confirmation").val("");
		$("#provider_password").focus();
		return false;
	}
	if (provider_password != provider_password_confirmation) {
		alertMessage("provider_signup_alert", "Passwords don't match.", "danger", false);
		$("#provider_password").val("");
		$("#provider_password_confirmation").val("");
		$("#provider_password").focus();
		return false;
	}
};

var validateUploadPicture = function() {
	if (!validNotEmpty($("#mainImageLabel").val())) {
		return false;
	}
};

var validateClientUpdateInfoShort = function()  {
	//client_password = $("#client_password").val();
	//client_password_confirmation = $("#client_password_confirmation").val();
	var client_weeks_pregnant = $("#client_weeks_pregnant").val();
	
	var client_first_name = $("#client_first_name").val();
	var client_last_name = $("#client_last_name").val();
	
	if (!validNotEmpty(client_first_name) || validAnyNumber(client_first_name)) {
		alertMessage("client_edit_alert", "Type your first name (Only letters).", "danger", false);
		$("#client_first_name").focus();
		return false;
	}
	if (!validNotEmpty(client_last_name) || validAnyNumber(client_last_name)) {
		alertMessage("client_edit_alert", "Type your last name (Only letters).", "danger", false);
		$("#client_last_name").focus();
		return false;
	}
	
	clearMessage("client_edit_alert");
	
	if (validNotEmpty(client_weeks_pregnant) && !validNumber(client_weeks_pregnant)) {
		alertMessage("client_edit_alert", "Weeks pregnant must be a number.", "danger", false);
		$("#client_weeks_pregnant").val("");
		$("#client_weeks_pregnant").focus();
		return false;
	}
	return true;
};

var validateProviderUpdateInfoShort = function()  {
	clearMessage("provider_edit_alert");
	
	if (!validNotEmpty($("#provider_first_name").val()) || validAnyNumber($("#provider_first_name").val())) {
		alertMessage("provider_edit_alert", "First name cannot be empty (Only letters).", "danger", false);
		$("#provider_first_name").val("");
		$("#provider_first_name").focus();
		return false;
	}
	
	if (!validNotEmpty($("#provider_last_name").val()) || validAnyNumber($("#provider_last_name").val())) {
		alertMessage("provider_edit_alert", "Last name cannot be empty (Only letters).", "danger", false);
		$("#provider_last_name").val("");
		$("#provider_last_name").focus();
		return false;
	}
	
	if (!validNotEmpty($("#provider_email").val()) || !validEmail($("#provider_email").val())) {
		alertMessage("provider_edit_alert", "Invalid email.", "danger", false);
		$("#provider_email").val("");
		$("#provider_email").focus();
		return false;
	}
	
	return true;
};

var validateClientUpdateInfo = function() {
	client_first_name = $("#client_first_name").val();
	client_last_name = $("#client_last_name").val();
	client_email = $("#client_email").val();
	client_password = $("#client_password").val();
	client_password_confirmation = $("#client_password_confirmation").val();
	client_weeks_pregnant = $("#client_weeks_pregnant").val();
	
	clearMessage("client_edit_alert");
	
	if (!validNotEmpty(client_first_name) || validAnyNumber(client_first_name)) {
		alertMessage("client_edit_alert", "Type your first name (Only letters).", "danger", false);
		$("#client_first_name").focus();
		return false;
	}
	
	if (!validNotEmpty(client_last_name) || validAnyNumber(client_last_name)) {
		alertMessage("client_edit_alert", "Type your last name (Only letters).", "danger", false);
		$("#client_last_name").focus();
		return false;
	}
	
	if (!validEmail(client_email)) {
		alertMessage("client_edit_alert", "Invalid email.", "danger", false);
		$("#client_email").focus();
		return false;
	}
	
	if (validNotEmpty(client_weeks_pregnant) && !validNumber(client_weeks_pregnant)) {
		alertMessage("client_edit_alert", "Weeks pregnant must be a number.", "danger", false);
		$("#client_weeks_pregnant").val("");
		$("#client_weeks_pregnant").focus();
		return false;
	}
	return true;
};

var validateClientUpdatePassword = function() {
	client_password_old = $("#client_password_old").val();
	client_password = $("#client_password").val();
	client_password_confirmation = $("#client_password_confirmation").val();
	
	if (!validPassword(client_password_old)) {
		alertMessage("client_edit_alert", "Invalid old password.", "danger", false);
		$("#client_password_old").val("");
		$("#client_password_old").focus();
		return false;
	}
	
	if (!validPassword(client_password)) {
		alertMessage("client_edit_alert", "Invalid password.", "danger", false);
		$("#client_password").val("");
		$("#client_password_confirmation").val("");
		$("#client_password").focus();
		return false;
	}
	if (!validPassword(client_password_confirmation)) {
		alertMessage("client_edit_alert", "Invalid password confirmation.", "danger", false);
		$("#client_password").val("");
		$("#client_password_confirmation").val("");
		$("#client_password").focus();
		return false;
	}
	if (client_password != client_password_confirmation) {
		alertMessage("client_edit_alert", "Passwords don't match.", "danger", false);
		$("#client_password").val("");
		$("#client_password_confirmation").val("");
		$("#client_password").focus();
		return false;
	}
};

var validateProviderEdit = function() {
	if (!validNotEmpty($("#provider_first_name").val()) || validAnyNumber($("#provider_first_name").val())) {
		alertMessage("top_page_message", "First name is required (Only letters).", "danger", false);
		$("#provider_first_name").focus();
		return false;
	}
	if (!validNotEmpty($("#provider_last_name").val()) || validAnyNumber($("#provider_last_name").val())) {
		alertMessage("top_page_message", "Last name is required (Only letters).", "danger", false);
		$("#provider_last_name").focus();
		return false;
	}
	if (!validEmail($("#provider_email").val())) {
		alertMessage("top_page_message", "Email is required.", "danger", false);
		$("#provider_email").focus();
		return false;
	}
	return true;	
};

var validateContact = function() {
	if (!validNotEmpty($("#name").val())) {
		alertMessage("top_page_contact", "Name is required.", "danger", false);
		$("#name").focus();
		return false;
	}
	if (!validEmail($("#email").val())) {
		alertMessage("top_page_contact", "Email must be not empty and valid.", "danger", false);
		$("#email").focus();
		return false;
	}
	if (!validNotEmpty($("#message").val())) {
		alertMessage("top_page_contact", "Message must be not empty.", "danger", false);
		$("#message").focus();
		return false;
	}
	return true;
};

(function() {


}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
// put an equal symbol "=" imediately after the comment if someday it is need



// require turbolinks

