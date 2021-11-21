<script>
    import Poster from './poster.svelte'
    export let shows;
    let page = 0;
    let width;
    let lenght = shows.length;
    function move(n) {
        let mag = 228
        if (width <= 600) {
            mag = 208
        }
        let p = page + (n*mag)
        if ((p > -1) && (p < ((lenght*mag)-width))) {
            page = parseInt(p/mag)*mag
        } else {
            if (p >= ((lenght*mag)-width)) {
                if (page == (lenght*mag)-width) {
                    page = 0
                } else {
                    page = (lenght*mag)-width
                }
            }
        }
    }
</script>

<section class="slidebar" bind:clientWidth={width}>
    <button id="left" on:click={() => {move(-1)}}>{'<'}</button>
    <div style="left: -{page}px">
    {#each shows as i}
        <span></span>
        <Poster img={i.poster} name={i.name} type={i.type} duration="1h" relese="2020" />
        <span></span>
    {/each}
    </div>
    <button id="right" on:click={() => {move(1)}}>{'>'}</button>
</section>

<style>
    .slidebar {
        position: relative;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: nowrap;
        overflow-x: hidden;
    }
    .slidebar div  {
        position: relative;
        display: flex;
        flex-wrap: nowrap;
        transition: left 0.5s ease;
    }
    .slidebar div span {
        width: 10px;
    }
    .slidebar button {
        display: none;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;
        cursor: pointer;
        position: absolute;
        border: none;
        font-size: 90px;
        background-color: rgba(26, 30, 36, 0.9);
        margin: 0 18px;
        padding: 10px 5px;
    }
    .slidebar:hover > button {
        display: block;
    }
    .slidebar #left {
        left: 0;
    }
    .slidebar #right {
        right: 0;
    }
    @media only screen and (max-width: 600px) {
        .slidebar button {
            font-size: 80px;
        }
        .slidebar div span {
            width: 0;
        }
    }
</style>