<script>
    import axios from "axios"
    import Watch from '../components/watch.svelte'
    export let name;
    let show;
    let curentSeason = 0;
    let eps = {};
    function selectEp(index) {
        eps = show.seasons[curentSeason].eps[index].links
    }
    function selectSeason(index) {
        curentSeason = index
        selectEp(0)
    }
    axios.get("http://localhost:3000/api/watch/"+name).then(res => {
        show = res.data
        selectEp(0)
    })
</script>

<main>
    {#if show !== undefined}
    <Watch 
        name={show.name}
        duration={show.duration}
        relese={show.relese}
        genre={show.genres}
        poster={show.poster}
        description={show.description}
        services={eps}
    />
    <div class="eps">
            <div class="ep">
                {#each show.seasons[curentSeason].eps as episode}
                    <button on:click={() => {selectEp(show.seasons[curentSeason].eps.indexOf(episode))}}>  
                        {show.seasons[curentSeason].eps.indexOf(episode) + 1}
                    </button>
                {/each}
            </div>
    </div>
    {/if}
</main>

<style>
    main {
        width: 90%;
        padding: 25px 5%;
        padding-bottom: 40px;
    }
    .eps {
        border-radius: 5px;
        padding: 5px;
        background-color: rgb(27, 33, 43);
    }
    .eps .ep {
        display: flex;
        flex-wrap: wrap;
    }
    .eps h2 {
        font-weight: 400;
    }
    .eps button {
        display: flex;
        justify-content: center;
        min-width: 60px;
        cursor: pointer;
        display: flex;
        background: none;
        border: none;
        align-items: center;
        margin: 5px;
        font-size: 18px;
    }
    .eps .ep button {
		background-color: rgb(45, 53, 68);
        border-radius: 6px;
        padding: 4px;
    }
    @media only screen and (max-width: 772px) {
        main { 
            width: 100%;
            padding: 0;
        }
        .eps .ep {
            border-radius: 0;
            margin: 10px 0;
        }
    }
</style>