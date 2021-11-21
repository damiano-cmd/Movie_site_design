<script>
    import {Link} from 'svelte-routing'
    export let img;
    export let name;
    export let type;
    export let relese;
    export let duration;
    export let season;
    export let eps;
    export let id;
    name = String(name)
    let link = '/'+type+'/'+id
</script>

<Link class="poster" to={link}>
    <img src={img} alt="#">
    <p id="t">
        {name}
    </p>
    {#if type == "movie"}
    <img class="boxcon" src='/images/movie.svg' alt='#' />
    <p>{relese.split('-')[0]} <span></span> {duration}</p>
    {:else}
    <img class="boxcon" src="/images/series.svg" alt="#" />
    <p>SS {season} <span></span> Eps {eps}</p>
    {/if}
</Link>

<style>
    :global(.poster) {
        position: relative;
        min-width: 200px;
        max-width: 200px;
        height: min-content;
        margin: 15px 4px;
        text-decoration: none;
    }
    :global(.poster p) {
        color: rgb(195, 195, 195);
        font-size: 15px;
        display: flex;
        align-items: center;
    }
    :global(.poster p span) {
        display: inline-block;
        width: 5px;
        height: 5px;
        margin: 2px 6px;
        border-radius: 50%;
        background-color: white;
    }
    :global(.poster .boxcon) {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 22px;
        margin: 0;
        border: none;
    }
    :global(.poster #t) {
        color: #fff;
        margin-bottom: 5px;
        font-size: 17px;
    }
    :global(.poster img) {
        width: 100%;
        margin-bottom: 5px;
        border-radius: 4px;
        border: 1px solid black;
        filter: brightness(95%);
    }
</style>