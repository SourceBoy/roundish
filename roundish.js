(function(_root) {

	_root.Roundish = {};

	var routes = {},
		histories = []; // Navigation histories.

	// Called internally by getRoute()
	function findParameters(path_spec, path)
	{

		var parameters = {};

		if (path_spec === path) { // Exact match. Route is static.
			return parameters;
		} else if (path_spec.indexOf(':') < 0) {
			return false; // path_spec is static that doesn't match path.
		}

		// Else p has named parameters

		var keys = [],
			values = [];

		var pattern = path_spec.replace(/:\w+/g, function(m) {
			keys.push(m.substring(1));
			return '(.+)';
		});

		var re = new RegExp(pattern, 'g'),
			matches,
			matched = false,
			i = 1,
			matches_count = 0,
			keys_count = keys.length;

		while (matches = re.exec(path)) {
			matched = true;
			matches_count = matches.length;

			for (i = 1; i < matches_count; i++) {
				values.push(matches[i]);
			}
		}

		if (!matched) { return false; } // Not a matching route.

		if (keys_count !== values.length) {
			throw new Error('Named parameters & their values mismatch');
		}

		for (var k = 0; k < keys_count; k++) {
			parameters[keys[k]] = values[k];
		}

		return parameters;

	}

	function getRoute(path)
	{
		var parameters = false;

		for (var path_spec in routes) {
			if (!routes.hasOwnProperty(path_spec)) { continue; }

			parameters = findParameters(path_spec, path);

			if (parameters !== false) {
				return { 'path_spec': path_spec, 'parameters': parameters };
			}
		}

		return false;
	}

	function executeRoute(path)
	{
		var r = getRoute(path);

		if (r === false) { return false; }

		routes[r.path_spec].call(Roundish, r.parameters);

		return true;
	}

	Roundish.getRoute = getRoute;

	// @todo warn duplicate path_spec
	Roundish.addRoute = function(path_spec, handler)
	{
		routes[path_spec] = handler;
	};

	Roundish.getState = function()
	{
		return history.state || null;
	};

	Roundish.getHistories = function()
	{
		return histories;
	};

	Roundish.navigate = function(path, api)
	{
		var h_count = histories.length,
			is_current_path = (path === location.pathname);

		var _state = { 'path': path, 'title': 'title goes here', 'url': path },
			_title = 'title goes here',
			_url = path;

		if (!api) { api = {}; }

		if ((api.replaceState === true) && history.replaceState) {
			history.replaceState(_state, _title, _url);
		} else if (history.pushState) {

			if (!h_count || (histories[h_count-1] !== location.pathname)) {
				if (!is_current_path) {
					histories.push(location.pathname);
				}
			}

			if (!is_current_path) {
				history.pushState(_state, _title, _url);
			}

		} else {
			return location.assign(path);
		}

		return executeRoute(path);
	};

	Roundish.navigateBack = function(fallback_path)
	{
		var index = histories.length - 1,
			destination = '';

		if (index < 0) {
			return location.assign(fallback_path);
		}

		destination = histories[index];

		if (destination === location.pathname) {
			this.navigate(histories[index - 1]);
		} else {
			this.navigate(destination);
		}
	};

	function pop(e)
	{
		var state = e.state,
			path = state ? state.path : location.pathname;

		executeRoute(path);
	}

	window.addEventListener('popstate', pop, false);

}(window));
