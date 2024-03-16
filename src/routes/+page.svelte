<script lang="ts">
    import { onMount } from 'svelte';
    import { MainScene } from '$lib/scene';
    import AssetSelector from '../components/asset-selector.svelte';
    import { cars, wheels, hdris } from "../mock_data";

    let canv: HTMLCanvasElement;
    let scene: MainScene;

    onMount(() => {
        scene = new MainScene(canv);
        scene.init();
    });

    const handleCarSelect = (value: string) => {
        scene.loadCar(value);
    }

    const handleWheelsSelect = (value: string) => {
        scene.loadWheels(value);
    }

    const handleHdriSelect = (value: string) => {
        scene.setEnvironment(value);
    }
</script>

<svelte:head>
    <title>Car app</title>
    <meta name="description" content="App for customizing cars made with Svelte and Three.js" />
</svelte:head>

<div class="Assets">
    <h2 class="Assets-title">Asset selection:</h2>
    <AssetSelector values={Object.values(hdris)} handleSelect={handleHdriSelect} />
    <AssetSelector values={Object.values(cars)} handleSelect={handleCarSelect} />
    <AssetSelector values={Object.values(wheels)} handleSelect={handleWheelsSelect} />
</div>

<canvas bind:this={canv} />

<style>
    .Assets {
        position: absolute;
        width: max-content;
        margin-left: 20px;
        margin-top: 20px;
        background-color: rgba(53, 80, 231, 0.3);
        border-radius: 10px;
        padding: 20px;
        border: 1px solid rgb(49, 59, 116);
    }

    .Assets-title {
        padding: 0;
        margin: 0;
        font-size: 18px;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
</style>