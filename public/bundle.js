
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.data !== data)
            text.data = data;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.shift()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            while (render_callbacks.length) {
                const callback = render_callbacks.pop();
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_render);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_render.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.callbacks.push(() => {
                outroing.delete(block);
                if (callback) {
                    block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_render } = component.$$;
        fragment.m(target, anchor);
        // onMount happens after the initial afterUpdate. Because
        // afterUpdate callbacks happen in reverse order (inner first)
        // we schedule onMount callbacks before afterUpdate callbacks
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_render.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal$$1, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal: not_equal$$1,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_render: [],
            after_render: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, value) => {
                if ($$.ctx && not_equal$$1($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_render);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src/components/Autocomplete.svelte generated by Svelte v3.6.1 */

    const file = "src/components/Autocomplete.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.match = list[i];
    	child_ctx.i = i;
    	return child_ctx;
    }

    // (117:0) {#if label}
    function create_if_block_2(ctx) {
    	var label_1, t;

    	return {
    		c: function create() {
    			label_1 = element("label");
    			t = text(ctx.label);
    			attr(label_1, "for", ctx.id);
    			add_location(label_1, file, 117, 2, 2490);
    		},

    		m: function mount(target, anchor) {
    			insert(target, label_1, anchor);
    			append(label_1, t);
    		},

    		p: function update(changed, ctx) {
    			if (changed.label) {
    				set_data(t, ctx.label);
    			}

    			if (changed.id) {
    				attr(label_1, "for", ctx.id);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(label_1);
    			}
    		}
    	};
    }

    // (131:2) {#if (matches.length > 0)}
    function create_if_block(ctx) {
    	var each_1_anchor;

    	var each_value = ctx.matches;

    	var each_blocks = [];

    	for (var i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	return {
    		c: function create() {
    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert(target, each_1_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (changed.maxMatches || changed.arrowCounter || changed.matches) {
    				each_value = ctx.matches;

    				for (var i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}
    		},

    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);

    			if (detaching) {
    				detach(each_1_anchor);
    			}
    		}
    	};
    }

    // (133:6) {#if i < maxMatches}
    function create_if_block_1(ctx) {
    	var div, h4, t0_value = ctx.match.name, t0, t1, t2_value = ctx.match.abbr, t2, t3, h4_data_value, t4, small, t5, strong, t6_value = ctx.match.capital, t6, t7, div_class_value, dispose;

    	function click_handler_1() {
    		return ctx.click_handler_1(ctx);
    	}

    	return {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			t0 = text(t0_value);
    			t1 = text(" (");
    			t2 = text(t2_value);
    			t3 = text(")");
    			t4 = space();
    			small = element("small");
    			t5 = text("Capital: ");
    			strong = element("strong");
    			t6 = text(t6_value);
    			t7 = space();
    			attr(h4, "data", h4_data_value = ctx.match.name);
    			attr(h4, "class", "svelte-12f2kn0");
    			add_location(h4, file, 137, 10, 2958);
    			add_location(strong, file, 138, 26, 3039);
    			add_location(small, file, 138, 10, 3023);
    			attr(div, "class", div_class_value = "result" + (ctx.i === ctx.arrowCounter ? ' is-active' : '') + " svelte-12f2kn0");
    			add_location(div, file, 133, 8, 2820);
    			dispose = listen(div, "click", click_handler_1);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, h4);
    			append(h4, t0);
    			append(h4, t1);
    			append(h4, t2);
    			append(h4, t3);
    			append(div, t4);
    			append(div, small);
    			append(small, t5);
    			append(small, strong);
    			append(strong, t6);
    			append(div, t7);
    		},

    		p: function update(changed, new_ctx) {
    			ctx = new_ctx;
    			if ((changed.matches) && t0_value !== (t0_value = ctx.match.name)) {
    				set_data(t0, t0_value);
    			}

    			if ((changed.matches) && t2_value !== (t2_value = ctx.match.abbr)) {
    				set_data(t2, t2_value);
    			}

    			if ((changed.matches) && h4_data_value !== (h4_data_value = ctx.match.name)) {
    				attr(h4, "data", h4_data_value);
    			}

    			if ((changed.matches) && t6_value !== (t6_value = ctx.match.capital)) {
    				set_data(t6, t6_value);
    			}

    			if ((changed.arrowCounter) && div_class_value !== (div_class_value = "result" + (ctx.i === ctx.arrowCounter ? ' is-active' : '') + " svelte-12f2kn0")) {
    				attr(div, "class", div_class_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			dispose();
    		}
    	};
    }

    // (132:4) {#each matches as match, i}
    function create_each_block(ctx) {
    	var if_block_anchor;

    	var if_block = (ctx.i < ctx.maxMatches) && create_if_block_1(ctx);

    	return {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (ctx.i < ctx.maxMatches) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},

    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);

    			if (detaching) {
    				detach(if_block_anchor);
    			}
    		}
    	};
    }

    function create_fragment(ctx) {
    	var t0, input, t1, div, dispose;

    	var if_block0 = (ctx.label) && create_if_block_2(ctx);

    	var if_block1 = ((ctx.matches.length > 0)) && create_if_block(ctx);

    	return {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			input = element("input");
    			t1 = space();
    			div = element("div");
    			if (if_block1) if_block1.c();
    			attr(input, "type", "text");
    			attr(input, "id", ctx.id);
    			attr(input, "placeholder", ctx.placeholder);
    			attr(input, "class", "svelte-12f2kn0");
    			add_location(input, file, 119, 0, 2528);
    			attr(div, "class", "result-list svelte-12f2kn0");
    			add_location(div, file, 129, 0, 2698);

    			dispose = [
    				listen(input, "input", ctx.input_input_handler),
    				listen(input, "input", ctx.searchStates),
    				listen(input, "keydown", ctx.onKeyDown),
    				listen(input, "click", ctx.click_handler)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert(target, t0, anchor);
    			insert(target, input, anchor);

    			input.value = ctx.search;

    			insert(target, t1, anchor);
    			insert(target, div, anchor);
    			if (if_block1) if_block1.m(div, null);
    		},

    		p: function update(changed, ctx) {
    			if (ctx.label) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (changed.search && (input.value !== ctx.search)) input.value = ctx.search;

    			if (changed.id) {
    				attr(input, "id", ctx.id);
    			}

    			if (changed.placeholder) {
    				attr(input, "placeholder", ctx.placeholder);
    			}

    			if ((ctx.matches.length > 0)) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);

    			if (detaching) {
    				detach(t0);
    				detach(input);
    				detach(t1);
    				detach(div);
    			}

    			if (if_block1) if_block1.d();
    			run_all(dispose);
    		}
    	};
    }

    const URL = '../data/states.json';

    function instance($$self, $$props, $$invalidate) {
    	let { placeholder = 'Enter search text', id = 'autocomplete', label = null, exact = false, minChars = 2, maxMatches = 7, fromStart = false } = $$props;

    let search = '';
    let matches = [];
    let data = null;
    let arrowCounter = -1;

    onMount(async () => {
      const res = await fetch(URL);
      data = await res.json();
    });

    // search states.json and filter it
    async function searchStates() {
      if (search.length < minChars) {
        $$invalidate('matches', matches = []);
        return
      }

      // * Customize as needed for data set,
      // * get matches to current text input
      const searchString = (fromStart) ?  `^${search}` : `${search}`;

      $$invalidate('matches', matches = data.filter(item => {
        const regex = new RegExp(searchString, 'gi');
        return item.name.match(regex) || item.abbr.match(regex)
      }));

      // if search is empty, don't show anything
      // (otherwise would show all data)
      if (search.length === 0) $$invalidate('matches', matches = []);
    }

    function setSearch(index, clearMatches = false) {
      $$invalidate('search', search = matches[index].name);
      if (clearMatches) {
        $$invalidate('matches', matches = []);
        $$invalidate('arrowCounter', arrowCounter = -1);
      }
    }

    // key events
    function onKeyDown (event) {
      // ArrowDown
      if (event.keyCode === 40 && arrowCounter < matches.length-1) {
        $$invalidate('arrowCounter', arrowCounter = arrowCounter + 1);
        setSearch(arrowCounter);
      // ArrowUp
      } else if (event.keyCode === 38 && arrowCounter > -1) {
        $$invalidate('arrowCounter', arrowCounter = arrowCounter - 1);
        setSearch(arrowCounter);
      // Enter
      // TODO: do nothing if there isn't a match list, this isn't working
      } else if (event.keyCode === 13) {
        event.preventDefault();
        if (arrowCounter === -1) {
          $$invalidate('arrowCounter', arrowCounter = 0); // Default select first item of list
          setSearch(arrowCounter, true);
        } else if(matches.length > 0) {
          setSearch(arrowCounter, true);
        }
      // Escape
      } else if (event.keyCode === 27) {
        event.preventDefault();
        $$invalidate('matches', matches = []);
        $$invalidate('arrowCounter', arrowCounter = -1);
      }
    }

    	const writable_props = ['placeholder', 'id', 'label', 'exact', 'minChars', 'maxMatches', 'fromStart'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Autocomplete> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		search = this.value;
    		$$invalidate('search', search);
    	}

    	function click_handler() {
    		const $$result = arrowCounter=-1;
    		$$invalidate('arrowCounter', arrowCounter);
    		return $$result;
    	}

    	function click_handler_1({ i }) {
    		return setSearch(i, true);
    	}

    	$$self.$set = $$props => {
    		if ('placeholder' in $$props) $$invalidate('placeholder', placeholder = $$props.placeholder);
    		if ('id' in $$props) $$invalidate('id', id = $$props.id);
    		if ('label' in $$props) $$invalidate('label', label = $$props.label);
    		if ('exact' in $$props) $$invalidate('exact', exact = $$props.exact);
    		if ('minChars' in $$props) $$invalidate('minChars', minChars = $$props.minChars);
    		if ('maxMatches' in $$props) $$invalidate('maxMatches', maxMatches = $$props.maxMatches);
    		if ('fromStart' in $$props) $$invalidate('fromStart', fromStart = $$props.fromStart);
    	};

    	return {
    		placeholder,
    		id,
    		label,
    		exact,
    		minChars,
    		maxMatches,
    		fromStart,
    		search,
    		matches,
    		arrowCounter,
    		searchStates,
    		setSearch,
    		onKeyDown,
    		input_input_handler,
    		click_handler,
    		click_handler_1
    	};
    }

    class Autocomplete extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["placeholder", "id", "label", "exact", "minChars", "maxMatches", "fromStart"]);
    	}

    	get placeholder() {
    		throw new Error("<Autocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Autocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Autocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Autocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Autocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Autocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get exact() {
    		throw new Error("<Autocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set exact(value) {
    		throw new Error("<Autocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get minChars() {
    		throw new Error("<Autocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set minChars(value) {
    		throw new Error("<Autocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxMatches() {
    		throw new Error("<Autocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxMatches(value) {
    		throw new Error("<Autocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fromStart() {
    		throw new Error("<Autocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fromStart(value) {
    		throw new Error("<Autocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.6.1 */

    const file$1 = "src/App.svelte";

    function create_fragment$1(ctx) {
    	var div, current;

    	var autocomplete = new Autocomplete({
    		props: {
    		label: "State",
    		id: "state-search",
    		placeholder: "Search for states",
    		minChars: 1,
    		fromStart: false
    	},
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			div = element("div");
    			autocomplete.$$.fragment.c();
    			attr(div, "class", "container");
    			add_location(div, file$1, 8, 0, 257);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			mount_component(autocomplete, div, null);
    			current = true;
    		},

    		p: noop,

    		i: function intro(local) {
    			if (current) return;
    			transition_in(autocomplete.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(autocomplete.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			destroy_component(autocomplete, );
    		}
    	};
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$1, safe_not_equal, []);
    	}
    }

    var app = new App({
      target: document.body
    });

    var main = {
      app
    };

    return main;

}());
//# sourceMappingURL=bundle.js.map
