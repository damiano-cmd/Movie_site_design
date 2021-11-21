<script>
    import {Link} from "svelte-routing"
    import Poster from '../components/poster.svelte'
    import Bilbord from '../components/bilbord2.svelte'
    import {tags, popular, latest, comingsoon} from '../stores.js'

    let genres;
    let pop;
    let lat;
    let cs;

	let scroll;
	let height;

    tags.subscribe(r => {
        genres = r
    })
    popular.subscribe(r => {
        pop = r 
    })
    tags.subscribe(r => {
        genres = r 
    })
    latest.subscribe(r => {
        lat = r
    })
    comingsoon.subscribe(r => {
        cs = r
    })
    
	window.scrollTo(0, 0)
</script>

<svelte:window bind:innerHeight={height} bind:scrollY={scroll} />

<main>
    <Bilbord/>
    <section class="querys ml">
        {#each genres as i}
        <Link to={"/genre/"+i}>{i}</Link>
        {/each}
    </section>
    <section>
        <h1>Popular</h1>
    </section>
    <section class="flex mr">
        {#each pop as i}
        <Poster name={i.name} img={i.poster} type={i.type} relese={i.relese} duration={i.duration} season={i.season} eps={i.eps} id={i.showid} />
        {/each}
    </section>
    <section>
        <h1>Latest</h1>
    </section>
    <section class="flex mr">
        {#each lat as i}
        <Poster name={i.name} img={i.poster} type={i.type} relese={i.relese} duration={i.duration} season={i.season} eps={i.eps} id={i.showid} />
        {/each}
    </section>
    <section>
        <h1>Coming Soon</h1>
    </section>
    <section class="flex mr">
        {#each cs as i}
        <Poster name={i.name} img={i.poster} type={i.type} relese={i.relese} duration={i.duration} season={i.season} eps={i.eps} id={i.showid} />
        {/each}
    </section>
</main>

<style>
    section {
        max-width: 96%;
        margin: 0 2%;
    }
    .mr {
        padding-bottom: 50px;
    }
    .ml {
        padding: 25px 0;
    }
    .querys {
        display: flex;
        flex-wrap: wrap;
    }
    .querys :global(a) {
        background-color: rgb(27, 33, 43);
        text-decoration: none;
        padding: 5px 20px;
        margin: 5px 15px;
		border-radius: 4px;
    }
    .flex {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }
    h1 {
        font-size: 38px;
        font-weight: 400;
        margin: 5px 0;
    }
    @media only screen and (max-width: 1000px) {
        section {
            max-width: 100%;
            padding: 20px 0 0 0;
        }
    }
    @media only screen and (max-width: 680px) {
        .ml {
            padding: 10px 0;
        }
        h1 {
            text-align: center;
        }
    }
</style>