// Three.js setup
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({ alpha: false });
renderer.setSize(window.innerWidth / 1.5, window.innerHeight / 1.1);
renderer.setClearColor(0xffffff, 1);
document.getElementById("particleContainer").appendChild(renderer.domElement);

var particles = createParticles();
scene.add(particles);

camera.position.z = 400;

function animate() {
    requestAnimationFrame(animate);
    particles.rotation.y += 0.0005;
    renderer.render(scene, camera);
}

function createParticles() {
    var distance = Math.min(210, window.innerWidth);
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

    var material = new THREE.PointsMaterial({ color: 0x0800ff, size: 1.7 });
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
    var newPositions = [];

    for (var i = 0; i < positions.length; i += 3) {
        newPositions[i] = positions[i] + (Math.random() - 0.5) * 400;
        newPositions[i + 1] = positions[i + 1] + (Math.random() - 0.5) * 400;
        newPositions[i + 2] = positions[i + 2] + (Math.random() - 0.5) * 400;
    }

    gsap.to(particles.geometry.attributes.position.array, {
        duration: 2,
        endArray: newPositions,
        onUpdate: function () {
            particles.geometry.attributes.position.needsUpdate = true;
        }
    });
}

animate();

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

// Button and text animations
var button = document.querySelector('.fancy-button');
button.addEventListener('click', scatterParticles);

var nameText = document.querySelector('.name');
var taglineText = document.querySelector('.tagline');

gsap.to(nameText, { opacity: 1, scale: 1, duration: 0.8, delay: 0.5, ease: 'power4.out' });
gsap.to(taglineText, { opacity: 1, scale: 1, duration: 0.8, delay: 0.7, ease: 'power4.out' });

// Sidebar functionality
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

    var sidebar1 = document.getElementById('sidebar1');

    button.addEventListener('click', function () {
        sidebar1.classList.toggle('sidebar-visible');
    });

    document.addEventListener('click', function (event) {
        if (!sidebar1.contains(event.target) && event.target !== button) {
            sidebar1.classList.remove('sidebar-visible');
        }
    });

    const toggleButton = document.getElementById("toggle-sidebar");

    function toggleSidebar() {
        sidebar1.classList.toggle("show");
    }

    toggleButton.addEventListener("click", toggleSidebar);
});

// Section navigation
document.querySelectorAll('.menu-link').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('hidden');
        });

        const targetSection = document.querySelector(`#${targetId}`);
        targetSection.classList.remove('hidden');

        document.getElementById('landing-page').classList.add('hidden');

        // Store the current section in localStorage
        localStorage.setItem('activeSection', targetId);

        history.pushState({ section: targetId }, '', `#${targetId}`);
    });
});

// Popstate event to handle back/forward navigation
window.addEventListener('popstate', function (event) {
    if (event.state) {
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('hidden');
        });

        const targetSection = document.querySelector(`#${event.state.section}`);
        targetSection.classList.remove('hidden');

        document.getElementById('landing-page').classList.add('hidden');
    } else {
        showLandingPage();
    }
});

// Function to show the landing page
function showLandingPage() {
    document.getElementById('landing-page').classList.remove('hidden');
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
}

// On page load, check localStorage for the active section
window.addEventListener('DOMContentLoaded', () => {
    const activeSection = localStorage.getItem('activeSection');
    if (activeSection) {
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('hidden');
        });
        const targetSection = document.querySelector(`#${activeSection}`);
        targetSection.classList.remove('hidden');
        document.getElementById('landing-page').classList.add('hidden');
    } else {
        showLandingPage();
    }
});

document.getElementById('home-button').addEventListener('click', function () {
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show the landing page
    document.getElementById('landing-page').classList.remove('hidden');

    // Update the URL without refreshing the page
    history.pushState({ section: 'landing-page' }, '', '#landing-page');
});
