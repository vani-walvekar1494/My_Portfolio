var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth/1.5, window.innerHeight/1.1);
document.getElementById("particleContainer").appendChild(renderer.domElement);
renderer.setClearColor(0xffffff, 1);

var particles = createParticles();
scene.add(particles);

camera.position.z = 400;

function animate() {
    requestAnimationFrame(animate);
    particles.rotation.y += 0.0005;
    renderer.render(scene, camera);
}

function createParticles() {
    var distance = Math.min(210, window.innerWidth); // Adjusted distance for better fitting
    var geometry = new THREE.BufferGeometry();
    var vertices = [];

    for (var i = 0; i < 1600; i++) {
        var theta = Math.random() * Math.PI * 2;
        var phi = Math.random() * Math.PI * 2;

        var x = distance * Math.sin(theta) * Math.cos(phi);
        var y = distance * Math.sin(theta) * Math.sin(phi);
        var z = distance * Math.cos(theta);

        vertices.push(x, y, z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    var material = new THREE.PointsMaterial({ color: 0x91a8ee, size: 1.7 });
    return new THREE.Points(geometry, material);
}

document.addEventListener('mousemove', onmousemove, false);

function onmousemove(event) {
    var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    gsap.to(particles.rotation, { duration: 0.1, y: mouseX });
}

function scatterParticles() {
    var positions = particles.geometry.attributes.position.array;
    var duration = 1;
    var spread = 500; // Adjust this to change how far the particles scatter

    for (var i = 0; i < positions.length; i += 3) {
        var x = (Math.random() - 0.5) * spread;
        var y = (Math.random() - 0.5) * spread;
        var z = (Math.random() - 0.5) * spread;

        gsap.to(positions, {
            duration: duration,
            [i]: x,
            [i + 1]: y,
            [i + 2]: z,
            ease: "power4.out"
        });
    }

    particles.geometry.attributes.position.needsUpdate = true;
}

renderer.domElement.addEventListener('click', scatterParticles);

animate();

// Select the text elements
var nameText = document.querySelector('.name');
var taglineText = document.querySelector('.tagline');

// Animate the text elements with GSAP
gsap.to(nameText, { opacity: 1, scale: 1, duration: 0.8, delay: 0.5, ease: 'power4.out' });
gsap.to(taglineText, { opacity: 1, scale: 1, duration: 0.8, delay: 0.7, ease: 'power4.out' });

// Sidebar
document.addEventListener('DOMContentLoaded', function () {
    var sidebar = document.querySelector('.menu-container');

    if (window.innerWidth <= 768) {
        sidebar.classList.remove('show');
    }

    document.addEventListener('click', function (e) {
        if (window.innerWidth <= 768 && !sidebar.contains(e.target)) {
            sidebar.classList.remove('show');
        }
    });
});
