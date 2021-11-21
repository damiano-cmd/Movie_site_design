<script>
	import {Link} from 'svelte-routing'
	import Search from '../../components/search.svelte'
</script>

<nav>
	<Search width="500px" base="/library" />
	<br>
	<ul>
		<li> <Link to="/admin" >Upload</Link> </li>
		<li> <Link to="/admin/library" >Library</Link> </li>
	</ul>
</nav>

<style>
	nav {
		position: static;
		width: 100%;
		height: 64px;
		background-color: rgb(37, 43, 54);

		display: flex;
		align-items: center;
		justify-content: center;

		z-index: 9;
	}
	nav br {
		width: 80px;
	}
	nav ul {
		display: flex;
		list-style: none;
	}
	nav ul li :global(a) {
		text-decoration: none;
		font-size: 18px;
		padding: 18px;
		border-bottom: 3px solid transparent;
	}
	nav ul li > :global(a:hover) {
		border-bottom-color: white;
	}
</style>