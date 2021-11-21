
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
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
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
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
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
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
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.38.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());
    const { navigate: navigate$1 } = globalHistory;

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    function startsWith(string, search) {
      return string.substr(0, search.length) === search;
    }

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    function addQuery(pathname, query) {
      return pathname + (query ? `?${query}` : "");
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
      // /foo/bar, /baz/qux => /foo/bar
      if (startsWith(to, "/")) {
        return to;
      }

      const [toPathname, toQuery] = to.split("?");
      const [basePathname] = base.split("?");
      const toSegments = segmentize(toPathname);
      const baseSegments = segmentize(basePathname);

      // ?a=b, /users?b=c => /users?a=b
      if (toSegments[0] === "") {
        return addQuery(basePathname, toQuery);
      }

      // profile, /users/789 => /users/789/profile
      if (!startsWith(toSegments[0], ".")) {
        const pathname = baseSegments.concat(toSegments).join("/");

        return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
      }

      // ./       , /users/123 => /users/123
      // ../      , /users/123 => /users
      // ../..    , /users/123 => /
      // ../../one, /a/b/c/d   => /a/b/one
      // .././one , /a/b/c/d   => /a/b/c/one
      const allSegments = baseSegments.concat(toSegments);
      const segments = [];

      allSegments.forEach(segment => {
        if (segment === "..") {
          segments.pop();
        } else if (segment !== ".") {
          segments.push(segment);
        }
      });

      return addQuery("/" + segments.join("/"), toQuery);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
      return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      );
    }

    /* node_modules/svelte-routing/src/Router.svelte generated by Svelte v3.38.2 */

    function create_fragment$n(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let $base;
    	let $location;
    	let $routes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Router", slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, "routes");
    	component_subscribe($$self, routes, value => $$invalidate(7, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(6, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, "base");
    	component_subscribe($$self, base, value => $$invalidate(5, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ["basepath", "url"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("basepath" in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(4, url = $$props.url);
    		if ("$$scope" in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		derived,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$base,
    		$location,
    		$routes
    	});

    	$$self.$inject_state = $$props => {
    		if ("basepath" in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(4, url = $$props.url);
    		if ("hasActiveRoute" in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 32) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			{
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 192) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		$base,
    		$location,
    		$routes,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-routing/src/Route.svelte generated by Svelte v3.38.2 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 4,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[2],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block$d(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$4, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block$4(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, routeParams, $location*/ 532)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[9], dirty, get_default_slot_changes, get_default_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1$4(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[2],
    		/*routeProps*/ ctx[3]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 28)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block$d(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$d(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Route", slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, "activeRoute");
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));
    	const location = getContext(LOCATION);
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("path" in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ("component" in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ("$$scope" in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ("path" in $$props) $$invalidate(8, path = $$new_props.path);
    		if ("component" in $$props) $$invalidate(0, component = $$new_props.component);
    		if ("routeParams" in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ("routeProps" in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 2) {
    			if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(2, routeParams = $activeRoute.params);
    			}
    		}

    		{
    			const { path, component, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-routing/src/Link.svelte generated by Svelte v3.38.2 */
    const file$l = "node_modules/svelte-routing/src/Link.svelte";

    function create_fragment$l(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1],
    		/*$$restProps*/ ctx[6]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$l, 40, 0, 1249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[15], dirty, null, null);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*ariaCurrent*/ 4) && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1],
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let ariaCurrent;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $base;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Link", slots, ['default']);
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	const { base } = getContext(ROUTER);
    	validate_store(base, "base");
    	component_subscribe($$self, base, value => $$invalidate(13, $base = value));
    	const location = getContext(LOCATION);
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(14, $location = value));
    	const dispatch = createEventDispatcher();
    	let href, isPartiallyCurrent, isCurrent, props;

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate$1(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("to" in $$new_props) $$invalidate(7, to = $$new_props.to);
    		if ("replace" in $$new_props) $$invalidate(8, replace = $$new_props.replace);
    		if ("state" in $$new_props) $$invalidate(9, state = $$new_props.state);
    		if ("getProps" in $$new_props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ("$$scope" in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		ROUTER,
    		LOCATION,
    		navigate: navigate$1,
    		startsWith,
    		resolve,
    		shouldNavigate,
    		to,
    		replace,
    		state,
    		getProps,
    		base,
    		location,
    		dispatch,
    		href,
    		isPartiallyCurrent,
    		isCurrent,
    		props,
    		onClick,
    		$base,
    		$location,
    		ariaCurrent
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("to" in $$props) $$invalidate(7, to = $$new_props.to);
    		if ("replace" in $$props) $$invalidate(8, replace = $$new_props.replace);
    		if ("state" in $$props) $$invalidate(9, state = $$new_props.state);
    		if ("getProps" in $$props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ("href" in $$props) $$invalidate(0, href = $$new_props.href);
    		if ("isPartiallyCurrent" in $$props) $$invalidate(11, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ("isCurrent" in $$props) $$invalidate(12, isCurrent = $$new_props.isCurrent);
    		if ("props" in $$props) $$invalidate(1, props = $$new_props.props);
    		if ("ariaCurrent" in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 8320) {
    			$$invalidate(0, href = to === "/" ? $base.uri : resolve(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 16385) {
    			$$invalidate(11, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 16385) {
    			$$invalidate(12, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 4096) {
    			$$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		if ($$self.$$.dirty & /*getProps, $location, href, isPartiallyCurrent, isCurrent*/ 23553) {
    			$$invalidate(1, props = getProps({
    				location: $location,
    				href,
    				isPartiallyCurrent,
    				isCurrent
    			}));
    		}
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		base,
    		location,
    		onClick,
    		$$restProps,
    		to,
    		replace,
    		state,
    		getProps,
    		isPartiallyCurrent,
    		isCurrent,
    		$base,
    		$location,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {
    			to: 7,
    			replace: 8,
    			state: 9,
    			getProps: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // main
    const bilbord = writable({});
    const latest = writable([]);
    const popular = writable([]);
    const comingsoon = writable([]);
    const tags = writable([]);
    const genresList = writable([]);
    const genres = writable([]);

    //movies
    const movieList = writable([]);
    const curentMPage = writable(0);
    const mScl = writable(0);

    //series
    const seriesList = writable([]);
    const curentSPage = writable(0);
    const sScl = writable(0);

    //player
    const player = writable({
    	t: 0
    });

    //login 
    const logedin = writable(false);

    var bind = function bind(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
      };
    };

    /*global toString:true*/

    // utils is a library of generic helper functions non-specific to axios

    var toString = Object.prototype.toString;

    /**
     * Determine if a value is an Array
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Array, otherwise false
     */
    function isArray(val) {
      return toString.call(val) === '[object Array]';
    }

    /**
     * Determine if a value is undefined
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if the value is undefined, otherwise false
     */
    function isUndefined(val) {
      return typeof val === 'undefined';
    }

    /**
     * Determine if a value is a Buffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Buffer, otherwise false
     */
    function isBuffer(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
        && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
    }

    /**
     * Determine if a value is an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an ArrayBuffer, otherwise false
     */
    function isArrayBuffer(val) {
      return toString.call(val) === '[object ArrayBuffer]';
    }

    /**
     * Determine if a value is a FormData
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an FormData, otherwise false
     */
    function isFormData(val) {
      return (typeof FormData !== 'undefined') && (val instanceof FormData);
    }

    /**
     * Determine if a value is a view on an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
     */
    function isArrayBufferView(val) {
      var result;
      if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        result = ArrayBuffer.isView(val);
      } else {
        result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
      }
      return result;
    }

    /**
     * Determine if a value is a String
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a String, otherwise false
     */
    function isString(val) {
      return typeof val === 'string';
    }

    /**
     * Determine if a value is a Number
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Number, otherwise false
     */
    function isNumber(val) {
      return typeof val === 'number';
    }

    /**
     * Determine if a value is an Object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Object, otherwise false
     */
    function isObject(val) {
      return val !== null && typeof val === 'object';
    }

    /**
     * Determine if a value is a plain Object
     *
     * @param {Object} val The value to test
     * @return {boolean} True if value is a plain Object, otherwise false
     */
    function isPlainObject(val) {
      if (toString.call(val) !== '[object Object]') {
        return false;
      }

      var prototype = Object.getPrototypeOf(val);
      return prototype === null || prototype === Object.prototype;
    }

    /**
     * Determine if a value is a Date
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Date, otherwise false
     */
    function isDate(val) {
      return toString.call(val) === '[object Date]';
    }

    /**
     * Determine if a value is a File
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */
    function isFile(val) {
      return toString.call(val) === '[object File]';
    }

    /**
     * Determine if a value is a Blob
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Blob, otherwise false
     */
    function isBlob(val) {
      return toString.call(val) === '[object Blob]';
    }

    /**
     * Determine if a value is a Function
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Function, otherwise false
     */
    function isFunction(val) {
      return toString.call(val) === '[object Function]';
    }

    /**
     * Determine if a value is a Stream
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Stream, otherwise false
     */
    function isStream(val) {
      return isObject(val) && isFunction(val.pipe);
    }

    /**
     * Determine if a value is a URLSearchParams object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a URLSearchParams object, otherwise false
     */
    function isURLSearchParams(val) {
      return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
    }

    /**
     * Trim excess whitespace off the beginning and end of a string
     *
     * @param {String} str The String to trim
     * @returns {String} The String freed of excess whitespace
     */
    function trim(str) {
      return str.replace(/^\s*/, '').replace(/\s*$/, '');
    }

    /**
     * Determine if we're running in a standard browser environment
     *
     * This allows axios to run in a web worker, and react-native.
     * Both environments support XMLHttpRequest, but not fully standard globals.
     *
     * web workers:
     *  typeof window -> undefined
     *  typeof document -> undefined
     *
     * react-native:
     *  navigator.product -> 'ReactNative'
     * nativescript
     *  navigator.product -> 'NativeScript' or 'NS'
     */
    function isStandardBrowserEnv() {
      if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                               navigator.product === 'NativeScript' ||
                                               navigator.product === 'NS')) {
        return false;
      }
      return (
        typeof window !== 'undefined' &&
        typeof document !== 'undefined'
      );
    }

    /**
     * Iterate over an Array or an Object invoking a function for each item.
     *
     * If `obj` is an Array callback will be called passing
     * the value, index, and complete array for each item.
     *
     * If 'obj' is an Object callback will be called passing
     * the value, key, and complete object for each property.
     *
     * @param {Object|Array} obj The object to iterate
     * @param {Function} fn The callback to invoke for each item
     */
    function forEach(obj, fn) {
      // Don't bother if no value provided
      if (obj === null || typeof obj === 'undefined') {
        return;
      }

      // Force an array if not already something iterable
      if (typeof obj !== 'object') {
        /*eslint no-param-reassign:0*/
        obj = [obj];
      }

      if (isArray(obj)) {
        // Iterate over array values
        for (var i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        // Iterate over object keys
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn.call(null, obj[key], key, obj);
          }
        }
      }
    }

    /**
     * Accepts varargs expecting each argument to be an object, then
     * immutably merges the properties of each object and returns result.
     *
     * When multiple objects contain the same key the later object in
     * the arguments list will take precedence.
     *
     * Example:
     *
     * ```js
     * var result = merge({foo: 123}, {foo: 456});
     * console.log(result.foo); // outputs 456
     * ```
     *
     * @param {Object} obj1 Object to merge
     * @returns {Object} Result of all merge properties
     */
    function merge(/* obj1, obj2, obj3, ... */) {
      var result = {};
      function assignValue(val, key) {
        if (isPlainObject(result[key]) && isPlainObject(val)) {
          result[key] = merge(result[key], val);
        } else if (isPlainObject(val)) {
          result[key] = merge({}, val);
        } else if (isArray(val)) {
          result[key] = val.slice();
        } else {
          result[key] = val;
        }
      }

      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
      }
      return result;
    }

    /**
     * Extends object a by mutably adding to it the properties of object b.
     *
     * @param {Object} a The object to be extended
     * @param {Object} b The object to copy properties from
     * @param {Object} thisArg The object to bind function to
     * @return {Object} The resulting value of object a
     */
    function extend(a, b, thisArg) {
      forEach(b, function assignValue(val, key) {
        if (thisArg && typeof val === 'function') {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
        }
      });
      return a;
    }

    /**
     * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
     *
     * @param {string} content with BOM
     * @return {string} content value without BOM
     */
    function stripBOM(content) {
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
      }
      return content;
    }

    var utils = {
      isArray: isArray,
      isArrayBuffer: isArrayBuffer,
      isBuffer: isBuffer,
      isFormData: isFormData,
      isArrayBufferView: isArrayBufferView,
      isString: isString,
      isNumber: isNumber,
      isObject: isObject,
      isPlainObject: isPlainObject,
      isUndefined: isUndefined,
      isDate: isDate,
      isFile: isFile,
      isBlob: isBlob,
      isFunction: isFunction,
      isStream: isStream,
      isURLSearchParams: isURLSearchParams,
      isStandardBrowserEnv: isStandardBrowserEnv,
      forEach: forEach,
      merge: merge,
      extend: extend,
      trim: trim,
      stripBOM: stripBOM
    };

    function encode(val) {
      return encodeURIComponent(val).
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, '+').
        replace(/%5B/gi, '[').
        replace(/%5D/gi, ']');
    }

    /**
     * Build a URL by appending params to the end
     *
     * @param {string} url The base of the url (e.g., http://www.google.com)
     * @param {object} [params] The params to be appended
     * @returns {string} The formatted url
     */
    var buildURL = function buildURL(url, params, paramsSerializer) {
      /*eslint no-param-reassign:0*/
      if (!params) {
        return url;
      }

      var serializedParams;
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (utils.isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        var parts = [];

        utils.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === 'undefined') {
            return;
          }

          if (utils.isArray(val)) {
            key = key + '[]';
          } else {
            val = [val];
          }

          utils.forEach(val, function parseValue(v) {
            if (utils.isDate(v)) {
              v = v.toISOString();
            } else if (utils.isObject(v)) {
              v = JSON.stringify(v);
            }
            parts.push(encode(key) + '=' + encode(v));
          });
        });

        serializedParams = parts.join('&');
      }

      if (serializedParams) {
        var hashmarkIndex = url.indexOf('#');
        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }

        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
      }

      return url;
    };

    function InterceptorManager() {
      this.handlers = [];
    }

    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    InterceptorManager.prototype.use = function use(fulfilled, rejected) {
      this.handlers.push({
        fulfilled: fulfilled,
        rejected: rejected
      });
      return this.handlers.length - 1;
    };

    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     */
    InterceptorManager.prototype.eject = function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    };

    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     */
    InterceptorManager.prototype.forEach = function forEach(fn) {
      utils.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    };

    var InterceptorManager_1 = InterceptorManager;

    /**
     * Transform the data for a request or a response
     *
     * @param {Object|String} data The data to be transformed
     * @param {Array} headers The headers for the request or response
     * @param {Array|Function} fns A single function or Array of functions
     * @returns {*} The resulting transformed data
     */
    var transformData = function transformData(data, headers, fns) {
      /*eslint no-param-reassign:0*/
      utils.forEach(fns, function transform(fn) {
        data = fn(data, headers);
      });

      return data;
    };

    var isCancel = function isCancel(value) {
      return !!(value && value.__CANCEL__);
    };

    var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
      utils.forEach(headers, function processHeader(value, name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
          headers[normalizedName] = value;
          delete headers[name];
        }
      });
    };

    /**
     * Update an Error with the specified config, error code, and response.
     *
     * @param {Error} error The error to update.
     * @param {Object} config The config.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The error.
     */
    var enhanceError = function enhanceError(error, config, code, request, response) {
      error.config = config;
      if (code) {
        error.code = code;
      }

      error.request = request;
      error.response = response;
      error.isAxiosError = true;

      error.toJSON = function toJSON() {
        return {
          // Standard
          message: this.message,
          name: this.name,
          // Microsoft
          description: this.description,
          number: this.number,
          // Mozilla
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          // Axios
          config: this.config,
          code: this.code
        };
      };
      return error;
    };

    /**
     * Create an Error with the specified message, config, error code, request and response.
     *
     * @param {string} message The error message.
     * @param {Object} config The config.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The created error.
     */
    var createError = function createError(message, config, code, request, response) {
      var error = new Error(message);
      return enhanceError(error, config, code, request, response);
    };

    /**
     * Resolve or reject a Promise based on response status.
     *
     * @param {Function} resolve A function that resolves the promise.
     * @param {Function} reject A function that rejects the promise.
     * @param {object} response The response.
     */
    var settle = function settle(resolve, reject, response) {
      var validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(createError(
          'Request failed with status code ' + response.status,
          response.config,
          null,
          response.request,
          response
        ));
      }
    };

    var cookies = (
      utils.isStandardBrowserEnv() ?

      // Standard browser envs support document.cookie
        (function standardBrowserEnv() {
          return {
            write: function write(name, value, expires, path, domain, secure) {
              var cookie = [];
              cookie.push(name + '=' + encodeURIComponent(value));

              if (utils.isNumber(expires)) {
                cookie.push('expires=' + new Date(expires).toGMTString());
              }

              if (utils.isString(path)) {
                cookie.push('path=' + path);
              }

              if (utils.isString(domain)) {
                cookie.push('domain=' + domain);
              }

              if (secure === true) {
                cookie.push('secure');
              }

              document.cookie = cookie.join('; ');
            },

            read: function read(name) {
              var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
              return (match ? decodeURIComponent(match[3]) : null);
            },

            remove: function remove(name) {
              this.write(name, '', Date.now() - 86400000);
            }
          };
        })() :

      // Non standard browser env (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return {
            write: function write() {},
            read: function read() { return null; },
            remove: function remove() {}
          };
        })()
    );

    /**
     * Determines whether the specified URL is absolute
     *
     * @param {string} url The URL to test
     * @returns {boolean} True if the specified URL is absolute, otherwise false
     */
    var isAbsoluteURL = function isAbsoluteURL(url) {
      // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
      // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
      // by any combination of letters, digits, plus, period, or hyphen.
      return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
    };

    /**
     * Creates a new URL by combining the specified URLs
     *
     * @param {string} baseURL The base URL
     * @param {string} relativeURL The relative URL
     * @returns {string} The combined URL
     */
    var combineURLs = function combineURLs(baseURL, relativeURL) {
      return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
    };

    /**
     * Creates a new URL by combining the baseURL with the requestedURL,
     * only when the requestedURL is not already an absolute URL.
     * If the requestURL is absolute, this function returns the requestedURL untouched.
     *
     * @param {string} baseURL The base URL
     * @param {string} requestedURL Absolute or relative URL to combine
     * @returns {string} The combined full path
     */
    var buildFullPath = function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    };

    // Headers whose duplicates are ignored by node
    // c.f. https://nodejs.org/api/http.html#http_message_headers
    var ignoreDuplicateOf = [
      'age', 'authorization', 'content-length', 'content-type', 'etag',
      'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
      'last-modified', 'location', 'max-forwards', 'proxy-authorization',
      'referer', 'retry-after', 'user-agent'
    ];

    /**
     * Parse headers into an object
     *
     * ```
     * Date: Wed, 27 Aug 2014 08:58:49 GMT
     * Content-Type: application/json
     * Connection: keep-alive
     * Transfer-Encoding: chunked
     * ```
     *
     * @param {String} headers Headers needing to be parsed
     * @returns {Object} Headers parsed into an object
     */
    var parseHeaders = function parseHeaders(headers) {
      var parsed = {};
      var key;
      var val;
      var i;

      if (!headers) { return parsed; }

      utils.forEach(headers.split('\n'), function parser(line) {
        i = line.indexOf(':');
        key = utils.trim(line.substr(0, i)).toLowerCase();
        val = utils.trim(line.substr(i + 1));

        if (key) {
          if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
            return;
          }
          if (key === 'set-cookie') {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
          }
        }
      });

      return parsed;
    };

    var isURLSameOrigin = (
      utils.isStandardBrowserEnv() ?

      // Standard browser envs have full support of the APIs needed to test
      // whether the request URL is of the same origin as current location.
        (function standardBrowserEnv() {
          var msie = /(msie|trident)/i.test(navigator.userAgent);
          var urlParsingNode = document.createElement('a');
          var originURL;

          /**
        * Parse a URL to discover it's components
        *
        * @param {String} url The URL to be parsed
        * @returns {Object}
        */
          function resolveURL(url) {
            var href = url;

            if (msie) {
            // IE needs attribute set twice to normalize properties
              urlParsingNode.setAttribute('href', href);
              href = urlParsingNode.href;
            }

            urlParsingNode.setAttribute('href', href);

            // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
            return {
              href: urlParsingNode.href,
              protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
              host: urlParsingNode.host,
              search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
              hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
              hostname: urlParsingNode.hostname,
              port: urlParsingNode.port,
              pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                urlParsingNode.pathname :
                '/' + urlParsingNode.pathname
            };
          }

          originURL = resolveURL(window.location.href);

          /**
        * Determine if a URL shares the same origin as the current location
        *
        * @param {String} requestURL The URL to test
        * @returns {boolean} True if URL shares the same origin, otherwise false
        */
          return function isURLSameOrigin(requestURL) {
            var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
            return (parsed.protocol === originURL.protocol &&
                parsed.host === originURL.host);
          };
        })() :

      // Non standard browser envs (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return function isURLSameOrigin() {
            return true;
          };
        })()
    );

    var xhr = function xhrAdapter(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        var requestData = config.data;
        var requestHeaders = config.headers;

        if (utils.isFormData(requestData)) {
          delete requestHeaders['Content-Type']; // Let the browser set it
        }

        var request = new XMLHttpRequest();

        // HTTP basic authentication
        if (config.auth) {
          var username = config.auth.username || '';
          var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
          requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
        }

        var fullPath = buildFullPath(config.baseURL, config.url);
        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

        // Set the request timeout in MS
        request.timeout = config.timeout;

        // Listen for ready state
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }

          // The request errored out and we didn't get a response, this will be
          // handled by onerror instead
          // With one exception: request that using file: protocol, most browsers
          // will return status as 0 even though it's a successful request
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
            return;
          }

          // Prepare the response
          var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
          var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
          var response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config: config,
            request: request
          };

          settle(resolve, reject, response);

          // Clean up request
          request = null;
        };

        // Handle browser request cancellation (as opposed to a manual cancellation)
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }

          reject(createError('Request aborted', config, 'ECONNABORTED', request));

          // Clean up request
          request = null;
        };

        // Handle low level network errors
        request.onerror = function handleError() {
          // Real errors are hidden from us by the browser
          // onerror should only fire if it's a network error
          reject(createError('Network Error', config, null, request));

          // Clean up request
          request = null;
        };

        // Handle timeout
        request.ontimeout = function handleTimeout() {
          var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
            request));

          // Clean up request
          request = null;
        };

        // Add xsrf header
        // This is only done if running in a standard browser environment.
        // Specifically not if we're in a web worker, or react-native.
        if (utils.isStandardBrowserEnv()) {
          // Add xsrf header
          var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
            cookies.read(config.xsrfCookieName) :
            undefined;

          if (xsrfValue) {
            requestHeaders[config.xsrfHeaderName] = xsrfValue;
          }
        }

        // Add headers to the request
        if ('setRequestHeader' in request) {
          utils.forEach(requestHeaders, function setRequestHeader(val, key) {
            if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
              // Remove Content-Type if data is undefined
              delete requestHeaders[key];
            } else {
              // Otherwise add header to the request
              request.setRequestHeader(key, val);
            }
          });
        }

        // Add withCredentials to request if needed
        if (!utils.isUndefined(config.withCredentials)) {
          request.withCredentials = !!config.withCredentials;
        }

        // Add responseType to request if needed
        if (config.responseType) {
          try {
            request.responseType = config.responseType;
          } catch (e) {
            // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
            // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
            if (config.responseType !== 'json') {
              throw e;
            }
          }
        }

        // Handle progress if needed
        if (typeof config.onDownloadProgress === 'function') {
          request.addEventListener('progress', config.onDownloadProgress);
        }

        // Not all browsers support upload events
        if (typeof config.onUploadProgress === 'function' && request.upload) {
          request.upload.addEventListener('progress', config.onUploadProgress);
        }

        if (config.cancelToken) {
          // Handle cancellation
          config.cancelToken.promise.then(function onCanceled(cancel) {
            if (!request) {
              return;
            }

            request.abort();
            reject(cancel);
            // Clean up request
            request = null;
          });
        }

        if (!requestData) {
          requestData = null;
        }

        // Send the request
        request.send(requestData);
      });
    };

    var DEFAULT_CONTENT_TYPE = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    function setContentTypeIfUnset(headers, value) {
      if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
        headers['Content-Type'] = value;
      }
    }

    function getDefaultAdapter() {
      var adapter;
      if (typeof XMLHttpRequest !== 'undefined') {
        // For browsers use XHR adapter
        adapter = xhr;
      } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
        // For node use HTTP adapter
        adapter = xhr;
      }
      return adapter;
    }

    var defaults = {
      adapter: getDefaultAdapter(),

      transformRequest: [function transformRequest(data, headers) {
        normalizeHeaderName(headers, 'Accept');
        normalizeHeaderName(headers, 'Content-Type');
        if (utils.isFormData(data) ||
          utils.isArrayBuffer(data) ||
          utils.isBuffer(data) ||
          utils.isStream(data) ||
          utils.isFile(data) ||
          utils.isBlob(data)
        ) {
          return data;
        }
        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
          setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
          return data.toString();
        }
        if (utils.isObject(data)) {
          setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
          return JSON.stringify(data);
        }
        return data;
      }],

      transformResponse: [function transformResponse(data) {
        /*eslint no-param-reassign:0*/
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (e) { /* Ignore */ }
        }
        return data;
      }],

      /**
       * A timeout in milliseconds to abort a request. If set to 0 (default) a
       * timeout is not created.
       */
      timeout: 0,

      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',

      maxContentLength: -1,
      maxBodyLength: -1,

      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      }
    };

    defaults.headers = {
      common: {
        'Accept': 'application/json, text/plain, */*'
      }
    };

    utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
      defaults.headers[method] = {};
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });

    var defaults_1 = defaults;

    /**
     * Throws a `Cancel` if cancellation has been requested.
     */
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }
    }

    /**
     * Dispatch a request to the server using the configured adapter.
     *
     * @param {object} config The config that is to be used for the request
     * @returns {Promise} The Promise to be fulfilled
     */
    var dispatchRequest = function dispatchRequest(config) {
      throwIfCancellationRequested(config);

      // Ensure headers exist
      config.headers = config.headers || {};

      // Transform request data
      config.data = transformData(
        config.data,
        config.headers,
        config.transformRequest
      );

      // Flatten headers
      config.headers = utils.merge(
        config.headers.common || {},
        config.headers[config.method] || {},
        config.headers
      );

      utils.forEach(
        ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
        function cleanHeaderConfig(method) {
          delete config.headers[method];
        }
      );

      var adapter = config.adapter || defaults_1.adapter;

      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);

        // Transform response data
        response.data = transformData(
          response.data,
          response.headers,
          config.transformResponse
        );

        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);

          // Transform response data
          if (reason && reason.response) {
            reason.response.data = transformData(
              reason.response.data,
              reason.response.headers,
              config.transformResponse
            );
          }
        }

        return Promise.reject(reason);
      });
    };

    /**
     * Config-specific merge-function which creates a new config-object
     * by merging two configuration objects together.
     *
     * @param {Object} config1
     * @param {Object} config2
     * @returns {Object} New object resulting from merging config2 to config1
     */
    var mergeConfig = function mergeConfig(config1, config2) {
      // eslint-disable-next-line no-param-reassign
      config2 = config2 || {};
      var config = {};

      var valueFromConfig2Keys = ['url', 'method', 'data'];
      var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
      var defaultToConfig2Keys = [
        'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
        'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
        'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
        'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
        'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
      ];
      var directMergeKeys = ['validateStatus'];

      function getMergedValue(target, source) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
          return utils.merge(target, source);
        } else if (utils.isPlainObject(source)) {
          return utils.merge({}, source);
        } else if (utils.isArray(source)) {
          return source.slice();
        }
        return source;
      }

      function mergeDeepProperties(prop) {
        if (!utils.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(config1[prop], config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          config[prop] = getMergedValue(undefined, config1[prop]);
        }
      }

      utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(undefined, config2[prop]);
        }
      });

      utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

      utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(undefined, config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          config[prop] = getMergedValue(undefined, config1[prop]);
        }
      });

      utils.forEach(directMergeKeys, function merge(prop) {
        if (prop in config2) {
          config[prop] = getMergedValue(config1[prop], config2[prop]);
        } else if (prop in config1) {
          config[prop] = getMergedValue(undefined, config1[prop]);
        }
      });

      var axiosKeys = valueFromConfig2Keys
        .concat(mergeDeepPropertiesKeys)
        .concat(defaultToConfig2Keys)
        .concat(directMergeKeys);

      var otherKeys = Object
        .keys(config1)
        .concat(Object.keys(config2))
        .filter(function filterAxiosKeys(key) {
          return axiosKeys.indexOf(key) === -1;
        });

      utils.forEach(otherKeys, mergeDeepProperties);

      return config;
    };

    /**
     * Create a new instance of Axios
     *
     * @param {Object} instanceConfig The default config for the instance
     */
    function Axios(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager_1(),
        response: new InterceptorManager_1()
      };
    }

    /**
     * Dispatch a request
     *
     * @param {Object} config The config specific for this request (merged with this.defaults)
     */
    Axios.prototype.request = function request(config) {
      /*eslint no-param-reassign:0*/
      // Allow for axios('example/url'[, config]) a la fetch API
      if (typeof config === 'string') {
        config = arguments[1] || {};
        config.url = arguments[0];
      } else {
        config = config || {};
      }

      config = mergeConfig(this.defaults, config);

      // Set config.method
      if (config.method) {
        config.method = config.method.toLowerCase();
      } else if (this.defaults.method) {
        config.method = this.defaults.method.toLowerCase();
      } else {
        config.method = 'get';
      }

      // Hook up interceptors middleware
      var chain = [dispatchRequest, undefined];
      var promise = Promise.resolve(config);

      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        chain.unshift(interceptor.fulfilled, interceptor.rejected);
      });

      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        chain.push(interceptor.fulfilled, interceptor.rejected);
      });

      while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift());
      }

      return promise;
    };

    Axios.prototype.getUri = function getUri(config) {
      config = mergeConfig(this.defaults, config);
      return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
    };

    // Provide aliases for supported request methods
    utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
          method: method,
          url: url,
          data: (config || {}).data
        }));
      };
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function(url, data, config) {
        return this.request(mergeConfig(config || {}, {
          method: method,
          url: url,
          data: data
        }));
      };
    });

    var Axios_1 = Axios;

    /**
     * A `Cancel` is an object that is thrown when an operation is canceled.
     *
     * @class
     * @param {string=} message The message.
     */
    function Cancel(message) {
      this.message = message;
    }

    Cancel.prototype.toString = function toString() {
      return 'Cancel' + (this.message ? ': ' + this.message : '');
    };

    Cancel.prototype.__CANCEL__ = true;

    var Cancel_1 = Cancel;

    /**
     * A `CancelToken` is an object that can be used to request cancellation of an operation.
     *
     * @class
     * @param {Function} executor The executor function.
     */
    function CancelToken(executor) {
      if (typeof executor !== 'function') {
        throw new TypeError('executor must be a function.');
      }

      var resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });

      var token = this;
      executor(function cancel(message) {
        if (token.reason) {
          // Cancellation has already been requested
          return;
        }

        token.reason = new Cancel_1(message);
        resolvePromise(token.reason);
      });
    }

    /**
     * Throws a `Cancel` if cancellation has been requested.
     */
    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };

    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    CancelToken.source = function source() {
      var cancel;
      var token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token: token,
        cancel: cancel
      };
    };

    var CancelToken_1 = CancelToken;

    /**
     * Syntactic sugar for invoking a function and expanding an array for arguments.
     *
     * Common use case would be to use `Function.prototype.apply`.
     *
     *  ```js
     *  function f(x, y, z) {}
     *  var args = [1, 2, 3];
     *  f.apply(null, args);
     *  ```
     *
     * With `spread` this example can be re-written.
     *
     *  ```js
     *  spread(function(x, y, z) {})([1, 2, 3]);
     *  ```
     *
     * @param {Function} callback
     * @returns {Function}
     */
    var spread = function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };

    /**
     * Determines whether the payload is an error thrown by Axios
     *
     * @param {*} payload The value to test
     * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
     */
    var isAxiosError = function isAxiosError(payload) {
      return (typeof payload === 'object') && (payload.isAxiosError === true);
    };

    /**
     * Create an instance of Axios
     *
     * @param {Object} defaultConfig The default config for the instance
     * @return {Axios} A new instance of Axios
     */
    function createInstance(defaultConfig) {
      var context = new Axios_1(defaultConfig);
      var instance = bind(Axios_1.prototype.request, context);

      // Copy axios.prototype to instance
      utils.extend(instance, Axios_1.prototype, context);

      // Copy context to instance
      utils.extend(instance, context);

      return instance;
    }

    // Create the default instance to be exported
    var axios$1 = createInstance(defaults_1);

    // Expose Axios class to allow class inheritance
    axios$1.Axios = Axios_1;

    // Factory for creating new instances
    axios$1.create = function create(instanceConfig) {
      return createInstance(mergeConfig(axios$1.defaults, instanceConfig));
    };

    // Expose Cancel & CancelToken
    axios$1.Cancel = Cancel_1;
    axios$1.CancelToken = CancelToken_1;
    axios$1.isCancel = isCancel;

    // Expose all/spread
    axios$1.all = function all(promises) {
      return Promise.all(promises);
    };
    axios$1.spread = spread;

    // Expose isAxiosError
    axios$1.isAxiosError = isAxiosError;

    var axios_1 = axios$1;

    // Allow use of default import syntax in TypeScript
    var _default = axios$1;
    axios_1.default = _default;

    var axios = axios_1;

    /* src/components/poster.svelte generated by Svelte v3.38.2 */
    const file$k = "src/components/poster.svelte";

    // (23:4) {:else}
    function create_else_block$3(ctx) {
    	let img_1;
    	let img_1_src_value;
    	let t0;
    	let p;
    	let t1;
    	let t2;
    	let t3;
    	let span;
    	let t4;
    	let t5;

    	const block = {
    		c: function create() {
    			img_1 = element("img");
    			t0 = space();
    			p = element("p");
    			t1 = text("SS ");
    			t2 = text(/*season*/ ctx[5]);
    			t3 = space();
    			span = element("span");
    			t4 = text(" Eps ");
    			t5 = text(/*eps*/ ctx[6]);
    			attr_dev(img_1, "class", "boxcon");
    			if (img_1.src !== (img_1_src_value = "/images/series.svg")) attr_dev(img_1, "src", img_1_src_value);
    			attr_dev(img_1, "alt", "#");
    			add_location(img_1, file$k, 23, 4, 569);
    			add_location(span, file$k, 24, 19, 645);
    			add_location(p, file$k, 24, 4, 630);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img_1, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(p, span);
    			append_dev(p, t4);
    			append_dev(p, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*season*/ 32) set_data_dev(t2, /*season*/ ctx[5]);
    			if (dirty & /*eps*/ 64) set_data_dev(t5, /*eps*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img_1);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(23:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (20:4) {#if type == "movie"}
    function create_if_block$c(ctx) {
    	let img_1;
    	let img_1_src_value;
    	let t0;
    	let p;
    	let t1_value = /*relese*/ ctx[3].split("-")[0] + "";
    	let t1;
    	let t2;
    	let span;
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			img_1 = element("img");
    			t0 = space();
    			p = element("p");
    			t1 = text(t1_value);
    			t2 = space();
    			span = element("span");
    			t3 = space();
    			t4 = text(/*duration*/ ctx[4]);
    			attr_dev(img_1, "class", "boxcon");
    			if (img_1.src !== (img_1_src_value = "/images/movie.svg")) attr_dev(img_1, "src", img_1_src_value);
    			attr_dev(img_1, "alt", "#");
    			add_location(img_1, file$k, 20, 4, 436);
    			add_location(span, file$k, 21, 30, 522);
    			add_location(p, file$k, 21, 4, 496);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img_1, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, span);
    			append_dev(p, t3);
    			append_dev(p, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*relese*/ 8 && t1_value !== (t1_value = /*relese*/ ctx[3].split("-")[0] + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*duration*/ 16) set_data_dev(t4, /*duration*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img_1);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(20:4) {#if type == \\\"movie\\\"}",
    		ctx
    	});

    	return block;
    }

    // (15:0) <Link class="poster" to={link}>
    function create_default_slot$7(ctx) {
    	let img_1;
    	let img_1_src_value;
    	let t0;
    	let p;
    	let t1;
    	let t2;
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*type*/ ctx[2] == "movie") return create_if_block$c;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			img_1 = element("img");
    			t0 = space();
    			p = element("p");
    			t1 = text(/*name*/ ctx[0]);
    			t2 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			if (img_1.src !== (img_1_src_value = /*img*/ ctx[1])) attr_dev(img_1, "src", img_1_src_value);
    			attr_dev(img_1, "alt", "#");
    			add_location(img_1, file$k, 15, 4, 338);
    			attr_dev(p, "id", "t");
    			add_location(p, file$k, 16, 4, 367);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img_1, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t1);
    			insert_dev(target, t2, anchor);
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*img*/ 2 && img_1.src !== (img_1_src_value = /*img*/ ctx[1])) {
    				attr_dev(img_1, "src", img_1_src_value);
    			}

    			if (dirty & /*name*/ 1) set_data_dev(t1, /*name*/ ctx[0]);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img_1);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t2);
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(15:0) <Link class=\\\"poster\\\" to={link}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let link_1;
    	let current;

    	link_1 = new Link({
    			props: {
    				class: "poster",
    				to: /*link*/ ctx[7],
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link_1.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(link_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link_1_changes = {};

    			if (dirty & /*$$scope, duration, relese, type, eps, season, name, img*/ 639) {
    				link_1_changes.$$scope = { dirty, ctx };
    			}

    			link_1.$set(link_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Poster", slots, []);
    	let { img } = $$props;
    	let { name } = $$props;
    	let { type } = $$props;
    	let { relese } = $$props;
    	let { duration } = $$props;
    	let { season } = $$props;
    	let { eps } = $$props;
    	let { id } = $$props;
    	name = String(name);
    	let link = "/" + type + "/" + id;
    	const writable_props = ["img", "name", "type", "relese", "duration", "season", "eps", "id"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Poster> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("img" in $$props) $$invalidate(1, img = $$props.img);
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("type" in $$props) $$invalidate(2, type = $$props.type);
    		if ("relese" in $$props) $$invalidate(3, relese = $$props.relese);
    		if ("duration" in $$props) $$invalidate(4, duration = $$props.duration);
    		if ("season" in $$props) $$invalidate(5, season = $$props.season);
    		if ("eps" in $$props) $$invalidate(6, eps = $$props.eps);
    		if ("id" in $$props) $$invalidate(8, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		Link,
    		img,
    		name,
    		type,
    		relese,
    		duration,
    		season,
    		eps,
    		id,
    		link
    	});

    	$$self.$inject_state = $$props => {
    		if ("img" in $$props) $$invalidate(1, img = $$props.img);
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("type" in $$props) $$invalidate(2, type = $$props.type);
    		if ("relese" in $$props) $$invalidate(3, relese = $$props.relese);
    		if ("duration" in $$props) $$invalidate(4, duration = $$props.duration);
    		if ("season" in $$props) $$invalidate(5, season = $$props.season);
    		if ("eps" in $$props) $$invalidate(6, eps = $$props.eps);
    		if ("id" in $$props) $$invalidate(8, id = $$props.id);
    		if ("link" in $$props) $$invalidate(7, link = $$props.link);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, img, type, relese, duration, season, eps, link, id];
    }

    class Poster extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {
    			img: 1,
    			name: 0,
    			type: 2,
    			relese: 3,
    			duration: 4,
    			season: 5,
    			eps: 6,
    			id: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Poster",
    			options,
    			id: create_fragment$k.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*img*/ ctx[1] === undefined && !("img" in props)) {
    			console.warn("<Poster> was created without expected prop 'img'");
    		}

    		if (/*name*/ ctx[0] === undefined && !("name" in props)) {
    			console.warn("<Poster> was created without expected prop 'name'");
    		}

    		if (/*type*/ ctx[2] === undefined && !("type" in props)) {
    			console.warn("<Poster> was created without expected prop 'type'");
    		}

    		if (/*relese*/ ctx[3] === undefined && !("relese" in props)) {
    			console.warn("<Poster> was created without expected prop 'relese'");
    		}

    		if (/*duration*/ ctx[4] === undefined && !("duration" in props)) {
    			console.warn("<Poster> was created without expected prop 'duration'");
    		}

    		if (/*season*/ ctx[5] === undefined && !("season" in props)) {
    			console.warn("<Poster> was created without expected prop 'season'");
    		}

    		if (/*eps*/ ctx[6] === undefined && !("eps" in props)) {
    			console.warn("<Poster> was created without expected prop 'eps'");
    		}

    		if (/*id*/ ctx[8] === undefined && !("id" in props)) {
    			console.warn("<Poster> was created without expected prop 'id'");
    		}
    	}

    	get img() {
    		throw new Error("<Poster>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set img(value) {
    		throw new Error("<Poster>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Poster>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Poster>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Poster>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Poster>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get relese() {
    		throw new Error("<Poster>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set relese(value) {
    		throw new Error("<Poster>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Poster>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Poster>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get season() {
    		throw new Error("<Poster>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set season(value) {
    		throw new Error("<Poster>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get eps() {
    		throw new Error("<Poster>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set eps(value) {
    		throw new Error("<Poster>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Poster>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Poster>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/bilbord2.svelte generated by Svelte v3.38.2 */
    const file$j = "src/components/bilbord2.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (18:16) {#if top.genres != undefined}
    function create_if_block$b(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*top*/ ctx[0].genres;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*top*/ 1) {
    				each_value = /*top*/ ctx[0].genres;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(18:16) {#if top.genres != undefined}",
    		ctx
    	});

    	return block;
    }

    // (20:24) <Link to={'/genre/'+genre} >
    function create_default_slot_1$3(ctx) {
    	let t0_value = /*genre*/ ctx[1] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text(", ");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*top*/ 1 && t0_value !== (t0_value = /*genre*/ ctx[1] + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(20:24) <Link to={'/genre/'+genre} >",
    		ctx
    	});

    	return block;
    }

    // (19:20) {#each top.genres as genre}
    function create_each_block$5(ctx) {
    	let link;
    	let current;

    	link = new Link({
    			props: {
    				to: "/genre/" + /*genre*/ ctx[1],
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};
    			if (dirty & /*top*/ 1) link_changes.to = "/genre/" + /*genre*/ ctx[1];

    			if (dirty & /*$$scope, top*/ 17) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(19:20) {#each top.genres as genre}",
    		ctx
    	});

    	return block;
    }

    // (12:4) <Link to={`/${top.type}/${top.showid}`} class="a">
    function create_default_slot$6(ctx) {
    	let div0;
    	let t0;
    	let div1;
    	let h1;
    	let t1_value = /*top*/ ctx[0].name + "";
    	let t1;
    	let t2;
    	let p0;
    	let t3;
    	let t4_value = /*top*/ ctx[0].duration + "";
    	let t4;
    	let t5;
    	let img0;
    	let img0_src_value;
    	let t6;
    	let t7_value = /*top*/ ctx[0].relese + "";
    	let t7;
    	let t8;
    	let img1;
    	let img1_src_value;
    	let t9;
    	let p1;
    	let t10;
    	let t11;
    	let p2;
    	let t12_value = /*top*/ ctx[0].description + "";
    	let t12;
    	let current;
    	let if_block = /*top*/ ctx[0].genres != undefined && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			h1 = element("h1");
    			t1 = text(t1_value);
    			t2 = space();
    			p0 = element("p");
    			t3 = text("Duration: ");
    			t4 = text(t4_value);
    			t5 = space();
    			img0 = element("img");
    			t6 = text(" Relese: ");
    			t7 = text(t7_value);
    			t8 = space();
    			img1 = element("img");
    			t9 = space();
    			p1 = element("p");
    			t10 = text("Genre: \n                ");
    			if (if_block) if_block.c();
    			t11 = space();
    			p2 = element("p");
    			t12 = text(t12_value);
    			attr_dev(div0, "class", "backgrade");
    			add_location(div0, file$j, 12, 8, 295);
    			add_location(h1, file$j, 14, 12, 366);
    			if (img0.src !== (img0_src_value = "/images/playtime.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "#");
    			add_location(img0, file$j, 15, 40, 426);
    			if (img1.src !== (img1_src_value = "/images/cal.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "#");
    			add_location(img1, file$j, 15, 102, 488);
    			add_location(p0, file$j, 15, 12, 398);
    			add_location(p1, file$j, 16, 12, 540);
    			attr_dev(p2, "id", "description");
    			add_location(p2, file$j, 23, 12, 794);
    			attr_dev(div1, "class", "info");
    			add_location(div1, file$j, 13, 8, 334);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(h1, t1);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(p0, t3);
    			append_dev(p0, t4);
    			append_dev(p0, t5);
    			append_dev(p0, img0);
    			append_dev(p0, t6);
    			append_dev(p0, t7);
    			append_dev(p0, t8);
    			append_dev(p0, img1);
    			append_dev(div1, t9);
    			append_dev(div1, p1);
    			append_dev(p1, t10);
    			if (if_block) if_block.m(p1, null);
    			append_dev(div1, t11);
    			append_dev(div1, p2);
    			append_dev(p2, t12);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*top*/ 1) && t1_value !== (t1_value = /*top*/ ctx[0].name + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*top*/ 1) && t4_value !== (t4_value = /*top*/ ctx[0].duration + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*top*/ 1) && t7_value !== (t7_value = /*top*/ ctx[0].relese + "")) set_data_dev(t7, t7_value);

    			if (/*top*/ ctx[0].genres != undefined) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*top*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$b(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(p1, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if ((!current || dirty & /*top*/ 1) && t12_value !== (t12_value = /*top*/ ctx[0].description + "")) set_data_dev(t12, t12_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(12:4) <Link to={`/${top.type}/${top.showid}`} class=\\\"a\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t;
    	let link;
    	let current;

    	link = new Link({
    			props: {
    				to: `/${/*top*/ ctx[0].type}/${/*top*/ ctx[0].showid}`,
    				class: "a",
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t = space();
    			create_component(link.$$.fragment);
    			if (img.src !== (img_src_value = /*top*/ ctx[0].panel)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "#");
    			attr_dev(img, "id", "br");
    			attr_dev(img, "class", "svelte-ct08sf");
    			add_location(img, file$j, 10, 4, 194);
    			attr_dev(div, "class", "bilbord svelte-ct08sf");
    			add_location(div, file$j, 9, 0, 168);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t);
    			mount_component(link, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*top*/ 1 && img.src !== (img_src_value = /*top*/ ctx[0].panel)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			const link_changes = {};
    			if (dirty & /*top*/ 1) link_changes.to = `/${/*top*/ ctx[0].type}/${/*top*/ ctx[0].showid}`;

    			if (dirty & /*$$scope, top*/ 17) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Bilbord2", slots, []);
    	let top;

    	bilbord.subscribe(r => {
    		$$invalidate(0, top = r);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Bilbord2> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link, bilbord, top });

    	$$self.$inject_state = $$props => {
    		if ("top" in $$props) $$invalidate(0, top = $$props.top);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [top];
    }

    class Bilbord2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Bilbord2",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src/pages/Home.svelte generated by Svelte v3.38.2 */

    const { window: window_1$4 } = globals;
    const file$i = "src/pages/Home.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (40:8) <Link to={"/genre/"+i}>
    function create_default_slot$5(ctx) {
    	let t_value = /*i*/ ctx[8] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*genres*/ 1 && t_value !== (t_value = /*i*/ ctx[8] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(40:8) <Link to={\\\"/genre/\\\"+i}>",
    		ctx
    	});

    	return block;
    }

    // (39:8) {#each genres as i}
    function create_each_block_3(ctx) {
    	let link;
    	let current;

    	link = new Link({
    			props: {
    				to: "/genre/" + /*i*/ ctx[8],
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};
    			if (dirty & /*genres*/ 1) link_changes.to = "/genre/" + /*i*/ ctx[8];

    			if (dirty & /*$$scope, genres*/ 131073) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(39:8) {#each genres as i}",
    		ctx
    	});

    	return block;
    }

    // (47:8) {#each pop as i}
    function create_each_block_2$1(ctx) {
    	let poster;
    	let current;

    	poster = new Poster({
    			props: {
    				name: /*i*/ ctx[8].name,
    				img: /*i*/ ctx[8].poster,
    				type: /*i*/ ctx[8].type,
    				relese: /*i*/ ctx[8].relese,
    				duration: /*i*/ ctx[8].duration,
    				season: /*i*/ ctx[8].season,
    				eps: /*i*/ ctx[8].eps,
    				id: /*i*/ ctx[8].showid
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(poster.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(poster, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const poster_changes = {};
    			if (dirty & /*pop*/ 2) poster_changes.name = /*i*/ ctx[8].name;
    			if (dirty & /*pop*/ 2) poster_changes.img = /*i*/ ctx[8].poster;
    			if (dirty & /*pop*/ 2) poster_changes.type = /*i*/ ctx[8].type;
    			if (dirty & /*pop*/ 2) poster_changes.relese = /*i*/ ctx[8].relese;
    			if (dirty & /*pop*/ 2) poster_changes.duration = /*i*/ ctx[8].duration;
    			if (dirty & /*pop*/ 2) poster_changes.season = /*i*/ ctx[8].season;
    			if (dirty & /*pop*/ 2) poster_changes.eps = /*i*/ ctx[8].eps;
    			if (dirty & /*pop*/ 2) poster_changes.id = /*i*/ ctx[8].showid;
    			poster.$set(poster_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(poster.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(poster.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(poster, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(47:8) {#each pop as i}",
    		ctx
    	});

    	return block;
    }

    // (55:8) {#each lat as i}
    function create_each_block_1$2(ctx) {
    	let poster;
    	let current;

    	poster = new Poster({
    			props: {
    				name: /*i*/ ctx[8].name,
    				img: /*i*/ ctx[8].poster,
    				type: /*i*/ ctx[8].type,
    				relese: /*i*/ ctx[8].relese,
    				duration: /*i*/ ctx[8].duration,
    				season: /*i*/ ctx[8].season,
    				eps: /*i*/ ctx[8].eps,
    				id: /*i*/ ctx[8].showid
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(poster.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(poster, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const poster_changes = {};
    			if (dirty & /*lat*/ 4) poster_changes.name = /*i*/ ctx[8].name;
    			if (dirty & /*lat*/ 4) poster_changes.img = /*i*/ ctx[8].poster;
    			if (dirty & /*lat*/ 4) poster_changes.type = /*i*/ ctx[8].type;
    			if (dirty & /*lat*/ 4) poster_changes.relese = /*i*/ ctx[8].relese;
    			if (dirty & /*lat*/ 4) poster_changes.duration = /*i*/ ctx[8].duration;
    			if (dirty & /*lat*/ 4) poster_changes.season = /*i*/ ctx[8].season;
    			if (dirty & /*lat*/ 4) poster_changes.eps = /*i*/ ctx[8].eps;
    			if (dirty & /*lat*/ 4) poster_changes.id = /*i*/ ctx[8].showid;
    			poster.$set(poster_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(poster.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(poster.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(poster, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(55:8) {#each lat as i}",
    		ctx
    	});

    	return block;
    }

    // (63:8) {#each cs as i}
    function create_each_block$4(ctx) {
    	let poster;
    	let current;

    	poster = new Poster({
    			props: {
    				name: /*i*/ ctx[8].name,
    				img: /*i*/ ctx[8].poster,
    				type: /*i*/ ctx[8].type,
    				relese: /*i*/ ctx[8].relese,
    				duration: /*i*/ ctx[8].duration,
    				season: /*i*/ ctx[8].season,
    				eps: /*i*/ ctx[8].eps,
    				id: /*i*/ ctx[8].showid
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(poster.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(poster, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const poster_changes = {};
    			if (dirty & /*cs*/ 8) poster_changes.name = /*i*/ ctx[8].name;
    			if (dirty & /*cs*/ 8) poster_changes.img = /*i*/ ctx[8].poster;
    			if (dirty & /*cs*/ 8) poster_changes.type = /*i*/ ctx[8].type;
    			if (dirty & /*cs*/ 8) poster_changes.relese = /*i*/ ctx[8].relese;
    			if (dirty & /*cs*/ 8) poster_changes.duration = /*i*/ ctx[8].duration;
    			if (dirty & /*cs*/ 8) poster_changes.season = /*i*/ ctx[8].season;
    			if (dirty & /*cs*/ 8) poster_changes.eps = /*i*/ ctx[8].eps;
    			if (dirty & /*cs*/ 8) poster_changes.id = /*i*/ ctx[8].showid;
    			poster.$set(poster_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(poster.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(poster.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(poster, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(63:8) {#each cs as i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let scrolling = false;

    	let clear_scrolling = () => {
    		scrolling = false;
    	};

    	let scrolling_timeout;
    	let main;
    	let bilbord;
    	let t0;
    	let section0;
    	let t1;
    	let section1;
    	let h10;
    	let t3;
    	let section2;
    	let t4;
    	let section3;
    	let h11;
    	let t6;
    	let section4;
    	let t7;
    	let section5;
    	let h12;
    	let t9;
    	let section6;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[6]);
    	add_render_callback(/*onwindowscroll*/ ctx[7]);
    	bilbord = new Bilbord2({ $$inline: true });
    	let each_value_3 = /*genres*/ ctx[0];
    	validate_each_argument(each_value_3);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_3[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const out = i => transition_out(each_blocks_3[i], 1, 1, () => {
    		each_blocks_3[i] = null;
    	});

    	let each_value_2 = /*pop*/ ctx[1];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	const out_1 = i => transition_out(each_blocks_2[i], 1, 1, () => {
    		each_blocks_2[i] = null;
    	});

    	let each_value_1 = /*lat*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const out_2 = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*cs*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const out_3 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(bilbord.$$.fragment);
    			t0 = space();
    			section0 = element("section");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t1 = space();
    			section1 = element("section");
    			h10 = element("h1");
    			h10.textContent = "Popular";
    			t3 = space();
    			section2 = element("section");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t4 = space();
    			section3 = element("section");
    			h11 = element("h1");
    			h11.textContent = "Latest";
    			t6 = space();
    			section4 = element("section");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t7 = space();
    			section5 = element("section");
    			h12 = element("h1");
    			h12.textContent = "Coming Soon";
    			t9 = space();
    			section6 = element("section");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(section0, "class", "querys ml svelte-3ccgq3");
    			add_location(section0, file$i, 37, 4, 740);
    			attr_dev(h10, "class", "svelte-3ccgq3");
    			add_location(h10, file$i, 43, 8, 897);
    			attr_dev(section1, "class", "svelte-3ccgq3");
    			add_location(section1, file$i, 42, 4, 878);
    			attr_dev(section2, "class", "flex mr svelte-3ccgq3");
    			add_location(section2, file$i, 45, 4, 935);
    			attr_dev(h11, "class", "svelte-3ccgq3");
    			add_location(h11, file$i, 51, 8, 1191);
    			attr_dev(section3, "class", "svelte-3ccgq3");
    			add_location(section3, file$i, 50, 4, 1172);
    			attr_dev(section4, "class", "flex mr svelte-3ccgq3");
    			add_location(section4, file$i, 53, 4, 1228);
    			attr_dev(h12, "class", "svelte-3ccgq3");
    			add_location(h12, file$i, 59, 8, 1484);
    			attr_dev(section5, "class", "svelte-3ccgq3");
    			add_location(section5, file$i, 58, 4, 1465);
    			attr_dev(section6, "class", "flex mr svelte-3ccgq3");
    			add_location(section6, file$i, 61, 4, 1526);
    			add_location(main, file$i, 35, 0, 712);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(bilbord, main, null);
    			append_dev(main, t0);
    			append_dev(main, section0);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(section0, null);
    			}

    			append_dev(main, t1);
    			append_dev(main, section1);
    			append_dev(section1, h10);
    			append_dev(main, t3);
    			append_dev(main, section2);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(section2, null);
    			}

    			append_dev(main, t4);
    			append_dev(main, section3);
    			append_dev(section3, h11);
    			append_dev(main, t6);
    			append_dev(main, section4);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(section4, null);
    			}

    			append_dev(main, t7);
    			append_dev(main, section5);
    			append_dev(section5, h12);
    			append_dev(main, t9);
    			append_dev(main, section6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section6, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1$4, "resize", /*onwindowresize*/ ctx[6]),
    					listen_dev(window_1$4, "scroll", () => {
    						scrolling = true;
    						clearTimeout(scrolling_timeout);
    						scrolling_timeout = setTimeout(clear_scrolling, 100);
    						/*onwindowscroll*/ ctx[7]();
    					})
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*scroll*/ 16 && !scrolling) {
    				scrolling = true;
    				clearTimeout(scrolling_timeout);
    				scrollTo(window_1$4.pageXOffset, /*scroll*/ ctx[4]);
    				scrolling_timeout = setTimeout(clear_scrolling, 100);
    			}

    			if (dirty & /*genres*/ 1) {
    				each_value_3 = /*genres*/ ctx[0];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    						transition_in(each_blocks_3[i], 1);
    					} else {
    						each_blocks_3[i] = create_each_block_3(child_ctx);
    						each_blocks_3[i].c();
    						transition_in(each_blocks_3[i], 1);
    						each_blocks_3[i].m(section0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_3.length; i < each_blocks_3.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*pop*/ 2) {
    				each_value_2 = /*pop*/ ctx[1];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    						transition_in(each_blocks_2[i], 1);
    					} else {
    						each_blocks_2[i] = create_each_block_2$1(child_ctx);
    						each_blocks_2[i].c();
    						transition_in(each_blocks_2[i], 1);
    						each_blocks_2[i].m(section2, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks_2.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*lat*/ 4) {
    				each_value_1 = /*lat*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1$2(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(section4, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out_2(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*cs*/ 8) {
    				each_value = /*cs*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(section6, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_3(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bilbord.$$.fragment, local);

    			for (let i = 0; i < each_value_3.length; i += 1) {
    				transition_in(each_blocks_3[i]);
    			}

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks_2[i]);
    			}

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bilbord.$$.fragment, local);
    			each_blocks_3 = each_blocks_3.filter(Boolean);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				transition_out(each_blocks_3[i]);
    			}

    			each_blocks_2 = each_blocks_2.filter(Boolean);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				transition_out(each_blocks_2[i]);
    			}

    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(bilbord);
    			destroy_each(each_blocks_3, detaching);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Home", slots, []);
    	let genres;
    	let pop;
    	let lat;
    	let cs;
    	let scroll;
    	let height;

    	tags.subscribe(r => {
    		$$invalidate(0, genres = r);
    	});

    	popular.subscribe(r => {
    		$$invalidate(1, pop = r);
    	});

    	tags.subscribe(r => {
    		$$invalidate(0, genres = r);
    	});

    	latest.subscribe(r => {
    		$$invalidate(2, lat = r);
    	});

    	comingsoon.subscribe(r => {
    		$$invalidate(3, cs = r);
    	});

    	window.scrollTo(0, 0);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(5, height = window_1$4.innerHeight);
    	}

    	function onwindowscroll() {
    		$$invalidate(4, scroll = window_1$4.pageYOffset);
    	}

    	$$self.$capture_state = () => ({
    		Link,
    		Poster,
    		Bilbord: Bilbord2,
    		tags,
    		popular,
    		latest,
    		comingsoon,
    		genres,
    		pop,
    		lat,
    		cs,
    		scroll,
    		height
    	});

    	$$self.$inject_state = $$props => {
    		if ("genres" in $$props) $$invalidate(0, genres = $$props.genres);
    		if ("pop" in $$props) $$invalidate(1, pop = $$props.pop);
    		if ("lat" in $$props) $$invalidate(2, lat = $$props.lat);
    		if ("cs" in $$props) $$invalidate(3, cs = $$props.cs);
    		if ("scroll" in $$props) $$invalidate(4, scroll = $$props.scroll);
    		if ("height" in $$props) $$invalidate(5, height = $$props.height);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [genres, pop, lat, cs, scroll, height, onwindowresize, onwindowscroll];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src/pages/Genres.svelte generated by Svelte v3.38.2 */
    const file$h = "src/pages/Genres.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (23:2) <Link to={"/genre/"+i}>
    function create_default_slot$4(ctx) {
    	let t_value = /*i*/ ctx[2] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*listgenres*/ 2 && t_value !== (t_value = /*i*/ ctx[2] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(23:2) <Link to={\\\"/genre/\\\"+i}>",
    		ctx
    	});

    	return block;
    }

    // (22:2) {#each listgenres as i}
    function create_each_block_2(ctx) {
    	let link;
    	let current;

    	link = new Link({
    			props: {
    				to: "/genre/" + /*i*/ ctx[2],
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};
    			if (dirty & /*listgenres*/ 2) link_changes.to = "/genre/" + /*i*/ ctx[2];

    			if (dirty & /*$$scope, listgenres*/ 1026) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(22:2) {#each listgenres as i}",
    		ctx
    	});

    	return block;
    }

    // (29:3) {#each i.shows as e}
    function create_each_block_1$1(ctx) {
    	let poster;
    	let current;

    	poster = new Poster({
    			props: {
    				name: /*e*/ ctx[5].name,
    				type: /*e*/ ctx[5].type,
    				img: /*e*/ ctx[5].poster,
    				relese: /*e*/ ctx[5].relese,
    				duration: /*e*/ ctx[5].duration,
    				season: /*i*/ ctx[2].season,
    				eps: /*i*/ ctx[2].eps,
    				id: /*i*/ ctx[2].showid
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(poster.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(poster, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const poster_changes = {};
    			if (dirty & /*genre*/ 1) poster_changes.name = /*e*/ ctx[5].name;
    			if (dirty & /*genre*/ 1) poster_changes.type = /*e*/ ctx[5].type;
    			if (dirty & /*genre*/ 1) poster_changes.img = /*e*/ ctx[5].poster;
    			if (dirty & /*genre*/ 1) poster_changes.relese = /*e*/ ctx[5].relese;
    			if (dirty & /*genre*/ 1) poster_changes.duration = /*e*/ ctx[5].duration;
    			if (dirty & /*genre*/ 1) poster_changes.season = /*i*/ ctx[2].season;
    			if (dirty & /*genre*/ 1) poster_changes.eps = /*i*/ ctx[2].eps;
    			if (dirty & /*genre*/ 1) poster_changes.id = /*i*/ ctx[2].showid;
    			poster.$set(poster_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(poster.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(poster.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(poster, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(29:3) {#each i.shows as e}",
    		ctx
    	});

    	return block;
    }

    // (26:1) {#each genre as i}
    function create_each_block$3(ctx) {
    	let h1;
    	let t0_value = /*i*/ ctx[2].genre + "";
    	let t0;
    	let t1;
    	let section;
    	let t2;
    	let current;
    	let each_value_1 = /*i*/ ctx[2].shows;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			section = element("section");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			attr_dev(h1, "class", "svelte-1jfew7b");
    			add_location(h1, file$h, 26, 2, 485);
    			attr_dev(section, "class", "flex svelte-1jfew7b");
    			add_location(section, file$h, 27, 2, 507);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, section, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section, null);
    			}

    			append_dev(section, t2);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*genre*/ 1) && t0_value !== (t0_value = /*i*/ ctx[2].genre + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*genre*/ 1) {
    				each_value_1 = /*i*/ ctx[2].shows;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(section, t2);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(26:1) {#each genre as i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let section;
    	let t2;
    	let current;
    	let each_value_2 = /*listgenres*/ ctx[1];
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*genre*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Genres";
    			t1 = space();
    			section = element("section");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "class", "svelte-1jfew7b");
    			add_location(h1, file$h, 19, 1, 330);
    			attr_dev(section, "class", "querys svelte-1jfew7b");
    			add_location(section, file$h, 20, 1, 348);
    			attr_dev(main, "class", "svelte-1jfew7b");
    			add_location(main, file$h, 18, 0, 321);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, section);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(section, null);
    			}

    			append_dev(main, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*listgenres*/ 2) {
    				each_value_2 = /*listgenres*/ ctx[1];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(section, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*genre*/ 1) {
    				each_value = /*genre*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(main, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Genres", slots, []);
    	let genre;
    	let listgenres;

    	genres.subscribe(r => {
    		$$invalidate(0, genre = r);
    	});

    	genresList.subscribe(r => {
    		$$invalidate(1, listgenres = r);
    	});

    	window.scrollTo(0, 0);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Genres> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Poster,
    		genres,
    		genresList,
    		Link,
    		genre,
    		listgenres
    	});

    	$$self.$inject_state = $$props => {
    		if ("genre" in $$props) $$invalidate(0, genre = $$props.genre);
    		if ("listgenres" in $$props) $$invalidate(1, listgenres = $$props.listgenres);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [genre, listgenres];
    }

    class Genres extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Genres",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src/components/lib.svelte generated by Svelte v3.38.2 */
    const file$g = "src/components/lib.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (7:1) {#each shows as i}
    function create_each_block$2(ctx) {
    	let poster;
    	let current;

    	poster = new Poster({
    			props: {
    				name: /*i*/ ctx[1].name,
    				img: /*i*/ ctx[1].poster,
    				type: /*i*/ ctx[1].type,
    				relese: /*i*/ ctx[1].relese,
    				duration: /*i*/ ctx[1].duration,
    				season: /*i*/ ctx[1].season,
    				eps: /*i*/ ctx[1].eps,
    				id: /*i*/ ctx[1].showid
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(poster.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(poster, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const poster_changes = {};
    			if (dirty & /*shows*/ 1) poster_changes.name = /*i*/ ctx[1].name;
    			if (dirty & /*shows*/ 1) poster_changes.img = /*i*/ ctx[1].poster;
    			if (dirty & /*shows*/ 1) poster_changes.type = /*i*/ ctx[1].type;
    			if (dirty & /*shows*/ 1) poster_changes.relese = /*i*/ ctx[1].relese;
    			if (dirty & /*shows*/ 1) poster_changes.duration = /*i*/ ctx[1].duration;
    			if (dirty & /*shows*/ 1) poster_changes.season = /*i*/ ctx[1].season;
    			if (dirty & /*shows*/ 1) poster_changes.eps = /*i*/ ctx[1].eps;
    			if (dirty & /*shows*/ 1) poster_changes.id = /*i*/ ctx[1].showid;
    			poster.$set(poster_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(poster.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(poster.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(poster, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(7:1) {#each shows as i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div;
    	let current;
    	let each_value = /*shows*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "svelte-i9fghu");
    			add_location(div, file$g, 5, 0, 94);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*shows*/ 1) {
    				each_value = /*shows*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Lib", slots, []);
    	let { shows } = $$props;
    	const writable_props = ["shows"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Lib> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("shows" in $$props) $$invalidate(0, shows = $$props.shows);
    	};

    	$$self.$capture_state = () => ({ Poster, shows });

    	$$self.$inject_state = $$props => {
    		if ("shows" in $$props) $$invalidate(0, shows = $$props.shows);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [shows];
    }

    class Lib extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { shows: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Lib",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*shows*/ ctx[0] === undefined && !("shows" in props)) {
    			console.warn("<Lib> was created without expected prop 'shows'");
    		}
    	}

    	get shows() {
    		throw new Error("<Lib>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shows(value) {
    		throw new Error("<Lib>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/load.svelte generated by Svelte v3.38.2 */

    const file$f = "src/components/load.svelte";

    function create_fragment$f(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "load svelte-ugzh3a");
    			add_location(div, file$f, 2, 0, 21);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Load", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Load> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Load extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Load",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/pages/Movies.svelte generated by Svelte v3.38.2 */

    const { console: console_1$1, setTimeout: setTimeout_1$2, window: window_1$3 } = globals;
    const file$e = "src/pages/Movies.svelte";

    // (74:1) {#if end == false}
    function create_if_block$a(ctx) {
    	let load_1;
    	let current;
    	load_1 = new Load({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(load_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(load_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(load_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(load_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(load_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(74:1) {#if end == false}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let scrolling = false;

    	let clear_scrolling = () => {
    		scrolling = false;
    	};

    	let scrolling_timeout;
    	let main;
    	let lib;
    	let t;
    	let main_resize_listener;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowscroll*/ ctx[4]);

    	lib = new Lib({
    			props: { shows: /*movies*/ ctx[0] },
    			$$inline: true
    		});

    	let if_block = /*end*/ ctx[3] == false && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(lib.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			add_render_callback(() => /*main_elementresize_handler*/ ctx[5].call(main));
    			add_location(main, file$e, 71, 0, 1351);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(lib, main, null);
    			append_dev(main, t);
    			if (if_block) if_block.m(main, null);
    			main_resize_listener = add_resize_listener(main, /*main_elementresize_handler*/ ctx[5].bind(main));
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1$3, "scroll", () => {
    					scrolling = true;
    					clearTimeout(scrolling_timeout);
    					scrolling_timeout = setTimeout_1$2(clear_scrolling, 100);
    					/*onwindowscroll*/ ctx[4]();
    				});

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*scroll*/ 2 && !scrolling) {
    				scrolling = true;
    				clearTimeout(scrolling_timeout);
    				scrollTo(window_1$3.pageXOffset, /*scroll*/ ctx[1]);
    				scrolling_timeout = setTimeout_1$2(clear_scrolling, 100);
    			}

    			const lib_changes = {};
    			if (dirty & /*movies*/ 1) lib_changes.shows = /*movies*/ ctx[0];
    			lib.$set(lib_changes);

    			if (/*end*/ ctx[3] == false) {
    				if (if_block) {
    					if (dirty & /*end*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$a(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(main, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lib.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lib.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(lib);
    			if (if_block) if_block.d();
    			main_resize_listener();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Movies", slots, []);
    	let movies = [];
    	let scroll;
    	let height;
    	let page = 0;
    	let maxpg = 0;
    	let end = false;
    	let load = true;

    	async function update() {
    		load = false;

    		axios.get(`http://localhost:3000/api/show/movie/${page}`).then(res => {
    			maxpg = res.data.maxpage;
    			let newm = movies;

    			for (let i = 0; i < res.data.shows.length; i++) {
    				newm.push(res.data.shows[i]);
    			}

    			console.log(newm);
    			movieList.set(newm);
    			load = true;

    			if (page >= maxpg) {
    				$$invalidate(3, end = true);
    			}
    		});
    	}

    	movieList.subscribe(r => {
    		$$invalidate(0, movies = r);
    	});

    	curentMPage.subscribe(r => {
    		page = r;
    	});

    	if (movies.length == 0) {
    		update();
    	}

    	window.onscroll = () => {
    		mScl.update(() => {
    			return scroll;
    		});

    		if (!end && load) {
    			if (page < maxpg) {
    				if (document.body.offsetHeight - (scroll + height) < 10) {
    					update();

    					curentMPage.update(n => {
    						return n + 1;
    					});
    				}
    			} else {
    				$$invalidate(3, end = true);
    			}
    		}

    		console.log(page, maxpg);
    	};

    	setTimeout(
    		() => {
    			mScl.update(r => {
    				window.scrollTo(0, r);
    				return r;
    			});
    		},
    		10
    	);

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Movies> was created with unknown prop '${key}'`);
    	});

    	function onwindowscroll() {
    		$$invalidate(1, scroll = window_1$3.pageYOffset);
    	}

    	function main_elementresize_handler() {
    		height = this.clientHeight;
    		$$invalidate(2, height);
    	}

    	$$self.$capture_state = () => ({
    		Lib,
    		Load,
    		movieList,
    		mScl,
    		curentMPage,
    		axios,
    		movies,
    		scroll,
    		height,
    		page,
    		maxpg,
    		end,
    		load,
    		update
    	});

    	$$self.$inject_state = $$props => {
    		if ("movies" in $$props) $$invalidate(0, movies = $$props.movies);
    		if ("scroll" in $$props) $$invalidate(1, scroll = $$props.scroll);
    		if ("height" in $$props) $$invalidate(2, height = $$props.height);
    		if ("page" in $$props) page = $$props.page;
    		if ("maxpg" in $$props) maxpg = $$props.maxpg;
    		if ("end" in $$props) $$invalidate(3, end = $$props.end);
    		if ("load" in $$props) load = $$props.load;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [movies, scroll, height, end, onwindowscroll, main_elementresize_handler];
    }

    class Movies extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Movies",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src/pages/Series.svelte generated by Svelte v3.38.2 */

    const { setTimeout: setTimeout_1$1, window: window_1$2 } = globals;
    const file$d = "src/pages/Series.svelte";

    // (72:1) {#if end == false}
    function create_if_block$9(ctx) {
    	let load_1;
    	let current;
    	load_1 = new Load({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(load_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(load_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(load_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(load_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(load_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(72:1) {#if end == false}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let scrolling = false;

    	let clear_scrolling = () => {
    		scrolling = false;
    	};

    	let scrolling_timeout;
    	let main;
    	let lib;
    	let t;
    	let main_resize_listener;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowscroll*/ ctx[4]);

    	lib = new Lib({
    			props: { shows: /*shows*/ ctx[0] },
    			$$inline: true
    		});

    	let if_block = /*end*/ ctx[3] == false && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(lib.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			add_render_callback(() => /*main_elementresize_handler*/ ctx[5].call(main));
    			add_location(main, file$d, 69, 0, 1295);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(lib, main, null);
    			append_dev(main, t);
    			if (if_block) if_block.m(main, null);
    			main_resize_listener = add_resize_listener(main, /*main_elementresize_handler*/ ctx[5].bind(main));
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1$2, "scroll", () => {
    					scrolling = true;
    					clearTimeout(scrolling_timeout);
    					scrolling_timeout = setTimeout_1$1(clear_scrolling, 100);
    					/*onwindowscroll*/ ctx[4]();
    				});

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*scroll*/ 2 && !scrolling) {
    				scrolling = true;
    				clearTimeout(scrolling_timeout);
    				scrollTo(window_1$2.pageXOffset, /*scroll*/ ctx[1]);
    				scrolling_timeout = setTimeout_1$1(clear_scrolling, 100);
    			}

    			const lib_changes = {};
    			if (dirty & /*shows*/ 1) lib_changes.shows = /*shows*/ ctx[0];
    			lib.$set(lib_changes);

    			if (/*end*/ ctx[3] == false) {
    				if (if_block) {
    					if (dirty & /*end*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$9(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(main, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lib.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lib.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(lib);
    			if (if_block) if_block.d();
    			main_resize_listener();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Series", slots, []);
    	let shows = [];
    	let scroll;
    	let height;
    	let page = 0;
    	let maxpg = 3;
    	let end = false;
    	let load = true;

    	function update() {
    		load = false;

    		axios.get(`http://localhost:3000/api/show/series/${page}`).then(res => {
    			maxpg = res.data.maxpage;
    			let news = shows;

    			for (let i = 0; i < res.data.shows.length; i++) {
    				news.push(res.data.shows[i]);
    			}

    			seriesList.set(news);
    			load = true;

    			if (page >= maxpg) {
    				$$invalidate(3, end = true);
    			}
    		});
    	}

    	seriesList.subscribe(r => {
    		$$invalidate(0, shows = r);
    	});

    	curentSPage.subscribe(r => {
    		page = r;
    	});

    	if (shows.length == 0) {
    		update();
    	}

    	window.onscroll = () => {
    		sScl.update(() => {
    			return scroll;
    		});

    		if (!end && load) {
    			if (page < maxpg) {
    				if (document.body.offsetHeight - (scroll + height) < 100) {
    					update();

    					curentSPage.update(n => {
    						return n + 1;
    					});
    				}
    			} else {
    				$$invalidate(3, end = true);
    			}
    		}
    	};

    	setTimeout(
    		() => {
    			sScl.update(r => {
    				window.scrollTo(0, r);
    				return r;
    			});
    		},
    		10
    	);

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Series> was created with unknown prop '${key}'`);
    	});

    	function onwindowscroll() {
    		$$invalidate(1, scroll = window_1$2.pageYOffset);
    	}

    	function main_elementresize_handler() {
    		height = this.clientHeight;
    		$$invalidate(2, height);
    	}

    	$$self.$capture_state = () => ({
    		Lib,
    		Load,
    		seriesList,
    		sScl,
    		curentSPage,
    		axios,
    		shows,
    		scroll,
    		height,
    		page,
    		maxpg,
    		end,
    		load,
    		update
    	});

    	$$self.$inject_state = $$props => {
    		if ("shows" in $$props) $$invalidate(0, shows = $$props.shows);
    		if ("scroll" in $$props) $$invalidate(1, scroll = $$props.scroll);
    		if ("height" in $$props) $$invalidate(2, height = $$props.height);
    		if ("page" in $$props) page = $$props.page;
    		if ("maxpg" in $$props) maxpg = $$props.maxpg;
    		if ("end" in $$props) $$invalidate(3, end = $$props.end);
    		if ("load" in $$props) load = $$props.load;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [shows, scroll, height, end, onwindowscroll, main_elementresize_handler];
    }

    class Series extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Series",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/pages/Genre.svelte generated by Svelte v3.38.2 */

    const { setTimeout: setTimeout_1, window: window_1$1 } = globals;
    const file$c = "src/pages/Genre.svelte";

    // (59:1) {#if end == false}
    function create_if_block_1$3(ctx) {
    	let load_1;
    	let current;
    	load_1 = new Load({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(load_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(load_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(load_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(load_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(load_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(59:1) {#if end == false}",
    		ctx
    	});

    	return block;
    }

    // (62:1) {#if nores}
    function create_if_block$8(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "No results";
    			attr_dev(p, "class", "nr svelte-1v3frmq");
    			add_location(p, file$c, 62, 1, 1157);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(62:1) {#if nores}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let scrolling = false;

    	let clear_scrolling = () => {
    		scrolling = false;
    	};

    	let scrolling_timeout;
    	let main;
    	let lib;
    	let t0;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[6]);
    	add_render_callback(/*onwindowscroll*/ ctx[7]);

    	lib = new Lib({
    			props: { shows: /*shows*/ ctx[0] },
    			$$inline: true
    		});

    	let if_block0 = /*end*/ ctx[3] == false && create_if_block_1$3(ctx);
    	let if_block1 = /*nores*/ ctx[4] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(lib.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			add_location(main, file$c, 56, 0, 1070);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(lib, main, null);
    			append_dev(main, t0);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t1);
    			if (if_block1) if_block1.m(main, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1$1, "resize", /*onwindowresize*/ ctx[6]),
    					listen_dev(window_1$1, "scroll", () => {
    						scrolling = true;
    						clearTimeout(scrolling_timeout);
    						scrolling_timeout = setTimeout_1(clear_scrolling, 100);
    						/*onwindowscroll*/ ctx[7]();
    					})
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*scroll*/ 2 && !scrolling) {
    				scrolling = true;
    				clearTimeout(scrolling_timeout);
    				scrollTo(window_1$1.pageXOffset, /*scroll*/ ctx[1]);
    				scrolling_timeout = setTimeout_1(clear_scrolling, 100);
    			}

    			const lib_changes = {};
    			if (dirty & /*shows*/ 1) lib_changes.shows = /*shows*/ ctx[0];
    			lib.$set(lib_changes);

    			if (/*end*/ ctx[3] == false) {
    				if (if_block0) {
    					if (dirty & /*end*/ 8) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(main, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*nores*/ ctx[4]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block$8(ctx);
    					if_block1.c();
    					if_block1.m(main, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lib.$$.fragment, local);
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lib.$$.fragment, local);
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(lib);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Genre", slots, []);
    	let { genre } = $$props;
    	let shows = [];
    	let scroll;
    	let height;
    	let page = 0;
    	let maxpg = 0;
    	let end = false;
    	let load = true;
    	let nores = false;

    	function update() {
    		load = false;

    		setTimeout(
    			() => {
    				axios.get(`http://localhost:3000/api/genre/${genre}/${page}`).then(res => {
    					maxpg = res.data.maxpage;
    					let news = shows;

    					for (let i = 0; i < res.data.shows.length; i++) {
    						news.push(res.data.shows[i]);
    					}

    					$$invalidate(0, shows = news);
    					page++;
    					load = true;

    					if (res.data.maxpage == 0) {
    						$$invalidate(3, end = true);
    						$$invalidate(4, nores = true);
    					}
    				});
    			},
    			1000
    		);
    	}

    	if (shows.length == 0) {
    		update();
    	}

    	window.onscroll = () => {
    		if (!end && load) {
    			if (page <= maxpg) {
    				if (document.body.offsetHeight - (scroll + height) < 100) {
    					update();
    				}
    			} else {
    				$$invalidate(3, end = true);
    			}
    		}
    	};

    	const writable_props = ["genre"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Genre> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(2, height = window_1$1.innerHeight);
    	}

    	function onwindowscroll() {
    		$$invalidate(1, scroll = window_1$1.pageYOffset);
    	}

    	$$self.$$set = $$props => {
    		if ("genre" in $$props) $$invalidate(5, genre = $$props.genre);
    	};

    	$$self.$capture_state = () => ({
    		Lib,
    		Load,
    		axios,
    		genre,
    		shows,
    		scroll,
    		height,
    		page,
    		maxpg,
    		end,
    		load,
    		nores,
    		update
    	});

    	$$self.$inject_state = $$props => {
    		if ("genre" in $$props) $$invalidate(5, genre = $$props.genre);
    		if ("shows" in $$props) $$invalidate(0, shows = $$props.shows);
    		if ("scroll" in $$props) $$invalidate(1, scroll = $$props.scroll);
    		if ("height" in $$props) $$invalidate(2, height = $$props.height);
    		if ("page" in $$props) page = $$props.page;
    		if ("maxpg" in $$props) maxpg = $$props.maxpg;
    		if ("end" in $$props) $$invalidate(3, end = $$props.end);
    		if ("load" in $$props) load = $$props.load;
    		if ("nores" in $$props) $$invalidate(4, nores = $$props.nores);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [shows, scroll, height, end, nores, genre, onwindowresize, onwindowscroll];
    }

    class Genre extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { genre: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Genre",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*genre*/ ctx[5] === undefined && !("genre" in props)) {
    			console.warn("<Genre> was created without expected prop 'genre'");
    		}
    	}

    	get genre() {
    		throw new Error("<Genre>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set genre(value) {
    		throw new Error("<Genre>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/watch.svelte generated by Svelte v3.38.2 */
    const file$b = "src/components/watch.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	return child_ctx;
    }

    // (25:16) {#if genre != undefined}
    function create_if_block_2(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*genre*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*genre*/ 16) {
    				each_value_1 = /*genre*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(25:16) {#if genre != undefined}",
    		ctx
    	});

    	return block;
    }

    // (27:20) <Link to={"/genre/"+gen}>
    function create_default_slot$3(ctx) {
    	let t0_value = /*gen*/ ctx[14] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text(", ");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*genre*/ 16 && t0_value !== (t0_value = /*gen*/ ctx[14] + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(27:20) <Link to={\\\"/genre/\\\"+gen}>",
    		ctx
    	});

    	return block;
    }

    // (26:16) {#each genre as gen}
    function create_each_block_1(ctx) {
    	let link;
    	let current;

    	link = new Link({
    			props: {
    				to: "/genre/" + /*gen*/ ctx[14],
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};
    			if (dirty & /*genre*/ 16) link_changes.to = "/genre/" + /*gen*/ ctx[14];

    			if (dirty & /*$$scope, genre*/ 131088) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(26:16) {#each genre as gen}",
    		ctx
    	});

    	return block;
    }

    // (48:8) {#if video != ''}
    function create_if_block$7(ctx) {
    	let each_1_anchor;
    	let each_value = /*services*/ ctx[6];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*setService, services, video*/ 448) {
    				each_value = /*services*/ ctx[6];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
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
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(48:8) {#if video != ''}",
    		ctx
    	});

    	return block;
    }

    // (54:16) {:else}
    function create_else_block$2(ctx) {
    	let button;
    	let t0_value = /*service*/ ctx[11].name + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[10](/*service*/ ctx[11]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(button, "class", "svelte-1241bap");
    			add_location(button, file$b, 54, 20, 1709);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*services*/ 64 && t0_value !== (t0_value = /*service*/ ctx[11].name + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(54:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (50:16) {#if video == service.link}
    function create_if_block_1$2(ctx) {
    	let button;
    	let t0_value = /*service*/ ctx[11].name + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[9](/*service*/ ctx[11]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(button, "id", "bluebutton");
    			attr_dev(button, "class", "svelte-1241bap");
    			add_location(button, file$b, 50, 20, 1514);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*services*/ 64 && t0_value !== (t0_value = /*service*/ ctx[11].name + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(50:16) {#if video == service.link}",
    		ctx
    	});

    	return block;
    }

    // (49:12) {#each services as service}
    function create_each_block$1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*video*/ ctx[7] == /*service*/ ctx[11].link) return create_if_block_1$2;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(49:12) {#each services as service}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div2;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div0;
    	let h10;
    	let t1;
    	let t2;
    	let p0;
    	let span0;
    	let t4;
    	let t5;
    	let t6;
    	let img1;
    	let img1_src_value;
    	let t7;
    	let p1;
    	let span1;
    	let t9;
    	let t10;
    	let t11;
    	let img2;
    	let img2_src_value;
    	let t12;
    	let p2;
    	let span2;
    	let t14;
    	let t15;
    	let p3;
    	let t17;
    	let p4;
    	let t18;
    	let t19;
    	let div4;
    	let iframe;
    	let iframe_src_value;
    	let t20;
    	let div3;
    	let h11;
    	let img3;
    	let img3_src_value;
    	let t21;
    	let t22;
    	let current;
    	let if_block0 = /*genre*/ ctx[4] != undefined && create_if_block_2(ctx);
    	let if_block1 = /*video*/ ctx[7] != "" && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div0 = element("div");
    			h10 = element("h1");
    			t1 = text(/*name*/ ctx[0]);
    			t2 = space();
    			p0 = element("p");
    			span0 = element("span");
    			span0.textContent = "Relese:";
    			t4 = space();
    			t5 = text(/*relese*/ ctx[2]);
    			t6 = space();
    			img1 = element("img");
    			t7 = space();
    			p1 = element("p");
    			span1 = element("span");
    			span1.textContent = "Duration:";
    			t9 = space();
    			t10 = text(/*duration*/ ctx[3]);
    			t11 = space();
    			img2 = element("img");
    			t12 = space();
    			p2 = element("p");
    			span2 = element("span");
    			span2.textContent = "Genre:";
    			t14 = space();
    			if (if_block0) if_block0.c();
    			t15 = space();
    			p3 = element("p");
    			p3.textContent = "Description:";
    			t17 = space();
    			p4 = element("p");
    			t18 = text(/*description*/ ctx[5]);
    			t19 = space();
    			div4 = element("div");
    			iframe = element("iframe");
    			t20 = space();
    			div3 = element("div");
    			h11 = element("h1");
    			img3 = element("img");
    			t21 = text(" Servers:");
    			t22 = space();
    			if (if_block1) if_block1.c();
    			if (img0.src !== (img0_src_value = /*poster*/ ctx[1])) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "#");
    			attr_dev(img0, "class", "poster0 svelte-1241bap");
    			add_location(img0, file$b, 18, 8, 408);
    			attr_dev(h10, "class", "svelte-1241bap");
    			add_location(h10, file$b, 20, 12, 477);
    			attr_dev(span0, "class", "description svelte-1241bap");
    			add_location(span0, file$b, 21, 16, 509);
    			if (img1.src !== (img1_src_value = "/images/cal.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "#");
    			attr_dev(img1, "class", "svelte-1241bap");
    			add_location(img1, file$b, 21, 66, 559);
    			attr_dev(p0, "class", "svelte-1241bap");
    			add_location(p0, file$b, 21, 12, 505);
    			attr_dev(span1, "class", "description svelte-1241bap");
    			add_location(span1, file$b, 22, 16, 616);
    			if (img2.src !== (img2_src_value = "/images/playtime.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "#");
    			attr_dev(img2, "class", "svelte-1241bap");
    			add_location(img2, file$b, 22, 70, 670);
    			attr_dev(p1, "class", "svelte-1241bap");
    			add_location(p1, file$b, 22, 12, 612);
    			attr_dev(span2, "class", "description svelte-1241bap");
    			add_location(span2, file$b, 23, 16, 732);
    			attr_dev(p2, "class", "svelte-1241bap");
    			add_location(p2, file$b, 23, 12, 728);
    			attr_dev(p3, "class", "description svelte-1241bap");
    			add_location(p3, file$b, 30, 12, 987);
    			attr_dev(p4, "class", "svelte-1241bap");
    			add_location(p4, file$b, 31, 12, 1041);
    			attr_dev(div0, "class", "svelte-1241bap");
    			add_location(div0, file$b, 19, 8, 459);
    			attr_dev(div1, "class", "ii svelte-1241bap");
    			add_location(div1, file$b, 17, 4, 383);
    			attr_dev(div2, "class", "heading svelte-1241bap");
    			add_location(div2, file$b, 16, 0, 356);
    			if (iframe.src !== (iframe_src_value = /*video*/ ctx[7])) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "frameborder", "0");
    			attr_dev(iframe, "marginwidth", "0");
    			attr_dev(iframe, "marginheight", "0");
    			attr_dev(iframe, "scrolling", "no");
    			iframe.allowFullscreen = true;
    			attr_dev(iframe, "class", "svelte-1241bap");
    			add_location(iframe, file$b, 36, 4, 1119);
    			if (img3.src !== (img3_src_value = "/images/server.svg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "#");
    			attr_dev(img3, "class", "svelte-1241bap");
    			add_location(img3, file$b, 46, 13, 1330);
    			attr_dev(h11, "class", "svelte-1241bap");
    			add_location(h11, file$b, 46, 8, 1325);
    			attr_dev(div3, "class", "links svelte-1241bap");
    			add_location(div3, file$b, 45, 4, 1297);
    			attr_dev(div4, "class", "video svelte-1241bap");
    			add_location(div4, file$b, 35, 0, 1095);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, img0);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, h10);
    			append_dev(h10, t1);
    			append_dev(div0, t2);
    			append_dev(div0, p0);
    			append_dev(p0, span0);
    			append_dev(p0, t4);
    			append_dev(p0, t5);
    			append_dev(p0, t6);
    			append_dev(p0, img1);
    			append_dev(div0, t7);
    			append_dev(div0, p1);
    			append_dev(p1, span1);
    			append_dev(p1, t9);
    			append_dev(p1, t10);
    			append_dev(p1, t11);
    			append_dev(p1, img2);
    			append_dev(div0, t12);
    			append_dev(div0, p2);
    			append_dev(p2, span2);
    			append_dev(p2, t14);
    			if (if_block0) if_block0.m(p2, null);
    			append_dev(div0, t15);
    			append_dev(div0, p3);
    			append_dev(div0, t17);
    			append_dev(div0, p4);
    			append_dev(p4, t18);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, iframe);
    			append_dev(div4, t20);
    			append_dev(div4, div3);
    			append_dev(div3, h11);
    			append_dev(h11, img3);
    			append_dev(h11, t21);
    			append_dev(div3, t22);
    			if (if_block1) if_block1.m(div3, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*poster*/ 2 && img0.src !== (img0_src_value = /*poster*/ ctx[1])) {
    				attr_dev(img0, "src", img0_src_value);
    			}

    			if (!current || dirty & /*name*/ 1) set_data_dev(t1, /*name*/ ctx[0]);
    			if (!current || dirty & /*relese*/ 4) set_data_dev(t5, /*relese*/ ctx[2]);
    			if (!current || dirty & /*duration*/ 8) set_data_dev(t10, /*duration*/ ctx[3]);

    			if (/*genre*/ ctx[4] != undefined) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*genre*/ 16) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(p2, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*description*/ 32) set_data_dev(t18, /*description*/ ctx[5]);

    			if (!current || dirty & /*video*/ 128 && iframe.src !== (iframe_src_value = /*video*/ ctx[7])) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}

    			if (/*video*/ ctx[7] != "") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$7(ctx);
    					if_block1.c();
    					if_block1.m(div3, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(div4);
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Watch", slots, []);
    	let video = "";
    	let { name } = $$props;
    	let { poster } = $$props;
    	let { relese } = $$props;
    	let { duration } = $$props;
    	let { genre } = $$props;
    	let { description } = $$props;
    	let { services } = $$props;

    	function setService(index) {
    		$$invalidate(7, video = services[index].link);
    	}

    	const writable_props = ["name", "poster", "relese", "duration", "genre", "description", "services"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Watch> was created with unknown prop '${key}'`);
    	});

    	const click_handler = service => {
    		setService(services.indexOf(service));
    	};

    	const click_handler_1 = service => {
    		setService(services.indexOf(service));
    	};

    	$$self.$$set = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("poster" in $$props) $$invalidate(1, poster = $$props.poster);
    		if ("relese" in $$props) $$invalidate(2, relese = $$props.relese);
    		if ("duration" in $$props) $$invalidate(3, duration = $$props.duration);
    		if ("genre" in $$props) $$invalidate(4, genre = $$props.genre);
    		if ("description" in $$props) $$invalidate(5, description = $$props.description);
    		if ("services" in $$props) $$invalidate(6, services = $$props.services);
    	};

    	$$self.$capture_state = () => ({
    		Link,
    		video,
    		name,
    		poster,
    		relese,
    		duration,
    		genre,
    		description,
    		services,
    		setService
    	});

    	$$self.$inject_state = $$props => {
    		if ("video" in $$props) $$invalidate(7, video = $$props.video);
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("poster" in $$props) $$invalidate(1, poster = $$props.poster);
    		if ("relese" in $$props) $$invalidate(2, relese = $$props.relese);
    		if ("duration" in $$props) $$invalidate(3, duration = $$props.duration);
    		if ("genre" in $$props) $$invalidate(4, genre = $$props.genre);
    		if ("description" in $$props) $$invalidate(5, description = $$props.description);
    		if ("services" in $$props) $$invalidate(6, services = $$props.services);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*services*/ 64) {
    			services && setService(0);
    		}
    	};

    	return [
    		name,
    		poster,
    		relese,
    		duration,
    		genre,
    		description,
    		services,
    		video,
    		setService,
    		click_handler,
    		click_handler_1
    	];
    }

    class Watch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			name: 0,
    			poster: 1,
    			relese: 2,
    			duration: 3,
    			genre: 4,
    			description: 5,
    			services: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Watch",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !("name" in props)) {
    			console.warn("<Watch> was created without expected prop 'name'");
    		}

    		if (/*poster*/ ctx[1] === undefined && !("poster" in props)) {
    			console.warn("<Watch> was created without expected prop 'poster'");
    		}

    		if (/*relese*/ ctx[2] === undefined && !("relese" in props)) {
    			console.warn("<Watch> was created without expected prop 'relese'");
    		}

    		if (/*duration*/ ctx[3] === undefined && !("duration" in props)) {
    			console.warn("<Watch> was created without expected prop 'duration'");
    		}

    		if (/*genre*/ ctx[4] === undefined && !("genre" in props)) {
    			console.warn("<Watch> was created without expected prop 'genre'");
    		}

    		if (/*description*/ ctx[5] === undefined && !("description" in props)) {
    			console.warn("<Watch> was created without expected prop 'description'");
    		}

    		if (/*services*/ ctx[6] === undefined && !("services" in props)) {
    			console.warn("<Watch> was created without expected prop 'services'");
    		}
    	}

    	get name() {
    		throw new Error("<Watch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Watch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get poster() {
    		throw new Error("<Watch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set poster(value) {
    		throw new Error("<Watch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get relese() {
    		throw new Error("<Watch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set relese(value) {
    		throw new Error("<Watch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Watch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Watch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get genre() {
    		throw new Error("<Watch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set genre(value) {
    		throw new Error("<Watch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<Watch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<Watch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get services() {
    		throw new Error("<Watch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set services(value) {
    		throw new Error("<Watch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/WatchM.svelte generated by Svelte v3.38.2 */
    const file$a = "src/pages/WatchM.svelte";

    // (12:4) {#if show.length != 0}
    function create_if_block$6(ctx) {
    	let watch;
    	let current;

    	watch = new Watch({
    			props: {
    				name: /*show*/ ctx[0].name,
    				relese: /*show*/ ctx[0].relese,
    				duration: /*show*/ ctx[0].duration,
    				genre: /*show*/ ctx[0].genres,
    				poster: /*show*/ ctx[0].poster,
    				description: /*show*/ ctx[0].description,
    				services: /*show*/ ctx[0].links
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(watch.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(watch, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const watch_changes = {};
    			if (dirty & /*show*/ 1) watch_changes.name = /*show*/ ctx[0].name;
    			if (dirty & /*show*/ 1) watch_changes.relese = /*show*/ ctx[0].relese;
    			if (dirty & /*show*/ 1) watch_changes.duration = /*show*/ ctx[0].duration;
    			if (dirty & /*show*/ 1) watch_changes.genre = /*show*/ ctx[0].genres;
    			if (dirty & /*show*/ 1) watch_changes.poster = /*show*/ ctx[0].poster;
    			if (dirty & /*show*/ 1) watch_changes.description = /*show*/ ctx[0].description;
    			if (dirty & /*show*/ 1) watch_changes.services = /*show*/ ctx[0].links;
    			watch.$set(watch_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(watch.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(watch.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(watch, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(12:4) {#if show.length != 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let main;
    	let current;
    	let if_block = /*show*/ ctx[0].length != 0 && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (if_block) if_block.c();
    			attr_dev(main, "class", "svelte-ffww8b");
    			add_location(main, file$a, 10, 0, 241);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if (if_block) if_block.m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*show*/ ctx[0].length != 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*show*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(main, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("WatchM", slots, []);
    	let { name } = $$props;
    	let show = {};

    	axios.get("http://localhost:3000/api/watch/" + name).then(res => {
    		$$invalidate(0, show = res.data);
    	});

    	const writable_props = ["name"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<WatchM> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({ axios, Watch, name, show });

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("show" in $$props) $$invalidate(0, show = $$props.show);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [show, name];
    }

    class WatchM extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { name: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WatchM",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[1] === undefined && !("name" in props)) {
    			console.warn("<WatchM> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<WatchM>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<WatchM>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/WatchS.svelte generated by Svelte v3.38.2 */
    const file$9 = "src/pages/WatchS.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (22:4) {#if show !== undefined}
    function create_if_block$5(ctx) {
    	let watch;
    	let t;
    	let div1;
    	let div0;
    	let current;

    	watch = new Watch({
    			props: {
    				name: /*show*/ ctx[0].name,
    				duration: /*show*/ ctx[0].duration,
    				relese: /*show*/ ctx[0].relese,
    				genre: /*show*/ ctx[0].genres,
    				poster: /*show*/ ctx[0].poster,
    				description: /*show*/ ctx[0].description,
    				services: /*eps*/ ctx[2]
    			},
    			$$inline: true
    		});

    	let each_value = /*show*/ ctx[0].seasons[/*curentSeason*/ ctx[1]].eps;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			create_component(watch.$$.fragment);
    			t = space();
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "ep svelte-byl7vu");
    			add_location(div0, file$9, 32, 12, 780);
    			attr_dev(div1, "class", "eps svelte-byl7vu");
    			add_location(div1, file$9, 31, 4, 750);
    		},
    		m: function mount(target, anchor) {
    			mount_component(watch, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const watch_changes = {};
    			if (dirty & /*show*/ 1) watch_changes.name = /*show*/ ctx[0].name;
    			if (dirty & /*show*/ 1) watch_changes.duration = /*show*/ ctx[0].duration;
    			if (dirty & /*show*/ 1) watch_changes.relese = /*show*/ ctx[0].relese;
    			if (dirty & /*show*/ 1) watch_changes.genre = /*show*/ ctx[0].genres;
    			if (dirty & /*show*/ 1) watch_changes.poster = /*show*/ ctx[0].poster;
    			if (dirty & /*show*/ 1) watch_changes.description = /*show*/ ctx[0].description;
    			if (dirty & /*eps*/ 4) watch_changes.services = /*eps*/ ctx[2];
    			watch.$set(watch_changes);

    			if (dirty & /*selectEp, show, curentSeason*/ 11) {
    				each_value = /*show*/ ctx[0].seasons[/*curentSeason*/ ctx[1]].eps;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(watch.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(watch.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(watch, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(22:4) {#if show !== undefined}",
    		ctx
    	});

    	return block;
    }

    // (34:16) {#each show.seasons[curentSeason].eps as episode}
    function create_each_block(ctx) {
    	let button;
    	let t0_value = /*show*/ ctx[0].seasons[/*curentSeason*/ ctx[1]].eps.indexOf(/*episode*/ ctx[7]) + 1 + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[5](/*episode*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(button, "class", "svelte-byl7vu");
    			add_location(button, file$9, 34, 20, 883);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*show, curentSeason*/ 3 && t0_value !== (t0_value = /*show*/ ctx[0].seasons[/*curentSeason*/ ctx[1]].eps.indexOf(/*episode*/ ctx[7]) + 1 + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(34:16) {#each show.seasons[curentSeason].eps as episode}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let main;
    	let current;
    	let if_block = /*show*/ ctx[0] !== undefined && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (if_block) if_block.c();
    			attr_dev(main, "class", "svelte-byl7vu");
    			add_location(main, file$9, 20, 0, 485);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if (if_block) if_block.m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*show*/ ctx[0] !== undefined) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*show*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(main, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("WatchS", slots, []);
    	let { name } = $$props;
    	let show;
    	let curentSeason = 0;
    	let eps = {};

    	function selectEp(index) {
    		$$invalidate(2, eps = show.seasons[curentSeason].eps[index].links);
    	}

    	function selectSeason(index) {
    		$$invalidate(1, curentSeason = index);
    		selectEp(0);
    	}

    	axios.get("http://localhost:3000/api/watch/" + name).then(res => {
    		$$invalidate(0, show = res.data);
    		selectEp(0);
    	});

    	const writable_props = ["name"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<WatchS> was created with unknown prop '${key}'`);
    	});

    	const click_handler = episode => {
    		selectEp(show.seasons[curentSeason].eps.indexOf(episode));
    	};

    	$$self.$$set = $$props => {
    		if ("name" in $$props) $$invalidate(4, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({
    		axios,
    		Watch,
    		name,
    		show,
    		curentSeason,
    		eps,
    		selectEp,
    		selectSeason
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(4, name = $$props.name);
    		if ("show" in $$props) $$invalidate(0, show = $$props.show);
    		if ("curentSeason" in $$props) $$invalidate(1, curentSeason = $$props.curentSeason);
    		if ("eps" in $$props) $$invalidate(2, eps = $$props.eps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [show, curentSeason, eps, selectEp, name, click_handler];
    }

    class WatchS extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { name: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WatchS",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[4] === undefined && !("name" in props)) {
    			console.warn("<WatchS> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<WatchS>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<WatchS>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/login.svelte generated by Svelte v3.38.2 */
    const file$8 = "src/components/login.svelte";

    // (23:1) {:else}
    function create_else_block$1(ctx) {
    	let h1;
    	let t1;
    	let form;
    	let label0;
    	let t3;
    	let input0;
    	let t4;
    	let br0;
    	let br1;
    	let t5;
    	let label1;
    	let t7;
    	let input1;
    	let t8;
    	let br2;
    	let br3;
    	let t9;
    	let label2;
    	let t11;
    	let input2;
    	let t12;
    	let br4;
    	let br5;
    	let t13;
    	let label3;
    	let t15;
    	let input3;
    	let t16;
    	let br6;
    	let br7;
    	let t17;
    	let button;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Register";
    			t1 = space();
    			form = element("form");
    			label0 = element("label");
    			label0.textContent = "Email:";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t5 = space();
    			label1 = element("label");
    			label1.textContent = "User Name:";
    			t7 = space();
    			input1 = element("input");
    			t8 = space();
    			br2 = element("br");
    			br3 = element("br");
    			t9 = space();
    			label2 = element("label");
    			label2.textContent = "Password:";
    			t11 = space();
    			input2 = element("input");
    			t12 = space();
    			br4 = element("br");
    			br5 = element("br");
    			t13 = space();
    			label3 = element("label");
    			label3.textContent = "Confirm password:";
    			t15 = space();
    			input3 = element("input");
    			t16 = space();
    			br6 = element("br");
    			br7 = element("br");
    			t17 = space();
    			button = element("button");
    			button.textContent = "Register";
    			attr_dev(h1, "class", "svelte-turdo4");
    			add_location(h1, file$8, 23, 2, 482);
    			attr_dev(label0, "class", "svelte-turdo4");
    			add_location(label0, file$8, 25, 3, 514);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "svelte-turdo4");
    			add_location(input0, file$8, 26, 3, 540);
    			add_location(br0, file$8, 27, 3, 564);
    			add_location(br1, file$8, 27, 7, 568);
    			attr_dev(label1, "class", "svelte-turdo4");
    			add_location(label1, file$8, 28, 3, 577);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "svelte-turdo4");
    			add_location(input1, file$8, 29, 3, 607);
    			add_location(br2, file$8, 30, 3, 631);
    			add_location(br3, file$8, 30, 7, 635);
    			attr_dev(label2, "class", "svelte-turdo4");
    			add_location(label2, file$8, 31, 3, 644);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "class", "svelte-turdo4");
    			add_location(input2, file$8, 32, 3, 673);
    			add_location(br4, file$8, 33, 3, 697);
    			add_location(br5, file$8, 33, 7, 701);
    			attr_dev(label3, "class", "svelte-turdo4");
    			add_location(label3, file$8, 34, 3, 710);
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "class", "svelte-turdo4");
    			add_location(input3, file$8, 35, 3, 747);
    			add_location(br6, file$8, 36, 3, 771);
    			add_location(br7, file$8, 36, 7, 775);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "svelte-turdo4");
    			add_location(button, file$8, 37, 3, 784);
    			add_location(form, file$8, 24, 2, 503);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, form, anchor);
    			append_dev(form, label0);
    			append_dev(form, t3);
    			append_dev(form, input0);
    			append_dev(form, t4);
    			append_dev(form, br0);
    			append_dev(form, br1);
    			append_dev(form, t5);
    			append_dev(form, label1);
    			append_dev(form, t7);
    			append_dev(form, input1);
    			append_dev(form, t8);
    			append_dev(form, br2);
    			append_dev(form, br3);
    			append_dev(form, t9);
    			append_dev(form, label2);
    			append_dev(form, t11);
    			append_dev(form, input2);
    			append_dev(form, t12);
    			append_dev(form, br4);
    			append_dev(form, br5);
    			append_dev(form, t13);
    			append_dev(form, label3);
    			append_dev(form, t15);
    			append_dev(form, input3);
    			append_dev(form, t16);
    			append_dev(form, br6);
    			append_dev(form, br7);
    			append_dev(form, t17);
    			append_dev(form, button);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(form);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(23:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (12:1) {#if lr}
    function create_if_block$4(ctx) {
    	let h1;
    	let t1;
    	let form;
    	let label0;
    	let t3;
    	let input0;
    	let t4;
    	let br0;
    	let br1;
    	let t5;
    	let label1;
    	let t7;
    	let input1;
    	let t8;
    	let br2;
    	let br3;
    	let t9;
    	let button;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Login";
    			t1 = space();
    			form = element("form");
    			label0 = element("label");
    			label0.textContent = "Email:";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t5 = space();
    			label1 = element("label");
    			label1.textContent = "Password:";
    			t7 = space();
    			input1 = element("input");
    			t8 = space();
    			br2 = element("br");
    			br3 = element("br");
    			t9 = space();
    			button = element("button");
    			button.textContent = "Login";
    			attr_dev(h1, "class", "svelte-turdo4");
    			add_location(h1, file$8, 12, 2, 263);
    			attr_dev(label0, "class", "svelte-turdo4");
    			add_location(label0, file$8, 14, 3, 292);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "svelte-turdo4");
    			add_location(input0, file$8, 15, 3, 318);
    			add_location(br0, file$8, 16, 3, 342);
    			add_location(br1, file$8, 16, 7, 346);
    			attr_dev(label1, "class", "svelte-turdo4");
    			add_location(label1, file$8, 17, 3, 355);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "svelte-turdo4");
    			add_location(input1, file$8, 18, 3, 384);
    			add_location(br2, file$8, 19, 3, 408);
    			add_location(br3, file$8, 19, 7, 412);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "svelte-turdo4");
    			add_location(button, file$8, 20, 3, 421);
    			add_location(form, file$8, 13, 2, 281);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, form, anchor);
    			append_dev(form, label0);
    			append_dev(form, t3);
    			append_dev(form, input0);
    			append_dev(form, t4);
    			append_dev(form, br0);
    			append_dev(form, br1);
    			append_dev(form, t5);
    			append_dev(form, label1);
    			append_dev(form, t7);
    			append_dev(form, input1);
    			append_dev(form, t8);
    			append_dev(form, br2);
    			append_dev(form, br3);
    			append_dev(form, t9);
    			append_dev(form, button);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(form);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(12:1) {#if lr}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div0;
    	let t;
    	let div1;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*lr*/ ctx[0]) return create_if_block$4;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			if_block.c();
    			attr_dev(div0, "class", "ovrl svelte-turdo4");
    			add_location(div0, file$8, 9, 0, 181);
    			attr_dev(div1, "class", "lr svelte-turdo4");
    			add_location(div1, file$8, 10, 0, 232);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);
    			if_block.m(div1, null);

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Login", slots, []);
    	let { lr = false } = $$props;
    	let dispach = createEventDispatcher();

    	function dis() {
    		dispach("show", 0);
    	}

    	const writable_props = ["lr"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		dis();
    	};

    	$$self.$$set = $$props => {
    		if ("lr" in $$props) $$invalidate(0, lr = $$props.lr);
    	};

    	$$self.$capture_state = () => ({ createEventDispatcher, lr, dispach, dis });

    	$$self.$inject_state = $$props => {
    		if ("lr" in $$props) $$invalidate(0, lr = $$props.lr);
    		if ("dispach" in $$props) dispach = $$props.dispach;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [lr, dis, click_handler];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { lr: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get lr() {
    		throw new Error("<Login>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lr(value) {
    		throw new Error("<Login>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/search.svelte generated by Svelte v3.38.2 */
    const file$7 = "src/components/search.svelte";

    function create_fragment$7(ctx) {
    	let div;
    	let form;
    	let input;
    	let t;
    	let button;
    	let img;
    	let img_src_value;
    	let div_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			form = element("form");
    			input = element("input");
    			t = space();
    			button = element("button");
    			img = element("img");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Search for any show or movie");
    			attr_dev(input, "class", "svelte-l3kzen");
    			add_location(input, file$7, 15, 8, 355);
    			if (img.src !== (img_src_value = "/images/gals.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "#");
    			attr_dev(img, "class", "svelte-l3kzen");
    			add_location(img, file$7, 17, 12, 488);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "svelte-l3kzen");
    			add_location(button, file$7, 16, 8, 452);
    			attr_dev(form, "class", "svelte-l3kzen");
    			add_location(form, file$7, 14, 4, 320);
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*clas*/ ctx[0]) + " svelte-l3kzen"));
    			add_location(div, file$7, 13, 0, 296);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, form);
    			append_dev(form, input);
    			set_input_value(input, /*searchQuery*/ ctx[1]);
    			append_dev(form, t);
    			append_dev(form, button);
    			append_dev(button, img);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[3]),
    					listen_dev(form, "submit", /*search*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*searchQuery*/ 2 && input.value !== /*searchQuery*/ ctx[1]) {
    				set_input_value(input, /*searchQuery*/ ctx[1]);
    			}

    			if (dirty & /*clas*/ 1 && div_class_value !== (div_class_value = "" + (null_to_empty(/*clas*/ ctx[0]) + " svelte-l3kzen"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Search", slots, []);
    	let { clas } = $$props;
    	let dispatch = createEventDispatcher();
    	let searchQuery;

    	const search = e => {
    		e.preventDefault();
    		dispatch("search", { text: searchQuery });
    	};

    	const writable_props = ["clas"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Search> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		searchQuery = this.value;
    		$$invalidate(1, searchQuery);
    	}

    	$$self.$$set = $$props => {
    		if ("clas" in $$props) $$invalidate(0, clas = $$props.clas);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		clas,
    		dispatch,
    		searchQuery,
    		search
    	});

    	$$self.$inject_state = $$props => {
    		if ("clas" in $$props) $$invalidate(0, clas = $$props.clas);
    		if ("dispatch" in $$props) dispatch = $$props.dispatch;
    		if ("searchQuery" in $$props) $$invalidate(1, searchQuery = $$props.searchQuery);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [clas, searchQuery, search, input_input_handler];
    }

    class Search extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { clas: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*clas*/ ctx[0] === undefined && !("clas" in props)) {
    			console.warn("<Search> was created without expected prop 'clas'");
    		}
    	}

    	get clas() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set clas(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/nav.svelte generated by Svelte v3.38.2 */
    const file$6 = "src/components/nav.svelte";

    // (49:2) <Link to="/" class="logo">
    function create_default_slot_9$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "/images/logoTr.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "#");
    			add_location(img, file$6, 48, 28, 950);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$1.name,
    		type: "slot",
    		source: "(49:2) <Link to=\\\"/\\\" class=\\\"logo\\\">",
    		ctx
    	});

    	return block;
    }

    // (52:7) <Link to="/">
    function create_default_slot_8$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Home");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(52:7) <Link to=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (53:7) <Link to="/genre">
    function create_default_slot_7$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Genre");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(53:7) <Link to=\\\"/genre\\\">",
    		ctx
    	});

    	return block;
    }

    // (54:7) <Link to="/movies">
    function create_default_slot_6$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Movies");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(54:7) <Link to=\\\"/movies\\\">",
    		ctx
    	});

    	return block;
    }

    // (55:7) <Link to="/series">
    function create_default_slot_5$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("TV Series");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(55:7) <Link to=\\\"/series\\\">",
    		ctx
    	});

    	return block;
    }

    // (59:12) <Link to="/">
    function create_default_slot_4$2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "/images/house.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "#");
    			add_location(img, file$6, 58, 25, 1293);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(59:12) <Link to=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (60:12) <Link to="/genre">
    function create_default_slot_3$2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "/images/new.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "#");
    			add_location(img, file$6, 59, 30, 1374);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(60:12) <Link to=\\\"/genre\\\">",
    		ctx
    	});

    	return block;
    }

    // (61:12) <Link to="/search/-*hfh*-">
    function create_default_slot_2$2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "/images/gals.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "#");
    			add_location(img, file$6, 60, 39, 1462);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(61:12) <Link to=\\\"/search/-*hfh*-\\\">",
    		ctx
    	});

    	return block;
    }

    // (62:12) <Link to="/library">
    function create_default_slot_1$2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "/images/library.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "#");
    			add_location(img, file$6, 61, 32, 1544);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(62:12) <Link to=\\\"/library\\\">",
    		ctx
    	});

    	return block;
    }

    // (67:1) {:else}
    function create_else_block(ctx) {
    	let div;
    	let button0;
    	let t1;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			button0.textContent = "Sign in";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Sign up";
    			attr_dev(button0, "class", "svelte-10mbnq5");
    			add_location(button0, file$6, 68, 3, 1872);
    			attr_dev(button1, "class", "bluebutton svelte-10mbnq5");
    			add_location(button1, file$6, 69, 3, 1937);
    			attr_dev(div, "class", "buttons svelte-10mbnq5");
    			add_location(div, file$6, 67, 2, 1846);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(div, t1);
    			append_dev(div, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_1*/ ctx[7], false, false, false),
    					listen_dev(button1, "click", /*click_handler_2*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(67:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (65:1) {#if login == true}
    function create_if_block_1$1(ctx) {
    	let link;
    	let current;

    	link = new Link({
    			props: {
    				id: "nobutton",
    				to: "/profile",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(65:1) {#if login == true}",
    		ctx
    	});

    	return block;
    }

    // (66:2) <Link id="nobutton" to="/profile">
    function create_default_slot$2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "/images/prof.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "#");
    			attr_dev(img, "class", "prof svelte-10mbnq5");
    			add_location(img, file$6, 65, 36, 1775);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(66:2) <Link id=\\\"nobutton\\\" to=\\\"/profile\\\">",
    		ctx
    	});

    	return block;
    }

    // (74:0) {#if showLR}
    function create_if_block$3(ctx) {
    	let login_1;
    	let current;

    	login_1 = new Login({
    			props: { lr: /*lr*/ ctx[2] },
    			$$inline: true
    		});

    	login_1.$on("show", /*show_handler*/ ctx[9]);

    	const block = {
    		c: function create() {
    			create_component(login_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(login_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const login_1_changes = {};
    			if (dirty & /*lr*/ 4) login_1_changes.lr = /*lr*/ ctx[2];
    			login_1.$set(login_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(login_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(login_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(login_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(74:0) {#if showLR}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let nav;
    	let div;
    	let link0;
    	let t0;
    	let search;
    	let t1;
    	let ul0;
    	let li0;
    	let link1;
    	let t2;
    	let li1;
    	let link2;
    	let t3;
    	let li2;
    	let link3;
    	let t4;
    	let li3;
    	let link4;
    	let t5;
    	let ul1;
    	let li4;
    	let link5;
    	let t6;
    	let li5;
    	let link6;
    	let t7;
    	let li6;
    	let link7;
    	let t8;
    	let li7;
    	let link8;
    	let t9;
    	let li8;
    	let button;
    	let img;
    	let img_src_value;
    	let t10;
    	let current_block_type_index;
    	let if_block0;
    	let t11;
    	let if_block1_anchor;
    	let current;
    	let mounted;
    	let dispose;

    	link0 = new Link({
    			props: {
    				to: "/",
    				class: "logo",
    				$$slots: { default: [create_default_slot_9$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	search = new Search({ $$inline: true });
    	search.$on("search", /*onSearch*/ ctx[5]);

    	link1 = new Link({
    			props: {
    				to: "/",
    				$$slots: { default: [create_default_slot_8$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link({
    			props: {
    				to: "/genre",
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link3 = new Link({
    			props: {
    				to: "/movies",
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link4 = new Link({
    			props: {
    				to: "/series",
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link5 = new Link({
    			props: {
    				to: "/",
    				$$slots: { default: [create_default_slot_4$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link6 = new Link({
    			props: {
    				to: "/genre",
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link7 = new Link({
    			props: {
    				to: "/search/-*hfh*-",
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link8 = new Link({
    			props: {
    				to: "/library",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block_1$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*login*/ ctx[0] == true) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*showLR*/ ctx[1] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div = element("div");
    			create_component(link0.$$.fragment);
    			t0 = space();
    			create_component(search.$$.fragment);
    			t1 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			create_component(link1.$$.fragment);
    			t2 = space();
    			li1 = element("li");
    			create_component(link2.$$.fragment);
    			t3 = space();
    			li2 = element("li");
    			create_component(link3.$$.fragment);
    			t4 = space();
    			li3 = element("li");
    			create_component(link4.$$.fragment);
    			t5 = space();
    			ul1 = element("ul");
    			li4 = element("li");
    			create_component(link5.$$.fragment);
    			t6 = space();
    			li5 = element("li");
    			create_component(link6.$$.fragment);
    			t7 = space();
    			li6 = element("li");
    			create_component(link7.$$.fragment);
    			t8 = space();
    			li7 = element("li");
    			create_component(link8.$$.fragment);
    			t9 = space();
    			li8 = element("li");
    			button = element("button");
    			img = element("img");
    			t10 = space();
    			if_block0.c();
    			t11 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(li0, "class", "svelte-10mbnq5");
    			add_location(li0, file$6, 51, 3, 1057);
    			attr_dev(li1, "class", "svelte-10mbnq5");
    			add_location(li1, file$6, 52, 3, 1095);
    			attr_dev(li2, "class", "svelte-10mbnq5");
    			add_location(li2, file$6, 53, 3, 1139);
    			attr_dev(li3, "class", "svelte-10mbnq5");
    			add_location(li3, file$6, 54, 3, 1185);
    			attr_dev(ul0, "class", "links svelte-10mbnq5");
    			add_location(ul0, file$6, 50, 2, 1034);
    			attr_dev(div, "class", "flex svelte-10mbnq5");
    			add_location(div, file$6, 47, 1, 902);
    			attr_dev(li4, "class", "svelte-10mbnq5");
    			add_location(li4, file$6, 58, 8, 1276);
    			attr_dev(li5, "class", "svelte-10mbnq5");
    			add_location(li5, file$6, 59, 8, 1352);
    			attr_dev(li6, "class", "svelte-10mbnq5");
    			add_location(li6, file$6, 60, 8, 1431);
    			attr_dev(li7, "class", "svelte-10mbnq5");
    			add_location(li7, file$6, 61, 8, 1520);
    			if (img.src !== (img_src_value = "/images/prof.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "#");
    			add_location(img, file$6, 62, 60, 1657);
    			attr_dev(button, "to", "/prof");
    			attr_dev(button, "class", "svelte-10mbnq5");
    			add_location(button, file$6, 62, 12, 1609);
    			attr_dev(li8, "class", "svelte-10mbnq5");
    			add_location(li8, file$6, 62, 8, 1605);
    			attr_dev(ul1, "class", "nav svelte-10mbnq5");
    			add_location(ul1, file$6, 57, 1, 1250);
    			attr_dev(nav, "class", "svelte-10mbnq5");
    			add_location(nav, file$6, 46, 0, 894);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div);
    			mount_component(link0, div, null);
    			append_dev(div, t0);
    			mount_component(search, div, null);
    			append_dev(div, t1);
    			append_dev(div, ul0);
    			append_dev(ul0, li0);
    			mount_component(link1, li0, null);
    			append_dev(ul0, t2);
    			append_dev(ul0, li1);
    			mount_component(link2, li1, null);
    			append_dev(ul0, t3);
    			append_dev(ul0, li2);
    			mount_component(link3, li2, null);
    			append_dev(ul0, t4);
    			append_dev(ul0, li3);
    			mount_component(link4, li3, null);
    			append_dev(nav, t5);
    			append_dev(nav, ul1);
    			append_dev(ul1, li4);
    			mount_component(link5, li4, null);
    			append_dev(ul1, t6);
    			append_dev(ul1, li5);
    			mount_component(link6, li5, null);
    			append_dev(ul1, t7);
    			append_dev(ul1, li6);
    			mount_component(link7, li6, null);
    			append_dev(ul1, t8);
    			append_dev(ul1, li7);
    			mount_component(link8, li7, null);
    			append_dev(ul1, t9);
    			append_dev(ul1, li8);
    			append_dev(li8, button);
    			append_dev(button, img);
    			append_dev(nav, t10);
    			if_blocks[current_block_type_index].m(nav, null);
    			insert_dev(target, t11, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    			const link3_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				link3_changes.$$scope = { dirty, ctx };
    			}

    			link3.$set(link3_changes);
    			const link4_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				link4_changes.$$scope = { dirty, ctx };
    			}

    			link4.$set(link4_changes);
    			const link5_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				link5_changes.$$scope = { dirty, ctx };
    			}

    			link5.$set(link5_changes);
    			const link6_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				link6_changes.$$scope = { dirty, ctx };
    			}

    			link6.$set(link6_changes);
    			const link7_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				link7_changes.$$scope = { dirty, ctx };
    			}

    			link7.$set(link7_changes);
    			const link8_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				link8_changes.$$scope = { dirty, ctx };
    			}

    			link8.$set(link8_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(nav, null);
    			}

    			if (/*showLR*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*showLR*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(search.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			transition_in(link3.$$.fragment, local);
    			transition_in(link4.$$.fragment, local);
    			transition_in(link5.$$.fragment, local);
    			transition_in(link6.$$.fragment, local);
    			transition_in(link7.$$.fragment, local);
    			transition_in(link8.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(search.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			transition_out(link3.$$.fragment, local);
    			transition_out(link4.$$.fragment, local);
    			transition_out(link5.$$.fragment, local);
    			transition_out(link6.$$.fragment, local);
    			transition_out(link7.$$.fragment, local);
    			transition_out(link8.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(link0);
    			destroy_component(search);
    			destroy_component(link1);
    			destroy_component(link2);
    			destroy_component(link3);
    			destroy_component(link4);
    			destroy_component(link5);
    			destroy_component(link6);
    			destroy_component(link7);
    			destroy_component(link8);
    			if_blocks[current_block_type_index].d();
    			if (detaching) detach_dev(t11);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Nav", slots, []);
    	let login;
    	let showProf = false;
    	let showLR = false;
    	let lr = false;

    	logedin.subscribe(value => {
    		$$invalidate(0, login = value);
    	});

    	globalHistory.listen(() => {
    		profile(false);
    	});

    	function profile(n = "k") {
    		if (n == "k") {
    			showProf = !showProf;
    		} else {
    			showProf = n;
    		}
    	}

    	function LoRe(n = "k", l = false) {
    		if (n == "k") {
    			$$invalidate(1, showLR = !showLR);
    		} else {
    			$$invalidate(1, showLR = n);
    		}

    		$$invalidate(2, lr = l);
    	}

    	let dispach = createEventDispatcher();

    	const onSearch = e => {
    		e.preventDefault();
    		dispach("search", { text: e.detail.text });
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Nav> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		profile();
    	};

    	const click_handler_1 = () => {
    		LoRe(true, true);
    	};

    	const click_handler_2 = () => {
    		LoRe(true, false);
    	};

    	const show_handler = () => {
    		LoRe(false);
    	};

    	$$self.$capture_state = () => ({
    		Link,
    		globalHistory,
    		createEventDispatcher,
    		Login,
    		logedin,
    		Search,
    		login,
    		showProf,
    		showLR,
    		lr,
    		profile,
    		LoRe,
    		dispach,
    		onSearch
    	});

    	$$self.$inject_state = $$props => {
    		if ("login" in $$props) $$invalidate(0, login = $$props.login);
    		if ("showProf" in $$props) showProf = $$props.showProf;
    		if ("showLR" in $$props) $$invalidate(1, showLR = $$props.showLR);
    		if ("lr" in $$props) $$invalidate(2, lr = $$props.lr);
    		if ("dispach" in $$props) dispach = $$props.dispach;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		login,
    		showLR,
    		lr,
    		profile,
    		LoRe,
    		onSearch,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		show_handler
    	];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/pages/Search.svelte generated by Svelte v3.38.2 */

    const { window: window_1 } = globals;
    const file$5 = "src/pages/Search.svelte";

    // (84:1) {#if end == false}
    function create_if_block_1(ctx) {
    	let load_1;
    	let current;
    	load_1 = new Load({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(load_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(load_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(load_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(load_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(load_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(84:1) {#if end == false}",
    		ctx
    	});

    	return block;
    }

    // (87:1) {#if nores}
    function create_if_block$2(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "No results";
    			attr_dev(p, "class", "nr svelte-3sd19i");
    			add_location(p, file$5, 87, 1, 1662);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(87:1) {#if nores}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let scrolling = false;

    	let clear_scrolling = () => {
    		scrolling = false;
    	};

    	let scrolling_timeout;
    	let div;
    	let nav;
    	let t0;
    	let main;
    	let search_1;
    	let t1;
    	let lib;
    	let t2;
    	let t3;
    	let main_resize_listener;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowscroll*/ ctx[7]);
    	nav = new Nav({ $$inline: true });
    	nav.$on("search", /*search*/ ctx[5]);

    	search_1 = new Search({
    			props: { clas: "search" },
    			$$inline: true
    		});

    	search_1.$on("search", /*search*/ ctx[5]);

    	lib = new Lib({
    			props: { shows: /*shows*/ ctx[0] },
    			$$inline: true
    		});

    	let if_block0 = /*end*/ ctx[3] == false && create_if_block_1(ctx);
    	let if_block1 = /*nores*/ ctx[4] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(nav.$$.fragment);
    			t0 = space();
    			main = element("main");
    			create_component(search_1.$$.fragment);
    			t1 = space();
    			create_component(lib.$$.fragment);
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "class", "sticky svelte-3sd19i");
    			add_location(div, file$5, 78, 0, 1445);
    			attr_dev(main, "class", "svelte-3sd19i");
    			add_render_callback(() => /*main_elementresize_handler*/ ctx[8].call(main));
    			add_location(main, file$5, 80, 0, 1501);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(nav, div, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(search_1, main, null);
    			append_dev(main, t1);
    			mount_component(lib, main, null);
    			append_dev(main, t2);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t3);
    			if (if_block1) if_block1.m(main, null);
    			main_resize_listener = add_resize_listener(main, /*main_elementresize_handler*/ ctx[8].bind(main));
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1, "scroll", () => {
    					scrolling = true;
    					clearTimeout(scrolling_timeout);
    					scrolling_timeout = setTimeout(clear_scrolling, 100);
    					/*onwindowscroll*/ ctx[7]();
    				});

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*scroll*/ 2 && !scrolling) {
    				scrolling = true;
    				clearTimeout(scrolling_timeout);
    				scrollTo(window_1.pageXOffset, /*scroll*/ ctx[1]);
    				scrolling_timeout = setTimeout(clear_scrolling, 100);
    			}

    			const lib_changes = {};
    			if (dirty & /*shows*/ 1) lib_changes.shows = /*shows*/ ctx[0];
    			lib.$set(lib_changes);

    			if (/*end*/ ctx[3] == false) {
    				if (if_block0) {
    					if (dirty & /*end*/ 8) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(main, t3);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*nores*/ ctx[4]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					if_block1.m(main, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(search_1.$$.fragment, local);
    			transition_in(lib.$$.fragment, local);
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(search_1.$$.fragment, local);
    			transition_out(lib.$$.fragment, local);
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(nav);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(search_1);
    			destroy_component(lib);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			main_resize_listener();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Search", slots, []);
    	let { param } = $$props;
    	let shows = [];
    	let scroll;
    	let height;
    	let page = 0;
    	let maxpg = 0;
    	let end = false;
    	let load = true;
    	let nores = false;

    	function update() {
    		load = false;

    		if (param == "-*hfh*-") {
    			$$invalidate(3, end = true);
    		} else {
    			axios.get(`http://localhost:3000/api/search/${param}/${page}`).then(res => {
    				maxpg = res.data.maxpage;
    				let news = shows;

    				for (let i = 0; i < res.data.shows.length; i++) {
    					news.push(res.data.shows[i]);
    				}

    				$$invalidate(0, shows = news);
    				page++;
    				load = true;

    				if (res.data.maxpage == 0) {
    					$$invalidate(3, end = true);
    					$$invalidate(4, nores = true);
    				}

    				if (page >= maxpg) {
    					$$invalidate(3, end = true);
    				}
    			});
    		}
    	}

    	if (shows.length == 0) {
    		update();
    	}

    	window.onscroll = () => {
    		if (!end && load) {
    			if (page < maxpg) {
    				if (document.body.offsetHeight - (scroll + height) < 100) {
    					update();
    				}
    			} else {
    				$$invalidate(3, end = true);
    			}
    		}
    	};

    	function search(e) {
    		$$invalidate(6, param = e.detail.text);
    		$$invalidate(0, shows = []);
    		page = 0;
    		maxpg = 0;
    		$$invalidate(3, end = false);
    		$$invalidate(4, nores = false);
    		load = true;
    		update();
    		navigate("/search/" + e.detail.text);
    	}

    	const writable_props = ["param"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Search> was created with unknown prop '${key}'`);
    	});

    	function onwindowscroll() {
    		$$invalidate(1, scroll = window_1.pageYOffset);
    	}

    	function main_elementresize_handler() {
    		height = this.clientHeight;
    		$$invalidate(2, height);
    	}

    	$$self.$$set = $$props => {
    		if ("param" in $$props) $$invalidate(6, param = $$props.param);
    	};

    	$$self.$capture_state = () => ({
    		Lib,
    		Load,
    		axios,
    		Nav,
    		Search,
    		param,
    		shows,
    		scroll,
    		height,
    		page,
    		maxpg,
    		end,
    		load,
    		nores,
    		update,
    		search
    	});

    	$$self.$inject_state = $$props => {
    		if ("param" in $$props) $$invalidate(6, param = $$props.param);
    		if ("shows" in $$props) $$invalidate(0, shows = $$props.shows);
    		if ("scroll" in $$props) $$invalidate(1, scroll = $$props.scroll);
    		if ("height" in $$props) $$invalidate(2, height = $$props.height);
    		if ("page" in $$props) page = $$props.page;
    		if ("maxpg" in $$props) maxpg = $$props.maxpg;
    		if ("end" in $$props) $$invalidate(3, end = $$props.end);
    		if ("load" in $$props) load = $$props.load;
    		if ("nores" in $$props) $$invalidate(4, nores = $$props.nores);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		shows,
    		scroll,
    		height,
    		end,
    		nores,
    		search,
    		param,
    		onwindowscroll,
    		main_elementresize_handler
    	];
    }

    class Search_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { param: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search_1",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*param*/ ctx[6] === undefined && !("param" in props)) {
    			console.warn("<Search> was created without expected prop 'param'");
    		}
    	}

    	get param() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set param(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/Contact.svelte generated by Svelte v3.38.2 */

    const file$4 = "src/pages/Contact.svelte";

    function create_fragment$4(ctx) {
    	let main;
    	let form;
    	let h10;
    	let t1;
    	let input0;
    	let t2;
    	let h11;
    	let t4;
    	let input1;
    	let t5;
    	let h12;
    	let t7;
    	let textarea;
    	let t8;
    	let button;

    	const block = {
    		c: function create() {
    			main = element("main");
    			form = element("form");
    			h10 = element("h1");
    			h10.textContent = "Your email:";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			h11 = element("h1");
    			h11.textContent = "About:";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			h12 = element("h1");
    			h12.textContent = "Details:";
    			t7 = space();
    			textarea = element("textarea");
    			t8 = space();
    			button = element("button");
    			button.textContent = "Submit";
    			attr_dev(h10, "class", "svelte-llcals");
    			add_location(h10, file$4, 6, 2, 66);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "youremail@email.com");
    			attr_dev(input0, "class", "svelte-llcals");
    			add_location(input0, file$4, 7, 2, 90);
    			attr_dev(h11, "class", "svelte-llcals");
    			add_location(h11, file$4, 8, 2, 147);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "svelte-llcals");
    			add_location(input1, file$4, 9, 2, 166);
    			attr_dev(h12, "class", "svelte-llcals");
    			add_location(h12, file$4, 10, 2, 189);
    			attr_dev(textarea, "name", "");
    			attr_dev(textarea, "id", "");
    			attr_dev(textarea, "cols", "30");
    			attr_dev(textarea, "rows", "10");
    			attr_dev(textarea, "class", "svelte-llcals");
    			add_location(textarea, file$4, 11, 2, 210);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "svelte-llcals");
    			add_location(button, file$4, 12, 2, 269);
    			attr_dev(form, "class", "svelte-llcals");
    			add_location(form, file$4, 5, 1, 56);
    			attr_dev(main, "class", "svelte-llcals");
    			add_location(main, file$4, 4, 0, 47);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, form);
    			append_dev(form, h10);
    			append_dev(form, t1);
    			append_dev(form, input0);
    			append_dev(form, t2);
    			append_dev(form, h11);
    			append_dev(form, t4);
    			append_dev(form, input1);
    			append_dev(form, t5);
    			append_dev(form, h12);
    			append_dev(form, t7);
    			append_dev(form, textarea);
    			append_dev(form, t8);
    			append_dev(form, button);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Contact", slots, []);
    	window.scrollTo(0, 0);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/player.svelte generated by Svelte v3.38.2 */
    const file$3 = "src/components/player.svelte";

    // (9:0) {#if sub_value.t == 1}
    function create_if_block$1(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t0;
    	let h1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Fast and Furious 7";
    			if (img.src !== (img_src_value = "/images/FAF7tall.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1awtb24");
    			add_location(img, file$3, 10, 1, 181);
    			attr_dev(h1, "class", "svelte-1awtb24");
    			add_location(h1, file$3, 11, 1, 223);
    			attr_dev(div, "class", "player svelte-1awtb24");
    			add_location(div, file$3, 9, 0, 158);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t0);
    			append_dev(div, h1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(9:0) {#if sub_value.t == 1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let if_block_anchor;
    	let if_block = /*sub_value*/ ctx[0].t == 1 && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*sub_value*/ ctx[0].t == 1) {
    				if (if_block) ; else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Player", slots, []);
    	let sub_value;

    	player.subscribe(value => {
    		$$invalidate(0, sub_value = value);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Player> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ player, sub_value });

    	$$self.$inject_state = $$props => {
    		if ("sub_value" in $$props) $$invalidate(0, sub_value = $$props.sub_value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [sub_value];
    }

    class Player extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Player",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/components/footer.svelte generated by Svelte v3.38.2 */
    const file$2 = "src/components/footer.svelte";

    // (20:4) <Link to="/">
    function create_default_slot_4$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Home");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(20:4) <Link to=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (21:4) <Link to="/movies">
    function create_default_slot_3$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Movies");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(21:4) <Link to=\\\"/movies\\\">",
    		ctx
    	});

    	return block;
    }

    // (22:4) <Link to="/series">
    function create_default_slot_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("TV Shows");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(22:4) <Link to=\\\"/series\\\">",
    		ctx
    	});

    	return block;
    }

    // (25:4) <Link to="/contact">
    function create_default_slot_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Contact");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(25:4) <Link to=\\\"/contact\\\">",
    		ctx
    	});

    	return block;
    }

    // (26:4) <Link to="/tos">
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Terms of Service");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(26:4) <Link to=\\\"/tos\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let footer;
    	let span0;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let h1;
    	let t2;
    	let div1;
    	let p0;
    	let t4;
    	let p1;
    	let t6;
    	let span3;
    	let div2;
    	let t8;
    	let div3;
    	let span1;
    	let link0;
    	let t9;
    	let link1;
    	let t10;
    	let link2;
    	let t11;
    	let span2;
    	let link3;
    	let t12;
    	let link4;
    	let current;

    	link0 = new Link({
    			props: {
    				to: "/",
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				to: "/movies",
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link({
    			props: {
    				to: "/series",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link3 = new Link({
    			props: {
    				to: "/contact",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link4 = new Link({
    			props: {
    				to: "/tos",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			span0 = element("span");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "MovieSea";
    			t2 = space();
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "This site allows you to watch free movies";
    			t4 = space();
    			p1 = element("p");
    			p1.textContent = "We do not host movies on your server!!!!!!";
    			t6 = space();
    			span3 = element("span");
    			div2 = element("div");
    			div2.textContent = "Links";
    			t8 = space();
    			div3 = element("div");
    			span1 = element("span");
    			create_component(link0.$$.fragment);
    			t9 = space();
    			create_component(link1.$$.fragment);
    			t10 = space();
    			create_component(link2.$$.fragment);
    			t11 = space();
    			span2 = element("span");
    			create_component(link3.$$.fragment);
    			t12 = space();
    			create_component(link4.$$.fragment);
    			if (img.src !== (img_src_value = "/images/logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-rqhroa");
    			add_location(img, file$2, 7, 3, 116);
    			attr_dev(h1, "class", "svelte-rqhroa");
    			add_location(h1, file$2, 8, 3, 156);
    			attr_dev(div0, "class", "flex svelte-rqhroa");
    			add_location(div0, file$2, 6, 2, 93);
    			attr_dev(p0, "class", "svelte-rqhroa");
    			add_location(p0, file$2, 11, 3, 197);
    			attr_dev(p1, "class", "svelte-rqhroa");
    			add_location(p1, file$2, 12, 3, 250);
    			attr_dev(div1, "class", "svelte-rqhroa");
    			add_location(div1, file$2, 10, 2, 187);
    			attr_dev(span0, "class", "sp svelte-rqhroa");
    			add_location(span0, file$2, 5, 1, 72);
    			attr_dev(div2, "class", "svelte-rqhroa");
    			add_location(div2, file$2, 16, 2, 343);
    			attr_dev(span1, "class", "fd svelte-rqhroa");
    			add_location(span1, file$2, 18, 3, 390);
    			attr_dev(span2, "class", "fd svelte-rqhroa");
    			add_location(span2, file$2, 23, 3, 532);
    			attr_dev(div3, "class", "flex spc svelte-rqhroa");
    			add_location(div3, file$2, 17, 2, 363);
    			attr_dev(span3, "class", "sp svelte-rqhroa");
    			add_location(span3, file$2, 15, 1, 322);
    			attr_dev(footer, "class", "svelte-rqhroa");
    			add_location(footer, file$2, 4, 0, 61);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, span0);
    			append_dev(span0, div0);
    			append_dev(div0, img);
    			append_dev(div0, t0);
    			append_dev(div0, h1);
    			append_dev(span0, t2);
    			append_dev(span0, div1);
    			append_dev(div1, p0);
    			append_dev(div1, t4);
    			append_dev(div1, p1);
    			append_dev(footer, t6);
    			append_dev(footer, span3);
    			append_dev(span3, div2);
    			append_dev(span3, t8);
    			append_dev(span3, div3);
    			append_dev(div3, span1);
    			mount_component(link0, span1, null);
    			append_dev(span1, t9);
    			mount_component(link1, span1, null);
    			append_dev(span1, t10);
    			mount_component(link2, span1, null);
    			append_dev(div3, t11);
    			append_dev(div3, span2);
    			mount_component(link3, span2, null);
    			append_dev(span2, t12);
    			mount_component(link4, span2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    			const link3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link3_changes.$$scope = { dirty, ctx };
    			}

    			link3.$set(link3_changes);
    			const link4_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link4_changes.$$scope = { dirty, ctx };
    			}

    			link4.$set(link4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			transition_in(link3.$$.fragment, local);
    			transition_in(link4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			transition_out(link3.$$.fragment, local);
    			transition_out(link4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    			destroy_component(link3);
    			destroy_component(link4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Footer", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link });
    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/pages/ToS.svelte generated by Svelte v3.38.2 */

    const file$1 = "src/pages/ToS.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let h10;
    	let t1;
    	let p0;
    	let t3;
    	let h11;
    	let t5;
    	let p1;
    	let t7;
    	let h12;
    	let t9;
    	let p2;

    	const block = {
    		c: function create() {
    			main = element("main");
    			h10 = element("h1");
    			h10.textContent = "Term 1";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Term meaning";
    			t3 = space();
    			h11 = element("h1");
    			h11.textContent = "Term 1";
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "Term meaning";
    			t7 = space();
    			h12 = element("h1");
    			h12.textContent = "Term 1";
    			t9 = space();
    			p2 = element("p");
    			p2.textContent = "Term meaning";
    			attr_dev(h10, "class", "svelte-rpzvha");
    			add_location(h10, file$1, 3, 4, 33);
    			attr_dev(p0, "class", "svelte-rpzvha");
    			add_location(p0, file$1, 4, 4, 54);
    			attr_dev(h11, "class", "svelte-rpzvha");
    			add_location(h11, file$1, 5, 4, 79);
    			attr_dev(p1, "class", "svelte-rpzvha");
    			add_location(p1, file$1, 6, 4, 100);
    			attr_dev(h12, "class", "svelte-rpzvha");
    			add_location(h12, file$1, 7, 4, 125);
    			attr_dev(p2, "class", "svelte-rpzvha");
    			add_location(p2, file$1, 8, 4, 146);
    			attr_dev(main, "class", "svelte-rpzvha");
    			add_location(main, file$1, 2, 0, 21);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h10);
    			append_dev(main, t1);
    			append_dev(main, p0);
    			append_dev(main, t3);
    			append_dev(main, h11);
    			append_dev(main, t5);
    			append_dev(main, p1);
    			append_dev(main, t7);
    			append_dev(main, h12);
    			append_dev(main, t9);
    			append_dev(main, p2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ToS", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ToS> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class ToS extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToS",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.38.2 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    // (44:1) <Route path="/">
    function create_default_slot_11(ctx) {
    	let div;
    	let nav;
    	let t;
    	let home;
    	let current;
    	nav = new Nav({ $$inline: true });
    	nav.$on("search", /*search*/ ctx[2]);
    	home = new Home({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(nav.$$.fragment);
    			t = space();
    			create_component(home.$$.fragment);
    			attr_dev(div, "class", "sticky svelte-1q1805m");
    			add_location(div, file, 44, 2, 1393);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(nav, div, null);
    			insert_dev(target, t, anchor);
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(nav);
    			if (detaching) detach_dev(t);
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(44:1) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (48:1) <Route path="/genre">
    function create_default_slot_10(ctx) {
    	let div;
    	let nav;
    	let t;
    	let genres_1;
    	let current;
    	nav = new Nav({ $$inline: true });
    	nav.$on("search", /*search*/ ctx[2]);
    	genres_1 = new Genres({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(nav.$$.fragment);
    			t = space();
    			create_component(genres_1.$$.fragment);
    			attr_dev(div, "class", "sticky svelte-1q1805m");
    			add_location(div, file, 48, 2, 1491);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(nav, div, null);
    			insert_dev(target, t, anchor);
    			mount_component(genres_1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(genres_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(genres_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(nav);
    			if (detaching) detach_dev(t);
    			destroy_component(genres_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(48:1) <Route path=\\\"/genre\\\">",
    		ctx
    	});

    	return block;
    }

    // (52:1) <Route path="/genre/:genre" let:params >
    function create_default_slot_9(ctx) {
    	let div;
    	let nav;
    	let t;
    	let gen;
    	let current;
    	nav = new Nav({ $$inline: true });
    	nav.$on("search", /*search*/ ctx[2]);

    	gen = new Genre({
    			props: { genre: /*params*/ ctx[3].genre },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(nav.$$.fragment);
    			t = space();
    			create_component(gen.$$.fragment);
    			attr_dev(div, "class", "sticky svelte-1q1805m");
    			add_location(div, file, 52, 2, 1610);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(nav, div, null);
    			insert_dev(target, t, anchor);
    			mount_component(gen, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const gen_changes = {};
    			if (dirty & /*params*/ 8) gen_changes.genre = /*params*/ ctx[3].genre;
    			gen.$set(gen_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(gen.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(gen.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(nav);
    			if (detaching) detach_dev(t);
    			destroy_component(gen, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(52:1) <Route path=\\\"/genre/:genre\\\" let:params >",
    		ctx
    	});

    	return block;
    }

    // (56:1) <Route path="/movies" >
    function create_default_slot_8(ctx) {
    	let div;
    	let nav;
    	let t;
    	let mov;
    	let current;
    	nav = new Nav({ $$inline: true });
    	nav.$on("search", /*search*/ ctx[2]);
    	mov = new Movies({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(nav.$$.fragment);
    			t = space();
    			create_component(mov.$$.fragment);
    			attr_dev(div, "class", "sticky svelte-1q1805m");
    			add_location(div, file, 56, 2, 1731);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(nav, div, null);
    			insert_dev(target, t, anchor);
    			mount_component(mov, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(mov.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(mov.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(nav);
    			if (detaching) detach_dev(t);
    			destroy_component(mov, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(56:1) <Route path=\\\"/movies\\\" >",
    		ctx
    	});

    	return block;
    }

    // (60:1) <Route path="/series" >
    function create_default_slot_7(ctx) {
    	let div;
    	let nav;
    	let t;
    	let ser;
    	let current;
    	nav = new Nav({ $$inline: true });
    	nav.$on("search", /*search*/ ctx[2]);
    	ser = new Series({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(nav.$$.fragment);
    			t = space();
    			create_component(ser.$$.fragment);
    			attr_dev(div, "class", "sticky svelte-1q1805m");
    			add_location(div, file, 60, 2, 1831);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(nav, div, null);
    			insert_dev(target, t, anchor);
    			mount_component(ser, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(ser.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(ser.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(nav);
    			if (detaching) detach_dev(t);
    			destroy_component(ser, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(60:1) <Route path=\\\"/series\\\" >",
    		ctx
    	});

    	return block;
    }

    // (64:1) <Route path="/search/:param" let:params >
    function create_default_slot_6(ctx) {
    	let search_1;
    	let current;

    	search_1 = new Search_1({
    			props: { param: /*params*/ ctx[3].param },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(search_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(search_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const search_1_changes = {};
    			if (dirty & /*params*/ 8) search_1_changes.param = /*params*/ ctx[3].param;
    			search_1.$set(search_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(search_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(search_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(search_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(64:1) <Route path=\\\"/search/:param\\\" let:params >",
    		ctx
    	});

    	return block;
    }

    // (67:1) <Route path="/contact" >
    function create_default_slot_5(ctx) {
    	let contact;
    	let current;
    	contact = new Contact({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(contact.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contact, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contact.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contact.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(contact, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(67:1) <Route path=\\\"/contact\\\" >",
    		ctx
    	});

    	return block;
    }

    // (70:1) <Route path="/tos" >
    function create_default_slot_4(ctx) {
    	let div;
    	let nav;
    	let t;
    	let tos;
    	let current;
    	nav = new Nav({ $$inline: true });
    	nav.$on("search", /*search*/ ctx[2]);
    	tos = new ToS({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(nav.$$.fragment);
    			t = space();
    			create_component(tos.$$.fragment);
    			attr_dev(div, "class", "sticky svelte-1q1805m");
    			add_location(div, file, 70, 2, 2065);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(nav, div, null);
    			insert_dev(target, t, anchor);
    			mount_component(tos, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(tos.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(tos.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(nav);
    			if (detaching) detach_dev(t);
    			destroy_component(tos, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(70:1) <Route path=\\\"/tos\\\" >",
    		ctx
    	});

    	return block;
    }

    // (74:1) <Route path="/movie/:name" let:params>
    function create_default_slot_3(ctx) {
    	let nav;
    	let t;
    	let watchm;
    	let current;
    	nav = new Nav({ $$inline: true });
    	nav.$on("search", /*search*/ ctx[2]);

    	watchm = new WatchM({
    			props: { name: /*params*/ ctx[3].name },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(nav.$$.fragment);
    			t = space();
    			create_component(watchm.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(nav, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(watchm, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const watchm_changes = {};
    			if (dirty & /*params*/ 8) watchm_changes.name = /*params*/ ctx[3].name;
    			watchm.$set(watchm_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(watchm.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(watchm.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(nav, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(watchm, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(74:1) <Route path=\\\"/movie/:name\\\" let:params>",
    		ctx
    	});

    	return block;
    }

    // (78:1) <Route path="/series/:name" let:params>
    function create_default_slot_2(ctx) {
    	let nav;
    	let t;
    	let watchs;
    	let current;
    	nav = new Nav({ $$inline: true });
    	nav.$on("search", /*search*/ ctx[2]);

    	watchs = new WatchS({
    			props: { name: /*params*/ ctx[3].name },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(nav.$$.fragment);
    			t = space();
    			create_component(watchs.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(nav, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(watchs, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const watchs_changes = {};
    			if (dirty & /*params*/ 8) watchs_changes.name = /*params*/ ctx[3].name;
    			watchs.$set(watchs_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(watchs.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(watchs.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(nav, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(watchs, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(78:1) <Route path=\\\"/series/:name\\\" let:params>",
    		ctx
    	});

    	return block;
    }

    // (82:1) <Route>
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Page not fount");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(82:1) <Route>",
    		ctx
    	});

    	return block;
    }

    // (83:1) {#if paths.includes(path)}
    function create_if_block(ctx) {
    	let player;
    	let current;
    	player = new Player({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(player.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(player, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(player.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(player.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(player, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(83:1) {#if paths.includes(path)}",
    		ctx
    	});

    	return block;
    }

    // (43:0) <Router>
    function create_default_slot(ctx) {
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let t2;
    	let route3;
    	let t3;
    	let route4;
    	let t4;
    	let route5;
    	let t5;
    	let route6;
    	let t6;
    	let route7;
    	let t7;
    	let route8;
    	let t8;
    	let route9;
    	let t9;
    	let route10;
    	let t10;
    	let show_if = /*paths*/ ctx[1].includes(/*path*/ ctx[0]);
    	let t11;
    	let foot;
    	let current;

    	route0 = new Route({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "/genre",
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route({
    			props: {
    				path: "/genre/:genre",
    				$$slots: {
    					default: [
    						create_default_slot_9,
    						({ params }) => ({ 3: params }),
    						({ params }) => params ? 8 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route3 = new Route({
    			props: {
    				path: "/movies",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route4 = new Route({
    			props: {
    				path: "/series",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route5 = new Route({
    			props: {
    				path: "/search/:param",
    				$$slots: {
    					default: [
    						create_default_slot_6,
    						({ params }) => ({ 3: params }),
    						({ params }) => params ? 8 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route6 = new Route({
    			props: {
    				path: "/contact",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route7 = new Route({
    			props: {
    				path: "/tos",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route8 = new Route({
    			props: {
    				path: "/movie/:name",
    				$$slots: {
    					default: [
    						create_default_slot_3,
    						({ params }) => ({ 3: params }),
    						({ params }) => params ? 8 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route9 = new Route({
    			props: {
    				path: "/series/:name",
    				$$slots: {
    					default: [
    						create_default_slot_2,
    						({ params }) => ({ 3: params }),
    						({ params }) => params ? 8 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route10 = new Route({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = show_if && create_if_block(ctx);
    	foot = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    			t2 = space();
    			create_component(route3.$$.fragment);
    			t3 = space();
    			create_component(route4.$$.fragment);
    			t4 = space();
    			create_component(route5.$$.fragment);
    			t5 = space();
    			create_component(route6.$$.fragment);
    			t6 = space();
    			create_component(route7.$$.fragment);
    			t7 = space();
    			create_component(route8.$$.fragment);
    			t8 = space();
    			create_component(route9.$$.fragment);
    			t9 = space();
    			create_component(route10.$$.fragment);
    			t10 = space();
    			if (if_block) if_block.c();
    			t11 = space();
    			create_component(foot.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(route1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(route2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(route3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(route4, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(route5, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(route6, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(route7, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(route8, target, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(route9, target, anchor);
    			insert_dev(target, t9, anchor);
    			mount_component(route10, target, anchor);
    			insert_dev(target, t10, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t11, anchor);
    			mount_component(foot, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope, params*/ 24) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    			const route4_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				route4_changes.$$scope = { dirty, ctx };
    			}

    			route4.$set(route4_changes);
    			const route5_changes = {};

    			if (dirty & /*$$scope, params*/ 24) {
    				route5_changes.$$scope = { dirty, ctx };
    			}

    			route5.$set(route5_changes);
    			const route6_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				route6_changes.$$scope = { dirty, ctx };
    			}

    			route6.$set(route6_changes);
    			const route7_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				route7_changes.$$scope = { dirty, ctx };
    			}

    			route7.$set(route7_changes);
    			const route8_changes = {};

    			if (dirty & /*$$scope, params*/ 24) {
    				route8_changes.$$scope = { dirty, ctx };
    			}

    			route8.$set(route8_changes);
    			const route9_changes = {};

    			if (dirty & /*$$scope, params*/ 24) {
    				route9_changes.$$scope = { dirty, ctx };
    			}

    			route9.$set(route9_changes);
    			const route10_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				route10_changes.$$scope = { dirty, ctx };
    			}

    			route10.$set(route10_changes);
    			if (dirty & /*path*/ 1) show_if = /*paths*/ ctx[1].includes(/*path*/ ctx[0]);

    			if (show_if) {
    				if (if_block) {
    					if (dirty & /*path*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t11.parentNode, t11);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			transition_in(route5.$$.fragment, local);
    			transition_in(route6.$$.fragment, local);
    			transition_in(route7.$$.fragment, local);
    			transition_in(route8.$$.fragment, local);
    			transition_in(route9.$$.fragment, local);
    			transition_in(route10.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(foot.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			transition_out(route5.$$.fragment, local);
    			transition_out(route6.$$.fragment, local);
    			transition_out(route7.$$.fragment, local);
    			transition_out(route8.$$.fragment, local);
    			transition_out(route9.$$.fragment, local);
    			transition_out(route10.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(foot.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(route1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(route2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(route3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(route4, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(route5, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(route6, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(route7, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(route8, detaching);
    			if (detaching) detach_dev(t8);
    			destroy_component(route9, detaching);
    			if (detaching) detach_dev(t9);
    			destroy_component(route10, detaching);
    			if (detaching) detach_dev(t10);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t11);
    			destroy_component(foot, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(43:0) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope, path*/ 17) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let path = window.location.pathname;
    	let paths = ["/", "/new", "/library", "/profile"];

    	globalHistory.listen(({ location, action }) => {
    		$$invalidate(0, path = location.pathname);
    	});

    	axios.get("http://localhost:3000/api/main").then(res => {
    		bilbord.set(res.data.top[0]);
    		popular.set(res.data.pop);
    		latest.set(res.data.latest);
    		genresList.set(res.data.genres);
    		genres.set(res.data.genre);
    		comingsoon.set(res.data.cs);
    		console.log(res.data.cs);
    	});

    	function search(e) {
    		navigate$1("/search/" + e.detail.text);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		globalHistory,
    		Router,
    		Route,
    		bilbord,
    		tags,
    		popular,
    		latest,
    		genres,
    		genresList,
    		comingsoon,
    		navigate: navigate$1,
    		axios,
    		Home,
    		Genres,
    		Mov: Movies,
    		Ser: Series,
    		Gen: Genre,
    		WatchM,
    		WatchS,
    		Search: Search_1,
    		Contact,
    		Player,
    		Nav,
    		Foot: Footer,
    		ToS,
    		path,
    		paths,
    		search
    	});

    	$$self.$inject_state = $$props => {
    		if ("path" in $$props) $$invalidate(0, path = $$props.path);
    		if ("paths" in $$props) $$invalidate(1, paths = $$props.paths);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [path, paths, search];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const admin = new App({
    	target: document.body
    });

    return admin;

}());
//# sourceMappingURL=bundle.js.map
