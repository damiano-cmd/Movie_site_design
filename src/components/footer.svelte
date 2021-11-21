<script>
	import {Link} from 'svelte-routing'
</script>

<footer>
	<span class="sp">
		<div class="flex">
			<img src="/images/logo.png" alt="">
			<h1>MovieSea</h1>
		</div>
		<div>
			<p>This site allows you to watch free movies</p>
			<p>We do not host movies on your server!!!!!!</p>
		</div>
	</span>
	<span class="sp">
		<div>Links</div>
		<div class="flex spc">
			<span class="fd">
				<Link to="/">Home</Link>
				<Link to="/movies">Movies</Link>
				<Link to="/series">TV Shows</Link>
			</span>
			<span class="fd">
				<Link to="/contact">Contact</Link>
				<Link to="/tos">Terms of Service</Link>
			</span>
		</div>
	</span>
</footer>

<style>
	footer {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		width: 100%;
		background-color: rgb(27, 33, 43);
	}
	span :global(a) {
		text-decoration: none;
		margin: 4px 0;
		width: max-content;
	}
	div {
		margin: 22px 0;
	}
	h1 {
		margin: 15px;
	}
	img {
		width: 70px;
	}
	p {
		padding: 10px 0;
	}
	span :global(a), p {
		color: gray;
	}
	.flex {
		display: flex;
		align-items: center;
	}
	.fd {
		display: flex;
		flex-direction: column;
		margin-right: 120px;
		align-self: flex-start;
	}
	.sp {
		padding: 2%;
		width: 100%;
		max-width: 46%;
		min-width: 400px;
	}
	@media only screen and (max-width: 1000px) {
		footer {
			padding-bottom: 50px;
		}
		span {
			text-align: center;
		}
		.flex {
			justify-content: center;
		}
		.fd {
			margin: 0 15px;
			align-items: center;
		}
		.sp {
			padding: 0;
		}
	}
</style>