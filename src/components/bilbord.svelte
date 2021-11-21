<script>
    import {Link} from 'svelte-routing'
    import {bilbord} from '../stores.js'
    let imgs;
    let page = 0;
    let next = true;
    bilbord.subscribe(r => {
        imgs = r
    })
    function move(n) {
        if ((page + n) < 0) {
            page = 9
        } else if ((page + n) > 9) {
            page = 0
        } else {
            page += n
        }
    }
    setInterval(() => {
        if (next) {
            move(1)
            next = true
        }
    }, 7000)
</script>

<div class="bilbord">
    <button class="left" on:click={() => {move(-1); next = false}}>
        {'<'}
    </button>
    <button class="right" on:click={() => {move(1); next = false}}>
        {'>'}
    </button>
    <div class="imgs" style={`left: -${page}00%`} >
        {#each imgs as imf}
            <Link to={`/${imf.type}/${imf.name}`}>
                <img src={imf.panel} alt="#">
            </Link>
        {/each}
    </div>
</div>

<style>
    .bilbord {
        position: relative;
        width: 100%;
        overflow: hidden;
    }
    .bilbord .imgs {
        position: relative;
        width: inherit;
        display: flex;
        transition: left 0.5s ease;
    }
    .bilbord .imgs :global(a) {
        overflow: hidden;
        min-width: 100%;
        background-color: black;
        border: none;
        display: flex;
        justify-content: center;
    }
    .bilbord .imgs :global(a img) {
        width: 100%;
        min-width: 500px;
    }
    .bilbord button {
        display: none;
        cursor: pointer;
        position: absolute;
        background: none;
        border: none;
        color: rgb(255, 255, 255);
        font-size: 80px;
        padding: 15px 8px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 2;
    }
    .bilbord button:hover {
        background-color: rgb(37, 42, 54);
    }
    .bilbord:hover > button {
        display: block;
    }
    .bilbord .left {
        left: 0px;
    }
    .bilbord .right {
        right: 0px;
    }
    @media only screen and (max-width: 600px) {
        .bilbord .left, .bilbord .right {
            padding: 10px 5px;
            font-size: 60px;
        }
        .bilbord button:hover {
            background: none;
        }
    }
</style>