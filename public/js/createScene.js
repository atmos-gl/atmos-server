import { AmbientLight, PointLight, Vector3, PerspectiveCamera, Scene, sRGBEncoding, WebGLRenderer } from 'three'
import { FBXLoader } from './FBXLoader.js'

const colorTable = {
    red: '#b20000',
    yellow: '#e0bb00',
    green: '#339b07',
    black: '#0e1806',
}

export default function createScene(camPos = new Vector3(12, 0, 10)) {


    let camera, scene, renderer;

    init();
    function init() {
        console.log(sceneData)

        camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.copy(camPos)
        camera.lookAt(0, -15, 0)

        scene = new Scene()
        const ambientLight = new AmbientLight('#ffffff', 0.2)
        scene.add(ambientLight)

        const pointLight = new PointLight('#ffffff', 0.7)
        pointLight.position.x = 15
        pointLight.position.y = 10
        pointLight.position.z = 10
        scene.add(pointLight)

        //scene = new ObjectLoader().parse( JSON.parse(window.sceneData) );
        const loader = new FBXLoader()
        loader.load('/assets/cart.fbx', (cart) => {
            cart.scale.setScalar(0.06)
            cart.position.y = -15
            scene.add(cart)
        })
        loader.load('/assets/tomato.fbx', (tomatoModel) => {
            tomatoModel.scale.setScalar(0.25)
            const mat = tomatoModel.getObjectByName('Sphere').material
            const {color, long, size} = sceneData.tomatoParams
            mat.color.set(colorTable[color])
            const body = tomatoModel.getObjectByName('body')

            body.scale.y = long * size
            body.scale.x = size
            body.scale.z = size

            for (const d of sceneData.tomatoes) {
                const tomato = tomatoModel.clone()
                tomato.quaternion.set(
                    d.quaternion._x,
                    d.quaternion._y,
                    d.quaternion._z,
                    d.quaternion._w,
                )
                tomato.position.set(
                    d.position.x,
                    d.position.y,
                    d.position.z,
                )
                scene.add(tomato)
            }
            setTimeout(render, 50)
        })

        renderer = new WebGLRenderer( { antialias: true, alpha: true } );
        renderer.outputEncoding = sRGBEncoding

        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );

    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function render() {

        // requestAnimationFrame( animate );

        renderer.render( scene, camera );
        window.onSceneRender?.()

    }
}
