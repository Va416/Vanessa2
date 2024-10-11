// 自定义鼠标指针逻辑（带尾随效果）
(function() {
    const cursor = document.querySelector('.cursor');
    const cursorTrail = document.querySelector('.cursor-trail');

    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    // 鼠标移动事件
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.transform = `translate(${mouseX - 5}px, ${mouseY - 5}px)`;
    });

    // 使用 requestAnimationFrame 实现尾随效果
    function animate() {
        requestAnimationFrame(animate);
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        cursorTrail.style.transform = `translate(${trailX - 5}px, ${trailY - 5}px)`;
    }
    animate();

    // 鼠标进入可点击元素时，指针放大
    const interactiveElements = document.querySelectorAll('a, button, .nav-item, .btn');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = `translate(${mouseX - 10}px, ${mouseY - 10}px) scale(2)`;
            cursorTrail.style.transform = `translate(${trailX - 10}px, ${trailY - 10}px) scale(2)`;
            cursor.style.backgroundColor = 'rgba(0, 255, 255, 0.8)';
            cursorTrail.style.backgroundColor = 'rgba(0, 255, 255, 0.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = `translate(${mouseX - 5}px, ${mouseY - 5}px) scale(1)`;
            cursorTrail.style.transform = `translate(${trailX - 5}px, ${trailY - 5}px) scale(1)`;
            cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            cursorTrail.style.backgroundColor = 'rgba(0, 255, 255, 0.5)';
        });
    });
})();

// 打字机效果
(function() {
    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".cursor");

    const textArray = ["By envisioning the impossible, make it possible."];
    const typingDelay = 100;   // 打字速度（毫秒）
    const erasingDelay = 50;   // 删除速度（毫秒）
    const newTextDelay = 2000; // 当前文本和下一个文本之间的延迟（毫秒）
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            cursorSpan.classList.remove("typing");
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            cursorSpan.classList.remove("typing");
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    document.addEventListener("DOMContentLoaded", function() { // 在 DOM 加载后启动效果
        if (textArray.length) setTimeout(type, newTextDelay + 250);
    });
})();

// 神经元背景特效
(function() {
    const container = document.getElementById('background');

    // 创建场景、相机和渲染器
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.z = 200;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // 创建节点（神经元）
    const nodeCount = 300;
    const nodes = [];
    const nodeGeometry = new THREE.SphereGeometry(1.5, 8, 8);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });

    for (let i = 0; i < nodeCount; i++) {
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
        node.position.x = (Math.random() - 0.5) * 400;
        node.position.y = (Math.random() - 0.5) * 400;
        node.position.z = (Math.random() - 0.5) * 400;
        scene.add(node);
        nodes.push(node);
    }

    // 创建连线（突触）
    const connections = [];
    const maxConnectionsPerNode = 3;

    nodes.forEach(node => {
        const connectionCount = Math.floor(Math.random() * maxConnectionsPerNode) + 1;
        for (let i = 0; i < connectionCount; i++) {
            const targetNode = nodes[Math.floor(Math.random() * nodes.length)];
            const material = new THREE.LineBasicMaterial({ color: 0x00ffff, opacity: 0.5, transparent: true });
            const geometry = new THREE.BufferGeometry().setFromPoints([
                node.position,
                targetNode.position
            ]);
            const line = new THREE.Line(geometry, material);
            scene.add(line);
            connections.push(line);
        }
    });

    // 鼠标交互
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - window.innerWidth / 2);
        mouseY = (event.clientY - window.innerHeight / 2);
    }

    // 鼠标悬停高亮
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    document.addEventListener('mousemove', onMouseMove, false);

    function onMouseMove(event) {
        // 将鼠标坐标转换为归一化设备坐标
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }

    // 窗口大小调整
    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // 动画循环
    function animate() {
        requestAnimationFrame(animate);

        // 更新射线
        raycaster.setFromCamera(mouse, camera);

        // 计算射线与节点的交集
        const intersects = raycaster.intersectObjects(nodes);

        // 重置所有节点的颜色
        nodes.forEach(node => node.material.color.set(0x00ffff));

        // 高亮鼠标下的节点
        if (intersects.length > 0) {
            intersects[0].object.material.color.set(0xffffff);
        }

        // 让场景缓慢旋转
        scene.rotation.x += 0.0005;
        scene.rotation.y += 0.0005;

        // 摄像机跟随鼠标移动
        camera.position.x += (mouseX - camera.position.x) * 0.02;
        camera.position.y += (-mouseY - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();
})();
