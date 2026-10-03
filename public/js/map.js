
   
    mapboxgl.accessToken=mapToken;
    const map = new mapboxgl.Map({
        // accessToken: 'pk.eyJ1IjoiZ29wYWxsb2hpeWExNTExIiwiYSI6ImNtdXI0cXZ5ZDBpOHQyeXMxOG1vcDhnYXUifQ.G-GizU4ZCQ_99QS343X2gw',
        container: 'map', // container ID
        center: [-71.06776, 42.35816], // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });
