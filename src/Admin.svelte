<script>
	import {Route, Router} from 'svelte-routing'
	import Index from './admin/Index.svelte'
	import Nav from './admin/components/nav.svelte'
	import Lib from './admin/Library.svelte'
</script>

<Router>
	<Nav/>
	<Route path="/admin" component={Index} />
	<Route path="/admin/library" component={Lib} />
</Router>

<style></style>