import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import CANNON from 'cannon'
import { CatmullRomCurve3 } from 'three'

/**
 * Debug
 */
const gui = new dat.GUI()
const xObject = {}
xObject.Laude_isko_dba = () =>
{
    createSphere(
        Math.random()* 0.5,
        {
            x: (Math.random()- 0.5) * 3,
            y: 3,
            z:(Math.random()- 0.5) * 3
        }
    )

    createBox(
        Math.random() * 0.5 ,Math.random() * 0.5 ,Math.random() * 0.5 ,
         
        {
            x: (Math.random()- 0.5) * (-3),
            y: 3,
            z:(Math.random()- 0.5) * 3
        })
}

const removeObject = {}
removeObject.Bhak_MC = () =>
{
    for ( const object of objectsToUpdate)
    {
        //remove body
        object.body.removeEventListener('collide',playHITSound)
        world.removeBody(object.body)

        //remove mesh
        scene.remove(object.mesh)

        // remove from the array 
        //objectsToUpdate.splice(0, objectsToUpdate.length)
    }
    
} 
gui.add(xObject, 'Laude_isko_dba')
gui.add(removeObject, 'Bhak_MC')











/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()





/**
 * Sounds -JavaScript - nothing top do with ThreeJS
 */
const hitSound = new Audio('/sounds/hit.mp3')
const playHITSound = (collision) =>
{
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()

    if(impactStrength > 1.2)
    {
    hitSound.volume = Math.random()
    hitSound.currentTime = 0
    hitSound.play()
    }
}









/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])






/**
 * Physics World
 */

const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, -9.8, 0)

// Material - 
const defaultMaterial = new CANNON.Material('default')


const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    
    }
)
world.addContactMaterial(defaultContactMaterial)




// // Sphere -
// const sphereShape = new CANNON.Sphere(0.5)
// const sphereBody = new CANNON.Body({
//     mass: 1,
//     position: new CANNON.Vec3(0,3,0),
//     shape: sphereShape,
//     material : defaultMaterial
// })

// //Local force
// sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0,0,0))

// world.addBody(sphereBody)



//floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass=0
floorBody.material = defaultMaterial
floorBody.addShape(floorShape)


floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1,0,0), Math.PI*0.5)

world.addBody(floorBody)











/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 32, 32),
//     new THREE.MeshStandardMaterial({
//         metalness: 0.3,
//         roughness: 0.4,
//         envMap: environmentMapTexture,
//         envMapIntensity: 0.5
//     })
// )
// sphere.castShadow = true
// sphere.position.y = 0.5
// scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 15, 15)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))









/**
 * UTILS
 */
const objectsToUpdate = []
const geo = new THREE.SphereGeometry(1, 20, 20)
  const mat =   new THREE.MeshStandardMaterial
        ({
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5})



const createSphere = (radius,position) =>
{

                    //THREE Mesh 
                    const mesh = new THREE.Mesh(geo, mat)
                    mesh.scale.set(radius,radius,radius)
                    
                    mesh.castShadow = true
                mesh.position.copy(position)
                scene.add(mesh)

                // Cannon.js body
                const shape = new CANNON.Sphere(radius)
                const body = new CANNON.Body({
                    mass:1,
                    position: new CANNON.Vec3(0, 3, 0),
                    shape: shape,
                    material: defaultMaterial
                })
                body.position.copy(position)
                world.addBody(body)

                //Save in object To update
                objectsToUpdate.push({
                    mesh:mesh,
                    body: body
                })

}



const geo1 = new THREE.BoxGeometry(1,1,1)
const mat1 = new THREE.MeshStandardMaterial(
    {
        metalness: 1,
        roughness: 0.2,
        envMap: environmentMapTexture
    }
)



const createBox = (width,height,depth,position) =>
{

                    //THREE Mesh 
                    const mesh1 = new THREE.Mesh(geo1, mat1)
                    mesh1.scale.set(width,height,depth)
                    
                    mesh1.castShadow = true
                mesh1.position.copy(position)
                scene.add(mesh1)

                // Cannon.js body
                const shape1 = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))
                const body1 = new CANNON.Body({
                    mass:1,
                    position: new CANNON.Vec3(0, 3, 0),
                    shape: shape1,
                    material: defaultMaterial
                })
                body1.position.copy(position)
                body1.addEventListener('collide', playHITSound)
                world.addBody(body1)

                //Save in object To update
                objectsToUpdate.push({
                    mesh:mesh1,
                    body: body1
                })

}


















/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime-previousTime
    previousTime=elapsedTime
    

    //update physics world 
    world.step(1/60, deltaTime, 3)

    for(const object of objectsToUpdate)
    {
        object.mesh.position.copy(object.body.position)
    }
    
   
    for(const object of objectsToUpdate)
    {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }
    


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()