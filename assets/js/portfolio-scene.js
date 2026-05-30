        import * as THREE from "three";
        import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

        const root = document.querySelector("#scene-root");
        const statusEl = document.querySelector("#scene-status");
        const sceneToggle = document.querySelector("#scene-toggle");
        const settingsToggle = document.querySelector("#settings-toggle");
        const sceneCloseBtn = document.querySelector("#scene-close-btn");
        const translateBtn = document.querySelector("#translate-btn");
        const rotateBtn = document.querySelector("#rotate-btn");
        const scaleBtn = document.querySelector("#scale-btn");
        const snapBtn = document.querySelector("#snap-btn");
        const undoBtn = document.querySelector("#undo-btn");
        const redoBtn = document.querySelector("#redo-btn");
        const resetObjectBtn = document.querySelector("#reset-object-btn");
        const deleteBtn = document.querySelector("#delete-btn");
        const addLightBtn = document.querySelector("#add-light-btn");
        const refreshObjectsBtn = document.querySelector("#refresh-objects-btn");
        const modelFileInput = document.querySelector("#model-file");
        const sceneLoadInput = document.querySelector("#scene-load-file");
        const saveBrowserBtn = document.querySelector("#save-browser-btn");
        const loadBrowserBtn = document.querySelector("#load-browser-btn");
        const exportSceneBtn = document.querySelector("#export-scene-btn");
        const saveSettingsBtn = document.querySelector("#save-settings-btn");
        const settingLoadInput = document.querySelector("#setting-load-file");
        const resetAllSettingsBtn = document.querySelector("#reset-all-settings-btn");
        const cameraKeyframeBtn = document.querySelector("#camera-keyframe-btn");
        const cameraPlayBtn = document.querySelector("#camera-play-btn");
        const cameraPauseBtn = document.querySelector("#camera-pause-btn");
        const cameraTimeline = document.querySelector("#camera-timeline");
        const cameraUpdateKeyframeBtn = document.querySelector("#camera-update-keyframe-btn");
        const cameraThirdPersonBtn = document.querySelector("#camera-third-person-btn");
        const cameraSmoothBtn = document.querySelector("#camera-smooth-btn");
        const cameraSequenceName = document.querySelector("#camera-sequence-name");
        const cameraSequenceSelect = document.querySelector("#camera-sequence-select");
        const cameraSaveSequenceBtn = document.querySelector("#camera-save-sequence-btn");
        const cameraExportBtn = document.querySelector("#camera-export-btn");
        const cameraLoadInput = document.querySelector("#camera-load-file");
        const scrollSyncToggle = document.querySelector("#scroll-sync-toggle");
        const cameraEasing = document.querySelector("#camera-easing");
        const objectListEl = document.querySelector("#object-list");
        const transformInputs = [...document.querySelectorAll(".transform-input")];
        const liveSettingInputs = [...document.querySelectorAll(".live-setting")];
        const cameraKeyframeList = document.querySelector("#camera-keyframe-list");
        const cameraTimelineDock = document.querySelector("#camera-timeline-dock");
        const timelineExpandBtn = document.querySelector("#timeline-expand-btn");
        const timelineAddKeyframeBtn = document.querySelector("#timeline-add-keyframe-btn");
        const timelineTrack = document.querySelector("#timeline-track");
        const pageEditorPanel = document.querySelector("#page-editor-panel");
        const pageEditorCloseBtn = document.querySelector("#page-editor-close-btn");
        const pageElementName = document.querySelector("#page-element-name");
        const pageElementSelect = document.querySelector("#page-element-select");
        const pageElementTimeline = document.querySelector("#page-element-timeline");
        const pageElementTimelineNumber = document.querySelector("#page-element-timeline-number");
        const pageElementTimelineValue = document.querySelector("#page-element-timeline-value");
        const pageElementX = document.querySelector("#page-element-x");
        const pageElementY = document.querySelector("#page-element-y");
        const pageElementWidth = document.querySelector("#page-element-width");
        const pageElementHeight = document.querySelector("#page-element-height");
        const pageElementOpacity = document.querySelector("#page-element-opacity");
        const pageElementOpacityValue = document.querySelector("#page-element-opacity-value");
        const pageElementFont = document.querySelector("#page-element-font");
        const pageElementColor = document.querySelector("#page-element-color");
        const pageElementText = document.querySelector("#page-element-text");
        const pageAddTextBtn = document.querySelector("#page-add-text-btn");
        const pageResetElementBtn = document.querySelector("#page-reset-element-btn");
        const pageSaveConfigBtn = document.querySelector("#page-save-config-btn");
        const pageLoadConfigBtn = document.querySelector("#page-load-config-btn");
        const pageExportConfigBtn = document.querySelector("#page-export-config-btn");
        const pageImportConfigFile = document.querySelector("#page-import-config-file");
        const pageTimelineDock = document.querySelector("#page-timeline-dock");
        const pageTimelineTrack = document.querySelector("#page-timeline-track");
        const pageTimelineAddBtn = document.querySelector("#page-timeline-add-btn");
        const perfOverlay = document.querySelector("#perf-overlay");
        const perfFps = document.querySelector("#perf-fps");
        const perfFrame = document.querySelector("#perf-frame");
        const perfQuality = document.querySelector("#perf-quality");
        const perfParticles = document.querySelector("#perf-particles");
        const perfRug = document.querySelector("#perf-rug");
        const projectViewer = document.querySelector("#project-viewer");
        const projectCards = [...document.querySelectorAll("[data-project-card]")];
        const projectTextTarget = document.querySelector("#project-text-target");
        const projectDescriptionEditor = document.querySelector("#project-description-editor");
        const hourglassFlipBtn = document.querySelector("#hourglass-flip-btn");
        const videoControls = document.querySelector("#projection-video-controls");
        const videoPrevBtn = document.querySelector("#projection-video-prev");
        const videoAudioBtn = document.querySelector("#projection-video-audio");
        const videoPauseBtn = document.querySelector("#projection-video-pause");
        const videoNextBtn = document.querySelector("#projection-video-next");
        const heartBurst = document.querySelector("#heart-burst");
        const titleFallback = document.querySelector("#title-fallback");
        const aboutVideo = document.querySelector("#about-blackhole-video");
        const panelDisplacement = document.querySelector("#liquid-panel-displacement");
        const lensDisplacement = document.querySelector("#liquid-lens-displacement");

        const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
        const lerp = (a, b, t) => a + (b - a) * t;
        const smoothstep = (t) => t * t * (3 - 2 * t);
        const smootherstep = (t) => t * t * t * (t * (t * 6 - 15) + 10);
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const qualityPresetOptions = new Set(["auto", "low", "medium", "high", "cinematic"]);
        const qualityDowngradeOrder = ["cinematic", "high", "medium", "low"];
        let runtimeQualityOverride = "";
        let runtimeFpsWindowStart = performance.now();
        let runtimeFpsFrames = 0;
        let runtimeFpsLastDowngrade = 0;

        function readInitialQualityPreset() {
            try {
                const params = new URLSearchParams(window.location.search);
                const requested = params.get("quality") || localStorage.getItem("pouya-ai-quality-preset") || "auto";
                return requested === "lowest" ? "low" : qualityPresetOptions.has(requested) ? requested : "auto";
            } catch (error) {
                return "auto";
            }
        }

        function persistQualityPreset(value) {
            try {
                const normalized = value === "lowest" ? "low" : value;
                if (!qualityPresetOptions.has(normalized) || normalized === "auto") localStorage.removeItem("pouya-ai-quality-preset");
                else localStorage.setItem("pouya-ai-quality-preset", normalized);
            } catch (error) {
                // Storage can be unavailable in private contexts; the in-memory setting still applies.
            }
        }

        function deviceCapabilityProfile() {
            const memory = navigator.deviceMemory || 0;
            const cores = navigator.hardwareConcurrency || 4;
            const coarse = window.matchMedia("(pointer: coarse)").matches;
            const mobile = coarse || window.innerWidth < 760 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            const capableMobile = mobile && (
                (memory >= 6 && cores >= 6) ||
                (memory >= 4 && cores >= 8) ||
                (!navigator.deviceMemory && cores >= 6)
            );
            return { memory, cores, mobile, capableMobile };
        }

        function preferredPixelRatio() {
            const dpr = window.devicePixelRatio || 1;
            const memory = deviceCapabilityProfile().memory || 4;
            const pixels = window.innerWidth * window.innerHeight;
            const highPixelViewport = pixels > 1920 * 1080;
            const quality = effectiveQualityPreset();
            const qualityCap = quality === "lowest" ? 0.75 : quality === "low" ? 1.0 : quality === "medium" ? 1.25 : quality === "high" ? 1.55 : 1.75;
            const deviceCap = memory >= 8 && !highPixelViewport ? 2 : memory <= 4 || highPixelViewport ? 1.5 : 1.75;
            const cap = Math.min(qualityCap, deviceCap);
            return Math.max(quality === "lowest" ? 0.65 : 1, Math.min(dpr, cap));
        }

        function chooseAnimationProfile() {
            return "480p";
        }

        const modelPaths = {
            title: "assets/models/pouya-ai-times-glass-text.glb",
            rug: "assets/models/fine-persian-heriz-carpet.glb",
            lamp: "assets/models/alladins-lamp.glb",
            globe: "assets/models/holographic-globe-uniform-detail.glb",
            icosahedron: "assets/models/transparent-icosahedron-skeleton.glb",
            iran: "assets/models/iran-polygon-thick.glb",
            bull: "assets/models/achaemenid-bull-columns.glb",
            hourglass: "assets/models/hourglass.glb"
        };
        const lowModelPaths = {
            rug: "assets/models/optimized/fine-persian-heriz-carpet-low.glb",
            lamp: "assets/models/optimized/alladins-lamp-low.glb",
            globe: "assets/models/optimized/holographic-globe-uniform-detail-low.glb",
            bull: "assets/models/optimized/achaemenid-bull-columns-low.glb",
            hourglass: "assets/models/optimized/hourglass-low.glb"
        };

        function modelPath(assetId) {
            return effectiveQualityPreset() === "low" && lowModelPaths[assetId] ? lowModelPaths[assetId] : modelPaths[assetId];
        }

        const animationVideos = [
            { title: "Glimpse of the Future", stem: "animation-glimpse-future" },
            { title: "Yalda", stem: "animation-yalda" },
            { title: "Persepolis", stem: "animation-persepolis" },
            { title: "Ghibli Iran", stem: "animation-ghibli-iran" },
            { title: "Sassanid Persia", stem: "animation-sassanid-persia" },
            { title: "Farshchian Animation", stem: "animation-farshchian" },
            { title: "Liberation of Babylon", stem: "animation-liberation-babylon", only480: true },
            { title: "Rome", stem: "animation-rome", only480: true }
        ];

        function animationVideoSource(video) {
            return `assets/media/${video.stem}-${video.only480 ? "480p" : chooseAnimationProfile()}.mp4`;
        }

        const animationVideoPreloaders = [];

        function effectiveQualityPreset() {
            const requested = visualSettings?.qualityPreset || "auto";
            if (requested !== "auto") return requested === "lowest" ? "low" : qualityPresetOptions.has(requested) ? requested : "medium";
            if (runtimeQualityOverride) return runtimeQualityOverride;
            const { memory, cores, mobile, capableMobile } = deviceCapabilityProfile();
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const reducedNetwork = Boolean(connection?.saveData) || ["slow-2g", "2g", "3g"].includes(connection?.effectiveType);
            if (reducedNetwork || (memory > 0 && memory <= 2) || cores <= 2) return "low";
            if (mobile) {
                if (capableMobile) return "medium";
                if (memory >= 4 || cores >= 6) return "low";
                return "low";
            }
            if (prefersReducedMotion || (memory > 0 && memory <= 4)) return "low";
            if (memory >= 12 && window.innerWidth >= 1500) return "high";
            if (memory >= 8 && window.innerWidth >= 1280) return "medium";
            return "medium";
        }

        function objectInteractionsEnabled() {
            return true;
        }

        function preloadAnimationVideos(centerIndex = currentAnimationIndex || 0) {
            animationVideoPreloaders.forEach((preloader) => {
                preloader.pause();
                preloader.removeAttribute("src");
                preloader.load();
            });
            animationVideoPreloaders.length = 0;
            document.querySelectorAll("link[data-animation-preload]").forEach((link) => link.remove());
            const quality = effectiveQualityPreset();
            const budget = quality === "lowest" || quality === "low" ? 0 : quality === "medium" ? 1 : quality === "high" ? 2 : 3;
            if (budget <= 0) return;
            const wanted = new Set(Array.from({ length: budget }, (_, offset) => (centerIndex + offset) % animationVideos.length));
            [...wanted].forEach((index) => {
                const video = animationVideos[index];
                const source = animationVideoSource(video);
                const preloader = document.createElement("video");
                preloader.muted = true;
                preloader.playsInline = true;
                preloader.preload = quality === "medium" ? "metadata" : "auto";
                preloader.crossOrigin = "anonymous";
                preloader.src = source;
                preloader.load();
                animationVideoPreloaders.push(preloader);
            });
        }

        const projectKeys = ["geo", "iran", "history", "timeline", "animations"];
        const projectSettings = {
            geo: { color: "#17224f", opacity: 0.58, spin: 0.0045, frameSpin: -0.0061, bob: true },
            iran: { color: "#9f0718", opacity: 0.68, spin: 0.0024, bob: true },
            history: { color: "#db831f", opacity: 0.2, spin: 0.0028, bob: true },
            timeline: { color: "#d8b263", opacity: 0.86, spin: 0.0018, bob: true },
            animations: { color: "#61f5ff", opacity: 0.72, spin: 0, bob: true }
        };

        const visualSettings = {
            glassBlur: 1,
            glassDisplacement: 18,
            glassSaturation: 1.55,
            glassPanelAlpha: 0.1,
            glassHighlightAlpha: 0.8,
            glassGlareAlpha: 0.14,
            chromaticGlass: true,
            lensOpacity: 0.5,
            lensSize: 58,
            lensDisplacement: 30,
            lensWarpRadius: 0.85,
            lensEdgeBlue: 0.01,
            lensEdgeBlur: 36,
            lensRadialOpacity: 0.13,
            lensSaturation: 2.8,
            titleOpacity: 0.84,
            titleFrost: 0.04,
            titleEdges: 0.5,
            titleParallax: 0.16,
            titleSparkle: 1,
            titlePrism: 0.85,
            globalIllumination: false,
            topLight: 6,
            blueGlow: 5.2,
            purpleGlow: 1.8,
            gridVisible: false,
            solidFloor: false,
            floorColor: "#090d14",
            backgroundColor: "#000000",
            backgroundAlpha: 1,
            lampGlow: 2.4,
            qualityPreset: readInitialQualityPreset(),
            performanceLighting: 1,
            performanceParticles: 1,
            performanceRugDetail: 1,
            performanceShadows: true,
            projectGlassPlane: true,
            projectFontPreset: "playfair",
            projectTitleSize: 37,
            projectBodySize: 17,
            projectTextGap: 22,
            projectTextWidth: 500,
            projectTextRotateY: 13,
            blackholeNonOrbit: true,
            selectedProject: "geo",
            hologramColor: "#17224f",
            hologramOpacity: 0.58,
            hologramSpin: 0.004,
            hologramBob: true,
            particleOpacity: 0.82,
            particleSpeed: 1,
            particleSpread: 1,
            particleSize: 0.02,
            particleShapeAttraction: 0.85,
            screenOpacity: 0.93,
            screenBrightness: 1.45,
            screenSaturation: 1.81,
            screenRgbEffect: 1,
            screenScanline: 1,
            ambientParticleAmount: 1000,
            ambientParticleSize: 0.015,
            carpetIntensity: 1,
            carpetAmplitude: 0.22,
            carpetWavelength: 2.55,
            carpetSpeed: 1.25,
            carpetDirection: 28,
            carpetEdgeCurl: 0.18,
            carpetHoverLift: 0.28,
            carpetHoverRadius: 1.12,
            carpetTextureBrightness: 1.3,
            carpetHueShift: 0,
            carpetSilkSheen: 1,
            carpetSilkSheenOpacity: 0.5,
            carpetHighlightOpacity: 0,
            carpetFringeSwing: 0.22,
            carpetFringeDensity: 5,
            carpetFringeLength: 0.08,
            carpetFringeStiffness: 0.62,
            carpetFringeGravity: 0.42,
            carpetSelfCollision: true,
            carpetCollisionThickness: 0.2,
            carpetRugStretch: 0.18,
            carpetFringeStretch: 0.1,
            hourglassTimerSeconds: 60,
            hourglassGlassOpacity: 0.55,
            hourglassTint: 1,
            hourglassStreamThickness: 0.42,
            hourglassStreamOverlap: 0.135,
            hourglassWallThickness: 0.06,
            hourglassFlare: 0.45,
            hourglassNeck: 0.46,
            hourglassAperture: 0.2,
            hourglassCurve: 1.21,
            hourglassSandSpeed: 1,
            hourglassColumns: true
        };
        const defaultVisualSettings = { ...visualSettings };
        const defaultProjectSettings = Object.fromEntries(Object.entries(projectSettings).map(([key, value]) => [key, { ...value }]));

        const initialProjectText = Object.fromEntries(projectCards.map((card) => {
            const key = card.dataset.projectCard;
            return [key, card.querySelector(".project-copy")?.textContent.trim() || ""];
        }));
        const projectTextVersion = "2026-05-23-expanded-copy";
        function readStoredProjectText() {
            try {
                if (localStorage.getItem("pouya-ai-project-text-version") !== projectTextVersion) {
                    localStorage.removeItem("pouya-ai-project-text");
                    localStorage.setItem("pouya-ai-project-text-version", projectTextVersion);
                }
                return JSON.parse(localStorage.getItem("pouya-ai-project-text") || "{}") || {};
            } catch (error) {
                localStorage.removeItem("pouya-ai-project-text");
                return {};
            }
        }

        const projectText = {
            ...initialProjectText,
            ...readStoredProjectText()
        };

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x010105, 0.024);

        const camera = new THREE.PerspectiveCamera(43, window.innerWidth / window.innerHeight, 0.1, 140);
        camera.position.set(0, 2.45, 8.9);
        scene.add(camera);
        const cameraTarget = new THREE.Vector3(0.35, 0.1, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(preferredPixelRatio());
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.12;
        root.appendChild(renderer.domElement);

        const composer = null;
        let bloomPass = null;
        let chromaticPass = null;
        let useComposerRender = false;
        let roomEnvironmentTexture = null;
        let roomEnvironmentLoadPromise = null;

        async function ensureRoomEnvironmentTexture() {
            if (roomEnvironmentTexture) return roomEnvironmentTexture;
            if (roomEnvironmentLoadPromise) return roomEnvironmentLoadPromise;
            roomEnvironmentLoadPromise = import("three/addons/environments/RoomEnvironment.js")
                .then(({ RoomEnvironment }) => {
                    const pmremGenerator = new THREE.PMREMGenerator(renderer);
                    roomEnvironmentTexture = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;
                    pmremGenerator.dispose();
                    return roomEnvironmentTexture;
                })
                .catch((error) => {
                    roomEnvironmentLoadPromise = null;
                    console.warn("Room environment failed to load.", error);
                    return null;
                });
            return roomEnvironmentLoadPromise;
        }

        scene.environment = null;

        let orbitControls = {
            enabled: false,
            target: cameraTarget.clone(),
            update() {}
        };
        let orbitControlsReady = false;
        let orbitControlsLoadPromise = null;

        async function ensureOrbitControls() {
            if (orbitControlsReady) return orbitControls;
            if (orbitControlsLoadPromise) return orbitControlsLoadPromise;
            orbitControlsLoadPromise = import("three/addons/controls/OrbitControls.js")
                .then(({ OrbitControls }) => {
                    const controls = new OrbitControls(camera, renderer.domElement);
                    controls.enableDamping = true;
                    controls.dampingFactor = 0.08;
                    controls.target.copy(orbitControls.target);
                    controls.maxPolarAngle = Math.PI * 0.5;
                    controls.minDistance = 2.5;
                    controls.maxDistance = 30;
                    controls.enabled = sceneMode && !scenePageVisible;
                    orbitControls = controls;
                    orbitControlsReady = true;
                    return orbitControls;
                })
                .catch((error) => {
                    orbitControlsLoadPromise = null;
                    console.warn("Orbit controls failed to load.", error);
                    return orbitControls;
                });
            return orbitControlsLoadPromise;
        }

        function makeTransformControlsShim() {
            return {
                enabled: false,
                visible: false,
                size: 0.74,
                mode: "translate",
                setMode(mode) { this.mode = mode; },
                getMode() { return this.mode; },
                setSize(size) { this.size = size; },
                attach() {},
                detach() {},
                addEventListener() {},
                setTranslationSnap() {},
                setRotationSnap() {},
                setScaleSnap() {}
            };
        }

        let transformControls = makeTransformControlsShim();
        let transformControlsReady = false;
        let transformControlsLoadPromise = null;
        let editorRuntimePromise = null;

        async function ensureTransformControls() {
            if (transformControlsReady) return transformControls;
            if (transformControlsLoadPromise) return transformControlsLoadPromise;
            transformControlsLoadPromise = import("three/addons/controls/TransformControls.js")
                .then(({ TransformControls }) => {
                    const controls = new TransformControls(camera, renderer.domElement);
                    controls.setMode(transformControls.getMode());
                    controls.setSize(transformControls.size || 0.74);
                    controls.visible = sceneMode && Boolean(selectedObject);
                    controls.enabled = sceneMode && !scenePageVisible;
                    scene.add(controls);
                    transformControls = controls;
                    transformControlsReady = true;
                    installTransformControlEvents(controls);
                    if (selectedObject && !selectedObject.userData.editorLocked && !selectedObject.userData.editorHidden) controls.attach(selectedObject);
                    return transformControls;
                })
                .catch((error) => {
                    transformControlsLoadPromise = null;
                    console.warn("Transform controls failed to load.", error);
                    return transformControls;
                });
            return transformControlsLoadPromise;
        }

        function ensureDevControls() {
            return Promise.all([ensureOrbitControls(), ensureTransformControls()]);
        }

        function ensureEditorRuntime() {
            editorRuntimePromise ||= import("./portfolio-editor-runtime.js").then(({ installEditorTimelineInteractions, installEditorKeyboardInteractions }) => {
                installEditorTimelineInteractions({
                    cameraTrack: timelineTrack,
                    pageTrack: pageTimelineTrack,
                    setCameraProgress: setCameraTimelineProgress,
                    setPageProgress: setPageTimelineProgress,
                    progressFromEvent: progressFromTimelineEvent
                });
                installEditorKeyboardInteractions({
                    isDevEnabled: () => devModeEnabled,
                    isSceneMode: () => sceneMode,
                    setShiftDown: (active) => { shiftDown = active; },
                    toggleSceneMode: () => setSceneMode(!sceneMode),
                    toggleSettings: () => setSettingsOpen(!settingsOpen),
                    togglePageEditor: () => setPageEditorMode(!pageEditorActive),
                    togglePerformanceOverlay: () => {
                        perfOverlayActive = !perfOverlayActive;
                        document.body.classList.toggle("perf-overlay-active", perfOverlayActive);
                        perfLastStamp = performance.now();
                        perfFrames = 0;
                    },
                    setScenePageVisible,
                    toggleSceneLayoutPreview: () => setSceneLayoutPreview(!sceneLayoutPreview),
                    runUndo,
                    runRedo,
                    setTransformMode,
                    deleteSelectedObject,
                    closeSceneMode: () => setSceneMode(false),
                    resizeTransformControl: (delta) => transformControls.setSize(Math.max(0.35, transformControls.size + delta))
                });
            }).catch((error) => {
                editorRuntimePromise = null;
                console.warn("Editor runtime failed to load.", error);
            });
            return editorRuntimePromise;
        }

        const titleGroup = new THREE.Group();
        titleGroup.name = "Pouya AI Liquid Glass Title";
        camera.add(titleGroup);

        const environmentGroup = new THREE.Group();
        environmentGroup.name = "Portfolio Environment";
        scene.add(environmentGroup);

        const projectionStage = new THREE.Group();
        projectionStage.name = "Project Stage";
        environmentGroup.add(projectionStage);

        const editableRoot = new THREE.Group();
        editableRoot.name = "Editable Objects";
        environmentGroup.add(editableRoot);

        const selectableObjects = [];
        const editableObjects = [];
        const multiSelectedObjects = new Set();
        const assetObjects = new Map();
        const projectObjects = new Map(projectKeys.map((key) => [key, []]));
        const interactiveProjectionRoots = new Set();
        const fadeMaterials = new Set();
        const actionStack = [];
        const redoStack = [];
        const cameraKeyframes = [];
        const defaultCameraKeyframes = [{"time":0,"project":"geo","position":[-1.3388356455678396,2.318299550152833,7.757070538703596],"target":[1.7800000000000002,0.5468,0.047200000000000006]},{"time":0.09712230215827339,"project":"geo","position":[3.5577044357761505,1.8077719926915148,9.213676774938596],"target":[1.7800000000000002,0.5468,0.047200000000000006]},{"time":0.2302158273381295,"project":"iran","position":[6.475943857541054,2.148476733207479,-5.789316327895974],"target":[2.6653201149928134,0.5507657557824456,0.6914155352357116]},{"time":0.3105515587529976,"project":"iran","position":[-3.9758131077091257,2.2792940757538327,-3.669673191694088],"target":[2.7440438274587935,0.77511288612861,-0.16393790555797638]},{"time":0.387,"project":"history","position":[-3.048295183166745,1.5897251292444605,4.410159494275501],"target":[2.8318531944421994,1.0253523487143392,-1.1180093261052388]},{"time":0.592,"project":"timeline","position":[5.908335597003093,5.772866705867747,-1.6057663738759864],"target":[2.0051865772202566,1.77202907047011,0.5176366684245781]},{"time":0.6966426858513189,"project":"timeline","position":[-5.587973029527567,3.4601515089094965,-8.1517279614401],"target":[2.0051865772202566,1.77202907047011,0.5176366684245781]},{"time":0.7577937649880095,"project":"timeline","position":[-7.757096960455764,3.342787609231923,6.700543818986134],"target":[1.6738873484695593,1.788869991029308,0.04429951255453572]},{"time":0.8405275779376499,"project":"animations","position":[1.092017159632582,3.9791507065310325,9.526161669786013],"target":[1.1641208046317293,2.2926366858410514,0.19060862308492743]},{"time":0.994,"project":"animations","position":[17.338368238461996,2.236206461366132,9.771657016464822],"target":[1.3193382350701885,1.2689991671523897,0.6068869711346812]}];
        const mobileDefaultCameraKeyframes = [
            { time: 0, project: "geo", position: [-1.7050619280611667, 2.1576350799596753, 12.372100926258154], target: [0.969228835982101, -0.7431213061411635, 0.1750916532216472] },
            { time: 0.2, project: "iran", position: [9.664245797799687, 4.598921579645133, 11.745001232921837], target: [1.0276518306392683, -0.4666624008900394, 0.6407762320212628] },
            { time: 0.4, project: "history", position: [11.503138707695461, 1.3061601169038017, 2.2386826010974286], target: [2.5461750080682095, -0.14694887952181795, 1.4036836781833335] },
            { time: 0.6, project: "timeline", position: [14.585349292368797, 0.360448810035354, 4.238936731003878], target: [1.9690150567917446, -0.41779690170461814, 1.3289441795037182] },
            { time: 0.8, project: "animations", position: [0.43705493947790686, 2.8910937108650074, 11.007094607135345], target: [1.2799088755592176, 0.7951259550813465, 1.1654222588017318] },
            { time: 1, project: "animations", position: [-5.954362701366389, 2.959029055953651, 7.86951327281161], target: [1.2799088755592174, 0.7951259550813466, 1.1654222588017322] }
        ];
        let selectedObject = null;
        let snapEnabled = false;
        let sceneMode = false;
        let settingsOpen = false;
        let transformStart = null;
        let transformDragging = false;
        let shiftDown = false;
        let cameraPlaying = false;
        let cameraPlayStart = 0;
        let cameraPlayOffset = 0;
        let currentTitleOpacity = 1;
        let currentEnvironmentOpacity = 0;
        let currentStageReveal = 0;
        let currentProjectionProgress = 0;
        let pointerTarget = { x: 0, y: 0 };
        let pointerCurrent = { x: 0, y: 0 };
        let hoverPulse = 0;
        let scenePageVisible = false;
        let sceneLayoutPreview = false;
        let projectionFloat = 0;
        let projectionExitProgress = 0;
        let cameraIntroProgress = 0;
        let hoveredInteractive = null;
        let grabbedProjection = null;
        let draggedCarpet = null;
        let draggedCarpetNode = -1;
        let activeInteractionPointerId = null;
        let activeInteractionPointerTarget = null;
        const activeTouchPointers = new Set();
        const carpetDragTarget = new THREE.Vector3();
        const carpetDragPlane = new THREE.Plane();
        let grabStartX = 0;
        let grabStartY = 0;
        let grabStartRotation = 0;
        let grabStartRotations = { x: 0, y: 0, z: 0 };
        const grabStartQuaternion = new THREE.Quaternion();
        let grabLastX = 0;
        let grabLastY = 0;
        let grabLastTime = 0;
        const grabMovePlane = new THREE.Plane();
        const grabMoveWorld = new THREE.Vector3();
        const grabLastPosition = new THREE.Vector3();
        const lampDefaultPosition = new THREE.Vector3(2.55, -0.76, 0.45);
        const lampProjectionOffset = new THREE.Vector3();
        const lampProjectionOffsetTarget = new THREE.Vector3();
        let multiTransformStart = null;
        let selectedCameraKeyframe = -1;
        let cameraThirdPerson = false;
        let currentAnimationIndex = 0;
        let screenHover = 0;
        let hourglassFlipTarget = 0;
        let hourglassFlipProgress = 0;
        let devModeEnabled = false;
        let devUnlockBuffer = "";
        let pageEditorActive = false;
        let pageElementCounter = 0;
        let selectedPageElementId = "";
        let pageEditorDrag = null;
        let pageInputBefore = null;
        let repairingPageSelection = false;
        let perfOverlayActive = false;
        let perfLastStamp = performance.now();
        let perfFrames = 0;
        let perfFpsValue = 0;
        const pageElements = new Map();
        const pageEditorFrames = new Map();
        const mobileDevCorners = [];

        const ambientLight = new THREE.HemisphereLight(0x527cff, 0x090018, 0.28);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xbfd8ff, 3.1);
        keyLight.name = "Blackhole Top Light";
        keyLight.position.set(-1.8, 8.5, 4.8);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.camera.left = -9;
        keyLight.shadow.camera.right = 9;
        keyLight.shadow.camera.top = 9;
        keyLight.shadow.camera.bottom = -9;
        keyLight.shadow.camera.near = 0.5;
        keyLight.shadow.camera.far = 28;
        keyLight.shadow.bias = -0.00012;
        scene.add(keyLight);

        const hologramLight = new THREE.PointLight(0x61f5ff, 5.8, 12);
        hologramLight.name = "Hologram Glow Light";
        hologramLight.position.set(0.88, 0.55, 0.15);
        scene.add(hologramLight);

        const lampGoldLight = new THREE.PointLight(0xf5c977, 1.6, 7);
        lampGoldLight.name = "Lamp Warm Light";
        lampGoldLight.position.set(2.45, -0.28, 0.58);
        scene.add(lampGoldLight);

        const violetLight = new THREE.PointLight(0xa78bfa, 2.2, 10);
        violetLight.name = "Purple Particle Light";
        violetLight.position.set(1.15, 0.28, -0.18);
        scene.add(violetLight);

        function registerFadeMaterial(material, baseOpacity = material.opacity ?? 1) {
            material.transparent = true;
            material.userData.baseOpacity = baseOpacity;
            fadeMaterials.add(material);
            return material;
        }

        function makeLiquidGlass3DMaterial(options = {}) {
            return new THREE.MeshPhysicalMaterial({
                color: options.color ?? 0xf7fbff,
                roughness: options.roughness ?? 0.018,
                metalness: 0,
                transparent: true,
                opacity: options.opacity ?? 0.84,
                transmission: options.transmission ?? 0.82,
                thickness: options.thickness ?? 2.8,
                ior: options.ior ?? 1.58,
                dispersion: options.dispersion ?? 0.36,
                reflectivity: 1,
                clearcoat: 1,
                clearcoatRoughness: 0.015,
                iridescence: options.iridescence ?? 0.26,
                iridescenceIOR: 1.36,
                iridescenceThicknessRange: [80, 280],
                envMapIntensity: options.envMapIntensity ?? 6.2,
                attenuationColor: new THREE.Color(options.attenuationColor ?? 0xdbeaff),
                attenuationDistance: options.attenuationDistance ?? 1.8,
                emissive: new THREE.Color(options.emissive ?? 0x8bbcff),
                emissiveIntensity: options.emissiveIntensity ?? 0.055,
                depthWrite: false,
                side: THREE.DoubleSide
            });
        }

        function makeGlassMaterial() {
            return makeLiquidGlass3DMaterial();
        }

        function createLiquidGlassPanel3D(width = 1.6, height = 0.9, options = {}) {
            const panel = new THREE.Group();
            panel.name = options.name || "Liquid Glass 3D Panel";
            const slab = new THREE.Mesh(
                new THREE.BoxGeometry(width, height, options.depth ?? 0.04, 8, 8, 1),
                makeLiquidGlass3DMaterial({
                    opacity: options.opacity ?? 0.56,
                    thickness: options.thickness ?? 1.2,
                    envMapIntensity: options.envMapIntensity ?? 4.6,
                    dispersion: options.dispersion ?? 0.28
                })
            );
            panel.add(slab);
            const rim = new THREE.LineSegments(
                new THREE.EdgesGeometry(slab.geometry, 22),
                new THREE.LineBasicMaterial({
                    color: options.rimColor ?? 0xeaf7ff,
                    transparent: true,
                    opacity: options.rimOpacity ?? 0.44,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                })
            );
            rim.name = "Liquid Glass Chromatic Rim";
            rim.scale.set(1.006, 1.006, 1.006);
            panel.add(rim);
            return panel;
        }

        function makeHologramMaterial(color = 0x61f5ff, opacity = 0.46) {
            return new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                side: THREE.DoubleSide
            });
        }

        function hexToColor(value) {
            return new THREE.Color(value || "#61f5ff");
        }

        function getProjectSetting(projectKey) {
            return projectSettings[projectKey] || projectSettings.geo;
        }

        function makeProjectHologramMaterial(projectKey, opacityMultiplier = 1, options = {}) {
            const setting = getProjectSetting(projectKey);
            return new THREE.MeshBasicMaterial({
                color: hexToColor(setting.color),
                transparent: true,
                opacity: setting.opacity * opacityMultiplier,
                wireframe: Boolean(options.wireframe),
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                side: THREE.DoubleSide
            });
        }

        function applyProjectMaterial(rootObject, projectKey, options = {}) {
            const quality = effectiveQualityPreset();
            rootObject.traverse((child) => {
                if (!child.isMesh) return;
                child.material = makeProjectHologramMaterial(projectKey, options.opacityMultiplier ?? 1, options);
                child.material.userData.projectKey = projectKey;
                child.material.userData.baseOpacity = child.material.opacity;
                child.material.userData.opacityMultiplier = options.opacityMultiplier ?? 1;
                child.castShadow = quality === "high" || quality === "cinematic";
                child.receiveShadow = false;
                child.frustumCulled = true;
            });
        }

        function addEdgeOverlay(rootObject, projectKey, threshold = 18, opacityMultiplier = 0.6) {
            const quality = effectiveQualityPreset();
            if (quality === "lowest") return;
            const maxEdgeMeshes = quality === "low" ? 1 : quality === "medium" ? 2 : quality === "high" ? 4 : Infinity;
            let added = 0;
            const setting = getProjectSetting(projectKey);
            rootObject.traverse((child) => {
                if (added >= maxEdgeMeshes) return;
                if (!child.isMesh || child.userData.edgeOverlay) return;
                const vertexCount = child.geometry?.attributes?.position?.count || 0;
                if (quality !== "cinematic" && vertexCount > (quality === "medium" ? 90000 : 50000)) return;
                const edges = new THREE.LineSegments(
                    new THREE.EdgesGeometry(child.geometry, quality === "low" ? threshold + 14 : quality === "medium" ? threshold + 8 : threshold),
                    new THREE.LineBasicMaterial({
                        color: hexToColor(setting.color),
                        transparent: true,
                        opacity: setting.opacity * opacityMultiplier,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false
                    })
                );
                edges.name = `${child.name || "Mesh"} hologram edges`;
                edges.userData.projectKey = projectKey;
                edges.userData.baseOpacity = setting.opacity * opacityMultiplier;
                edges.material.userData.projectKey = projectKey;
                edges.material.userData.baseOpacity = setting.opacity * opacityMultiplier;
                edges.material.userData.opacityMultiplier = opacityMultiplier;
                child.add(edges);
                child.userData.edgeOverlay = edges;
                added += 1;
            });
        }

        function addIranHeartbeat(material, center = new THREE.Vector3()) {
            material.userData.iranHeartbeat = { value: 0 };
            material.userData.iranGrabBoost = { value: 0 };
            material.onBeforeCompile = (shader) => {
                shader.uniforms.uIranBeat = material.userData.iranHeartbeat;
                shader.uniforms.uIranGrabBoost = material.userData.iranGrabBoost;
                shader.vertexShader = shader.vertexShader
                    .replace("#include <common>", "#include <common>\nvarying float vIranRadius;")
                    .replace("#include <begin_vertex>", `#include <begin_vertex>
                        vIranRadius = length(position.xy - vec2(${center.x.toFixed(4)}, ${center.y.toFixed(4)}));`);
                shader.fragmentShader = shader.fragmentShader
                    .replace("#include <common>", "#include <common>\nvarying float vIranRadius;\nuniform float uIranBeat;\nuniform float uIranGrabBoost;")
                    .replace("#include <dithering_fragment>", `
                        float beatPhase = fract(uIranBeat);
                        float beepA = exp(-pow((beatPhase - 0.10) / 0.052, 2.0));
                        float beepB = exp(-pow((beatPhase - 0.29) / 0.062, 2.0));
                        float heartbeat = beepA + beepB * 0.86;
                        float iranWave = fract(beatPhase - vIranRadius * 0.72);
                        float iranFront = smoothstep(0.0, 0.10, iranWave) * (1.0 - smoothstep(0.13, 0.31, iranWave));
                        float iranPulse = 0.66 + iranFront * heartbeat * (0.7 + uIranGrabBoost * 0.38) + heartbeat * 0.18;
                        gl_FragColor.a *= iranPulse;
                        gl_FragColor.rgb *= 0.82 + iranFront * heartbeat * 0.48;
                        #include <dithering_fragment>`);
            };
            material.needsUpdate = true;
        }

        function setProjectColor(projectKey, colorValue) {
            const setting = getProjectSetting(projectKey);
            setting.color = colorValue;
            const color = hexToColor(colorValue);
            projectCards.find((card) => card.dataset.projectCard === projectKey)
                ?.style.setProperty("--project-title-glow", colorToRgbTriplet(color));
            assetObjects.forEach((object) => {
                object.traverse((child) => {
                    if (child.material?.userData?.projectKey === projectKey && child.material.color) {
                        child.material.color.copy(color);
                    }
                });
            });
        }

        function setProjectOpacity(projectKey, opacity) {
            getProjectSetting(projectKey).opacity = opacity;
            assetObjects.forEach((object) => {
                object.traverse((child) => {
                    if (child.material?.userData?.projectKey === projectKey) {
                        const multiplier = child.material.userData.opacityMultiplier ?? 1;
                        child.material.userData.baseOpacity = opacity * multiplier;
                    }
                });
            });
        }

        function createShapeParticleCloud(rootObject, projectKey, maxPoints = 820) {
            const quality = effectiveQualityPreset();
            if (quality === "lowest") return null;
            const qualityFactor = quality === "low" ? 0.42 : quality === "medium" ? 0.68 : quality === "high" ? 0.84 : 1;
            maxPoints = Math.max(64, Math.floor(maxPoints * qualityFactor * Number(visualSettings.performanceParticles ?? 1)));
            const rootInverse = new THREE.Matrix4();
            rootObject.updateMatrixWorld(true);
            rootInverse.copy(rootObject.matrixWorld).invert();
            const samples = [];
            rootObject.traverse((child) => {
                if (!child.isMesh || !child.geometry?.attributes?.position) return;
                const position = child.geometry.attributes.position;
                const step = Math.max(1, Math.floor(position.count / Math.max(90, maxPoints / 2)));
                for (let i = 0; i < position.count; i += step) {
                    const v = new THREE.Vector3().fromBufferAttribute(position, i);
                    child.localToWorld(v);
                    v.applyMatrix4(rootInverse);
                    samples.push(v);
                    if (samples.length >= maxPoints) break;
                }
            });
            if (!samples.length) return null;
            while (samples.length < maxPoints) samples.push(samples[Math.floor(Math.random() * samples.length)].clone());
            const geometry = new THREE.BufferGeometry();
            const base = new Float32Array(maxPoints * 3);
            const drift = new Float32Array(maxPoints * 3);
            const seeds = new Float32Array(maxPoints);
            for (let i = 0; i < maxPoints; i += 1) {
                const v = samples[i % samples.length];
                base[i * 3] = v.x;
                base[i * 3 + 1] = v.y;
                base[i * 3 + 2] = v.z;
                const d = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(0.15 + Math.random() * 0.68);
                drift[i * 3] = d.x;
                drift[i * 3 + 1] = d.y;
                drift[i * 3 + 2] = d.z;
                seeds[i] = Math.random();
            }
            geometry.setAttribute("position", new THREE.BufferAttribute(base, 3));
            geometry.setAttribute("aBase", new THREE.BufferAttribute(base, 3));
            geometry.setAttribute("aDrift", new THREE.BufferAttribute(drift, 3));
            geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uColor: { value: hexToColor(getProjectSetting(projectKey).color) },
                    uDisperse: { value: 0 },
                    uOpacity: { value: 0 },
                    uTime: { value: 0 },
                    uPointSize: { value: 0.028 }
                },
                vertexShader: `
                    attribute vec3 aBase;
                    attribute vec3 aDrift;
                    attribute float aSeed;
                    uniform float uDisperse;
                    uniform float uTime;
                    uniform float uPointSize;
                    varying float vHalo;
                    void main() {
                        float pulse = sin(uTime * 2.3 + aSeed * 18.0) * 0.035;
                        vec3 formed = aBase + aDrift * uDisperse;
                        formed += vec3(pulse, pulse * 0.5, sin(uTime * 1.7 + aSeed * 11.0) * 0.02 * uDisperse);
                        vec4 mvPosition = modelViewMatrix * vec4(formed, 1.0);
                        gl_Position = projectionMatrix * mvPosition;
                        gl_PointSize = clamp(uPointSize * 980.0 / max(-mvPosition.z, 1.0), 1.0, 8.0);
                        vHalo = 0.72 + fract(aSeed * 17.0) * 0.28;
                    }
                `,
                fragmentShader: `
                    uniform vec3 uColor;
                    uniform float uOpacity;
                    varying float vHalo;
                    void main() {
                        vec2 p = gl_PointCoord - 0.5;
                        float halo = smoothstep(0.5, 0.03, length(p));
                        if (halo <= 0.01) discard;
                        gl_FragColor = vec4(uColor, halo * uOpacity * vHalo);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            material.userData.projectKey = projectKey;
            material.userData.baseOpacity = 0.8;
            const cloud = new THREE.Points(geometry, material);
            cloud.name = `${rootObject.name} dissolve particle map`;
            cloud.userData.base = base;
            cloud.userData.projectKey = projectKey;
            cloud.visible = false;
            rootObject.add(cloud);
            rootObject.userData.shapeCloud = cloud;
            return cloud;
        }

        function updateShapeCloud(rootObject, alpha, elapsed) {
            const cloud = rootObject?.userData?.shapeCloud;
            if (!cloud) return;
            if (effectiveQualityPreset() === "lowest") {
                cloud.visible = false;
                return;
            }
            const transitionAmount = clamp((1 - alpha) * 1.6);
            const visible = alpha > 0.025 && alpha < 0.98;
            cloud.visible = visible;
            if (!visible) {
                cloud.material.uniforms.uOpacity.value = 0;
                return;
            }
            const disperse = smoothstep(transitionAmount);
            cloud.material.uniforms.uColor.value.copy(hexToColor(getProjectSetting(cloud.userData.projectKey).color));
            cloud.material.uniforms.uDisperse.value = disperse;
            cloud.material.uniforms.uTime.value = elapsed;
            cloud.material.uniforms.uPointSize.value = visualSettings.particleSize * 0.82;
            cloud.material.uniforms.uOpacity.value = visualSettings.particleOpacity * Math.sin(clamp(alpha) * Math.PI) * 0.78;
        }

        const grid = new THREE.GridHelper(64, 64, 0xffffff, 0xffffff);
        grid.name = "White Floor Grid";
        grid.position.y = -1.18;
        grid.material.transparent = true;
        grid.material.opacity = 0.13;
        grid.material.depthWrite = false;
        registerFadeMaterial(grid.material, 0.13);
        environmentGroup.add(grid);

        const floorMaterial = registerFadeMaterial(new THREE.MeshPhysicalMaterial({
            color: 0x090d14,
            roughness: 0.56,
            metalness: 0,
            transparent: true,
            opacity: 0.28,
            side: THREE.DoubleSide
        }), 0.28);
        const floorPlane = new THREE.Mesh(new THREE.PlaneGeometry(64, 64), floorMaterial);
        floorPlane.name = "Optional Solid Floor";
        floorPlane.rotation.x = -Math.PI / 2;
        floorPlane.position.y = -1.205;
        floorPlane.receiveShadow = true;
        floorPlane.visible = false;
        environmentGroup.add(floorPlane);

        const cubeMaterial = registerFadeMaterial(new THREE.MeshPhysicalMaterial({
            color: 0x7db5ff,
            roughness: 0.22,
            metalness: 0.08,
            clearcoat: 0.65,
            transparent: true,
            opacity: 0.78
        }), 0.78);

        const cube = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.05, 1.05), cubeMaterial);
        cube.name = "Test Cube";
        cube.position.set(-2.15, -0.62, -0.4);
        cube.castShadow = true;
        cube.receiveShadow = true;
        cube.visible = false;
        cube.userData.selectableRoot = cube;
        cube.userData.assetId = "cube";
        cube.userData.editable = true;
        cube.userData.hideInPresentation = true;
        editableRoot.add(cube);
        registerEditable(cube);

        const selectionRing = new THREE.Mesh(
            new THREE.RingGeometry(1.05, 1.09, 96),
            registerFadeMaterial(new THREE.MeshBasicMaterial({
                color: 0x61f5ff,
                transparent: true,
                opacity: 0.34,
                side: THREE.DoubleSide,
                depthWrite: false
            }), 0.34)
        );
        selectionRing.rotation.x = -Math.PI / 2;
        selectionRing.position.y = -1.16;
        selectionRing.visible = false;
        environmentGroup.add(selectionRing);

        const cameraRig = new THREE.Group();
        cameraRig.name = "Director Camera Rig";
        cameraRig.userData.assetId = "camera-rig";
        cameraRig.userData.selectableRoot = cameraRig;
        cameraRig.userData.editable = true;
        const cameraRigBody = new THREE.Mesh(
            new THREE.ConeGeometry(0.18, 0.36, 4),
            new THREE.MeshBasicMaterial({
                color: 0x61f5ff,
                transparent: true,
                opacity: 0.36,
                wireframe: true,
                blending: THREE.AdditiveBlending
            })
        );
        cameraRigBody.rotation.x = Math.PI / 2;
        cameraRigBody.userData.selectableRoot = cameraRig;
        cameraRig.add(cameraRigBody);
        cameraRig.visible = false;
        editableRoot.add(cameraRig);

        function createSparkleTexture() {
            const canvas = document.createElement("canvas");
            canvas.width = 128;
            canvas.height = 128;
            const ctx = canvas.getContext("2d");
            const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 58);
            gradient.addColorStop(0, "rgba(255,255,255,1)");
            gradient.addColorStop(0.13, "rgba(202,226,255,0.9)");
            gradient.addColorStop(0.34, "rgba(116,185,255,0.28)");
            gradient.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 128, 128);
            ctx.strokeStyle = "rgba(255,255,255,0.85)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(64, 13);
            ctx.lineTo(64, 115);
            ctx.moveTo(13, 64);
            ctx.lineTo(115, 64);
            ctx.stroke();
            const texture = new THREE.CanvasTexture(canvas);
            texture.colorSpace = THREE.SRGBColorSpace;
            return texture;
        }

        const sparkleTexture = createSparkleTexture();
        const titleSparkles = [];

        function addTitleSparkle(x, y, z, scale) {
            const material = new THREE.SpriteMaterial({
                map: sparkleTexture,
                color: 0xeaf4ff,
                transparent: true,
                opacity: 0.5,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const sprite = new THREE.Sprite(material);
            sprite.position.set(x, y, z);
            sprite.scale.set(scale, scale, 1);
            titleGroup.add(sprite);
            titleSparkles.push({ sprite, baseScale: scale });
        }

        [
            [-2.75, -0.28, 0.25, 0.28],
            [-1.4, -0.1, 0.28, 0.19],
            [0.2, -0.35, 0.3, 0.24],
            [1.6, -0.14, 0.25, 0.22],
            [2.75, -0.28, 0.22, 0.3]
        ].forEach((p) => addTitleSparkle(...p));

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        const gltfLoader = new GLTFLoader();
        let meshoptDecoderPromise = null;
        const textureLoader = new THREE.TextureLoader();

        const spoutOrigin = new THREE.Vector3(2.04, -0.68, 0.42);
        const lampSpoutLocal = new THREE.Vector3(-0.51, 0.4, -0.06);
        const geoCenter = new THREE.Vector3(2.12, 0.88, 0.02);
        const iranCenter = new THREE.Vector3(2.14, 0.82, 0.02);
        const historyCenter = new THREE.Vector3(2.1, 0.52, 0.02);
        const timelineCenter = new THREE.Vector3(2.1, 1.72, 0.04);
        const animationsCenter = new THREE.Vector3(2.08, 2.72, 0.0);
        const projectCenters = {
            geo: geoCenter,
            iran: iranCenter,
            history: historyCenter,
            timeline: timelineCenter,
            animations: animationsCenter
        };

        const flowCount = 520;
        const flowGeometry = new THREE.BufferGeometry();
        const flowPositions = new Float32Array(flowCount * 3);
        const flowColors = new Float32Array(flowCount * 3);
        const flowTargets = new Float32Array(flowCount * 3);
        const flowSeedsBuffer = new Float32Array(flowCount * 4);
        const flowSeeds = [];

        function activeProjectKey() {
            return projectKeys[Math.round(clamp(projectionFloat, 0, projectKeys.length - 1))] || "geo";
        }

        function activeProjectionAlpha() {
            return Math.max(...projectKeys.map((_, index) => alphaForProject(index)));
        }

        function particleColorForProject(projectKey, accentRoll = Math.random()) {
            const color = hexToColor(getProjectSetting(projectKey).color);
            const hsl = {};
            color.getHSL(hsl);
            const shade = accentRoll - 0.5;
            color.setHSL(
                (hsl.h + shade * 0.035 + 1) % 1,
                clamp(hsl.s + 0.08 - Math.abs(shade) * 0.05),
                clamp(hsl.l + shade * 0.18 + (accentRoll > 0.94 ? 0.12 : 0))
            );
            return color;
        }

        const chromaticPaletteState = [
            new THREE.Color(0x14265c),
            new THREE.Color(0x7541c5),
            new THREE.Color(0xf5d896)
        ];
        const sampledAnimationPalette = [new THREE.Color(0x61f5ff), new THREE.Color(0x245dff), new THREE.Color(0xf3fbff)];
        const videoPaletteCanvas = document.createElement("canvas");
        videoPaletteCanvas.width = 24;
        videoPaletteCanvas.height = 24;
        const videoPaletteCtx = videoPaletteCanvas.getContext("2d", { willReadFrequently: true });

        const basePalettes = {
            hero: [0x14265c, 0x7541c5, 0xf5d896],
            geo: [0x071024, 0x17224f, 0x7f9cff],
            iran: [0x2a0208, 0x9f0718, 0xff5a62],
            history: [0x3b2405, 0xdb831f, 0xffd595],
            timeline: [0x2e2355, 0xc1a15e, 0xeef8ff],
            animations: sampledAnimationPalette
        };

        function paletteForProject(projectKey) {
            const palette = basePalettes[projectKey] || basePalettes.geo;
            return palette.map((entry) => entry.isColor ? entry.clone() : new THREE.Color(entry));
        }

        function blendedProjectPalette() {
            if (currentProjectionProgress <= 0.002) return paletteForProject("hero");
            const max = projectKeys.length - 1;
            const clamped = clamp(projectionFloat, 0, max);
            const index = Math.min(max - 1, Math.floor(clamped));
            const local = smootherstep(clamp(clamped - index));
            const from = paletteForProject(projectKeys[index]);
            const to = paletteForProject(projectKeys[index + 1]);
            return from.map((color, colorIndex) => color.clone().lerp(to[colorIndex], local));
        }

        function blendedProjectColor() {
            const palette = blendedProjectPalette();
            return palette[1].clone().lerp(palette[2], 0.18);
        }

        function colorToRgbTriplet(color) {
            return `${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}`;
        }

        function updateChromaticCssPalette() {
            const aboutRect = document.querySelector("#about")?.getBoundingClientRect();
            const aboutVisible = aboutRect && aboutRect.top < window.innerHeight * 0.78 && aboutRect.bottom > window.innerHeight * 0.12;
            const target = currentEnvironmentOpacity < 0.08 || aboutVisible ? paletteForProject("hero") : blendedProjectPalette();
            chromaticPaletteState.forEach((color, index) => {
                color.lerp(target[index], 0.045);
                document.documentElement.style.setProperty(`--chromatic-${["a", "b", "c"][index]}`, colorToRgbTriplet(color));
            });
        }

        for (let i = 0; i < flowCount; i += 1) {
            const color = particleColorForProject("geo");
            flowSeeds.push({
                t: Math.random(),
                orbit: Math.random() * Math.PI * 2,
                radius: Math.random(),
                speed: 0.18 + Math.random() * 0.42,
                colorIndex: Math.random() > 0.92 ? 2 : Math.random() > 0.72 ? 1 : 0,
                color,
                cycle: 0
            });
            const c = flowSeeds[i].color;
            flowColors[i * 3] = c.r;
            flowColors[i * 3 + 1] = c.g;
            flowColors[i * 3 + 2] = c.b;
            flowTargets[i * 3] = geoCenter.x;
            flowTargets[i * 3 + 1] = geoCenter.y;
            flowTargets[i * 3 + 2] = geoCenter.z;
            flowSeedsBuffer[i * 4] = flowSeeds[i].t;
            flowSeedsBuffer[i * 4 + 1] = flowSeeds[i].speed;
            flowSeedsBuffer[i * 4 + 2] = flowSeeds[i].radius;
            flowSeedsBuffer[i * 4 + 3] = flowSeeds[i].orbit;
        }
        flowGeometry.setAttribute("position", new THREE.BufferAttribute(flowPositions, 3));
        flowGeometry.setAttribute("color", new THREE.BufferAttribute(flowColors, 3));
        flowGeometry.setAttribute("aTarget", new THREE.BufferAttribute(flowTargets, 3));
        flowGeometry.setAttribute("aSeed", new THREE.BufferAttribute(flowSeedsBuffer, 4));
        const flowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uGuideTarget: { value: geoCenter.clone() },
                uOpacity: { value: 0.82 },
                uShapeAttraction: { value: 0.85 },
                uSize: { value: 0.038 },
                uSpeed: { value: 1 },
                uSpread: { value: 1 },
                uSpout: { value: spoutOrigin.clone() },
                uTime: { value: 0 }
            },
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            vertexShader: `
                attribute vec3 aTarget;
                attribute vec4 aSeed;
                varying vec3 vColor;
                varying float vLife;
                uniform float uTime;
                uniform float uSpeed;
                uniform float uSpread;
                uniform float uSize;
                uniform float uShapeAttraction;
                uniform vec3 uGuideTarget;
                uniform vec3 uSpout;

                float smoothCurve(float t) {
                    return t * t * (3.0 - 2.0 * t);
                }

                void main() {
                    float t = fract(aSeed.x + uTime * aSeed.y * uSpeed);
                    float curved = smoothCurve(t);
                    float formation = smoothCurve(clamp((t - 0.56) / 0.42, 0.0, 1.0)) * uShapeAttraction;
                    vec3 resolvedTarget = mix(uGuideTarget, aTarget, formation);
                    vec3 base = mix(uSpout, resolvedTarget, curved);
                    float wave = aSeed.w + uTime * (2.2 + aSeed.y * 2.0);
                    float turbulence = (0.16 + sin(t * 3.14159265) * 0.22) * uSpread;
                    float radius = (0.03 + aSeed.z * 0.22) * (sin(t * 3.14159265) + 0.15) * (1.0 + turbulence);
                    base.x += cos(wave) * radius;
                    base.y += sin(wave * 1.3) * radius + sin(t * 3.14159265) * 0.22;
                    base.z += sin(wave) * radius;
                    vec4 mvPosition = modelViewMatrix * vec4(base, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    gl_PointSize = clamp(uSize * 1200.0 / max(-mvPosition.z, 1.0), 1.0, 9.0);
                    vLife = sin(t * 3.14159265);
                    vColor = color;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vLife;
                uniform float uOpacity;
                void main() {
                    vec2 p = gl_PointCoord - 0.5;
                    float halo = smoothstep(0.5, 0.03, length(p));
                    if (halo <= 0.01) discard;
                    gl_FragColor = vec4(vColor, halo * uOpacity * max(vLife, 0.12));
                }
            `
        });
        const flowParticles = new THREE.Points(flowGeometry, flowMaterial);
        flowParticles.name = "Lamp Spout Hologram Particles";
        projectionStage.add(flowParticles);

        const ambientParticleCount = 1000;
        const ambientParticleGeometry = new THREE.BufferGeometry();
        const ambientParticlePositions = new Float32Array(ambientParticleCount * 3);
        const ambientParticleColors = new Float32Array(ambientParticleCount * 3);
        const ambientParticleSeeds = [];
        for (let i = 0; i < ambientParticleCount; i += 1) {
            ambientParticlePositions[i * 3] = (Math.random() - 0.5) * 22;
            ambientParticlePositions[i * 3 + 1] = -1.25 + Math.random() * 7.4;
            ambientParticlePositions[i * 3 + 2] = (Math.random() - 0.5) * 14;
            ambientParticleSeeds.push({ x: ambientParticlePositions[i * 3], y: ambientParticlePositions[i * 3 + 1], z: ambientParticlePositions[i * 3 + 2], phase: Math.random() * Math.PI * 2 });
        }
        ambientParticleGeometry.setAttribute("position", new THREE.BufferAttribute(ambientParticlePositions, 3));
        ambientParticleGeometry.setAttribute("color", new THREE.BufferAttribute(ambientParticleColors, 3));
        const ambientParticleMaterial = new THREE.PointsMaterial({
            size: 0.018,
            transparent: true,
            opacity: 0.36,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const ambientParticles = new THREE.Points(ambientParticleGeometry, ambientParticleMaterial);
        ambientParticles.name = "Ambient Chromatic Dust";
        projectionStage.add(ambientParticles);

        const projectionVideo = document.createElement("video");
        projectionVideo.muted = true;
        projectionVideo.loop = false;
        projectionVideo.playsInline = true;
        projectionVideo.crossOrigin = "anonymous";
        projectionVideo.preload = effectiveQualityPreset() === "lowest" ? "none" : "metadata";
        const transitionVideo = projectionVideo.cloneNode();
        transitionVideo.muted = true;
        transitionVideo.loop = false;
        transitionVideo.preload = "none";
        let projectionVideoSource = "";
        let transitionVideoSource = "";
        let pendingAnimationIndex = null;
        let screenTransitionStart = 0;
        let screenTransitionDirection = 1;
        let animationPaused = false;
        let animationAutoAdvanceArmed = true;
        let lastVideoPaletteSample = 0;

        function setProjectionSource(video, index, cachedSource) {
            const nextSource = animationVideoSource(animationVideos[index]);
            if (cachedSource === nextSource) return cachedSource;
            video.pause();
            video.src = nextSource;
            video.load();
            return nextSource;
        }

        function ensureProjectionVideoSource(index = currentAnimationIndex) {
            projectionVideoSource = setProjectionSource(projectionVideo, index, projectionVideoSource);
        }

        projectionVideoSource = animationVideoSource(animationVideos[0]);
        if (effectiveQualityPreset() !== "lowest") {
            projectionVideo.src = projectionVideoSource;
            projectionVideo.load();
        }
        transitionVideoSource = projectionVideoSource;

        const projectionVideoTexture = new THREE.VideoTexture(projectionVideo);
        const transitionVideoTexture = new THREE.VideoTexture(transitionVideo);
        projectionVideoTexture.colorSpace = THREE.SRGBColorSpace;
        transitionVideoTexture.colorSpace = THREE.SRGBColorSpace;

        const screenGroup = new THREE.Group();
        screenGroup.name = "Animation Hologram Screen";
        screenGroup.userData.assetId = "animation-screen";
        screenGroup.userData.selectableRoot = screenGroup;
        screenGroup.userData.editable = true;
        screenGroup.userData.interactiveProject = "animations";
        const screenMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uCurrent: { value: projectionVideoTexture },
                uNext: { value: transitionVideoTexture },
                uTransition: { value: 0 },
                uDirection: { value: 1 },
                uOpacity: { value: visualSettings.screenOpacity },
                uBrightness: { value: visualSettings.screenBrightness },
                uSaturation: { value: visualSettings.screenSaturation },
                uRgbEffect: { value: visualSettings.screenRgbEffect },
                uScanline: { value: visualSettings.screenScanline },
                uTint: { value: new THREE.Color(0xe8fbff) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                uniform sampler2D uCurrent;
                uniform sampler2D uNext;
                uniform float uTransition;
                uniform float uDirection;
                uniform float uOpacity;
                uniform float uBrightness;
                uniform float uSaturation;
                uniform float uRgbEffect;
                uniform float uScanline;
                uniform vec3 uTint;

                vec4 sampleSlide(sampler2D source, vec2 uv) {
                    if (uv.y < 0.0 || uv.y > 1.0) return vec4(0.0);
                    return texture2D(source, uv);
                }

                vec3 grade(vec3 color) {
                    float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
                    return mix(vec3(luma), color, uSaturation) * uBrightness * uTint;
                }

                void main() {
                    float eased = uTransition * uTransition * (3.0 - 2.0 * uTransition);
                    vec2 currentUv = vUv + vec2(0.0, uDirection * eased);
                    vec2 nextUv = vUv + vec2(0.0, uDirection * (eased - 1.0));
                    vec4 currentFrame = sampleSlide(uCurrent, currentUv);
                    vec4 nextFrame = sampleSlide(uNext, nextUv);
                    vec4 frame = currentFrame + nextFrame;
                    float px = 1.0 / 270.0;
                    float r = sampleSlide(uCurrent, currentUv + vec2(px * 1.2 * uRgbEffect, 0.0)).r + sampleSlide(uNext, nextUv + vec2(px * 1.2 * uRgbEffect, 0.0)).r;
                    float g = frame.g;
                    float b = sampleSlide(uCurrent, currentUv - vec2(px * 1.2 * uRgbEffect, 0.0)).b + sampleSlide(uNext, nextUv - vec2(px * 1.2 * uRgbEffect, 0.0)).b;
                    vec3 rgb = mix(frame.rgb, vec3(r, g, b), uRgbEffect);
                    float triad = 0.72 + 0.28 * step(0.33, fract(vUv.x * 270.0 * 3.0));
                    float scan = 1.0 - uScanline * (0.18 * step(0.5, fract(vUv.y * 480.0)) + 0.08 * sin(vUv.y * 1500.0));
                    gl_FragColor = vec4(grade(rgb) * mix(1.0, triad * scan, uRgbEffect), frame.a * uOpacity);
                }
            `,
            transparent: true,
            blending: THREE.NormalBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });
        screenMaterial.userData.projectKey = "animations";
        screenMaterial.userData.baseOpacity = 1;
        const screenPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.28, 2.28), screenMaterial);
        screenPlane.name = "Projected Animation Video Plane";
        screenPlane.userData.selectableRoot = screenGroup;
        screenGroup.add(screenPlane);
        const screenFrame = new THREE.LineSegments(
            new THREE.EdgesGeometry(new THREE.BoxGeometry(1.36, 2.36, 0.025), 8),
            new THREE.LineBasicMaterial({
                color: 0x61f5ff,
                transparent: true,
                opacity: 0.72,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            })
        );
        screenFrame.name = "Holographic Video Screen Frame";
        screenFrame.material.userData.projectKey = "animations";
        screenFrame.material.userData.baseOpacity = 0.72;
        screenGroup.add(screenFrame);
        const screenTetherGeometry = new THREE.BufferGeometry();
        const screenTetherPositions = new Float32Array(4 * 2 * 3);
        screenTetherGeometry.setAttribute("position", new THREE.BufferAttribute(screenTetherPositions, 3));
        const screenTetherFade = new Float32Array(4 * 2);
        screenTetherFade.forEach((_, index) => {
            screenTetherFade[index] = index % 2;
        });
        screenTetherGeometry.setAttribute("aFade", new THREE.BufferAttribute(screenTetherFade, 1));
        const screenTetherMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uColor: { value: new THREE.Color(0x61f5ff) },
                uOpacity: { value: 0 },
                uTime: { value: 0 }
            },
            vertexShader: `
                attribute float aFade;
                varying float vFade;
                void main() {
                    vFade = aFade;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying float vFade;
                uniform vec3 uColor;
                uniform float uOpacity;
                uniform float uTime;
                void main() {
                    float endFade = 1.0 - smoothstep(0.58, 1.0, vFade);
                    float flicker = 0.88 + sin(uTime * 8.0 + vFade * 14.0) * 0.08;
                    gl_FragColor = vec4(uColor, uOpacity * endFade * flicker);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const screenTethers = new THREE.LineSegments(screenTetherGeometry, screenTetherMaterial);
        screenTethers.name = "Animation Screen Spout Tethers";
        screenTethers.visible = false;
        projectionStage.add(screenTethers);

        const sandCount = 360;
        const sandGeometry = new THREE.BufferGeometry();
        const sandPositions = new Float32Array(sandCount * 3);
        const sandSeeds = [];
        for (let i = 0; i < sandCount; i += 1) {
            sandSeeds.push({ x: (Math.random() - 0.5) * 0.26, z: (Math.random() - 0.5) * 0.12, radius: Math.random(), phase: Math.random(), speed: 0.55 + Math.random() * 0.85 });
        }
        sandGeometry.setAttribute("position", new THREE.BufferAttribute(sandPositions, 3));
        const sandMaterial = new THREE.PointsMaterial({
            color: 0xf5c977,
            size: 0.025,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        sandMaterial.userData.projectKey = "timeline";
        sandMaterial.userData.baseOpacity = 0.7;
        const hourglassSand = new THREE.Points(sandGeometry, sandMaterial);
        hourglassSand.name = "Reactive Hourglass Sand";
        const hourglassSandPile = new THREE.Mesh(
            new THREE.SphereGeometry(0.31, 28, 12, 0, Math.PI * 2, 0, Math.PI * 0.5),
            new THREE.MeshBasicMaterial({
                color: 0xf5c977,
                transparent: true,
                opacity: 0.22,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                side: THREE.DoubleSide
            })
        );
        hourglassSandPile.name = "Hourglass Sand Pile";
        hourglassSandPile.scale.set(1, 0.72, 0.46);
        hourglassSandPile.position.y = -0.58;
        hourglassSandPile.material.userData.projectKey = "timeline";
        hourglassSandPile.material.userData.baseOpacity = 0.22;

        function registerEditable(object) {
            if (!editableObjects.includes(object)) editableObjects.push(object);
            if (!selectableObjects.includes(object)) selectableObjects.push(object);
            object.userData.selectableRoot = object;
            object.userData.editable = true;
            if (!object.userData.defaultTransform) object.userData.defaultTransform = snapshotObject(object);
            renderObjectList();
        }

        function registerProjectObject(projectKey, object, options = {}) {
            if (!projectObjects.has(projectKey)) projectObjects.set(projectKey, []);
            projectObjects.get(projectKey).push(object);
            object.userData.projectKey = projectKey;
            object.userData.interactiveProject = options.interactive ? projectKey : object.userData.interactiveProject;
            if (options.interactive) interactiveProjectionRoots.add(object);
        }

        function carpetQualityProfile() {
            const mobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 760;
            const quality = effectiveQualityPreset();
            const detailScale = Number(visualSettings.performanceRugDetail ?? 1);
            const profiles = {
                lowest: {
                    label: "Lowest",
                    segX: 1,
                    segZ: 1,
                    stringPoints: 2,
                    solverIterations: 0,
                    normalsEvery: 999,
                    fringeEvery: 999,
                    fringeBase: 0,
                    fringeMul: 0,
                    fringes: false,
                    shadows: false,
                    fakeShadow: false,
                    selfCollision: false,
                    material: 0,
                    flat: true
                },
                low: {
                    label: "Battery",
                    segX: 18,
                    segZ: 12,
                    stringPoints: 4,
                    solverIterations: 2,
                    normalsEvery: 5,
                    fringeEvery: 3,
                    fringeBase: 28,
                    fringeMul: 7,
                    fringes: false,
                    shadows: false,
                    fakeShadow: true,
                    selfCollision: false,
                    material: 0.16
                },
                medium: {
                    label: "Balanced",
                    segX: mobile ? 22 : 28,
                    segZ: mobile ? 15 : 18,
                    stringPoints: mobile ? 4 : 5,
                    solverIterations: mobile ? 2 : 3,
                    normalsEvery: mobile ? 4 : 3,
                    fringeEvery: mobile ? 2 : 1,
                    fringeBase: mobile ? 36 : 58,
                    fringeMul: mobile ? 9 : 13,
                    fringes: true,
                    shadows: !mobile,
                    fakeShadow: mobile,
                    selfCollision: false,
                    material: 0.48
                },
                high: {
                    label: "Beautiful",
                    segX: mobile ? 26 : 34,
                    segZ: mobile ? 18 : 22,
                    stringPoints: mobile ? 5 : 6,
                    solverIterations: mobile ? 3 : 4,
                    normalsEvery: mobile ? 3 : 2,
                    fringeEvery: 1,
                    fringeBase: mobile ? 46 : 86,
                    fringeMul: mobile ? 11 : 18,
                    fringes: true,
                    shadows: !mobile,
                    fakeShadow: mobile,
                    selfCollision: !mobile,
                    material: 0.78
                },
                cinematic: {
                    label: "Ultra",
                    segX: mobile ? 30 : 38,
                    segZ: mobile ? 20 : 24,
                    stringPoints: mobile ? 5 : 7,
                    solverIterations: mobile ? 3 : 4,
                    normalsEvery: 2,
                    fringeEvery: 1,
                    fringeBase: mobile ? 54 : 105,
                    fringeMul: mobile ? 13 : 23,
                    fringes: true,
                    shadows: !mobile,
                    fakeShadow: mobile,
                    selfCollision: !mobile,
                    material: 1
                }
            };
            const profile = { ...(profiles[quality] || profiles.medium) };
            if (profile.flat) return profile;
            if (detailScale < 0.95) {
                profile.segX = Math.max(12, Math.round(profile.segX * detailScale));
                profile.segZ = Math.max(8, Math.round(profile.segZ * detailScale));
                profile.fringeBase = Math.max(18, Math.round(profile.fringeBase * detailScale));
                profile.fringeMul = Math.max(4, Math.round(profile.fringeMul * detailScale));
                profile.solverIterations = Math.max(1, Math.round(profile.solverIterations * Math.max(0.65, detailScale)));
                if (detailScale < 0.4) profile.fringes = false;
            }
            return profile;
        }

        function makeFlatFlyingCarpet() {
            const group = new THREE.Group();
            group.name = "Flat Persian Carpet";
            const width = 5.7;
            const length = 3.75;
            const geometry = new THREE.BufferGeometry();
            geometry.setIndex([0, 2, 1, 1, 2, 3]);
            geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([
                -width / 2, 0, -length / 2,
                width / 2, 0, -length / 2,
                -width / 2, 0, length / 2,
                width / 2, 0, length / 2
            ]), 3));
            geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([
                1, 0,
                1, 1,
                0, 0,
                0, 1
            ]), 2));
            geometry.computeVertexNormals();
            const texture = textureLoader.load("assets/media/persian-flying-carpet-texture.png", (map) => {
                map.colorSpace = THREE.SRGBColorSpace;
                map.wrapS = THREE.ClampToEdgeWrapping;
                map.wrapT = THREE.ClampToEdgeWrapping;
                map.anisotropy = Math.min(2, renderer.capabilities.getMaxAnisotropy());
                map.needsUpdate = true;
            });
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                color: 0xffffff,
                side: THREE.DoubleSide
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = false;
            mesh.receiveShadow = false;
            mesh.frustumCulled = true;
            mesh.userData.selectableRoot = group;
            group.add(mesh);
            group.position.set(1.45, -0.98, 0.44);
            group.rotation.y = -0.08;
            group.userData.baseScale = group.scale.clone();
            group.userData.selectableRoot = group;
            group.userData.carpet = {
                flat: true,
                mesh,
                material,
                geometry,
                width,
                length,
                segX: 1,
                segZ: 1,
                carpetQuality: carpetQualityProfile(),
                group
            };
            return group;
        }

        function makeFlyingCarpet() {
            if (carpetQualityProfile().flat) return makeFlatFlyingCarpet();
            const group = new THREE.Group();
            group.name = "Flying Persian Carpet";
            const width = 5.7;
            const length = 3.75;
            const carpetQuality = carpetQualityProfile();
            const segX = carpetQuality.segX;
            const segZ = carpetQuality.segZ;
            const stringPoints = carpetQuality.stringPoints;
            const geometry = new THREE.BufferGeometry();
            const count = (segX + 1) * (segZ + 1);
            const positions = new Float32Array(count * 3);
            const normals = new Float32Array(count * 3);
            const uvs = new Float32Array(count * 2);
            const rest = new Float32Array(count * 3);
            const curr = new Float32Array(count * 3);
            const prev = new Float32Array(count * 3);
            const topEdge = [];
            const bottomEdge = [];
            const leftEdge = [];
            const rightEdge = [];
            const idxLocal = (i, j) => j * (segX + 1) + i;
            const off = (n) => n * 3;
            let p = 0;
            let uv = 0;
            for (let j = 0; j <= segZ; j += 1) {
                const z = lerp(-length / 2, length / 2, j / segZ);
                for (let i = 0; i <= segX; i += 1) {
                    const x = lerp(-width / 2, width / 2, i / segX);
                    positions[p] = rest[p] = curr[p] = prev[p] = x;
                    positions[p + 1] = rest[p + 1] = curr[p + 1] = prev[p + 1] = 0;
                    positions[p + 2] = rest[p + 2] = curr[p + 2] = prev[p + 2] = z;
                    uvs[uv] = 1 - j / segZ;
                    uvs[uv + 1] = i / segX;
                    p += 3;
                    uv += 2;
                }
            }
            for (let i = 0; i <= segX; i += 1) {
                topEdge.push(idxLocal(i, 0));
                bottomEdge.push(idxLocal(i, segZ));
            }
            for (let j = 0; j <= segZ; j += 1) {
                leftEdge.push(idxLocal(0, j));
                rightEdge.push(idxLocal(segX, j));
            }
            const indices = [];
            for (let j = 0; j < segZ; j += 1) {
                for (let i = 0; i < segX; i += 1) {
                    const a = idxLocal(i, j);
                    const b = idxLocal(i + 1, j);
                    const c = idxLocal(i, j + 1);
                    const d = idxLocal(i + 1, j + 1);
                    indices.push(a, c, b, b, c, d);
                }
            }
            geometry.setIndex(indices);
            geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
            geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
            geometry.computeVertexNormals();
            const constraints = [];
            const addConstraint = (a, b, st = 1) => {
                const ai = off(a);
                const bi = off(b);
                constraints.push({
                    a,
                    b,
                    rest: Math.hypot(rest[bi] - rest[ai], rest[bi + 1] - rest[ai + 1], rest[bi + 2] - rest[ai + 2]),
                    st
                });
            };
            for (let j = 0; j <= segZ; j += 1) {
                for (let i = 0; i <= segX; i += 1) {
                    const a = idxLocal(i, j);
                    if (i < segX) addConstraint(a, idxLocal(i + 1, j), 1);
                    if (j < segZ) addConstraint(a, idxLocal(i, j + 1), 1);
                    if (i < segX && j < segZ) {
                        addConstraint(a, idxLocal(i + 1, j + 1), 0.72);
                        addConstraint(idxLocal(i + 1, j), idxLocal(i, j + 1), 0.72);
                    }
                    if (i < segX - 1) addConstraint(a, idxLocal(i + 2, j), 0.32);
                    if (j < segZ - 1) addConstraint(a, idxLocal(i, j + 2), 0.32);
                }
            }
            const texture = textureLoader.load("assets/media/persian-flying-carpet-texture.png", (map) => {
                map.colorSpace = THREE.SRGBColorSpace;
                map.wrapS = THREE.ClampToEdgeWrapping;
                map.wrapT = THREE.ClampToEdgeWrapping;
                map.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
                map.needsUpdate = true;
            });
            const material = new THREE.MeshPhysicalMaterial({
                map: texture,
                color: 0xffffff,
                roughness: lerp(0.42, 0.2, carpetQuality.material),
                metalness: 0.02,
                clearcoat: lerp(0.06, 0.41, carpetQuality.material),
                clearcoatRoughness: 0.12,
                sheen: lerp(0.12, 0.5, carpetQuality.material),
                sheenColor: new THREE.Color(0xffd5a0),
                sheenRoughness: 0.22,
                envMapIntensity: 0.72,
                side: THREE.DoubleSide
            });
            material.onBeforeCompile = (shader) => {
                shader.uniforms.uTextureBrightness = { value: visualSettings.carpetTextureBrightness };
                shader.uniforms.uHueShift = { value: visualSettings.carpetHueShift };
                material.userData.shader = shader;
                shader.fragmentShader = `uniform float uTextureBrightness;
uniform float uHueShift;
vec3 hueShiftRug(vec3 color, float degrees) {
    float angle = radians(degrees);
    mat3 rgb2yiq = mat3(0.299,0.587,0.114,0.596,-0.274,-0.322,0.211,-0.523,0.312);
    mat3 yiq2rgb = mat3(1.0,0.956,0.621,1.0,-0.272,-0.647,1.0,-1.106,1.703);
    vec3 yiq = rgb2yiq * color;
    float hue = atan(yiq.z, yiq.y) + angle;
    float chroma = length(yiq.yz);
    return clamp(yiq2rgb * vec3(yiq.x, chroma * cos(hue), chroma * sin(hue)), 0.0, 1.0);
}
${shader.fragmentShader}`
                    .replace("#include <map_fragment>", `#include <map_fragment>
                        diffuseColor.rgb *= uTextureBrightness;
                        if (abs(uHueShift) > 0.001) diffuseColor.rgb = hueShiftRug(diffuseColor.rgb, uHueShift);`);
            };
            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = carpetQuality.shadows;
            mesh.receiveShadow = carpetQuality.shadows;
            mesh.frustumCulled = false;
            mesh.userData.selectableRoot = group;
            group.add(mesh);
            const edgeLine = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xe4c37b, transparent: true, opacity: 0.82 }));
            edgeLine.userData.selectableRoot = group;
            group.add(edgeLine);
            const fringeGeometry = new THREE.BufferGeometry();
            const fringeMaterial = new THREE.LineBasicMaterial({ color: 0xe9dcc0, transparent: true, opacity: 0.86 });
            const fringes = new THREE.LineSegments(fringeGeometry, fringeMaterial);
            fringes.userData.selectableRoot = group;
            group.add(fringes);
            group.position.set(1.45, -0.98, 0.44);
            group.rotation.y = -0.08;
            group.userData.baseScale = group.scale.clone();
            group.userData.carpet = {
                mesh, material, geometry, positions, rest, curr, prev, constraints, edgeLine,
                fringeGeometry, fringeMaterial, fringes, fringePositions: null, fringeMeta: [],
                width, length, segX, segZ, stringPoints, topEdge, bottomEdge, leftEdge, rightEdge,
                carpetQuality,
                group, lampLocal: null,
                hoverPoint: new THREE.Vector2(), hoverTargetPoint: new THREE.Vector2(), hoverActive: 0, hoverTarget: 0, hoverPulse: 0, frame: 0
            };
            group.userData.selectableRoot = group;
            rebuildFlyingCarpetFringes(group);
            return group;
        }

        function disposeObjectResources(object) {
            object?.traverse?.((child) => {
                child.geometry?.dispose?.();
                const materials = Array.isArray(child.material) ? child.material : [child.material];
                materials.filter(Boolean).forEach((material) => {
                    material.map?.dispose?.();
                    material.dispose?.();
                });
            });
        }

        function unregisterEditableRoot(object) {
            const remove = (items) => {
                const index = items.indexOf(object);
                if (index >= 0) items.splice(index, 1);
            };
            remove(editableObjects);
            remove(selectableObjects);
            interactiveProjectionRoots.delete(object);
            if (selectedObject === object) {
                detachSelection();
            }
        }

        function installFlyingCarpet(rug) {
            prepareEditableModel(rug, "rug");
            rug.userData.baseScale = rug.scale.clone();
            projectionStage.add(rug);
            registerEditable(rug);
            assetObjects.set("rug", rug);
            return rug;
        }

        function replaceFlyingCarpet(profile = carpetQualityProfile()) {
            const oldRug = assetObjects.get("rug");
            if (oldRug) {
                unregisterEditableRoot(oldRug);
                projectionStage.remove(oldRug);
                assetObjects.delete("rug");
                disposeObjectResources(oldRug);
            }
            const rug = profile.flat ? makeFlatFlyingCarpet() : makeFlyingCarpet();
            return installFlyingCarpet(rug);
        }

        function rebuildFlyingCarpetFringes(rug = assetObjects.get("rug")) {
            const data = rug?.userData?.carpet;
            if (!data) return;
            if (data.flat) return;
            const meta = [];
            const carpetQuality = data.carpetQuality || carpetQualityProfile();
            const sampleEdge = (edge, t) => {
                const f = clamp(t) * (edge.length - 1);
                const aIndex = Math.floor(f);
                return { a: edge[aIndex], b: edge[Math.min(edge.length - 1, aIndex + 1)], alpha: f - aIndex };
            };
            if (!carpetQuality.fringes) {
                data.fringeMeta = [];
                data.fringePositions = new Float32Array(0);
                data.fringeGeometry.setAttribute("position", new THREE.BufferAttribute(data.fringePositions, 3));
                data.fringes.visible = false;
                return;
            }
            data.fringes.visible = true;
            const perEnd = Math.round(carpetQuality.fringeBase + data.length * visualSettings.carpetFringeDensity * carpetQuality.fringeMul);
            for (const [edge, sign] of [[data.leftEdge, -1], [data.rightEdge, 1]]) {
                for (let s = 0; s < perEnd; s += 1) {
                    const info = sampleEdge(edge, perEnd === 1 ? 0 : s / (perEnd - 1));
                    meta.push({
                        ...info,
                        sign,
                        length: visualSettings.carpetFringeLength * (0.74 + Math.random() * 0.55),
                        phase: Math.random() * Math.PI * 2,
                        side: (Math.random() - 0.5) * 0.018,
                        points: new Float32Array(data.stringPoints * 3),
                        prev: new Float32Array(data.stringPoints * 3)
                    });
                }
            }
            data.fringeMeta = meta;
            data.fringePositions = new Float32Array(meta.length * (data.stringPoints - 1) * 2 * 3);
            data.fringeGeometry.setAttribute("position", new THREE.BufferAttribute(data.fringePositions, 3));
            initFlyingCarpetFringes(data, true);
        }

        function carpetOffset(n) {
            return n * 3;
        }

        function flyingCarpetEdgeRoot(data, meta) {
            const a = carpetOffset(meta.a);
            const b = carpetOffset(meta.b);
            return {
                x: lerp(data.curr[a], data.curr[b], meta.alpha),
                y: lerp(data.curr[a + 1], data.curr[b + 1], meta.alpha),
                z: lerp(data.curr[a + 2], data.curr[b + 2], meta.alpha)
            };
        }

        function flyingCarpetOutward(meta) {
            return { x: meta.sign, z: 0 };
        }

        function initFlyingCarpetFringes(data, force = false) {
            data.fringeMeta.forEach((meta) => {
                const root = flyingCarpetEdgeRoot(data, meta);
                const out = flyingCarpetOutward(meta);
                for (let i = 0; i < data.stringPoints; i += 1) {
                    const r = i / (data.stringPoints - 1);
                    const o = carpetOffset(i);
                    meta.points[o] = root.x + out.x * meta.length * r + meta.side * r;
                    meta.points[o + 1] = root.y - 0.015 * r;
                    meta.points[o + 2] = root.z + out.z * meta.length * r;
                    if (force) {
                        meta.prev[o] = meta.points[o];
                        meta.prev[o + 1] = meta.points[o + 1];
                        meta.prev[o + 2] = meta.points[o + 2];
                    }
                }
            });
        }

        function flyingCarpetBaseline(data, x, z, t) {
            const direction = THREE.MathUtils.degToRad(visualSettings.carpetDirection);
            const dx = Math.cos(direction);
            const dz = Math.sin(direction);
            const cx = -dz;
            const cz = dx;
            const phase = ((x * dx + z * dz) / Math.max(visualSettings.carpetWavelength, 0.08)) * Math.PI * 2 + t * visualSettings.carpetSpeed;
            const cross = x * cx + z * cz;
            let y = Math.sin(phase) * visualSettings.carpetAmplitude * visualSettings.carpetIntensity;
            y += Math.sin(phase * 0.52 + cross * 0.26 + t * visualSettings.carpetSpeed * 0.72) * visualSettings.carpetAmplitude * 0.34 * visualSettings.carpetIntensity;
            y += Math.sin(phase * 1.83 - cross * 0.16 - t * visualSettings.carpetSpeed * 1.12) * visualSettings.carpetAmplitude * 0.12 * visualSettings.carpetIntensity;
            const edge = Math.max(
                smoothstep(clamp((Math.abs(x) - data.width * 0.27) / (data.width * 0.23))),
                smoothstep(clamp((Math.abs(z) - data.length * 0.3) / (data.length * 0.2)))
            );
            y += Math.pow(edge, 2) * visualSettings.carpetEdgeCurl * (0.62 + 0.38 * Math.sin(t * visualSettings.carpetSpeed * 1.12 + x * 2.1 - z * 0.35));
            const hd = Math.hypot(x - data.hoverPoint.x, z - data.hoverPoint.y);
            const hm = Math.exp(-(hd * hd) / Math.max(0.001, visualSettings.carpetHoverRadius * visualSettings.carpetHoverRadius)) * data.hoverActive;
            y += hm * visualSettings.carpetHoverLift;
            y += Math.sin(hd * 9.5 - t * 7.25) * 0.055 * hm * data.hoverPulse;
            if (data.lampLocal) {
                const ld = Math.hypot(x - data.lampLocal.x, z - data.lampLocal.z);
                const cushion = Math.exp(-(ld * ld) / 0.22) * 0.045;
                y -= cushion;
            }
            return y;
        }

        function simulateFlyingCarpet(data, dt, t) {
            data.frame += 1;
            data.hoverActive += (data.hoverTarget - data.hoverActive) * 0.12;
            data.hoverPoint.lerp(data.hoverTargetPoint, 0.18);
            data.hoverPulse *= 0.985;
            const lamp = assetObjects.get("lamp");
            if (lamp && data.group) {
                data.lampLocal = data.group.worldToLocal(lamp.getWorldPosition(new THREE.Vector3()));
            } else {
                data.lampLocal = null;
            }
            const n = data.curr.length / 3;
            const carpetQuality = data.carpetQuality || carpetQualityProfile();
            const damp = 0.985;
            const spring = 32;
            const gravity = -0.25;
            for (let q = 0; q < n; q += 1) {
                const o = carpetOffset(q);
                const x = data.curr[o];
                const y = data.curr[o + 1];
                const z = data.curr[o + 2];
                if (draggedCarpet === data && q === draggedCarpetNode) {
                    data.prev[o] = x; data.prev[o + 1] = y; data.prev[o + 2] = z;
                    data.curr[o] = lerp(x, carpetDragTarget.x, 0.82);
                    data.curr[o + 1] = lerp(y, carpetDragTarget.y, 0.82);
                    data.curr[o + 2] = lerp(z, carpetDragTarget.z, 0.82);
                    continue;
                }
                const tx = data.rest[o];
                const tz = data.rest[o + 2];
                const ty = flyingCarpetBaseline(data, tx, tz, t);
                const vx = (x - data.prev[o]) * damp;
                const vy = (y - data.prev[o + 1]) * damp;
                const vz = (z - data.prev[o + 2]) * damp;
                data.prev[o] = x; data.prev[o + 1] = y; data.prev[o + 2] = z;
                data.curr[o] = x + vx + (tx - x) * spring * dt * dt;
                data.curr[o + 1] = y + vy + ((ty - y) * spring + gravity) * dt * dt;
                data.curr[o + 2] = z + vz + (tz - z) * spring * dt * dt;
            }
            for (let iter = 0; iter < carpetQuality.solverIterations; iter += 1) {
                data.constraints.forEach((c) => {
                    const a = carpetOffset(c.a);
                    const b = carpetOffset(c.b);
                    let dx = data.curr[b] - data.curr[a];
                    let dy = data.curr[b + 1] - data.curr[a + 1];
                    let dz = data.curr[b + 2] - data.curr[a + 2];
                    const dist = Math.hypot(dx, dy, dz);
                    if (!dist) return;
                    const diff = ((dist - c.rest) / dist) * c.st;
                    const half = 0.5 * diff;
                    const af = draggedCarpet === data && c.a === draggedCarpetNode;
                    const bf = draggedCarpet === data && c.b === draggedCarpetNode;
                    if (!af && !bf) {
                        data.curr[a] += dx * half; data.curr[a + 1] += dy * half; data.curr[a + 2] += dz * half;
                        data.curr[b] -= dx * half; data.curr[b + 1] -= dy * half; data.curr[b + 2] -= dz * half;
                    } else if (af && !bf) {
                        data.curr[b] -= dx * diff; data.curr[b + 1] -= dy * diff; data.curr[b + 2] -= dz * diff;
                    } else if (!af && bf) {
                        data.curr[a] += dx * diff; data.curr[a + 1] += dy * diff; data.curr[a + 2] += dz * diff;
                    }
                });
            }
            if (carpetQuality.selfCollision && draggedCarpet === data && visualSettings.carpetSelfCollision && data.frame % 2 === 0) applyFlyingCarpetSelfCollision(data);
        }

        function applyFlyingCarpetSelfCollision(data) {
            if (draggedCarpetNode < 0) return;
            const thickness = clamp(visualSettings.carpetCollisionThickness || 0.1, 0.04, 0.2);
            const cell = thickness * 1.8;
            const cols = data.segX + 1;
            const hash = new Map();
            const keyFor = (x, y, z) => `${Math.floor(x / cell)},${Math.floor(y / cell)},${Math.floor(z / cell)}`;
            for (let q = 0, n = data.curr.length / 3; q < n; q += 1) {
                const o = carpetOffset(q);
                const key = keyFor(data.curr[o], data.curr[o + 1], data.curr[o + 2]);
                if (!hash.has(key)) hash.set(key, []);
                hash.get(key).push(q);
            }
            const neigh = [-1, 0, 1];
            let solved = 0;
            for (let q = 0, n = data.curr.length / 3; q < n && solved < 280; q += 1) {
                const qo = carpetOffset(q);
                const qi = q % cols;
                const qj = Math.floor(q / cols);
                const cx = Math.floor(data.curr[qo] / cell);
                const cy = Math.floor(data.curr[qo + 1] / cell);
                const cz = Math.floor(data.curr[qo + 2] / cell);
                neigh.forEach((ax) => neigh.forEach((ay) => neigh.forEach((az) => {
                    const bucket = hash.get(`${cx + ax},${cy + ay},${cz + az}`);
                    if (!bucket) return;
                    for (const r of bucket) {
                        if (r <= q) continue;
                        const ri = r % cols;
                        const rj = Math.floor(r / cols);
                        if (Math.abs(ri - qi) <= 3 && Math.abs(rj - qj) <= 3) continue;
                        const ro = carpetOffset(r);
                        let dx = data.curr[ro] - data.curr[qo];
                        let dy = data.curr[ro + 1] - data.curr[qo + 1];
                        let dz = data.curr[ro + 2] - data.curr[qo + 2];
                        let dist = Math.hypot(dx, dy, dz);
                        if (dist >= thickness) continue;
                        if (dist < 0.0001) { dx = 0; dy = thickness; dz = 0; dist = thickness; }
                        const push = ((thickness - dist) / dist) * 0.28;
                        data.curr[qo] -= dx * push; data.curr[qo + 1] -= dy * push; data.curr[qo + 2] -= dz * push;
                        data.curr[ro] += dx * push; data.curr[ro + 1] += dy * push; data.curr[ro + 2] += dz * push;
                        solved += 1;
                        if (solved >= 280) break;
                    }
                })));
            }
        }

        function updateFlyingCarpetGeometry(data) {
            data.positions.set(data.curr);
            data.geometry.attributes.position.needsUpdate = true;
            const carpetQuality = data.carpetQuality || carpetQualityProfile();
            if (data.frame % carpetQuality.normalsEvery === 0) {
                data.geometry.computeVertexNormals();
                data.geometry.attributes.normal.needsUpdate = true;
            }
            const pts = [];
            const push = (n) => {
                const o = carpetOffset(n);
                pts.push(new THREE.Vector3(data.curr[o], data.curr[o + 1] + 0.014, data.curr[o + 2]));
            };
            data.topEdge.forEach(push);
            data.rightEdge.slice(1).forEach(push);
            data.bottomEdge.slice(0, -1).reverse().forEach(push);
            data.leftEdge.slice(1, -1).reverse().forEach(push);
            if (data.topEdge.length) push(data.topEdge[0]);
            data.edgeLine.geometry.dispose();
            data.edgeLine.geometry = new THREE.BufferGeometry().setFromPoints(pts);
        }

        function updateFlyingCarpetFringes(data, dt, t) {
            if (!data.fringeGeometry || !data.fringeMeta.length) return;
            const damp = 0.965;
            const segLenScale = 1 / (data.stringPoints - 1);
            data.fringeMeta.forEach((meta) => {
                const pts = meta.points;
                const prev = meta.prev;
                const root = flyingCarpetEdgeRoot(data, meta);
                const out = flyingCarpetOutward(meta);
                const segLen = meta.length * segLenScale;
                pts[0] = root.x; pts[1] = root.y - 0.004; pts[2] = root.z;
                prev[0] = pts[0]; prev[1] = pts[1]; prev[2] = pts[2];
                for (let i = 1; i < data.stringPoints; i += 1) {
                    const o = carpetOffset(i);
                    const r = i / (data.stringPoints - 1);
                    const x = pts[o], y = pts[o + 1], z = pts[o + 2];
                    const vx = (x - prev[o]) * damp, vy = (y - prev[o + 1]) * damp, vz = (z - prev[o + 2]) * damp;
                    prev[o] = x; prev[o + 1] = y; prev[o + 2] = z;
                    const tx = root.x + out.x * meta.length * r + meta.side * r;
                    const ty = root.y - 0.012 * r - 0.045 * r * r * visualSettings.carpetFringeGravity;
                    const tz = root.z + out.z * meta.length * r;
                    const wind = Math.sin(t * (2 + visualSettings.carpetFringeSwing) + meta.phase + i * 0.7) * 0.018 * visualSettings.carpetFringeSwing * r;
                    pts[o] = x + vx + (tx - x) * 0.045 + wind;
                    pts[o + 1] = y + vy - 0.012 * visualSettings.carpetFringeGravity * dt + (ty - y) * 0.035;
                    pts[o + 2] = z + vz + (tz - z) * 0.045 + Math.cos(t * 2.4 + meta.phase) * 0.006 * visualSettings.carpetFringeSwing * r * meta.sign;
                }
                for (let iter = 0; iter < 4; iter += 1) {
                    pts[0] = root.x; pts[1] = root.y - 0.004; pts[2] = root.z;
                    for (let i = 1; i < data.stringPoints; i += 1) {
                        const a = carpetOffset(i - 1);
                        const b = carpetOffset(i);
                        let dx = pts[b] - pts[a], dy = pts[b + 1] - pts[a + 1], dz = pts[b + 2] - pts[a + 2];
                        const dist = Math.hypot(dx, dy, dz) || 1;
                        const diff = ((dist - segLen) / dist) * visualSettings.carpetFringeStiffness;
                        if (i === 1) {
                            pts[b] -= dx * diff; pts[b + 1] -= dy * diff; pts[b + 2] -= dz * diff;
                        } else {
                            pts[a] += dx * 0.5 * diff; pts[a + 1] += dy * 0.5 * diff; pts[a + 2] += dz * 0.5 * diff;
                            pts[b] -= dx * 0.5 * diff; pts[b + 1] -= dy * 0.5 * diff; pts[b + 2] -= dz * 0.5 * diff;
                        }
                    }
                }
            });
            let k = 0;
            data.fringeMeta.forEach((meta) => {
                for (let i = 0; i < data.stringPoints - 1; i += 1) {
                    const a = carpetOffset(i);
                    const b = carpetOffset(i + 1);
                    data.fringePositions[k++] = meta.points[a]; data.fringePositions[k++] = meta.points[a + 1]; data.fringePositions[k++] = meta.points[a + 2];
                    data.fringePositions[k++] = meta.points[b]; data.fringePositions[k++] = meta.points[b + 1]; data.fringePositions[k++] = meta.points[b + 2];
                }
            });
            data.fringeGeometry.attributes.position.needsUpdate = true;
        }

        function updateFlyingCarpetMaterial(data) {
            const s = visualSettings.carpetSilkSheen;
            const sheenOpacity = visualSettings.carpetSilkSheenOpacity;
            data.material.color.setScalar(visualSettings.carpetTextureBrightness);
            if ("roughness" in data.material) data.material.roughness = lerp(0.86, 0.2, s);
            if ("clearcoat" in data.material) data.material.clearcoat = lerp(0.02, 0.82, s) * sheenOpacity;
            if ("clearcoatRoughness" in data.material) data.material.clearcoatRoughness = lerp(0.82, 0.12, s);
            if ("sheen" in data.material) data.material.sheen = lerp(0.18, 1, s) * sheenOpacity;
            if ("sheenRoughness" in data.material) data.material.sheenRoughness = lerp(0.9, 0.22, s);
            if ("envMapIntensity" in data.material) data.material.envMapIntensity = lerp(0.15, 1.45, s) * sheenOpacity;
            if (data.material.userData.shader?.uniforms) {
                data.material.userData.shader.uniforms.uTextureBrightness.value = visualSettings.carpetTextureBrightness;
                data.material.userData.shader.uniforms.uHueShift.value = visualSettings.carpetHueShift || 0;
            }
        }

        function updateFlyingCarpet(elapsed) {
            const rug = assetObjects.get("rug");
            if (!rug?.userData?.carpet) return;
            const data = rug.userData.carpet;
            if (data.flat) {
                updateFlyingCarpetMaterial(data);
                return;
            }
            simulateFlyingCarpet(data, 1 / 60, elapsed);
            updateFlyingCarpetGeometry(data);
            const carpetQuality = data.carpetQuality || carpetQualityProfile();
            if (carpetQuality.fringes && data.frame % carpetQuality.fringeEvery === 0) updateFlyingCarpetFringes(data, (1 / 60) * carpetQuality.fringeEvery, elapsed);
            updateFlyingCarpetMaterial(data);
        }

        function makeImportedHourglass() {
            const group = new THREE.Group();
            group.name = "Imported Hyperboloid Hourglass";
            const hg = {
                profile: null,
                glassParts: [],
                supportColumnGroup: null,
                sandPlus: 0.68,
                geometryTimer: 1,
                lastElapsed: performance.now() * 0.001,
                topFillMesh: null,
                bottomFillMesh: null,
                plusConeMesh: null,
                minusConeMesh: null,
                streamOuter: null,
                streamInner: null
            };
            const hClamp = THREE.MathUtils.clamp;
            const hSmooth = (edge0, edge1, value) => {
                const t = hClamp((value - edge0) / (edge1 - edge0), 0, 1);
                return t * t * (3 - 2 * t);
            };
            const profileRadius = (y, neck, c, flare, curve, lip = 0.18) => {
                const a = Math.abs(y);
                const base = neck * Math.pow(1 + (a * a) / (c * c), curve * 0.5);
                const f = hSmooth(1.45, 2.32, a);
                const l = hSmooth(2.03, 2.34, a);
                return base + flare * Math.pow(f, 1.55) + lip * Math.pow(l, 2);
            };
            const buildProfile = () => {
                const outerPoints = [];
                const innerPoints = [];
                const heightHalf = 2.34;
                const curve = visualSettings.hourglassCurve;
                const c = lerp(1.34, 0.78, hClamp((curve - 0.65) / 1.15, 0, 1));
                const safeAperture = Math.min(visualSettings.hourglassAperture, Math.max(0.02, visualSettings.hourglassNeck - visualSettings.hourglassWallThickness * 0.68));
                for (let i = 0; i <= 128; i += 1) {
                    const y = lerp(-heightHalf, heightHalf, i / 128);
                    const a = Math.abs(y);
                    const outer = profileRadius(y, visualSettings.hourglassNeck, c, visualSettings.hourglassFlare, curve);
                    const wall = visualSettings.hourglassWallThickness + 0.018 * hSmooth(0, 2.2, a);
                    const chamber = Math.max(outer - wall, safeAperture + 0.02);
                    const throat = 0.54;
                    let inner = a <= throat ? lerp(safeAperture, chamber, hSmooth(0, throat, a)) : chamber;
                    inner = Math.min(inner, outer - 0.025);
                    inner = Math.max(inner, safeAperture);
                    outerPoints.push(new THREE.Vector2(outer, y));
                    innerPoints.push(new THREE.Vector2(inner, y));
                }
                hg.profile = { outerPoints, innerPoints, heightHalf, topOuterRadius: outerPoints.at(-1).x, bottomOuterRadius: outerPoints[0].x, safeAperture };
            };
            const radiusFromProfile = (points, y) => {
                if (y <= points[0].y) return points[0].x;
                if (y >= points.at(-1).y) return points.at(-1).x;
                const t = (y - points[0].y) / (points.at(-1).y - points[0].y);
                const raw = t * (points.length - 1);
                const i0 = Math.floor(raw);
                const i1 = Math.min(points.length - 1, i0 + 1);
                const a = points[i0];
                const b = points[i1];
                return lerp(a.x, b.x, (y - a.y) / (b.y - a.y || 1));
            };
            const innerRadiusAtY = (y) => radiusFromProfile(hg.profile.innerPoints, y);
            const makeGlassMaterial = () => {
                const tint = new THREE.Color().setHSL(0.52, 0.34 + visualSettings.hourglassTint * 0.22, 0.72 + visualSettings.hourglassTint * 0.12);
                return registerFadeMaterial(new THREE.MeshPhysicalMaterial({
                    color: tint,
                    transparent: true,
                    opacity: visualSettings.hourglassGlassOpacity,
                    transmission: 0.08,
                    roughness: 0.18,
                    metalness: 0,
                    thickness: 0.42,
                    ior: 1.5,
                    clearcoat: 0.55,
                    clearcoatRoughness: 0.08,
                    reflectivity: 0.16,
                    attenuationColor: tint.clone().lerp(new THREE.Color(0xffffff), 0.25),
                    attenuationDistance: 7.5,
                    emissive: new THREE.Color(0x20343b),
                    emissiveIntensity: 0.008,
                    side: THREE.DoubleSide,
                    depthWrite: false,
                    envMapIntensity: 0.34
                }), visualSettings.hourglassGlassOpacity);
            };
            const makeMetalMaterial = (variant = 0) => registerFadeMaterial(new THREE.MeshPhysicalMaterial({
                color: [0xe9ecf7, 0xf3d9ef, 0xd9eef8][variant % 3],
                metalness: 1,
                roughness: 0.17,
                clearcoat: 1,
                clearcoatRoughness: 0.08,
                reflectivity: 0.32,
                iridescence: 0.24,
                iridescenceIOR: 1.32,
                iridescenceThicknessRange: [120, 850],
                sheen: 0.18,
                sheenColor: new THREE.Color(0xffffff),
                envMapIntensity: 0.52,
                emissive: new THREE.Color(0x182225),
                emissiveIntensity: 0.012,
                transparent: true,
                opacity: 1
            }), 1);
            const makeSandMat = () => registerFadeMaterial(new THREE.MeshStandardMaterial({
                color: 0xd8b263,
                roughness: 0.98,
                metalness: 0.01,
                side: THREE.DoubleSide,
                depthTest: true,
                depthWrite: true,
                emissive: new THREE.Color(0x4f3510),
                emissiveIntensity: 0.06,
                transparent: true,
                opacity: 1
            }), 1);
            const makeStreamMat = (color, opacity) => registerFadeMaterial(new THREE.MeshStandardMaterial({
                color,
                roughness: 0.92,
                metalness: 0.02,
                transparent: true,
                opacity,
                side: THREE.DoubleSide,
                depthTest: true,
                depthWrite: true
            }), opacity);
            const createCylinderBetween = (start, end, radius, material) => {
                const direction = new THREE.Vector3().subVectors(end, start);
                const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, direction.length(), 20, 1, true), material);
                mesh.position.copy(new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5));
                mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                return mesh;
            };
            const createDecorativeBase = (y, baseRadius, matA, matB, flip = false) => {
                const base = new THREE.Group();
                const h = 0.16;
                const disk = new THREE.Mesh(new THREE.CylinderGeometry(baseRadius, baseRadius * 0.98, h, 64), matA);
                disk.position.y = y;
                base.add(disk);
                const ring = new THREE.Mesh(new THREE.TorusGeometry(baseRadius * 0.87, 0.045, 16, 84), matB);
                ring.rotation.x = Math.PI / 2;
                ring.position.y = y + (flip ? -h * 0.18 : h * 0.18);
                base.add(ring);
                const rim = new THREE.Mesh(new THREE.TorusGeometry(baseRadius * 0.985, 0.05, 16, 96), matA);
                rim.rotation.x = Math.PI / 2;
                rim.position.y = y;
                base.add(rim);
                for (let i = 0; i < 28; i += 1) {
                    const angle = (i / 28) * Math.PI * 2;
                    const bead = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.09, 10), matB);
                    bead.rotation.z = Math.PI / 2;
                    bead.position.set(Math.cos(angle) * baseRadius * 0.95, y, Math.sin(angle) * baseRadius * 0.95);
                    bead.lookAt(0, y, 0);
                    base.add(bead);
                }
                return base;
            };
            const createSealingCap = (radius, y, material, flip = false) => {
                const cap = new THREE.Mesh(new THREE.SphereGeometry(radius, 42, 18, 0, Math.PI * 2, 0, Math.PI / 2), material);
                cap.scale.y = 0.35;
                cap.position.y = y;
                if (flip) cap.rotation.x = Math.PI;
                return cap;
            };
            const chamberBounds = (sign) => {
                const h = hg.profile.heightHalf;
                return sign > 0 ? { min: 0.055, max: h - 0.22, neck: 0.055 } : { min: -h + 0.18, max: -0.055, neck: -0.055 };
            };
            const fillLevel = (sign, amount, downSign) => {
                const b = chamberBounds(sign);
                const lower = downSign > 0 ? b.max : b.min;
                const upper = downSign > 0 ? b.min : b.max;
                return lower + (upper - lower) * hClamp(amount, 0, 1);
            };
            const fillGeometry = (sign, amount, downSign) => {
                amount = hClamp(amount, 0, 1);
                if (amount < 0.008) return new THREE.BufferGeometry();
                const b = chamberBounds(sign);
                const level = fillLevel(sign, amount, downSign);
                const base = downSign > 0 ? b.max : b.min;
                const low = Math.min(base, level);
                const high = Math.max(base, level);
                const points = [new THREE.Vector2(0, low)];
                for (let i = 0; i <= 38; i += 1) {
                    const y = lerp(low, high, i / 38);
                    points.push(new THREE.Vector2(innerRadiusAtY(y) * 0.955, y));
                }
                points.push(new THREE.Vector2(0, high), new THREE.Vector2(0, low));
                const geometry = new THREE.LatheGeometry(points, 128);
                geometry.computeVertexNormals();
                return geometry;
            };
            const coneData = (sign, amount, downSign) => {
                const b = chamberBounds(sign);
                const surface = fillLevel(sign, amount, downSign);
                const available = Math.abs(b.neck - surface);
                const height = Math.min(0.22 + amount * 0.52, available * 0.72);
                const direction = Math.sign(b.neck - surface) || 1;
                const apex = surface + direction * height;
                const r = hClamp(innerRadiusAtY(surface) * (0.24 + 0.23 * amount), 0.11, 0.64);
                return { surface, apex, r, visible: amount > 0.045 && available > 0.1 };
            };
            const coneGeometry = (sign, amount, downSign, active) => {
                const data = coneData(sign, amount, downSign);
                if (!active || !data.visible) return new THREE.BufferGeometry();
                const mid = lerp(data.apex, data.surface, 0.52);
                const points = [
                    new THREE.Vector2(0, data.apex),
                    new THREE.Vector2(data.r * 0.16, mid),
                    new THREE.Vector2(data.r, data.surface),
                    new THREE.Vector2(0, data.surface),
                    new THREE.Vector2(0, data.apex)
                ];
                const geometry = new THREE.LatheGeometry(points, 96);
                geometry.computeVertexNormals();
                return geometry;
            };
            const refresh = (mesh, geometry, visible) => {
                mesh.geometry.dispose();
                mesh.geometry = geometry;
                mesh.visible = visible;
            };
            const updateStream = (active, receiverSign, receiverAmount, downSign, time) => {
                if (!active) {
                    hg.streamOuter.visible = false;
                    hg.streamInner.visible = false;
                    return;
                }
                const data = coneData(receiverSign, receiverAmount, downSign);
                const direction = Math.sign(data.apex) || (receiverSign > 0 ? 1 : -1);
                const sourceEmbed = lerp(0.035, 0.125, visualSettings.hourglassStreamOverlap / 0.35);
                const targetEmbed = lerp(0.035, 0.185, visualSettings.hourglassStreamOverlap / 0.35);
                const startY = -direction * sourceEmbed;
                const endY = data.apex + direction * targetEmbed;
                const length = Math.max(0.05, Math.abs(endY - startY));
                const midY = (startY + endY) / 2;
                const apertureFactor = hClamp((hg.profile.safeAperture - 0.03) / 0.17, 0, 1);
                const timerFactor = hClamp((3600 / visualSettings.hourglassTimerSeconds) / 120, 0, 1);
                const baseRadius = lerp(0.0035, 0.0125, 0.32 * apertureFactor + 0.68 * timerFactor) * visualSettings.hourglassStreamThickness;
                const pulse = 1 + Math.sin(time * 18) * 0.025;
                hg.streamOuter.visible = true;
                hg.streamInner.visible = true;
                hg.streamOuter.position.set(0, midY, 0);
                hg.streamInner.position.set(0, midY, 0);
                hg.streamOuter.rotation.set(0, 0, direction < 0 ? Math.PI : 0);
                hg.streamInner.rotation.set(0, 0, direction < 0 ? Math.PI : 0);
                hg.streamOuter.scale.set(baseRadius * 1.85, length * pulse, baseRadius * 1.85);
                hg.streamInner.scale.set(baseRadius * 0.72, length * pulse, baseRadius * 0.72);
            };
            const updateSand = (dt, time) => {
                const gravity = new THREE.Vector3(0, -1, 0).applyQuaternion(group.getWorldQuaternion(new THREE.Quaternion()).invert()).normalize();
                const downSign = gravity.y >= 0 ? 1 : -1;
                const ready = hSmooth(0.72, 0.95, Math.abs(gravity.y));
                const plusUpper = downSign < 0;
                const upperAmount = plusUpper ? hg.sandPlus : 1 - hg.sandPlus;
                const canFlow = ready > 0.04 && upperAmount > 0.005;
                const rate = canFlow ? dt / visualSettings.hourglassTimerSeconds * ready * visualSettings.hourglassSandSpeed : 0;
                if (rate > 0) hg.sandPlus = hClamp(hg.sandPlus + (plusUpper ? -rate : rate), 0, 1);
                const minusAmount = 1 - hg.sandPlus;
                const receiverSign = downSign < 0 ? -1 : 1;
                const receiverAmount = receiverSign > 0 ? hg.sandPlus : minusAmount;
                hg.geometryTimer += dt;
                if (hg.geometryTimer > 0.045) {
                    hg.geometryTimer = 0;
                    refresh(hg.topFillMesh, fillGeometry(1, hg.sandPlus, downSign), hg.sandPlus > 0.008);
                    refresh(hg.bottomFillMesh, fillGeometry(-1, minusAmount, downSign), minusAmount > 0.008);
                    refresh(hg.plusConeMesh, coneGeometry(1, hg.sandPlus, downSign, receiverSign > 0), hg.sandPlus > 0.045 && receiverSign > 0);
                    refresh(hg.minusConeMesh, coneGeometry(-1, minusAmount, downSign, receiverSign < 0), minusAmount > 0.045 && receiverSign < 0);
                }
                updateStream(canFlow && upperAmount > 0.012, receiverSign, receiverAmount, downSign, time);
            };

            buildProfile();
            const glassMat = makeGlassMaterial();
            const innerMat = makeGlassMaterial();
            innerMat.opacity = Math.max(visualSettings.hourglassGlassOpacity * 0.76, 0.1);
            const outerGlass = new THREE.Mesh(new THREE.LatheGeometry(hg.profile.outerPoints, 144), glassMat);
            const innerGlass = new THREE.Mesh(new THREE.LatheGeometry(hg.profile.innerPoints, 144), innerMat);
            outerGlass.geometry.computeVertexNormals();
            innerGlass.geometry.computeVertexNormals();
            group.add(outerGlass, innerGlass);
            hg.glassParts.push(outerGlass, innerGlass);
            group.add(
                createSealingCap(hg.profile.topOuterRadius * 0.98, hg.profile.heightHalf + 0.01, glassMat, false),
                createSealingCap(hg.profile.bottomOuterRadius * 0.98, -hg.profile.heightHalf - 0.01, glassMat, true)
            );
            const collarA = makeMetalMaterial(0);
            const collarB = makeMetalMaterial(1);
            const topCollar = new THREE.Mesh(new THREE.TorusGeometry(hg.profile.topOuterRadius * 1.02, 0.06, 18, 96), collarA);
            const bottomCollar = new THREE.Mesh(new THREE.TorusGeometry(hg.profile.bottomOuterRadius * 1.02, 0.06, 18, 96), collarA);
            topCollar.rotation.x = Math.PI / 2;
            bottomCollar.rotation.x = Math.PI / 2;
            topCollar.position.y = hg.profile.heightHalf + 0.02;
            bottomCollar.position.y = -hg.profile.heightHalf - 0.02;
            group.add(topCollar, bottomCollar);
            const topPlate = new THREE.Mesh(new THREE.CylinderGeometry(hg.profile.topOuterRadius * 1.08, hg.profile.topOuterRadius * 1.12, 0.12, 42), collarB);
            const bottomPlate = new THREE.Mesh(new THREE.CylinderGeometry(hg.profile.bottomOuterRadius * 1.12, hg.profile.bottomOuterRadius * 1.08, 0.12, 42), collarB);
            topPlate.position.y = hg.profile.heightHalf + 0.16;
            bottomPlate.position.y = -hg.profile.heightHalf - 0.16;
            group.add(topPlate, bottomPlate);
            const baseRadius = Math.max(hg.profile.topOuterRadius, hg.profile.bottomOuterRadius) + 0.7;
            const baseOffset = hg.profile.heightHalf + 0.58;
            group.add(createDecorativeBase(baseOffset, baseRadius, makeMetalMaterial(0), makeMetalMaterial(2), false));
            group.add(createDecorativeBase(-baseOffset, baseRadius, makeMetalMaterial(0), makeMetalMaterial(2), true));
            hg.supportColumnGroup = new THREE.Group();
            const colInset = baseRadius * 0.92;
            const topY = hg.profile.heightHalf + 0.22;
            const bottomY = -hg.profile.heightHalf - 0.22;
            for (let i = 0; i < 4; i += 1) {
                const angle = Math.PI / 4 + i * Math.PI / 2;
                const x = Math.cos(angle) * colInset;
                const z = Math.sin(angle) * colInset;
                hg.supportColumnGroup.add(createCylinderBetween(new THREE.Vector3(x, -baseOffset + 0.08, z), new THREE.Vector3(x, baseOffset - 0.08, z), 0.055, makeMetalMaterial(i % 3)));
                hg.supportColumnGroup.add(createCylinderBetween(new THREE.Vector3(x * 0.86, topY, z * 0.86), new THREE.Vector3(x, baseOffset - 0.08, z), 0.038, makeMetalMaterial((i + 1) % 3)));
                hg.supportColumnGroup.add(createCylinderBetween(new THREE.Vector3(x * 0.86, bottomY, z * 0.86), new THREE.Vector3(x, -baseOffset + 0.08, z), 0.038, makeMetalMaterial((i + 2) % 3)));
            }
            hg.supportColumnGroup.visible = visualSettings.hourglassColumns;
            group.add(hg.supportColumnGroup);
            hg.topFillMesh = new THREE.Mesh(fillGeometry(1, hg.sandPlus, -1), makeSandMat());
            hg.bottomFillMesh = new THREE.Mesh(fillGeometry(-1, 1 - hg.sandPlus, -1), makeSandMat());
            hg.plusConeMesh = new THREE.Mesh(coneGeometry(1, hg.sandPlus, -1, false), makeSandMat());
            hg.minusConeMesh = new THREE.Mesh(coneGeometry(-1, 1 - hg.sandPlus, -1, true), makeSandMat());
            hg.streamOuter = new THREE.Mesh(new THREE.CylinderGeometry(1, 0.72, 1, 24, 1, true), makeStreamMat(0xe4be72, 0.58));
            hg.streamInner = new THREE.Mesh(new THREE.CylinderGeometry(1, 0.78, 1, 20, 1, true), makeStreamMat(0xc9993a, 0.92));
            hg.streamOuter.visible = false;
            hg.streamInner.visible = false;
            group.add(hg.topFillMesh, hg.bottomFillMesh, hg.plusConeMesh, hg.minusConeMesh, hg.streamOuter, hg.streamInner);
            hg.updateGlass = () => {
                const tint = new THREE.Color().setHSL(0.52, 0.34 + visualSettings.hourglassTint * 0.22, 0.72 + visualSettings.hourglassTint * 0.12);
                hg.glassParts.forEach((part, index) => {
                    part.material.color.copy(tint);
                    part.material.opacity = index === 1 ? Math.max(visualSettings.hourglassGlassOpacity * 0.76, 0.1) : visualSettings.hourglassGlassOpacity;
                    part.material.userData.baseOpacity = part.material.opacity;
                    if (part.material.attenuationColor) part.material.attenuationColor.copy(tint).lerp(new THREE.Color(0xffffff), 0.25);
                    part.material.needsUpdate = true;
                });
                hg.supportColumnGroup.visible = visualSettings.hourglassColumns;
            };
            hg.updateSand = updateSand;
            group.userData.hourglassImport = hg;
            group.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.userData.selectableRoot = group;
                }
            });
            return group;
        }

        function updateImportedHourglass(elapsed) {
            const hourglass = assetObjects.get("hourglass");
            const parts = hourglass?.userData?.hourglassImport;
            if (!parts) return;
            const flip = hourglassFlipTarget;
            hourglassFlipProgress = Math.min(1, hourglassFlipProgress + 0.018 * visualSettings.hourglassSandSpeed);
            const desiredFlipX = (hourglass.userData.flipBaseX || 0) + flip;
            hourglass.rotation.x += (desiredFlipX - hourglass.rotation.x) * (0.04 + smootherstep(hourglassFlipProgress) * 0.035);
            const dt = clamp(elapsed - (parts.lastElapsed || elapsed), 0.001, 0.06);
            parts.lastElapsed = elapsed;
            parts.updateGlass?.();
            parts.updateSand?.(dt, elapsed);
        }

        function rebuildImportedHourglass() {
            const hourglass = assetObjects.get("hourglass");
            if (!hourglass) return;
            if (hourglass.userData.shapeCloud) {
                hourglass.remove(hourglass.userData.shapeCloud);
                hourglass.userData.shapeCloud.geometry?.dispose();
                hourglass.userData.shapeCloud.material?.dispose();
                hourglass.userData.shapeCloud = null;
            }
            [...hourglass.children].forEach((child) => {
                hourglass.remove(child);
            });
            const asset = makeImportedHourglass();
            fitModelToBox(asset, { target: 2.0 });
            hourglass.add(asset);
            hourglass.userData.hourglassImport = asset.userData.hourglassImport;
            createShapeParticleCloud(hourglass, "timeline", 460);
        }

        function updateSpoutFromLamp(lamp) {
            spoutOrigin.copy(lampSpoutLocal).applyQuaternion(lamp.quaternion).add(lamp.position);
            return spoutOrigin;
        }

        function angleDelta(target, current) {
            return Math.atan2(Math.sin(target - current), Math.cos(target - current));
        }

        function orientLampHandleToCamera(lamp, strength = 0.18) {
            const cameraLocal = lamp.parent.worldToLocal(camera.getWorldPosition(new THREE.Vector3()).clone());
            const dx = cameraLocal.x - lamp.position.x;
            const dz = cameraLocal.z - lamp.position.z;
            if (Math.hypot(dx, dz) < 0.001) return;
            const targetYaw = Math.atan2(dx, dz) + Math.PI * 1.5;
            lamp.rotation.y += angleDelta(targetYaw, lamp.rotation.y) * strength;
        }

        function orientLampSpoutToVelocity(lamp, velocity, strength = 0.12) {
            const vx = velocity?.x || 0;
            const vz = velocity?.z || 0;
            if (Math.hypot(vx, vz) < 0.001) return;
            const targetYaw = Math.atan2(vz, -vx);
            lamp.rotation.y += angleDelta(targetYaw, lamp.rotation.y) * strength;
        }

        function updateLampFloatAndSpout(elapsed) {
            const lamp = assetObjects.get("lamp");
            if (!lamp) return;
            if (sceneMode && grabbedProjection !== lamp) {
                lampProjectionOffsetTarget.copy(lamp.position).sub(lampDefaultPosition);
                lampProjectionOffset.copy(lampProjectionOffsetTarget);
                updateSpoutFromLamp(lamp);
                return;
            }
            if (grabbedProjection !== lamp) {
                const velocity = lamp.userData.dragVelocity;
                if (velocity) {
                    lamp.position.add(velocity);
                    const targetTiltZ = clamp(-velocity.x * 3.2, -0.44, 0.44);
                    const targetTiltX = clamp(velocity.y * 2.4, -0.32, 0.32);
                    lamp.rotation.z += (targetTiltZ - lamp.rotation.z) * 0.12;
                    lamp.rotation.x += (targetTiltX - lamp.rotation.x) * 0.1;
                    orientLampSpoutToVelocity(lamp, velocity, 0.16);
                    velocity.multiplyScalar(0.88);
                    if (velocity.length() < 0.002) lamp.userData.dragVelocity = null;
                }
                const floatY = Math.sin(elapsed * 0.78) * 0.026;
                const target = lampDefaultPosition.clone();
                target.y += floatY;
                lamp.position.lerp(target, 0.038);
                lamp.rotation.x += (0 - lamp.rotation.x) * 0.055;
                lamp.rotation.y += (0 - lamp.rotation.y) * 0.055;
                lamp.rotation.z += (Math.sin(elapsed * 0.52) * 0.012 - lamp.rotation.z) * 0.06;
            }
            lampProjectionOffsetTarget.copy(lamp.position).sub(lampDefaultPosition);
            lampProjectionOffset.lerp(lampProjectionOffsetTarget, 0.08);
            updateSpoutFromLamp(lamp);
        }

        function unregisterEditable(object) {
            const e = editableObjects.indexOf(object);
            if (e >= 0) editableObjects.splice(e, 1);
            const s = selectableObjects.indexOf(object);
            if (s >= 0) selectableObjects.splice(s, 1);
            renderObjectList();
        }

        function setStatus(message) {
            statusEl.textContent = message;
        }

        function snapshotObject(object) {
            return {
                uuid: object.uuid,
                name: object.name,
                position: object.position.toArray(),
                rotation: [object.rotation.x, object.rotation.y, object.rotation.z],
                scale: object.scale.toArray(),
                visible: object.visible
            };
        }

        function applySnapshot(object, snapshot) {
            object.position.fromArray(snapshot.position);
            object.rotation.set(snapshot.rotation[0], snapshot.rotation[1], snapshot.rotation[2]);
            object.scale.fromArray(snapshot.scale);
            object.visible = snapshot.visible;
            object.updateMatrixWorld(true);
            if (object.userData.assetId === "lamp") updateSpoutFromLamp(object);
            updateInspector();
            updateProjectionState();
        }

        function pushTransformAction(object, before, after, label = "Transform") {
            if (!object || JSON.stringify(before) === JSON.stringify(after)) return;
            const cloneSnapshot = (snapshot) => ({
                ...snapshot,
                position: [...snapshot.position],
                rotation: [...snapshot.rotation],
                scale: [...snapshot.scale]
            });
            actionStack.push({ type: "transform", object, before: cloneSnapshot(before), after: cloneSnapshot(after), label });
            redoStack.length = 0;
        }

        function clonePageSnapshot(snapshot) {
            return JSON.parse(JSON.stringify(snapshot));
        }

        function snapshotPageElement(entry) {
            return entry ? pageElementData(entry) : null;
        }

        function pushPageAction(entry, before, after, label = "Page edit") {
            if (!entry || !before || !after || JSON.stringify(before) === JSON.stringify(after)) return;
            actionStack.push({
                type: "page",
                id: entry.id,
                before: clonePageSnapshot(before),
                after: clonePageSnapshot(after),
                label
            });
            redoStack.length = 0;
        }

        function runUndo() {
            const action = actionStack.pop();
            if (!action) return;
            if (action.type === "transform") applySnapshot(action.object, action.before);
            if (action.type === "page") applySinglePageSnapshot(action.before);
            if (action.type === "page-add") {
                const entry = pageElements.get(action.snapshot.id);
                entry?.element?.remove();
                pageElements.delete(action.snapshot.id);
                clearPageEditorFrames();
                renderPageTimeline();
                renderPageEditorFrames();
            }
            if (action.type === "delete") {
                action.parent.add(action.object);
                registerEditable(action.object);
                attachToObject(action.object);
            }
            if (action.type === "add") {
                action.parent.remove(action.object);
                unregisterEditable(action.object);
                if (selectedObject === action.object) detachSelection();
            }
            redoStack.push(action);
            setStatus(`Undo: ${action.label}.`);
        }

        function runRedo() {
            const action = redoStack.pop();
            if (!action) return;
            if (action.type === "transform") applySnapshot(action.object, action.after);
            if (action.type === "page") applySinglePageSnapshot(action.after);
            if (action.type === "page-add") applySinglePageSnapshot(action.snapshot);
            if (action.type === "delete") {
                action.parent.remove(action.object);
                unregisterEditable(action.object);
                if (selectedObject === action.object) detachSelection();
            }
            if (action.type === "add") {
                action.parent.add(action.object);
                registerEditable(action.object);
                attachToObject(action.object);
            }
            actionStack.push(action);
            setStatus(`Redo: ${action.label}.`);
        }

        function setActiveModeButton(mode) {
            translateBtn.classList.toggle("active", mode === "translate");
            rotateBtn.classList.toggle("active", mode === "rotate");
            scaleBtn.classList.toggle("active", mode === "scale");
        }

        function setTransformMode(mode) {
            transformControls.setMode(mode);
            setActiveModeButton(mode);
            if (selectedObject) setStatus(`Selected: ${selectedObject.name || "object"}. Mode: ${mode}.`);
        }

        function attachToObject(object) {
            if (!object || object.userData.editorLocked || object.userData.editorHidden || object.visible === false) return;
            multiSelectedObjects.clear();
            selectedObject = object;
            transformControls.attach(object);
            transformControls.visible = sceneMode;
            transformControls.enabled = sceneMode;
            selectionRing.visible = sceneMode;
            setStatus(`Selected: ${object.name || "object"}.`);
            renderObjectList();
            updateInspector();
        }

        function detachSelection() {
            selectedObject = null;
            multiSelectedObjects.clear();
            transformControls.detach();
            selectionRing.visible = false;
            setStatus("Selection cleared.");
            renderObjectList();
            updateInspector();
        }

        function findSelectableRoot(object) {
            let current = object;
            while (current) {
                if (current.userData && current.userData.selectableRoot) return current.userData.selectableRoot;
                current = current.parent;
            }
            return null;
        }

        function bestSelectableHit(hits, { interactive = false } = {}) {
            const candidates = hits
                .map((hit) => ({ hit, root: findSelectableRoot(hit.object) || hit.object }))
                .filter(({ root }) => root && root.visible !== false && !root.userData.editorHidden && !root.userData.editorLocked);
            if (!candidates.length) return null;
            candidates.sort((a, b) => {
                const priorityDelta = (b.root.userData.selectionPriority || 0) - (a.root.userData.selectionPriority || 0);
                if (priorityDelta) return priorityDelta;
                if (interactive) {
                    const alphaDelta = (alphaForProject(projectKeys.indexOf(b.root.userData.projectKey)) || 0) - (alphaForProject(projectKeys.indexOf(a.root.userData.projectKey)) || 0);
                    if (alphaDelta) return alphaDelta;
                }
                return a.hit.distance - b.hit.distance;
            });
            return candidates[0].root;
        }

        function pointerRayFromEvent(event) {
            const rect = renderer.domElement.getBoundingClientRect();
            pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(pointer, camera);
        }

        function pickFlyingCarpet(event) {
            if (!objectInteractionsEnabled()) return null;
            const rug = assetObjects.get("rug");
            const mesh = rug?.userData?.carpet?.mesh;
            if (!mesh || !rug.visible) return null;
            pointerRayFromEvent(event);
            return raycaster.intersectObject(mesh, false)[0] || null;
        }

        function startFlyingCarpetDrag(event, hit) {
            const rug = assetObjects.get("rug");
            const data = rug?.userData?.carpet;
            if (!data || data.flat || !objectInteractionsEnabled() || !hit?.uv) return false;
            beginPointerInteraction(event);
            draggedCarpet = data;
            draggedCarpetNode = Math.round(hit.uv.y * data.segX) + (data.segX + 1) * Math.round((1 - hit.uv.x) * data.segZ);
            draggedCarpetNode = Math.round(clamp(draggedCarpetNode, 0, data.curr.length / 3 - 1));
            const normal = new THREE.Vector3();
            camera.getWorldDirection(normal);
            carpetDragPlane.setFromNormalAndCoplanarPoint(normal, hit.point);
            rug.worldToLocal(carpetDragTarget.copy(hit.point));
            document.body.style.cursor = "grabbing";
            event.preventDefault();
            return true;
        }

        function updateFlyingCarpetPointer(event) {
            if (!objectInteractionsEnabled()) return false;
            const rug = assetObjects.get("rug");
            const data = rug?.userData?.carpet;
            if (!data || data.flat) return false;
            pointerRayFromEvent(event);
            if (draggedCarpet === data) {
                const worldHit = new THREE.Vector3();
                if (raycaster.ray.intersectPlane(carpetDragPlane, worldHit)) rug.worldToLocal(carpetDragTarget.copy(worldHit));
                return true;
            }
            const hit = raycaster.intersectObject(data.mesh, false)[0];
            if (hit) {
                const local = rug.worldToLocal(hit.point.clone());
                data.hoverTargetPoint.set(local.x, local.z);
                data.hoverTarget = 1;
                data.hoverPulse = Math.min(1, data.hoverPulse + 0.075);
                if (!sceneMode) document.body.style.cursor = "crosshair";
                return true;
            }
            data.hoverTarget = 0;
            return false;
        }

        function beginPointerInteraction(event) {
            activeInteractionPointerId = event.pointerId;
            activeInteractionPointerTarget = event.target?.setPointerCapture ? event.target : null;
            try {
                activeInteractionPointerTarget?.setPointerCapture(event.pointerId);
            } catch (error) {
                activeInteractionPointerTarget = null;
            }
        }

        function releasePointerInteraction(event = null, { force = false } = {}) {
            if (event?.pointerType === "touch") activeTouchPointers.delete(event.pointerId);
            if (force) activeTouchPointers.clear();
            if (!force && activeInteractionPointerId !== null && event?.pointerId !== activeInteractionPointerId) return;
            try {
                if (activeInteractionPointerId !== null && activeInteractionPointerTarget?.hasPointerCapture?.(activeInteractionPointerId)) {
                    activeInteractionPointerTarget.releasePointerCapture(activeInteractionPointerId);
                }
            } catch (error) {
                // The pointer may already have been released by the browser.
            }
            draggedCarpet = null;
            draggedCarpetNode = -1;
            grabbedProjection = null;
            activeInteractionPointerId = null;
            activeInteractionPointerTarget = null;
            document.body.style.cursor = hoveredInteractive ? "grab" : "";
        }

        function maybeUnlockDevFromMobileCorners(event) {
            const mobilePointer = window.matchMedia("(pointer: coarse)").matches || event.pointerType === "touch";
            if (devModeEnabled || !mobilePointer) return false;
            const margin = Math.min(96, Math.max(44, window.innerWidth * 0.16));
            const x = event.clientX;
            const y = event.clientY;
            const corner =
                x < margin && y > window.innerHeight - margin ? "bl" :
                x > window.innerWidth - margin && y > window.innerHeight - margin ? "br" :
                x > window.innerWidth - margin && y < margin ? "tr" :
                x < margin && y < margin ? "tl" : "";
            if (!corner) return false;
            const expected = ["bl", "br", "tr", "tl"][mobileDevCorners.length];
            if (corner === expected) mobileDevCorners.push(corner);
            else {
                mobileDevCorners.length = 0;
                if (corner === "bl") mobileDevCorners.push(corner);
            }
            if (mobileDevCorners.length === 4) {
                mobileDevCorners.length = 0;
                setDevMode(true);
                event.preventDefault();
                return true;
            }
            return false;
        }

        function onPointerDown(event) {
            if (event.pointerType === "touch") {
                activeTouchPointers.add(event.pointerId);
                if (activeTouchPointers.size > 1) {
                    releasePointerInteraction(null, { force: true });
                    return;
                }
            }
            if (maybeUnlockDevFromMobileCorners(event)) return;
            if (objectInteractionsEnabled() && !sceneMode && currentEnvironmentOpacity > 0.2 && !event.target.closest?.("a, button, input, textarea, select, label, #scene-hud, #camera-timeline-dock, #page-editor-panel, #page-timeline-dock, .page-editor-frame")) {
                const hit = pickInteractiveProjection(event);
                if (hit) {
                    event.preventDefault();
                    beginPointerInteraction(event);
                    grabbedProjection = hit;
                    grabStartX = event.clientX;
                    grabStartY = event.clientY;
                    const grabAxis = hit.userData.grabAxis || "y";
                    grabStartRotation = grabAxis === "screen" || grabAxis === "dual-return" ? hit.rotation.y : hit.rotation[grabAxis];
                    grabStartRotations = { x: hit.rotation.x, y: hit.rotation.y, z: hit.rotation.z };
                    grabStartQuaternion.copy(hit.quaternion);
                    grabLastPosition.copy(hit.position);
                    grabLastX = event.clientX;
                    grabLastY = event.clientY;
                    grabLastTime = performance.now();
                    hit.userData.inertia = null;
                    if (hit.userData.dragMove) {
                        const normal = new THREE.Vector3();
                        camera.getWorldDirection(normal);
                        grabMovePlane.setFromNormalAndCoplanarPoint(normal, hit.getWorldPosition(new THREE.Vector3()));
                    }
                    document.body.style.cursor = "grabbing";
                    return;
                }
                const carpetHit = pickFlyingCarpet(event);
                if (carpetHit && startFlyingCarpetDrag(event, carpetHit)) return;
                return;
            }
            if (!sceneMode || event.target !== renderer.domElement) return;
            const rect = renderer.domElement.getBoundingClientRect();
            pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(pointer, camera);
            const hits = raycaster.intersectObjects(selectableObjects, true);
            if (hits.length > 0) {
                const rootObject = bestSelectableHit(hits);
                if (rootObject) attachToObject(rootObject);
            }
        }

        function pickInteractiveProjection(event) {
            if (!objectInteractionsEnabled()) return null;
            pointerRayFromEvent(event);
            const roots = [...interactiveProjectionRoots].filter((object) => object.visible && !object.userData.editorHidden && !object.userData.editorLocked);
            const hits = raycaster.intersectObjects(roots, true);
            if (!hits.length) return null;
            return bestSelectableHit(hits, { interactive: true });
        }

        function onProjectionDoubleClick(event) {
            if (!objectInteractionsEnabled() || sceneMode || currentEnvironmentOpacity < 0.2) return;
            const hit = pickInteractiveProjection(event);
            const timelineActive = activeProjectKey() === "timeline" && alphaForProject(3) > 0.45;
            if ((hit && (hit.userData.projectKey === "timeline" || hit.userData.assetId === "hourglass")) || (!hit && timelineActive)) {
                flipHourglassProjection();
            }
            if (hit && (hit.userData.projectKey === "animations" || hit.userData.assetId === "animation-screen")) {
                heartBurst.classList.remove("active");
                void heartBurst.offsetWidth;
                heartBurst.classList.add("active");
            }
        }

        function flipHourglassProjection() {
            hourglassFlipTarget += Math.PI;
            hourglassFlipProgress = 0;
            setStatus("Hourglass flipped. Sand reset.");
        }

        function updateInspector() {
            transformInputs.forEach((input) => {
                if (!selectedObject) {
                    input.value = "";
                    input.disabled = true;
                    return;
                }
                input.disabled = false;
                const transform = input.dataset.transform;
                const axis = input.dataset.axis;
                const value = transform === "rotation"
                    ? THREE.MathUtils.radToDeg(selectedObject.rotation[axis])
                    : selectedObject[transform][axis];
                input.value = Number(value).toFixed(transform === "rotation" ? 1 : 2);
            });
        }

        function applyInspectorValue(input) {
            if (!selectedObject) return;
            const transform = input.dataset.transform;
            const axis = input.dataset.axis;
            const value = parseFloat(input.value);
            if (!Number.isFinite(value)) return;
            const targets = multiSelectedObjects.size ? [...multiSelectedObjects] : [selectedObject];
            targets.forEach((object) => {
                if (object.userData.editorLocked || object.userData.editorHidden) return;
                const before = snapshotObject(object);
                if (transform === "rotation") object.rotation[axis] = THREE.MathUtils.degToRad(value);
                else object[transform][axis] = value;
                if (object.userData.assetId === "lamp") updateSpoutFromLamp(object);
                const after = snapshotObject(object);
                pushTransformAction(object, before, after, "Inspector edit");
            });
            updateSelectionRing();
        }

        function renderObjectList() {
            if (!devModeEnabled || !objectListEl) return;
            objectListEl.innerHTML = "";
            editableObjects.forEach((object) => {
                const item = document.createElement("div");
                item.className = `object-item${object === selectedObject ? " active" : ""}${multiSelectedObjects.has(object) ? " multi" : ""}`;
                const select = document.createElement("button");
                select.type = "button";
                select.className = "object-select";
                select.innerHTML = `<span>${object.name || "Object"}</span><span>${object.userData.assetId || "custom"}</span>`;
                select.addEventListener("click", (event) => {
                    if (event.ctrlKey || event.metaKey) {
                        if (!multiSelectedObjects.size && selectedObject && selectedObject !== object) multiSelectedObjects.add(selectedObject);
                        if (multiSelectedObjects.has(object)) multiSelectedObjects.delete(object);
                        else multiSelectedObjects.add(object);
                        selectedObject = multiSelectedObjects.values().next().value || object;
                        if (selectedObject && !selectedObject.userData.editorLocked && !selectedObject.userData.editorHidden) transformControls.attach(selectedObject);
                        renderObjectList();
                        updateInspector();
                        setStatus(`${multiSelectedObjects.size} object${multiSelectedObjects.size === 1 ? "" : "s"} selected. Inspector edits apply to all selected.`);
                    } else {
                        attachToObject(object);
                    }
                });
                const lock = document.createElement("button");
                lock.type = "button";
                lock.className = `object-mini${object.userData.editorLocked ? " active" : ""}`;
                lock.innerHTML = `<i class="ph ph-${object.userData.editorLocked ? "lock" : "lock-open"}" aria-hidden="true"></i>`;
                lock.title = "Lock object. Shift-click locks all others.";
                lock.addEventListener("click", (event) => {
                    event.stopPropagation();
                    if (event.shiftKey) {
                        const isolated = editableObjects.every((candidate) => candidate === object || candidate.userData.editorLocked);
                        editableObjects.forEach((candidate) => { candidate.userData.editorLocked = isolated ? false : candidate !== object; });
                        object.userData.editorLocked = false;
                    } else object.userData.editorLocked = !object.userData.editorLocked;
                    if (object.userData.editorLocked && selectedObject === object) detachSelection();
                    renderObjectList();
                });
                const hide = document.createElement("button");
                hide.type = "button";
                hide.className = `object-mini${object.userData.editorHidden ? " active" : ""}`;
                hide.innerHTML = `<i class="ph ph-${object.userData.editorHidden ? "eye-closed" : "eye"}" aria-hidden="true"></i>`;
                hide.title = "Hide object. Shift-click hides all others.";
                hide.addEventListener("click", (event) => {
                    event.stopPropagation();
                    if (event.shiftKey) {
                        const isolated = editableObjects.every((candidate) => candidate === object || candidate.userData.editorHidden || candidate.visible === false);
                        editableObjects.forEach((candidate) => {
                            candidate.userData.editorHidden = isolated ? false : candidate !== object;
                            candidate.visible = isolated ? true : candidate === object;
                        });
                    } else {
                        object.userData.editorHidden = !object.userData.editorHidden;
                        object.visible = !object.userData.editorHidden;
                    }
                    if (object.userData.editorHidden && selectedObject === object) detachSelection();
                    renderObjectList();
                    updateProjectionState();
                });
                item.append(select, lock, hide);
                objectListEl.appendChild(item);
            });
            if (!editableObjects.length) {
                const empty = document.createElement("div");
                empty.className = "text-xs text-white/42";
                empty.textContent = "No editable objects.";
                objectListEl.appendChild(empty);
            }
        }

        function deleteSelectedObject() {
            if (!selectedObject) return;
            const object = selectedObject;
            const parent = object.parent;
            parent.remove(object);
            unregisterEditable(object);
            detachSelection();
            actionStack.push({ type: "delete", object, parent, label: `Delete ${object.name || "object"}` });
            redoStack.length = 0;
            setStatus(`Deleted ${object.name || "object"}.`);
        }

        function resetSelectedObject() {
            const targets = multiSelectedObjects.size ? [...multiSelectedObjects] : selectedObject ? [selectedObject] : [];
            if (!targets.length) return;
            targets.forEach((object) => {
                const snapshot = object.userData.defaultTransform;
                if (!snapshot || object.userData.editorLocked) return;
                const before = snapshotObject(object);
                applySnapshot(object, snapshot);
                pushTransformAction(object, before, snapshotObject(object), `Reset ${object.name || "object"}`);
            });
            updateInspector();
            renderObjectList();
            setStatus(`Reset ${targets.length} object${targets.length === 1 ? "" : "s"} to defaults.`);
        }

        function addEditorLight() {
            const light = new THREE.PointLight(0x8edcff, 2.1, 9);
            light.name = `Point Light ${editableObjects.filter((o) => o.isLight).length + 1}`;
            light.position.set(camera.position.x, camera.position.y, camera.position.z - 1.5);
            light.userData.assetId = "point-light";
            editableRoot.add(light);
            registerEditable(light);
            attachToObject(light);
            actionStack.push({ type: "add", object: light, parent: editableRoot, label: `Add ${light.name}` });
            redoStack.length = 0;
        }

        function fitModelToBox(object, options = {}) {
            const target = options.target ?? 2;
            const fit = options.fit ?? "max";
            const box = new THREE.Box3().setFromObject(object);
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();
            box.getSize(size);
            box.getCenter(center);
            const dimension = fit === "xz" ? Math.max(size.x, size.z) : Math.max(size.x, size.y, size.z);
            if (dimension > 0) object.scale.multiplyScalar(target / dimension);
            const scaledBox = new THREE.Box3().setFromObject(object);
            const scaledCenter = new THREE.Vector3();
            scaledBox.getCenter(scaledCenter);
            object.position.sub(scaledCenter);
            if (options.floorY !== undefined) {
                const floorBox = new THREE.Box3().setFromObject(object);
                object.position.y += options.floorY - floorBox.min.y;
            }
        }

        function centerPivotOnBounds(object) {
            object.updateMatrixWorld(true);
            const box = new THREE.Box3().setFromObject(object);
            if (box.isEmpty()) return;
            const center = box.getCenter(new THREE.Vector3());
            const delta = center.clone().sub(object.position);
            object.children.forEach((child) => child.position.sub(delta));
            object.position.copy(center);
        }

        function prepareEditableModel(rootObject, assetId) {
            rootObject.traverse((child) => {
                if (!child.isMesh) return;
                child.castShadow = true;
                child.receiveShadow = true;
                child.userData.selectableRoot = rootObject;
            });
            rootObject.userData.assetId = assetId;
            rootObject.userData.selectableRoot = rootObject;
            rootObject.userData.editable = true;
        }

        function addLampSelectionProxy(lamp) {
            lamp.updateMatrixWorld(true);
            const box = new THREE.Box3();
            lamp.traverse((child) => {
                if (child.isMesh && !child.userData.selectionProxy) box.expandByObject(child);
            });
            if (box.isEmpty()) return;
            const worldScale = lamp.getWorldScale(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3()).multiplyScalar(1.06);
            const localCenter = lamp.worldToLocal(center.clone());
            const localSize = new THREE.Vector3(
                size.x / Math.max(worldScale.x, 0.0001),
                size.y / Math.max(worldScale.y, 0.0001),
                size.z / Math.max(worldScale.z, 0.0001)
            );
            const proxy = new THREE.Mesh(
                new THREE.BoxGeometry(localSize.x, localSize.y, localSize.z),
                new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
            );
            proxy.name = "Lamp visual selection volume";
            proxy.position.copy(localCenter);
            proxy.userData.selectableRoot = lamp;
            proxy.userData.selectionProxy = true;
            proxy.renderOrder = -10;
            lamp.add(proxy);
        }

        async function ensureModelDecoder(path) {
            if (!path.includes("/optimized/")) return;
            meshoptDecoderPromise ||= import("three/addons/libs/meshopt_decoder.module.js").then(({ MeshoptDecoder }) => {
                gltfLoader.setMeshoptDecoder(MeshoptDecoder);
                return MeshoptDecoder;
            });
            await meshoptDecoderPromise;
        }

        async function loadGLB(path) {
            await ensureModelDecoder(path);
            return new Promise((resolve, reject) => {
                gltfLoader.load(path, (gltf) => resolve(gltf.scene), undefined, reject);
            });
        }

        let historyAssetLoadPromise = null;

        function requestHistoryAssetLoad() {
            if (assetObjects.has("bull") || historyAssetLoadPromise || effectiveQualityPreset() === "lowest") return;
            historyAssetLoadPromise = loadGLB(modelPath("bull"))
                .then((bullAsset) => {
                    stageBullAsset(bullAsset);
                    setStatus("Loaded history projection asset.");
                })
                .catch((error) => console.warn("History projection asset failed to load.", error));
        }

        function stageBullAsset(bull) {
            bull.name = "Achaemenid Bull Column Hologram";
            prepareEditableModel(bull, "achaemenid-bull-column");
            applyProjectMaterial(bull, "history", { wireframe: true, opacityMultiplier: 0.08 });
            addEdgeOverlay(bull, "history", 12, 0.18);
            fitModelToBox(bull, { target: 1.85 });
            bull.position.copy(historyCenter);
            bull.rotation.set(THREE.MathUtils.degToRad(2), THREE.MathUtils.degToRad(-24), 0);
            bull.userData.baseScale = bull.scale.clone();
            bull.userData.grabAxis = "y";
            projectionStage.add(bull);
            registerEditable(bull);
            registerProjectObject("history", bull, { interactive: true });
            createShapeParticleCloud(bull, "history", 520);
            assetObjects.set("bull", bull);
            renderObjectList();
            updateProjectionState();
        }

        async function loadAssetModels() {
            try {
                const title = await loadGLB(modelPaths.title);
                title.name = "Pouya AI Glass Text";
                const titleMeshes = [];
                title.traverse((child) => {
                    if (child.isMesh) titleMeshes.push(child);
                });
                titleMeshes.forEach((child) => {
                    child.material = makeGlassMaterial();
                    child.material.depthTest = false;
                    child.userData.titleBaseOpacity = visualSettings.titleOpacity;
                    child.castShadow = true;
                    child.renderOrder = 30;
                    const frostFill = new THREE.Mesh(
                        child.geometry,
                        new THREE.MeshBasicMaterial({
                            color: 0xf4f9ff,
                            transparent: true,
                            opacity: visualSettings.titleFrost,
                            depthTest: false,
                            depthWrite: false,
                            side: THREE.DoubleSide,
                            polygonOffset: true,
                            polygonOffsetFactor: -1
                        })
                    );
                    frostFill.name = "Frosted Glass Fill";
                    frostFill.userData.titleBaseOpacity = visualSettings.titleFrost;
                    child.add(frostFill);
                    const bodySheen = new THREE.Mesh(
                        child.geometry,
                        new THREE.MeshBasicMaterial({
                            color: 0xeaf5ff,
                            transparent: true,
                            opacity: 0.09,
                            blending: THREE.AdditiveBlending,
                            depthTest: false,
                            depthWrite: false,
                            side: THREE.FrontSide,
                            polygonOffset: true,
                            polygonOffsetFactor: -2
                        })
                    );
                    bodySheen.name = "Prism Glass Body Sheen";
                    bodySheen.userData.prismBaseOpacity = 0.09;
                    bodySheen.userData.titleBaseOpacity = 0.09 * visualSettings.titlePrism;
                    child.add(bodySheen);
                    const rimGlow = new THREE.Mesh(
                        child.geometry,
                        new THREE.MeshBasicMaterial({
                            color: 0xbfd6ff,
                            transparent: true,
                            opacity: 0.1,
                            blending: THREE.AdditiveBlending,
                            depthTest: false,
                            depthWrite: false,
                            side: THREE.BackSide
                        })
                    );
                    rimGlow.name = "Soft Glass Rim Glow";
                    rimGlow.scale.setScalar(1.012);
                    rimGlow.userData.titleBaseOpacity = 0.14;
                    child.add(rimGlow);
                    const edgeLines = new THREE.LineSegments(
                        new THREE.EdgesGeometry(child.geometry, 30),
                        new THREE.LineBasicMaterial({
                            color: 0xffffff,
                            transparent: true,
                            opacity: visualSettings.titleEdges,
                            blending: THREE.AdditiveBlending,
                            depthTest: false,
                            depthWrite: false
                        })
                    );
                    edgeLines.name = "Glass Title Edge Refraction";
                    edgeLines.userData.titleBaseOpacity = visualSettings.titleEdges;
                    child.add(edgeLines);
                    [
                        ["Prism Cyan Refraction", 0x74f5ff, 1.018, 0.1, 0.018],
                        ["Prism Violet Refraction", 0xb8a2ff, 1.024, 0.075, -0.018],
                        ["Prism Gold Refraction", 0xffd68a, 1.014, 0.055, 0.011]
                    ].forEach(([name, color, scale, opacity, offset]) => {
                        const prism = new THREE.LineSegments(
                            new THREE.EdgesGeometry(child.geometry, 24),
                            new THREE.LineBasicMaterial({
                                color,
                                transparent: true,
                                opacity,
                                blending: THREE.AdditiveBlending,
                                depthTest: false,
                                depthWrite: false
                            })
                        );
                        prism.name = name;
                        prism.scale.setScalar(scale);
                        prism.position.x = offset;
                        prism.userData.prismBaseOpacity = opacity;
                        prism.userData.titleBaseOpacity = opacity * visualSettings.titlePrism;
                        child.add(prism);
                    });
                });
                fitModelToBox(title, { target: 5.8 });
                titleGroup.add(title);
                assetObjects.set("title", title);
                document.body.classList.add("title-loaded");
                if (titleFallback) titleFallback.style.opacity = "0";
                resizeTitle();
                setTitleOpacity(currentTitleOpacity);

                installFlyingCarpet(makeFlyingCarpet());
                if (effectiveQualityPreset() === "lowest") {
                    setStatus("Loaded lowest preset assets.");
                    updateProjectionState();
                    return;
                }

                const [lamp, globe, icosahedron, iran] = await Promise.all([
                    loadGLB(modelPath("lamp")),
                    loadGLB(modelPath("globe")),
                    loadGLB(modelPaths.icosahedron),
                    loadGLB(modelPaths.iran)
                ]);

                lamp.name = "Aladdin Lamp";
                prepareEditableModel(lamp, "lamp");
                fitModelToBox(lamp, { target: 1.35, floorY: -0.8 });
                lamp.position.copy(lampDefaultPosition);
                lamp.rotation.set(0, 0, 0);
                lamp.traverse((child) => {
                    if (!child.isMesh) return;
                    child.material = child.material?.clone?.() || new THREE.MeshStandardMaterial({ color: 0xc68b2d });
                    if (child.material.color) child.material.color.lerp(new THREE.Color(0xd6a13a), child.material.map ? 0.12 : 0.48);
                    if (roomEnvironmentTexture) {
                        child.material.envMap = roomEnvironmentTexture;
                        child.material.envMapIntensity = 2.9;
                    } else {
                        child.material.envMapIntensity = 0.35;
                    }
                    if ("metalness" in child.material) child.material.metalness = Math.max(child.material.metalness ?? 0.55, 0.62);
                    if ("roughness" in child.material) child.material.roughness = Math.min(child.material.roughness ?? 0.32, 0.34);
                    if ("emissive" in child.material) {
                        child.material.emissive = new THREE.Color(0x4a2605);
                        child.material.emissiveIntensity = 0.08;
                    }
                    child.material.needsUpdate = true;
                    child.castShadow = true;
                    child.receiveShadow = true;
                });
                lamp.userData.baseScale = lamp.scale.clone();
                lamp.userData.dragMove = true;
                lamp.userData.defaultPosition = lampDefaultPosition.clone();
                lamp.userData.grabAxis = "move-return";
                lamp.userData.selectionPriority = 40;
                addLampSelectionProxy(lamp);
                projectionStage.add(lamp);
                registerEditable(lamp);
                interactiveProjectionRoots.add(lamp);
                assetObjects.set("lamp", lamp);

                globe.name = "GeoIntel Holographic Globe";
                prepareEditableModel(globe, "globe");
                applyProjectMaterial(globe, "geo", { wireframe: true, opacityMultiplier: 0.018 });
                addEdgeOverlay(globe, "geo", 18, 0.62);
                fitModelToBox(globe, { target: 2.0 });
                globe.position.copy(geoCenter);
                globe.rotation.set(THREE.MathUtils.degToRad(23.4), 0, THREE.MathUtils.degToRad(-6));
                globe.userData.baseScale = globe.scale.clone();
                globe.userData.grabAxis = "dual-return";
                globe.userData.restRotation = globe.rotation.clone();
                projectionStage.add(globe);
                registerEditable(globe);
                registerProjectObject("geo", globe, { interactive: true });
                createShapeParticleCloud(globe, "geo", 560);
                assetObjects.set("globe", globe);

                icosahedron.name = "Counter-Rotating Hologram Frame";
                prepareEditableModel(icosahedron, "icosahedron");
                icosahedron.traverse((child) => {
                    if (child.isMesh) {
                        child.material = makeProjectHologramMaterial("geo", 0.06);
                        child.material.userData.projectKey = "geo";
                        child.material.userData.baseOpacity = 0.06;
                        child.material.userData.opacityMultiplier = 0.06;
                    }
                });
                addEdgeOverlay(icosahedron, "geo", 10, 0.32);
                fitModelToBox(icosahedron, { target: 2.42 });
                icosahedron.position.copy(geoCenter);
                icosahedron.userData.baseScale = icosahedron.scale.clone();
                icosahedron.userData.grabAxis = "y";
                projectionStage.add(icosahedron);
                registerEditable(icosahedron);
                registerProjectObject("geo", icosahedron, { interactive: false });
                assetObjects.set("icosahedron", icosahedron);

                iran.name = "Iran Protest Map Hologram";
                prepareEditableModel(iran, "iran-polygon");
                applyProjectMaterial(iran, "iran", { opacityMultiplier: 0.38 });
                addEdgeOverlay(iran, "iran", 8, 0.9);
                fitModelToBox(iran, { target: 2.2 });
                iran.position.copy(iranCenter);
                iran.rotation.set(THREE.MathUtils.degToRad(12), THREE.MathUtils.degToRad(-6), THREE.MathUtils.degToRad(4));
                iran.userData.baseScale = iran.scale.clone();
                iran.userData.grabAxis = "dual-return";
                iran.userData.restRotation = iran.rotation.clone();
                iran.traverse((child) => {
                    if (child.material?.userData?.projectKey === "iran" && child.material.isMeshBasicMaterial) {
                        child.geometry.computeBoundingBox();
                        addIranHeartbeat(child.material, child.geometry.boundingBox.getCenter(new THREE.Vector3()));
                    }
                });
                projectionStage.add(iran);
                registerEditable(iran);
                registerProjectObject("iran", iran, { interactive: true });
                createShapeParticleCloud(iran, "iran", 480);
                assetObjects.set("iran", iran);

                const hourglass = new THREE.Group();
                hourglass.name = "Tech and Politics Timeline Hourglass";
                const hourglassAsset = makeImportedHourglass();
                fitModelToBox(hourglassAsset, { target: 2.0 });
                hourglass.add(hourglassAsset);
                prepareEditableModel(hourglass, "hourglass");
                hourglass.position.copy(timelineCenter);
                hourglass.rotation.set(THREE.MathUtils.degToRad(2), THREE.MathUtils.degToRad(-10), 0);
                hourglass.userData.flipBaseX = hourglass.rotation.x;
                hourglass.userData.baseScale = hourglass.scale.clone();
                hourglass.userData.grabAxis = "y";
                hourglass.userData.hourglassImport = hourglassAsset.userData.hourglassImport;
                projectionStage.add(hourglass);
                registerEditable(hourglass);
                registerProjectObject("timeline", hourglass, { interactive: true });
                createShapeParticleCloud(hourglass, "timeline", 460);
                assetObjects.set("hourglass", hourglass);

                screenGroup.position.copy(animationsCenter);
                screenGroup.rotation.set(THREE.MathUtils.degToRad(-11), THREE.MathUtils.degToRad(-11), 0);
                screenGroup.scale.setScalar(1.05);
                screenGroup.userData.baseScale = screenGroup.scale.clone();
                screenGroup.userData.grabAxis = "screen";
                projectionStage.add(screenGroup);
                registerEditable(screenGroup);
                registerProjectObject("animations", screenGroup, { interactive: true });
                assetObjects.set("animationScreen", screenGroup);

                attachToObject(lamp);
                updateProjectionState();
                setStatus("Loaded genie projection assets.");
            } catch (error) {
                console.error(error);
                setStatus("One or more GLB assets failed to load.");
            }
        }

        function loadModelFromFile(file) {
            if (!file) return;
            const extension = file.name.split(".").pop().toLowerCase();
            if (!["glb", "gltf"].includes(extension)) {
                setStatus("Choose a GLB or GLTF file.");
                return;
            }
            const url = URL.createObjectURL(file);
            setStatus(`Loading ${file.name}...`);
            gltfLoader.load(
                url,
                (gltf) => {
                    const model = gltf.scene;
                    model.name = file.name.replace(/\.(glb|gltf)$/i, "") || "Loaded Model";
                    prepareEditableModel(model, "custom");
                    fitModelToBox(model, { target: 2.1, floorY: -1.18 });
                    model.position.x += 0.6;
                    editableRoot.add(model);
                    registerEditable(model);
                    attachToObject(model);
                    URL.revokeObjectURL(url);
                    setStatus(`Loaded: ${model.name}.`);
                },
                undefined,
                () => {
                    URL.revokeObjectURL(url);
                    setStatus("Model failed to load.");
                }
            );
        }

        function setSceneMode(active) {
            if (active) {
                void ensureDevControls();
                setPageEditorMode(false);
                setSettingsOpen(false);
            }
            sceneMode = active;
            document.body.classList.toggle("scene-mode-active", active);
            document.body.classList.toggle("scene-page-visible", active && scenePageVisible);
            document.body.classList.toggle("scene-layout-preview", active && sceneLayoutPreview);
            sceneToggle.setAttribute("aria-pressed", String(active));
            orbitControls.enabled = active && !scenePageVisible;
            transformControls.visible = active && Boolean(selectedObject);
            transformControls.enabled = active && !scenePageVisible;
            root.setAttribute("aria-hidden", String(!active));
            if (active && !selectedObject && editableObjects[0]) attachToObject(editableObjects[0]);
            updateScrollState();
        }

        function setSettingsOpen(active) {
            if (active) {
                setPageEditorMode(false);
                if (sceneMode) setSceneMode(false);
            }
            settingsOpen = active;
            document.body.classList.toggle("settings-open", active);
            settingsToggle?.setAttribute("aria-pressed", String(active));
            if (active) syncProjectSettingInputs(activeProjectKey());
        }

        function setDevMode(active) {
            devModeEnabled = active;
            document.body.classList.toggle("dev-mode-enabled", active);
            if (!active) {
                setSceneMode(false);
                setSettingsOpen(false);
                setPageEditorMode(false);
            } else {
                void ensureEditorRuntime();
                void ensureDevControls().then(() => {
                    renderObjectList();
                    renderCameraKeyframes();
                    renderCameraSequences();
                });
                setStatus("Dev controls unlocked.");
            }
        }

        function pageFontFamily(preset) {
            return {
                playfair: "'Playfair Display', Georgia, serif",
                cinematic: "Georgia, 'Times New Roman', serif",
                modern: "'Plus Jakarta Sans', system-ui, sans-serif",
                system: "system-ui, sans-serif"
            }[preset] || "";
        }

        function pageElementLabel(element, id) {
            if (element.dataset.projectCard) return element.querySelector(".project-title")?.textContent?.trim() || id;
            if (id.startsWith("about-")) return `About paragraph ${Number(id.split("-")[1] || 0) + 1}`;
            if (id === "hero-title") return "Hero title";
            if (id === "hero-subtitle") return "Hero subtitle";
            if (id === "footer") return "Footer";
            return id.replace(/-/g, " ");
        }

        function maxPageScroll() {
            return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        }

        function projectionIndexToPageTimeline(index) {
            if (!projectViewer) return 0.15 + index * 0.12;
            const y = window.scrollY || 0;
            const rect = projectViewer.getBoundingClientRect();
            const sectionTop = y + rect.top;
            const sectionScrollable = Math.max(projectViewer.offsetHeight - window.innerHeight, 1);
            const progress = projectKeys.length > 1 ? (index / (projectKeys.length - 1)) * 0.88 : 0;
            return clamp((sectionTop + sectionScrollable * progress) / maxPageScroll());
        }

        function elementToPageTimeline(element, fallback = 0) {
            if (!element) return fallback;
            const top = window.scrollY + element.getBoundingClientRect().top;
            return clamp((top + Math.min(element.offsetHeight || 0, window.innerHeight) * 0.35) / maxPageScroll());
        }

        function readPageElementText(element) {
            if (!element) return "";
            const title = element.querySelector?.(".project-title");
            const copy = element.querySelector?.(".project-copy");
            const link = element.querySelector?.(".project-link, .liquid-action");
            if (title || copy || link) {
                const blocks = [];
                if (title) blocks.push(title.textContent.trim());
                if (copy) blocks.push(copy.textContent.trim());
                if (link) blocks.push(`Button: ${link.textContent.trim()}`);
                return blocks.join("\n\n");
            }
            return element.textContent.trim();
        }

        function writePageElementText(entry, text) {
            const element = entry?.element;
            if (!element) return;
            const title = element.querySelector?.(".project-title");
            const copy = element.querySelector?.(".project-copy");
            const link = element.querySelector?.(".project-link, .liquid-action");
            if (title || copy || link) {
                const blocks = text.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
                if (title && blocks[0]) title.textContent = blocks[0];
                if (copy && blocks[1]) copy.textContent = blocks[1];
                const buttonBlock = blocks.find((part) => /^button:/i.test(part));
                if (link && buttonBlock) link.textContent = buttonBlock.replace(/^button:\s*/i, "");
                return;
            }
            element.textContent = text;
        }

        function persistPageElement(entry) {
            if (!entry?.element) return;
            entry.element.dataset.pageEditorLabel = entry.label || "";
            entry.element.dataset.pageEditorTimeline = String(entry.timeline ?? 0);
            entry.element.dataset.pageEditorX = String(entry.x ?? 0);
            entry.element.dataset.pageEditorY = String(entry.y ?? 0);
            entry.element.dataset.pageEditorWidth = String(entry.width ?? 0);
            entry.element.dataset.pageEditorHeight = String(entry.height ?? 0);
            entry.element.dataset.pageEditorOpacity = String(entry.opacity ?? 1);
            entry.element.dataset.pageEditorFont = entry.font || "";
            entry.element.dataset.pageEditorColor = entry.color || "#ffffff";
            entry.element.dataset.pageEditorCustom = entry.custom ? "1" : "";
        }

        function discoverPageElements() {
            const existingSelection = selectedPageElementId;
            pageElements.clear();
            document.querySelectorAll("[data-page-element]").forEach((element) => {
                const id = element.dataset.pageElement;
                if (!id) return;
                let timeline = element.dataset.pageEditorTimeline ? Number(element.dataset.pageEditorTimeline) : elementToPageTimeline(element, 0.2);
                if (element.dataset.projectCard) {
                    const index = projectKeys.indexOf(element.dataset.projectCard);
                    if (!element.dataset.pageEditorTimeline) timeline = projectionIndexToPageTimeline(Math.max(0, index));
                } else if (!element.dataset.pageEditorTimeline && id === "hero-title") timeline = 0.018;
                else if (!element.dataset.pageEditorTimeline && id === "hero-subtitle") timeline = 0.056;
                else if (!element.dataset.pageEditorTimeline && id === "footer") timeline = 0.985;
                const rect = element.getBoundingClientRect();
                const wrapHeight = element.dataset.pageEditorWrapHeight === "1" && !element.dataset.pageEditorHeight;
                const entry = {
                    id,
                    label: element.dataset.pageEditorLabel || pageElementLabel(element, id),
                    element,
                    timeline,
                    x: Number(element.dataset.pageEditorX || 0),
                    y: Number(element.dataset.pageEditorY || 0),
                    width: Number(element.dataset.pageEditorWidth || Math.round(rect.width || 320)),
                    height: wrapHeight ? 0 : Number(element.dataset.pageEditorHeight || Math.round(rect.height || 120)),
                    opacity: Number(element.dataset.pageEditorOpacity || 1),
                    font: element.dataset.pageEditorFont || "",
                    color: element.dataset.pageEditorColor || "#ffffff",
                    text: readPageElementText(element),
                    custom: element.dataset.pageEditorCustom === "1"
                };
                pageElements.set(id, entry);
                applyPageElement(entry);
            });
            pageElementSelect.innerHTML = "";
            pageElements.forEach((entry) => {
                const option = document.createElement("option");
                option.value = entry.id;
                option.textContent = entry.label;
                pageElementSelect.appendChild(option);
            });
            selectedPageElementId = pageElements.has(existingSelection) ? existingSelection : (pageElements.keys().next().value || "");
            if (selectedPageElementId) pageElementSelect.value = selectedPageElementId;
        }

        function applyPageElement(entry) {
            if (!entry?.element) return;
            persistPageElement(entry);
            entry.element.style.setProperty("--page-editor-x", `${entry.x || 0}px`);
            entry.element.style.setProperty("--page-editor-y", `${entry.y || 0}px`);
            entry.element.style.setProperty("--page-editor-opacity", entry.opacity ?? 1);
            if (entry.width) {
                entry.element.style.width = `${entry.width}px`;
                entry.element.style.maxWidth = "min(92vw, var(--page-editor-width, 9999px))";
                entry.element.style.setProperty("--page-editor-width", `${entry.width}px`);
            }
            if (entry.height) entry.element.style.minHeight = `${entry.height}px`;
            else if (entry.element.dataset.pageEditorWrapHeight === "1") entry.element.style.minHeight = "0";
            if (entry.color) {
                entry.element.style.color = entry.color;
                entry.element.querySelectorAll?.(".project-title, .project-copy, .project-link, p").forEach((child) => {
                    child.style.color = entry.color;
                });
            }
            const family = pageFontFamily(entry.font);
            if (family) {
                entry.element.style.fontFamily = family;
                entry.element.querySelectorAll?.(".project-title, .project-copy, .project-link, p").forEach((child) => {
                    child.style.fontFamily = family;
                });
            }
        }

        function setSelectedPageElement(id) {
            if (!pageElements.has(id)) return;
            selectedPageElementId = id;
            const entry = pageElements.get(id);
            const selectedOption = pageElementSelect?.querySelector?.(`option[value="${CSS.escape(id)}"]`);
            if (selectedOption) selectedOption.textContent = entry.label || id;
            if (pageElementName) pageElementName.value = entry.label || "";
            if (pageElementSelect) pageElementSelect.value = id;
            if (pageElementTimeline) pageElementTimeline.value = entry.timeline.toFixed(3);
            if (pageElementTimelineValue) pageElementTimelineValue.textContent = entry.timeline.toFixed(3);
            if (pageElementTimelineNumber) pageElementTimelineNumber.value = entry.timeline.toFixed(3);
            if (pageElementX) pageElementX.value = Math.round(entry.x || 0);
            if (pageElementY) pageElementY.value = Math.round(entry.y || 0);
            if (pageElementWidth) pageElementWidth.value = Math.round(entry.width || entry.element.getBoundingClientRect().width || 0);
            if (pageElementHeight) pageElementHeight.value = Math.round(entry.height || entry.element.getBoundingClientRect().height || 0);
            if (pageElementOpacity) pageElementOpacity.value = entry.opacity ?? 1;
            if (pageElementOpacityValue) pageElementOpacityValue.textContent = Number(entry.opacity ?? 1).toFixed(2);
            if (pageElementFont) pageElementFont.value = entry.font || "";
            if (pageElementColor) pageElementColor.value = entry.color || "#ffffff";
            if (pageElementText) pageElementText.value = readPageElementText(entry.element);
            renderPageEditorFrames();
            renderPageTimeline();
        }

        function pageElementData(entry) {
            return {
                id: entry.id,
                label: entry.label,
                timeline: entry.timeline,
                x: entry.x,
                y: entry.y,
                width: entry.width,
                height: entry.height,
                opacity: entry.opacity,
                font: entry.font,
                color: entry.color,
                text: readPageElementText(entry.element),
                custom: Boolean(entry.custom)
            };
        }

        function applyPageElementConfig(config) {
            if (!config?.elements) return;
            config.elements.forEach((item) => {
                let entry = pageElements.get(item.id);
                if (!entry && item.custom) entry = createPageTextElement(item);
                if (!entry) return;
                Object.assign(entry, item);
                if (item.text !== undefined) writePageElementText(entry, item.text);
                applyPageElement(entry);
            });
            setSelectedPageElement(config.selected || selectedPageElementId || pageElements.keys().next().value);
            renderPageTimeline();
            renderPageEditorFrames();
        }

        function applySinglePageSnapshot(snapshot) {
            if (!snapshot) return;
            let entry = pageElements.get(snapshot.id);
            if (!entry && snapshot.custom) entry = createPageTextElement(snapshot);
            if (!entry) return;
            Object.assign(entry, snapshot);
            if (snapshot.text !== undefined) writePageElementText(entry, snapshot.text);
            applyPageElement(entry);
            setSelectedPageElement(entry.id);
            updateProjectCards();
            updateScrollState();
        }

        function serializePageConfig() {
            return {
                version: 1,
                selected: selectedPageElementId,
                elements: [...pageElements.values()].map(pageElementData)
            };
        }

        function createPageTextElement(seed = {}) {
            const id = seed.id || `custom-text-${++pageElementCounter}`;
            let element = document.querySelector(`[data-page-element="${CSS.escape(id)}"]`);
            if (!element) {
                element = document.createElement("div");
                element.className = "projection-panel glass-plane-enabled custom-page-text";
                element.dataset.pageElement = id;
                const initialText = seed.text || `${seed.label || "Custom title"}\n\nCustom body text`;
                const [initialTitle, initialBody = "Custom body text"] = initialText.split(/\n\s*\n/);
                element.innerHTML = `<div class="project-kicker">Custom</div><h3 class="project-title">${initialTitle || "Custom title"}</h3><p class="project-copy">${initialBody}</p>`;
                document.querySelector(".projection-copy-shell")?.appendChild(element);
            }
            const rect = element.getBoundingClientRect();
            const entry = {
                id,
                label: seed.label || "Custom text",
                element,
                timeline: Number(seed.timeline ?? currentProjectionProgress),
                x: Number(seed.x ?? 0),
                y: Number(seed.y ?? 0),
                width: Number(seed.width ?? Math.round(rect.width || 360)),
                height: Number(seed.height ?? Math.round(rect.height || 120)),
                opacity: Number(seed.opacity ?? 1),
                font: seed.font || "",
                color: seed.color || "#ffffff",
                custom: true
            };
            pageElements.set(id, entry);
            applyPageElement(entry);
            return entry;
        }

        function pageTimelineSections() {
            const max = maxPageScroll();
            const y = window.scrollY || 0;
            const viewerTop = projectViewer ? y + projectViewer.getBoundingClientRect().top : window.innerHeight;
            const viewerScrollable = projectViewer ? Math.max(projectViewer.offsetHeight - window.innerHeight, 1) : max * 0.55;
            const about = document.querySelector("#about");
            const aboutStart = about ? clamp((y + about.getBoundingClientRect().top) / max) : 0.86;
            const sections = [{ label: "Top", start: 0, end: clamp(viewerTop / max), color: "rgba(91, 134, 255, 0.26)" }];
            projectKeys.forEach((key, index) => {
                const startProgress = index === 0 ? 0 : ((index - 0.5) / (projectKeys.length - 1)) * 0.88;
                const endProgress = index === projectKeys.length - 1 ? 0.88 : ((index + 0.5) / (projectKeys.length - 1)) * 0.88;
                sections.push({
                    label: key,
                    start: clamp((viewerTop + viewerScrollable * startProgress) / max),
                    end: clamp((viewerTop + viewerScrollable * endProgress) / max),
                    color: blendedProjectPaletteForKey(key, 0.28)
                });
            });
            sections.push({ label: "About", start: aboutStart, end: 1, color: "rgba(128, 92, 255, 0.28)" });
            return sections.filter((section) => section.end > section.start);
        }

        function blendedProjectPaletteForKey(key, alpha = 0.25) {
            const color = new THREE.Color(projectSettings[key]?.color || "#6ee7ff");
            return `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${alpha})`;
        }

        function renderTimelineSections(track, fullPage = false) {
            if (!track) return;
            track.querySelectorAll(".timeline-section").forEach((section) => section.remove());
            const sections = fullPage ? pageTimelineSections() : [
                { label: "GeoIntel", start: 0, end: 0.11, color: blendedProjectPaletteForKey("geo", 0.26) },
                { label: "Iran", start: 0.11, end: 0.33, color: blendedProjectPaletteForKey("iran", 0.22) },
                { label: "History", start: 0.33, end: 0.55, color: blendedProjectPaletteForKey("history", 0.22) },
                { label: "Timeline", start: 0.55, end: 0.77, color: blendedProjectPaletteForKey("timeline", 0.22) },
                { label: "Animations", start: 0.77, end: 1, color: blendedProjectPaletteForKey("animations", 0.22) }
            ];
            sections.forEach((section) => {
                const el = document.createElement("div");
                el.className = "timeline-section";
                el.style.left = `${section.start * 100}%`;
                el.style.width = `${Math.max(0.5, (section.end - section.start) * 100)}%`;
                el.style.background = section.color;
                el.title = section.label;
                track.prepend(el);
            });
        }

        function renderPageTimeline() {
            if (!pageTimelineTrack) return;
            pageTimelineTrack.querySelectorAll(".page-timeline-chip").forEach((chip) => chip.remove());
            renderTimelineSections(pageTimelineTrack, true);
            pageElements.forEach((entry) => {
                const chip = document.createElement("button");
                chip.type = "button";
                chip.className = `page-timeline-chip ${entry.id === selectedPageElementId ? "active" : ""}`;
                chip.style.left = `${clamp(entry.timeline) * 100}%`;
                chip.textContent = (entry.label || entry.id || "?").trim().charAt(0).toUpperCase();
                chip.style.setProperty("--chip-color", entry.element.dataset.projectCard ? blendedProjectPaletteForKey(entry.element.dataset.projectCard, 0.84) : entry.id.startsWith("about") ? "rgba(150, 116, 255, 0.9)" : "rgba(97, 245, 255, 0.9)");
                chip.title = `${entry.label} @ ${entry.timeline.toFixed(3)}`;
                chip.addEventListener("click", () => setSelectedPageElement(entry.id));
                chip.addEventListener("pointerdown", (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setSelectedPageElement(entry.id);
                    const before = snapshotPageElement(entry);
                    chip.setPointerCapture(event.pointerId);
                    const onMove = (moveEvent) => {
                        entry.timeline = progressFromTimelineEvent(moveEvent, pageTimelineTrack);
                        persistPageElement(entry);
                        chip.style.left = `${entry.timeline * 100}%`;
                        syncSelectedPageTimelineInputs(entry);
                        updateProjectCards();
                        updateAboutScroll(window.scrollY || 0, Math.max(window.innerHeight, 1));
                        renderPageEditorFrames();
                    };
                    const onUp = () => {
                        chip.removeEventListener("pointermove", onMove);
                        chip.removeEventListener("pointerup", onUp);
                        pushPageAction(entry, before, snapshotPageElement(entry), "Move page timeline marker");
                        setSelectedPageElement(entry.id);
                    };
                    chip.addEventListener("pointermove", onMove);
                    chip.addEventListener("pointerup", onUp);
                });
                pageTimelineTrack.appendChild(chip);
            });
        }

        function makePageEditorFrame(entry) {
            const frame = document.createElement("div");
            frame.className = "page-editor-frame";
            frame.dataset.pageFrame = entry.id;
            frame.innerHTML = `<span class="page-editor-frame-label"></span><button class="page-editor-move" type="button" aria-label="Move element"><i class="ph ph-arrows-out-cardinal" aria-hidden="true"></i></button>${["nw", "n", "ne", "e", "se", "s", "sw", "w"].map((handle) => `<span class="page-editor-handle ${handle}" data-handle="${handle}"></span>`).join("")}`;
            frame.querySelector(".page-editor-frame-label").textContent = entry.label;
            frame.addEventListener("pointerdown", (event) => {
                const handle = event.target.dataset.handle;
                if (!handle && !event.target.closest(".page-editor-move")) return;
                event.preventDefault();
                setSelectedPageElement(entry.id);
                const rect = entry.element.getBoundingClientRect();
                pageEditorDrag = {
                    id: entry.id,
                    handle: handle || "move",
                    startX: event.clientX,
                    startY: event.clientY,
                    before: snapshotPageElement(entry),
                    x: entry.x || 0,
                    y: entry.y || 0,
                    width: entry.width || rect.width,
                    height: entry.height || rect.height
                };
                frame.setPointerCapture(event.pointerId);
            });
            frame.addEventListener("pointermove", (event) => {
                if (!pageEditorDrag || pageEditorDrag.id !== entry.id) return;
                event.preventDefault();
                const dx = event.clientX - pageEditorDrag.startX;
                const dy = event.clientY - pageEditorDrag.startY;
                const handle = pageEditorDrag.handle;
                if (handle === "move") {
                    entry.x = pageEditorDrag.x + dx;
                    entry.y = pageEditorDrag.y + dy;
                } else {
                    if (handle.includes("e")) entry.width = Math.max(60, pageEditorDrag.width + dx);
                    if (handle.includes("s")) entry.height = Math.max(32, pageEditorDrag.height + dy);
                    if (handle.includes("w")) {
                        entry.width = Math.max(60, pageEditorDrag.width - dx);
                        entry.x = pageEditorDrag.x + dx;
                    }
                    if (handle.includes("n")) {
                        entry.height = Math.max(32, pageEditorDrag.height - dy);
                        entry.y = pageEditorDrag.y + dy;
                    }
                }
                applyPageElement(entry);
                if (pageElementX) pageElementX.value = Math.round(entry.x || 0);
                if (pageElementY) pageElementY.value = Math.round(entry.y || 0);
                if (pageElementWidth) pageElementWidth.value = Math.round(entry.width || 0);
                if (pageElementHeight) pageElementHeight.value = Math.round(entry.height || 0);
                renderPageEditorFrames();
            });
            frame.addEventListener("pointerup", () => {
                if (pageEditorDrag?.id === entry.id) pushPageAction(entry, pageEditorDrag.before, snapshotPageElement(entry), pageEditorDrag.handle === "move" ? "Move page element" : "Resize page element");
                pageEditorDrag = null;
            });
            document.body.appendChild(frame);
            return frame;
        }

        function renderPageEditorFrames() {
            if (!pageEditorActive) return;
            let firstVisibleId = "";
            pageElements.forEach((entry) => {
                const frame = pageEditorFrames.get(entry.id) || makePageEditorFrame(entry);
                pageEditorFrames.set(entry.id, frame);
                const rect = entry.element.getBoundingClientRect();
                const alpha = alphaForPageTimeline(entry.timeline, 0.055, 0.025);
                const computedTransform = getComputedStyle(entry.element).transform;
                frame.classList.toggle("active", entry.id === selectedPageElementId);
                frame.style.left = `${rect.left}px`;
                frame.style.top = `${rect.top}px`;
                frame.style.width = `${rect.width}px`;
                frame.style.height = `${rect.height}px`;
                frame.style.transform = computedTransform && computedTransform !== "none" ? computedTransform : "";
                frame.style.transformOrigin = getComputedStyle(entry.element).transformOrigin || "center center";
                const visible = !(alpha < 0.08 || rect.width < 8 || rect.height < 8 || rect.bottom < 0 || rect.top > window.innerHeight);
                frame.style.display = visible ? "block" : "none";
                if (visible && !firstVisibleId) firstVisibleId = entry.id;
            });
            const selectedFrame = pageEditorFrames.get(selectedPageElementId);
            if (!repairingPageSelection && firstVisibleId && selectedFrame && selectedFrame.style.display === "none") {
                repairingPageSelection = true;
                setSelectedPageElement(firstVisibleId);
                repairingPageSelection = false;
            }
        }

        function clearPageEditorFrames() {
            pageEditorFrames.forEach((frame) => frame.remove());
            pageEditorFrames.clear();
            pageEditorDrag = null;
        }

        function setPageEditorMode(active) {
            if (active && !devModeEnabled) return;
            pageEditorActive = active;
            document.body.classList.toggle("page-editor-active", active);
            if (active) {
                setSceneMode(false);
                setSettingsOpen(false);
                discoverPageElements();
                renderPageTimeline();
                renderPageEditorFrames();
                const visibleFrame = [...pageEditorFrames.values()].find((frame) => getComputedStyle(frame).display !== "none");
                setSelectedPageElement(visibleFrame?.dataset.pageFrame || selectedPageElementId || pageElements.keys().next().value);
            } else {
                clearPageEditorFrames();
            }
            setStatus(active ? "Page editor on. Drag outlines, resize handles, or timeline chips." : "Page editor off.");
        }

        function setScenePageVisible(active) {
            scenePageVisible = active;
            document.body.classList.toggle("scene-page-visible", sceneMode && scenePageVisible);
            orbitControls.enabled = sceneMode && !scenePageVisible;
            transformControls.enabled = sceneMode && !scenePageVisible;
        }

        function setSceneLayoutPreview(active) {
            sceneLayoutPreview = active;
            document.body.classList.toggle("scene-layout-preview", sceneMode && sceneLayoutPreview);
            setStatus(sceneLayoutPreview ? "Layout preview overlay on. Page UI is visible but not interactive." : "Layout preview overlay off.");
        }

        function setEnvironmentOpacity(opacity) {
            currentEnvironmentOpacity = opacity;
            renderer.setClearColor(new THREE.Color(visualSettings.backgroundColor), visualSettings.backgroundAlpha * opacity);
            projectionStage.visible = opacity > 0.035;
            editableRoot.visible = opacity > 0.035;
            cube.visible = sceneMode && opacity > 0.035;
            fadeMaterials.forEach((material) => {
                const baseOpacity = material.userData.baseOpacity ?? 1;
                material.opacity = baseOpacity * opacity;
                material.visible = material.opacity > 0.003;
            });
            selectionRing.visible = sceneMode && Boolean(selectedObject) && opacity > 0.1;
        }

        function setTitleOpacity(opacity) {
            currentTitleOpacity = opacity;
            titleGroup.visible = opacity > 0.01;
            titleGroup.traverse((child) => {
                if (child.material && child.material.opacity !== undefined) {
                    const base = child.userData.titleBaseOpacity ?? (child.isSprite ? 0.5 : 0.72);
                    child.material.opacity = base * opacity;
                }
            });
        }

        function alphaForProject(index) {
            const delta = Math.abs(projectionFloat - index);
            if (delta <= 0.34) return 1;
            if (delta >= 0.5) return 0;
            return smootherstep(clamp(1 - (delta - 0.34) / 0.16));
        }

        function currentPageTimeline() {
            return clamp((window.scrollY || 0) / maxPageScroll());
        }

        function progressFromTimelineEvent(event, track) {
            const rect = track.getBoundingClientRect();
            return clamp((event.clientX - rect.left) / Math.max(rect.width, 1));
        }

        function syncSelectedPageTimelineInputs(entry) {
            if (!entry || entry.id !== selectedPageElementId) return;
            const value = entry.timeline.toFixed(3);
            if (pageElementTimeline) pageElementTimeline.value = value;
            if (pageElementTimelineValue) pageElementTimelineValue.textContent = value;
            if (pageElementTimelineNumber) pageElementTimelineNumber.value = value;
        }

        function setCameraTimelineProgress(progress, previewRig = cameraThirdPerson) {
            const t = clamp(progress);
            cameraPlaying = false;
            if (scrollSyncToggle?.checked) scrollSyncToggle.checked = false;
            if (cameraTimeline) cameraTimeline.value = t.toFixed(3);
            document.documentElement.style.setProperty("--timeline-progress", t.toFixed(3));
            applyCameraAnimation(t, true, previewRig);
            return t;
        }

        function setPageTimelineProgress(progress) {
            const t = clamp(progress);
            document.documentElement.style.setProperty("--page-timeline-progress", t.toFixed(3));
            window.scrollTo({ top: t * maxPageScroll(), behavior: "auto" });
            updateScrollState();
            renderPageEditorFrames();
            return t;
        }

        function alphaForPageTimeline(timeline, radius = 0.052, feather = 0.035) {
            const distance = Math.abs(currentPageTimeline() - Number(timeline || 0));
            if (distance <= radius) return 1;
            if (distance >= radius + feather) return 0;
            return smootherstep(clamp(1 - (distance - radius) / feather));
        }

        function particleAlphaForProject(index) {
            const delta = Math.abs(projectionFloat - index);
            if (delta <= 0.32) return 1;
            if (delta >= 0.54) return 0;
            return smootherstep(clamp(1 - (delta - 0.32) / 0.22));
        }

        function projectVectorAt(floatIndex) {
            const max = projectKeys.length - 1;
            const clamped = clamp(floatIndex, 0, max);
            const index = Math.min(max - 1, Math.floor(clamped));
            const local = smoothstep(clamped - index);
            const from = projectCenterForKey(projectKeys[index]);
            const to = projectCenterForKey(projectKeys[index + 1]);
            return new THREE.Vector3().lerpVectors(
                from,
                to,
                local
            );
        }

        function projectCenterForKey(projectKey) {
            const objects = projectObjects.get(projectKey) || [];
            const visibleObjects = objects.filter((object) => object.visible);
            if (!visibleObjects.length) return projectCenters[projectKey].clone();
            const box = new THREE.Box3();
            let found = false;
            visibleObjects.forEach((object) => {
                box.expandByObject(object);
                found = true;
            });
            if (!found || box.isEmpty()) return projectCenters[projectKey].clone();
            return box.getCenter(new THREE.Vector3());
        }

        function updateProjectCards() {
            projectCards.forEach((card, index) => {
                const entry = pageElements.get(card.dataset.pageElement);
                const timelineAlpha = entry ? alphaForPageTimeline(entry.timeline, 0.045, 0.032) : alphaForProject(index);
                const delta = entry ? (currentPageTimeline() - entry.timeline) * 15 : projectionFloat - index;
                const alpha = timelineAlpha;
                const y = delta * -118;
                card.style.setProperty("--panel-opacity", alpha.toFixed(3));
                card.style.setProperty("--panel-y", `${y.toFixed(1)}px`);
                card.style.setProperty("--card-tilt-x", `${(-pointerCurrent.y * 4.2).toFixed(2)}deg`);
                card.style.setProperty("--card-tilt-y", `${(pointerCurrent.x * 5.2).toFixed(2)}deg`);
                card.style.visibility = alpha > 0.025 ? "visible" : "hidden";
                card.classList.toggle("active", alpha > 0.55);
            });
            pageElements.forEach((entry) => {
                if (!entry.custom || !entry.element) return;
                const alpha = alphaForPageTimeline(entry.timeline, 0.045, 0.032);
                const delta = (currentPageTimeline() - entry.timeline) * 15;
                entry.element.style.setProperty("--panel-opacity", alpha.toFixed(3));
                entry.element.style.setProperty("--panel-y", `${(delta * -118).toFixed(1)}px`);
                entry.element.style.visibility = alpha > 0.025 ? "visible" : "hidden";
                entry.element.classList.toggle("active", alpha > 0.55);
            });
        }

        function updateScrollState() {
            const y = window.scrollY || 0;
            const vh = Math.max(window.innerHeight, 1);
            const rect = projectViewer.getBoundingClientRect();
            const sectionTop = y + rect.top;
            const sectionScrollable = Math.max(projectViewer.offsetHeight - vh, 1);
            currentProjectionProgress = clamp((y - sectionTop) / sectionScrollable);
            const projectionTimelineProgress = clamp(currentProjectionProgress / 0.88);
            projectionFloat = projectionTimelineProgress * (projectKeys.length - 1);
            cameraIntroProgress = smoothstep(clamp((y - sectionTop - vh * 0.04) / (vh * 0.88)));
            projectionExitProgress = smoothstep(clamp((y - (sectionTop + projectViewer.offsetHeight - vh * 1.04)) / (vh * 0.78)));
            const videoOpacity = sceneMode ? 0.12 : clamp(1 - y / (vh * 0.9));
            const projectionEntryProgress = smootherstep(clamp((y - vh * 0.32) / (vh * 0.92)));
            const about = document.querySelector("#about");
            const aboutTop = about ? y + about.getBoundingClientRect().top : Number.POSITIVE_INFINITY;
            const aboutFade = smootherstep(clamp((y - aboutTop + vh * 0.72) / (vh * 1.05)));
            const environmentOpacity = sceneMode
                ? 1
                : projectionEntryProgress * (1 - aboutFade);
            const heroTitleOpacity = clamp(1 - y / (vh * 0.68));
            const titleOpacity = sceneMode ? heroTitleOpacity * 0.18 : heroTitleOpacity;
            const navOpacity = sceneMode || y > vh * 0.86 ? 0 : clamp(1 - y / (vh * 0.42), 0, 1);

            document.documentElement.style.setProperty("--video-opacity", videoOpacity.toFixed(3));
            document.documentElement.style.setProperty("--environment-opacity", environmentOpacity.toFixed(3));
            const entryShift = (1 - projectionEntryProgress) * vh * 1.08;
            const exitShift = projectionExitProgress * vh * 1.12;
            document.documentElement.style.setProperty("--environment-shift", sceneMode ? "0px" : `${(entryShift - exitShift).toFixed(1)}px`);
            environmentGroup.position.y = sceneMode ? 0 : -(1 - projectionEntryProgress) * 4.7 + projectionExitProgress * 5.1;
            document.documentElement.style.setProperty("--nav-opacity", navOpacity.toFixed(3));
            document.body.classList.toggle("nav-hidden", navOpacity < 0.05);
            document.documentElement.style.setProperty("--projection-progress", currentProjectionProgress.toFixed(3));
            document.documentElement.style.setProperty("--timeline-progress", currentProjectionProgress.toFixed(3));
            pageTimelineTrack?.style.setProperty("--page-progress", (y / maxPageScroll()).toFixed(3));
            document.documentElement.style.setProperty("--page-timeline-progress", clamp(y / maxPageScroll()).toFixed(3));
            document.documentElement.style.setProperty("--geo-panel-opacity", alphaForProject(0).toFixed(3));
            document.documentElement.style.setProperty("--iran-panel-opacity", alphaForProject(1).toFixed(3));
            if (titleFallback && !document.body.classList.contains("title-loaded")) {
                titleFallback.style.opacity = titleOpacity.toFixed(3);
            }
            setEnvironmentOpacity(environmentOpacity);
            setTitleOpacity(titleOpacity);
            updateAboutScroll(y, vh);
            updateProjectionState();
        }

        function updateAboutScroll(scrollY, vh) {
            const about = document.querySelector("#about");
            if (!about) return;
            const rect = about.getBoundingClientRect();
            const top = scrollY + rect.top;
            const scrollable = Math.max(about.offsetHeight - vh, 1);
            const progress = clamp((scrollY - top) / scrollable);
            const fade = smootherstep(clamp((scrollY - top + vh * 0.72) / (vh * 1.05)));
            document.documentElement.style.setProperty("--about-video-opacity", fade.toFixed(3));
            [0, 1, 2].forEach((index) => {
                const center = 0.18 + index * 0.31;
                const distance = Math.abs(progress - center);
                const entry = pageElements.get(`about-${index}`);
                const opacity = entry ? alphaForPageTimeline(entry.timeline, 0.016, 0.018) : clamp(1 - distance / 0.18);
                const eased = smootherstep(opacity);
                document.documentElement.style.setProperty(`--about-panel-${index}-opacity`, eased.toFixed(3));
                document.documentElement.style.setProperty(`--about-panel-${index}-y`, `${(18 + (1 - eased) * 36).toFixed(1)}px`);
            });
            if (aboutVideo) {
                aboutVideo.playbackRate = 0.35 + smootherstep(progress) * 2.15;
                if (fade > 0.08) aboutVideo.play().catch(() => {});
                else aboutVideo.pause();
            }
        }

        function updateProjectionState() {
            const geoAlpha = alphaForProject(0);
            const iranAlpha = alphaForProject(1);
            const historyAlpha = alphaForProject(2);
            const timelineAlpha = alphaForProject(3);
            const animationsAlpha = alphaForProject(4);
            const globe = assetObjects.get("globe");
            const icosahedron = assetObjects.get("icosahedron");
            const iran = assetObjects.get("iran");
            const bull = assetObjects.get("bull");
            const hourglass = assetObjects.get("hourglass");
            const animationScreen = assetObjects.get("animationScreen");
            const rug = assetObjects.get("rug");
            const lamp = assetObjects.get("lamp");
            currentStageReveal = sceneMode ? 1 : smootherstep(clamp((currentEnvironmentOpacity - 0.04) / 0.72));
            if (historyAlpha * currentStageReveal > 0.08) requestHistoryAssetLoad();
            if (rug) rug.visible = currentStageReveal > 0.025 && !rug.userData.editorHidden;
            if (lamp) lamp.visible = currentStageReveal > 0.025 && !lamp.userData.editorHidden;

            if (globe) {
                globe.visible = geoAlpha * currentStageReveal > 0.02 && !globe.userData.editorHidden;
                setObjectPulseScale(globe, 1 + hoverPulse * 0.035 + geoAlpha * 0.02);
                setObjectOpacity(globe, geoAlpha * currentStageReveal);
            }
            if (icosahedron) {
                icosahedron.visible = geoAlpha * currentStageReveal > 0.02 && !icosahedron.userData.editorHidden;
                setObjectPulseScale(icosahedron, 1.08 + hoverPulse * 0.045);
                setObjectOpacity(icosahedron, geoAlpha * 0.76 * currentStageReveal);
            }
            if (iran) {
                iran.visible = iranAlpha * currentStageReveal > 0.02 && !iran.userData.editorHidden;
                setObjectPulseScale(iran, 0.86 + iranAlpha * 0.16 + hoverPulse * 0.04);
                setObjectOpacity(iran, iranAlpha * currentStageReveal);
            }
            if (bull) {
                bull.visible = historyAlpha * currentStageReveal > 0.02 && !bull.userData.editorHidden;
                setObjectPulseScale(bull, 0.9 + historyAlpha * 0.12 + hoverPulse * 0.035);
                setObjectOpacity(bull, historyAlpha * currentStageReveal);
            }
            if (hourglass) {
                hourglass.visible = timelineAlpha * currentStageReveal > 0.02 && !hourglass.userData.editorHidden;
                setObjectPulseScale(hourglass, 0.92 + timelineAlpha * 0.1 + hoverPulse * 0.03);
                setObjectOpacity(hourglass, timelineAlpha * currentStageReveal);
            }
            if (animationScreen) {
                animationScreen.visible = animationsAlpha * currentStageReveal > 0.02 && !animationScreen.userData.editorHidden;
                setObjectPulseScale(animationScreen, 0.96 + animationsAlpha * 0.1 + screenHover * 0.035);
                setObjectOpacity(animationScreen, animationsAlpha * currentStageReveal);
                screenMaterial.uniforms.uOpacity.value = visualSettings.screenOpacity * animationsAlpha * currentStageReveal;
                if (animationsAlpha > 0.45) {
                    ensureProjectionVideoSource();
                    if (!animationPaused) projectionVideo.play().catch(() => {});
                } else if (!projectionVideo.paused) {
                    projectionVideo.pause();
                }
            }

            const lightTarget = projectVectorAt(projectionFloat);
            const activeColor = blendedProjectColor();
            hologramLight.position.copy(lightTarget);
            hologramLight.color.lerp(activeColor, 0.08);
            hologramLight.intensity += (((visualSettings.blueGlow + hoverPulse * 2.4) * currentEnvironmentOpacity) - hologramLight.intensity) * 0.06;
            violetLight.color.lerp(blendedProjectPalette()[0], 0.06);
            violetLight.intensity += (((visualSettings.purpleGlow + hoverPulse * 1.3) * currentEnvironmentOpacity) - violetLight.intensity) * 0.06;
            lampGoldLight.position.copy(spoutOrigin).add(new THREE.Vector3(0.12, 0.08, 0.08));
            lampGoldLight.intensity = (visualSettings.lampGlow + Math.sin(currentProjectionProgress * Math.PI) * 0.55) * currentEnvironmentOpacity;
            updateProjectCards();
        }

        function setObjectOpacity(object, opacity) {
            object.traverse((child) => {
                if (child.material && child.material.opacity !== undefined) {
                    const base = child.material.userData.baseOpacity ?? child.material.opacity ?? 1;
                    child.material.userData.baseOpacity = base;
                    child.material.opacity = clamp(base * opacity, 0, 1);
                }
            });
        }

        function setObjectPulseScale(object, multiplier) {
            const baseScale = object.userData.baseScale;
            const sameProjectHover = hoveredInteractive
                && hoveredInteractive.userData.projectKey
                && hoveredInteractive.userData.projectKey === object.userData.projectKey;
            const hoverTarget = hoveredInteractive === object || grabbedProjection === object || sameProjectHover ? 1 : 0;
            object.userData.hoverScale = lerp(object.userData.hoverScale || 0, hoverTarget, 0.1);
            const hoverMultiplier = 1 + object.userData.hoverScale * 0.035;
            if (baseScale) object.scale.copy(baseScale).multiplyScalar(multiplier * hoverMultiplier);
            else object.scale.setScalar(multiplier * hoverMultiplier);
        }

        function resizeTitle() {
            const sceneWidth = root.getBoundingClientRect().width || window.innerWidth;
            const viewportWidth = window.visualViewport ? window.visualViewport.width : window.innerWidth;
            const width = Math.min(sceneWidth, viewportWidth, window.innerWidth);
            const compact = width < 700;
            const scale = compact ? clamp(width / 1180, 0.27, 0.4) : clamp(width / 1350, 0.48, 0.86);
            const heroScroll = (window.scrollY || 0) / Math.max(window.innerHeight, 1);
            const pagePinnedLift = heroScroll * (compact ? 3.2 : 4.1);
            titleGroup.scale.setScalar(scale);
            titleGroup.position.set(pointerCurrent.x * 0.08, (compact ? 0.18 : 0.28) + pagePinnedLift, compact ? -6.3 : -6.9);
        }

        function updateSelectionRing() {
            if (!selectedObject || !selectedObject.parent) return;
            const box = new THREE.Box3().setFromObject(selectedObject);
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();
            box.getSize(size);
            box.getCenter(center);
            const radius = Math.max(size.x, size.z, 0.4) * 0.55 + 0.24;
            selectionRing.position.x = center.x;
            selectionRing.position.z = center.z;
            selectionRing.position.y = -1.16;
            selectionRing.scale.setScalar(Math.max(radius, 0.72));
        }

        function serializeScene() {
            return {
                version: 1,
                objects: editableObjects.map((object) => ({
                    assetId: object.userData.assetId || "custom",
                    name: object.name,
                    uuid: object.uuid,
                    transform: snapshotObject(object),
                    light: object.isLight ? {
                        color: object.color?.getHex(),
                        intensity: object.intensity,
                        distance: object.distance
                    } : null
                })),
                camera: {
                    position: camera.position.toArray(),
                    target: orbitControls.target.toArray()
                },
                cameraKeyframes
            };
        }

        function applySceneData(data) {
            if (!data) return;
            data.objects?.forEach((saved) => {
                const object = editableObjects.find((candidate) => candidate.userData.assetId === saved.assetId && candidate.name === saved.name);
                if (object) applySnapshot(object, saved.transform);
                if (object?.isLight && saved.light) {
                    object.color.setHex(saved.light.color);
                    object.intensity = saved.light.intensity;
                    object.distance = saved.light.distance;
                }
            });
            if (data.camera) {
                camera.position.fromArray(data.camera.position);
                orbitControls.target.fromArray(data.camera.target);
                camera.lookAt(orbitControls.target);
            }
            if (Array.isArray(data.cameraKeyframes)) {
                cameraKeyframes.length = 0;
                data.cameraKeyframes.forEach((keyframe) => cameraKeyframes.push(keyframe));
                renderCameraKeyframes();
            }
            updateInspector();
            renderObjectList();
            setStatus("Scene data applied.");
        }

        function serializeSettings() {
            return {
                version: 2,
                savedAt: new Date().toISOString(),
                visualSettings: { ...visualSettings },
                projectSettings: Object.fromEntries(Object.entries(projectSettings).map(([key, value]) => [key, { ...value }])),
                projectText: { ...projectText }
            };
        }

        function applySettingsData(data) {
            if (!data) return;
            Object.assign(visualSettings, data.visualSettings || data.settings || {});
            Object.entries(data.projectSettings || {}).forEach(([key, value]) => {
                if (projectSettings[key]) Object.assign(projectSettings[key], value);
            });
            Object.assign(projectText, data.projectText || {});
            persistQualityPreset(visualSettings.qualityPreset);
            localStorage.setItem("pouya-ai-project-text", JSON.stringify(projectText));
            applyProjectTextToCards();
            syncAllSettingInputs();
            applyVisualSettings();
            setStatus("Settings config loaded.");
        }

        function downloadJson(name, data) {
            const json = JSON.stringify(data, null, 2);
            localStorage.setItem("pouya-ai-last-json-export", JSON.stringify({ name, json, savedAt: new Date().toISOString() }));
            const blob = new Blob([json], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = name;
            document.body.appendChild(link);
            link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
            link.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 1200);
            setStatus(`Export prepared: ${name}.`);
        }

        async function readJsonFile(file, callback) {
            if (!file) return;
            try {
                callback(JSON.parse(await file.text()));
            } catch {
                setStatus("Could not read JSON file.");
            }
        }

        function updateSettingValue(setting, value) {
            document.querySelectorAll(`[data-value-for="${setting}"]`).forEach((element) => {
                element.textContent = setting === "blackholeNonOrbit"
                    ? (value ? "non-orbit" : "orbit")
                    : typeof value === "boolean" ? (value ? "on" : "off") : String(value);
            });
        }

        function syncAllSettingInputs() {
            liveSettingInputs.forEach((input) => {
                const key = input.dataset.setting;
                if (!key || !(key in visualSettings)) return;
                if (input.type === "checkbox") input.checked = Boolean(visualSettings[key]);
                else input.value = visualSettings[key];
                updateSettingValue(key, input.type === "checkbox" ? input.checked : input.value);
            });
            if (projectDescriptionEditor) projectDescriptionEditor.value = projectText[projectTextTarget?.value || visualSettings.selectedProject] || "";
        }

        function installSettingResetButtons() {
            document.querySelectorAll(".hud-details").forEach((details) => {
                const summary = details.querySelector(":scope > summary");
                if (!summary || summary.querySelector(".settings-reset-mini")) return;
                const reset = document.createElement("button");
                reset.type = "button";
                reset.className = "settings-reset-mini";
                reset.title = "Reset this section to defaults";
                reset.innerHTML = `<i class="ph ph-arrow-counter-clockwise" aria-hidden="true"></i>`;
                reset.addEventListener("click", (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    resetSettingSection(details);
                });
                summary.appendChild(reset);
            });
        }

        function resetSettingSection(details) {
            const keys = [...details.querySelectorAll(".live-setting")].map((input) => input.dataset.setting).filter(Boolean);
            keys.forEach((key) => {
                if (key in defaultVisualSettings) visualSettings[key] = defaultVisualSettings[key];
            });
            if (keys.some((key) => ["hologramColor", "hologramOpacity", "hologramSpin", "hologramBob"].includes(key))) {
                const projectKey = visualSettings.selectedProject || "geo";
                Object.assign(projectSettings[projectKey], defaultProjectSettings[projectKey]);
                syncProjectSettingInputs(projectKey);
            }
            if (keys.includes("blackholeNonOrbit")) localStorage.setItem("pouya-ai-blackhole-video-choice", visualSettings.blackholeNonOrbit ? "nonOrbit" : "orbit");
            if (keys.includes("qualityPreset")) persistQualityPreset(visualSettings.qualityPreset);
            syncAllSettingInputs();
            applyVisualSettings();
            setStatus("Settings section reset to defaults.");
        }

        function resetAllSettings() {
            Object.assign(visualSettings, defaultVisualSettings);
            Object.entries(defaultProjectSettings).forEach(([key, value]) => Object.assign(projectSettings[key], value));
            localStorage.setItem("pouya-ai-blackhole-video-choice", visualSettings.blackholeNonOrbit ? "nonOrbit" : "orbit");
            persistQualityPreset(visualSettings.qualityPreset);
            syncProjectSettingInputs("geo");
            syncAllSettingInputs();
            applyVisualSettings();
            setStatus("All settings reset to defaults.");
        }

        let appliedQualityPreset = "";
        let appliedRugProfileKey = "";
        function applyQualityPreset() {
            const quality = effectiveQualityPreset();
            const particleScale = Number(visualSettings.performanceParticles ?? 1);
            const flowDrawCount = Math.floor((quality === "lowest" ? 0 : quality === "low" ? flowCount * 0.24 : quality === "medium" ? flowCount * 0.54 : quality === "high" ? flowCount * 0.78 : flowCount) * particleScale);
            flowGeometry.setDrawRange(0, flowDrawCount);
            assetObjects.forEach((object) => {
                const cloud = object.userData?.shapeCloud;
                if (!cloud) return;
                const count = cloud.geometry.attributes.position.count;
                const factor = (quality === "lowest" ? 0 : quality === "low" ? 0.28 : quality === "medium" ? 0.56 : quality === "high" ? 0.78 : 1) * particleScale;
                cloud.geometry.setDrawRange(0, factor <= 0 ? 0 : Math.max(48, Math.floor(count * factor)));
            });
            if (bloomPass) {
                bloomPass.enabled = false;
                bloomPass.strength = 0;
            }
            if (chromaticPass) {
                chromaticPass.enabled = false;
                chromaticPass.uniforms.amount.value = 0;
            }
            useComposerRender = false;
            const screenOverride = quality === "lowest"
                ? { opacity: 0.18, brightness: 1, saturation: 1, rgb: 0, scanline: 0 }
                : quality === "low"
                    ? { opacity: visualSettings.screenOpacity * 0.72, brightness: Math.min(visualSettings.screenBrightness, 1.2), saturation: Math.min(visualSettings.screenSaturation, 1.25), rgb: 0, scanline: 0 }
                    : quality === "cinematic"
                        ? { opacity: 0.35, brightness: 1.35, saturation: 1.55, rgb: 0.7, scanline: 0.7 }
                        : { opacity: visualSettings.screenOpacity, brightness: visualSettings.screenBrightness, saturation: visualSettings.screenSaturation, rgb: visualSettings.screenRgbEffect, scanline: visualSettings.screenScanline };
            screenMaterial.uniforms.uBrightness.value = screenOverride.brightness;
            screenMaterial.uniforms.uSaturation.value = screenOverride.saturation;
            screenMaterial.uniforms.uRgbEffect.value = screenOverride.rgb;
            screenMaterial.uniforms.uScanline.value = screenOverride.scanline;
            screenMaterial.uniforms.uOpacity.value = screenOverride.opacity * alphaForProject(4) * currentStageReveal;
            renderer.setPixelRatio(preferredPixelRatio());
            composer?.setPixelRatio(preferredPixelRatio());
            const rugProfile = carpetQualityProfile();
            const rugProfileKey = `${quality}:${visualSettings.performanceRugDetail}:${rugProfile.segX}:${rugProfile.segZ}:${rugProfile.fringes}:${rugProfile.flat ? "flat" : "cloth"}`;
            if (appliedRugProfileKey !== rugProfileKey) {
                const rug = assetObjects.get("rug");
                if (rug?.userData?.carpet && Boolean(rug.userData.carpet.flat) !== Boolean(rugProfile.flat)) {
                    replaceFlyingCarpet(rugProfile);
                } else if (rug?.userData?.carpet && !rugProfile.flat) {
                    rug.userData.carpet.carpetQuality = rugProfile;
                    rebuildFlyingCarpetFringes(rug);
                }
                appliedRugProfileKey = rugProfileKey;
            }
            if (appliedQualityPreset !== quality) {
                const source = animationVideoSource(animationVideos[currentAnimationIndex] || animationVideos[0]);
                projectionVideoSource = source;
                transitionVideoSource = source;
                if (projectionVideo.getAttribute("src") !== source && quality !== "lowest") {
                    projectionVideo.src = source;
                    projectionVideo.load();
                }
                if (transitionVideo.getAttribute("src") !== source && quality !== "lowest") {
                    transitionVideo.src = source;
                    transitionVideo.load();
                }
                preloadAnimationVideos(currentAnimationIndex);
                appliedQualityPreset = quality;
            }
        }

        function applyProjectFontPreset() {
            const titleFont = {
                playfair: "'Playfair Display', serif",
                cinematic: "Georgia, 'Times New Roman', serif",
                modern: "'Plus Jakarta Sans', sans-serif",
                system: "system-ui, sans-serif"
            }[visualSettings.projectFontPreset] || "'Playfair Display', serif";
            const bodyFont = visualSettings.projectFontPreset === "system"
                ? "system-ui, sans-serif"
                : "'Plus Jakarta Sans', sans-serif";
            projectCards.forEach((card) => {
                const title = card.querySelector(".project-title");
                const copy = card.querySelector(".project-copy");
                const projectColor = new THREE.Color(projectSettings[card.dataset.projectCard]?.color || "#61f5ff");
                card.style.setProperty("--project-title-glow", colorToRgbTriplet(projectColor));
                if (title) title.style.fontFamily = titleFont;
                if (copy) copy.style.fontFamily = bodyFont;
            });
        }

        function applyProjectTextToCards() {
            projectCards.forEach((card) => {
                const key = card.dataset.projectCard;
                const copy = card.querySelector(".project-copy");
                if (copy && projectText[key]) copy.textContent = projectText[key];
            });
        }

        function applyVisualSettings() {
            const rootStyle = document.documentElement.style;
            rootStyle.setProperty("--glass-blur", `${visualSettings.glassBlur}px`);
            rootStyle.setProperty("--glass-saturation", visualSettings.glassSaturation);
            rootStyle.setProperty("--glass-panel-alpha", visualSettings.glassPanelAlpha);
            rootStyle.setProperty("--glass-highlight-alpha", visualSettings.glassHighlightAlpha);
            rootStyle.setProperty("--glass-glare-alpha", visualSettings.glassGlareAlpha);
            document.body.classList.toggle("chromatic-glass", Boolean(visualSettings.chromaticGlass));
            window.dispatchEvent(new CustomEvent("pouya:blackhole-video-change"));
            rootStyle.setProperty("--lens-user-opacity", visualSettings.lensOpacity);
            rootStyle.setProperty("--lens-size", `${visualSettings.lensSize}px`);
            rootStyle.setProperty("--lens-edge-blue", visualSettings.lensEdgeBlue);
            rootStyle.setProperty("--lens-edge-blur", `${visualSettings.lensEdgeBlur}%`);
            rootStyle.setProperty("--lens-radial-opacity", visualSettings.lensRadialOpacity);
            rootStyle.setProperty("--lens-saturate", visualSettings.lensSaturation);
            const compactTextScale = window.innerWidth < 430 ? 0.56 : window.innerWidth < 760 ? 0.68 : window.innerWidth < 1024 ? 0.84 : 1;
            rootStyle.setProperty("--project-title-size", `${Math.max(6, visualSettings.projectTitleSize * compactTextScale)}px`);
            rootStyle.setProperty("--project-body-size", `${Math.max(5, visualSettings.projectBodySize * (window.innerWidth < 760 ? 0.82 : compactTextScale))}px`);
            rootStyle.setProperty("--project-text-gap", `${visualSettings.projectTextGap}px`);
            rootStyle.setProperty("--project-text-rotate-y", `${visualSettings.projectTextRotateY}deg`);
            panelDisplacement?.setAttribute("scale", visualSettings.glassDisplacement);
            lensDisplacement?.setAttribute("scale", visualSettings.lensDisplacement * visualSettings.lensWarpRadius);
            const quality = effectiveQualityPreset();
            document.body.classList.toggle("lowest-quality", quality === "lowest");
            if (visualSettings.globalIllumination && quality !== "lowest") {
                if (roomEnvironmentTexture) scene.environment = roomEnvironmentTexture;
                else void ensureRoomEnvironmentTexture().then((texture) => {
                    if (texture && visualSettings.globalIllumination && effectiveQualityPreset() !== "lowest") scene.environment = texture;
                });
            } else {
                scene.environment = null;
            }
            ambientLight.intensity = visualSettings.globalIllumination ? 0.72 : 0.28;
            const lightingScale = Number(visualSettings.performanceLighting ?? 1);
            keyLight.intensity = visualSettings.topLight * lightingScale;
            grid.visible = visualSettings.gridVisible;
            floorPlane.visible = visualSettings.solidFloor;
            keyLight.castShadow = Boolean(visualSettings.performanceShadows);
            renderer.shadowMap.enabled = Boolean(visualSettings.performanceShadows);
            floorMaterial.color.set(visualSettings.floorColor);
            renderer.setClearColor(new THREE.Color(visualSettings.backgroundColor), visualSettings.backgroundAlpha * currentEnvironmentOpacity);
            document.querySelector(".projection-copy-shell")?.style.setProperty("width", `min(${visualSettings.projectTextWidth}px, 92vw)`);
            projectCards.forEach((card) => card.classList.toggle("glass-plane-enabled", Boolean(visualSettings.projectGlassPlane)));
            applyProjectFontPreset();
            setProjectColor(visualSettings.selectedProject, visualSettings.hologramColor);
            setProjectOpacity(visualSettings.selectedProject, Number(visualSettings.hologramOpacity));
            getProjectSetting(visualSettings.selectedProject).spin = Number(visualSettings.hologramSpin);
            getProjectSetting(visualSettings.selectedProject).bob = Boolean(visualSettings.hologramBob);
            screenMaterial.uniforms.uBrightness.value = visualSettings.screenBrightness;
            screenMaterial.uniforms.uSaturation.value = visualSettings.screenSaturation;
            screenMaterial.uniforms.uRgbEffect.value = visualSettings.screenRgbEffect;
            screenMaterial.uniforms.uScanline.value = visualSettings.screenScanline;
            screenMaterial.uniforms.uOpacity.value = visualSettings.screenOpacity * alphaForProject(4) * currentStageReveal;
            applyQualityPreset();
            titleGroup.traverse((child) => {
                if (!child.material) return;
                if (child.name === "Frosted Glass Fill") child.userData.titleBaseOpacity = visualSettings.titleFrost;
                if (child.name === "Glass Title Edge Refraction") child.userData.titleBaseOpacity = visualSettings.titleEdges;
                if (child.name?.includes?.("Prism")) child.userData.titleBaseOpacity = (child.userData.prismBaseOpacity || 0.08) * visualSettings.titlePrism;
                if (child.isMesh && child.material.isMeshPhysicalMaterial) {
                    child.userData.titleBaseOpacity = visualSettings.titleOpacity;
                    child.material.dispersion = visualSettings.chromaticGlass ? 0.58 : 0.36;
                    child.material.iridescence = visualSettings.chromaticGlass ? 0.44 : 0.26;
                    child.material.emissiveIntensity = visualSettings.chromaticGlass ? 0.085 : 0.055;
                }
            });
            setTitleOpacity(currentTitleOpacity);
            liveSettingInputs.forEach((input) => {
                const setting = input.dataset.setting;
                if (!setting) return;
                updateSettingValue(setting, visualSettings[setting]);
            });
            updateProjectionState();
        }

        function syncProjectSettingInputs(projectKey) {
            const setting = getProjectSetting(projectKey);
            visualSettings.selectedProject = projectKey;
            visualSettings.hologramColor = setting.color;
            visualSettings.hologramOpacity = setting.opacity;
            visualSettings.hologramSpin = setting.spin;
            visualSettings.hologramBob = Boolean(setting.bob);
            if (projectTextTarget && !projectTextTarget.value) projectTextTarget.value = projectKey;
            if (projectDescriptionEditor) projectDescriptionEditor.value = projectText[projectTextTarget?.value || projectKey] || "";
            liveSettingInputs.forEach((input) => {
                const key = input.dataset.setting;
                if (key in visualSettings) {
                    if (input.type === "checkbox") input.checked = Boolean(visualSettings[key]);
                    else input.value = visualSettings[key];
                    updateSettingValue(key, visualSettings[key]);
                }
            });
        }

        function addCameraKeyframe() {
            cameraKeyframes.push({
                time: cameraKeyframes.length ? Math.min(1, cameraKeyframes[cameraKeyframes.length - 1].time + 0.2) : 0,
                project: projectKeys[Math.round(clamp(projectionFloat, 0, projectKeys.length - 1))],
                position: camera.position.toArray(),
                target: orbitControls.target.toArray()
            });
            selectedCameraKeyframe = cameraKeyframes.length - 1;
            normalizeCameraTimes();
            renderCameraKeyframes();
            setStatus(`Camera keyframe ${cameraKeyframes.length} added.`);
        }

        function normalizeCameraTimes() {
            cameraKeyframes
                .sort((a, b) => a.time - b.time)
                .forEach((keyframe) => {
                    keyframe.time = clamp(Number(keyframe.time) || 0);
                });
        }

        function renderCameraKeyframes() {
            if (!devModeEnabled || !cameraKeyframeList) return;
            cameraKeyframeList.innerHTML = "";
            if (!cameraKeyframes.length) {
                cameraKeyframeList.textContent = "No camera keyframes yet.";
                renderTimelineMarkers();
                return;
            }
            cameraKeyframes.forEach((keyframe, index) => {
                const row = document.createElement("div");
                row.className = "grid grid-cols-[1fr_auto_auto] items-center gap-1";
                row.innerHTML = `<button class="hud-button !min-h-7 !justify-start !px-2 ${index === selectedCameraKeyframe ? "active" : ""}" type="button">${index + 1}. ${keyframe.project || "free"} @ ${Number(keyframe.time).toFixed(2)}</button><button class="hud-button !min-h-7 !px-2" type="button">Set</button><button class="hud-button danger !min-h-7 !px-2" type="button">Del</button>`;
                const [selectBtn, setBtn, deleteBtn] = row.querySelectorAll("button");
                selectBtn.addEventListener("click", () => {
                    selectedCameraKeyframe = index;
                    setCameraTimelineProgress(keyframe.time);
                    renderCameraKeyframes();
                });
                setBtn.addEventListener("click", () => updateSelectedCameraKeyframe(index));
                deleteBtn.addEventListener("click", () => {
                    cameraKeyframes.splice(index, 1);
                    selectedCameraKeyframe = Math.min(selectedCameraKeyframe, cameraKeyframes.length - 1);
                    normalizeCameraTimes();
                    renderCameraKeyframes();
                });
                cameraKeyframeList.appendChild(row);
            });
            renderTimelineMarkers();
        }

        function renderTimelineMarkers() {
            if (!timelineTrack) return;
            timelineTrack.querySelectorAll(".timeline-marker").forEach((marker) => marker.remove());
            renderTimelineSections(timelineTrack, false);
            cameraKeyframes.forEach((keyframe, index) => {
                const marker = document.createElement("button");
                marker.type = "button";
                marker.className = "timeline-marker";
                marker.style.left = `${clamp(keyframe.time) * 100}%`;
                marker.title = `Keyframe ${index + 1}: ${keyframe.project || "free"}`;
                marker.addEventListener("click", () => {
                    selectedCameraKeyframe = index;
                    setCameraTimelineProgress(keyframe.time);
                    renderCameraKeyframes();
                });
                marker.addEventListener("pointerdown", (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    selectedCameraKeyframe = index;
                    marker.setPointerCapture(event.pointerId);
                    const onMove = (moveEvent) => {
                        const t = progressFromTimelineEvent(moveEvent, timelineTrack);
                        keyframe.time = t;
                        marker.style.left = `${t * 100}%`;
                        setCameraTimelineProgress(t);
                    };
                    const onUp = () => {
                        marker.removeEventListener("pointermove", onMove);
                        marker.removeEventListener("pointerup", onUp);
                        normalizeCameraTimes();
                        renderCameraKeyframes();
                    };
                    marker.addEventListener("pointermove", onMove);
                    marker.addEventListener("pointerup", onUp);
                });
                timelineTrack.appendChild(marker);
            });
        }

        function updateSelectedCameraKeyframe(index = selectedCameraKeyframe) {
            const keyframe = cameraKeyframes[index];
            if (!keyframe) return;
            keyframe.position = camera.position.toArray();
            keyframe.target = orbitControls.target.toArray();
            keyframe.time = Number(cameraTimeline.value);
            keyframe.project = projectKeys[Math.round(clamp(projectionFloat, 0, projectKeys.length - 1))];
            normalizeCameraTimes();
            renderCameraKeyframes();
            setStatus(`Updated camera keyframe ${index + 1}.`);
        }

        function eased(t) {
            if (cameraEasing.value === "linear") return t;
            if (cameraEasing.value === "cinematic") return smootherstep(t);
            return smoothstep(t);
        }

        function applyCameraPose(position, target, previewRig = false) {
            if (previewRig) {
                cameraRig.visible = true;
                cameraRig.position.copy(position);
                cameraRig.lookAt(target);
                return;
            }
            camera.position.copy(position);
            orbitControls.target.copy(target);
            camera.lookAt(orbitControls.target);
        }

        function applyCameraAnimation(progress, force = false, previewRig = false) {
            if (cameraKeyframes.length < 2 || (sceneMode && !force)) return;
            normalizeCameraTimes();
            if (cameraEasing.value === "smooth-flow" && cameraKeyframes.length >= 3) {
                const positions = cameraKeyframes.map((keyframe) => new THREE.Vector3().fromArray(keyframe.position));
                const targets = cameraKeyframes.map((keyframe) => new THREE.Vector3().fromArray(keyframe.target));
                const positionCurve = new THREE.CatmullRomCurve3(positions, false, "centripetal", 0.38);
                const targetCurve = new THREE.CatmullRomCurve3(targets, false, "centripetal", 0.38);
                applyCameraPose(positionCurve.getPointAt(clamp(progress)), targetCurve.getPointAt(clamp(progress)), previewRig);
                return;
            }
            const p = clamp(progress);
            let index = 0;
            for (let i = 0; i < cameraKeyframes.length - 1; i += 1) {
                if (p >= cameraKeyframes[i].time) index = i;
                if (p <= cameraKeyframes[i + 1].time) break;
            }
            index = Math.min(index, cameraKeyframes.length - 2);
            const a = cameraKeyframes[index];
            const b = cameraKeyframes[index + 1];
            const span = Math.max(0.0001, b.time - a.time);
            const local = eased(clamp((p - a.time) / span));
            const position = new THREE.Vector3(
                lerp(a.position[0], b.position[0], local),
                lerp(a.position[1], b.position[1], local),
                lerp(a.position[2], b.position[2], local)
            );
            const target = new THREE.Vector3(
                lerp(a.target[0], b.target[0], local),
                lerp(a.target[1], b.target[1], local),
                lerp(a.target[2], b.target[2], local)
            );
            applyCameraPose(position, target, previewRig);
        }

        function applyDefaultScrollCamera() {
            if (sceneMode || cameraPlaying || scrollSyncToggle.checked) return;
            const stagePosition = new THREE.Vector3(0.18, 2.28, 7.35);
            const lastPosition = new THREE.Vector3(0.05, 2.72 + projectionExitProgress * 1.8, 7.8);
            const staticIndex = Math.min(projectKeys.length - 2, Math.max(0, Math.floor(projectionFloat)));
            const staticLocal = smoothstep(clamp(projectionFloat - staticIndex));
            const stableProjectTarget = new THREE.Vector3().lerpVectors(
                projectCenters[projectKeys[staticIndex]],
                projectCenters[projectKeys[staticIndex + 1]],
                staticLocal
            );
            const stageTarget = stableProjectTarget.lerp(new THREE.Vector3(1.12, -0.1, 0.1), 0.34);
            camera.position.copy(stagePosition.clone().lerp(lastPosition, projectionExitProgress));
            orbitControls.target.copy(stageTarget);
            camera.lookAt(orbitControls.target);
        }

        function saveCameraSequence() {
            const saved = JSON.parse(localStorage.getItem("pouya-ai-camera-sequences") || "{}");
            const name = cameraSequenceName.value.trim() || "Untitled sequence";
            saved[name] = { name, cameraKeyframes: cameraKeyframes.map((keyframe) => ({ ...keyframe })) };
            localStorage.setItem("pouya-ai-camera-sequences", JSON.stringify(saved));
            renderCameraSequences();
            setStatus(`Saved camera sequence: ${name}.`);
        }

        function renderCameraSequences() {
            if (!devModeEnabled || !cameraSequenceSelect) return;
            const saved = JSON.parse(localStorage.getItem("pouya-ai-camera-sequences") || "{}");
            cameraSequenceSelect.innerHTML = `<option value="">Load saved sequence...</option>`;
            Object.keys(saved).forEach((name) => {
                const option = document.createElement("option");
                option.value = name;
                option.textContent = name;
                cameraSequenceSelect.appendChild(option);
            });
        }

        function loadCameraSequence(name) {
            if (!name) return;
            const saved = JSON.parse(localStorage.getItem("pouya-ai-camera-sequences") || "{}");
            const sequence = saved[name];
            if (!sequence) return;
            cameraSequenceName.value = name;
            cameraKeyframes.length = 0;
            sequence.cameraKeyframes.forEach((keyframe) => cameraKeyframes.push({ ...keyframe }));
            selectedCameraKeyframe = cameraKeyframes.length ? 0 : -1;
            renderCameraKeyframes();
            setStatus(`Loaded camera sequence: ${name}.`);
        }

        function setAnimationVideo(index, direction = 1) {
            if (pendingAnimationIndex !== null) return;
            pendingAnimationIndex = (index + animationVideos.length) % animationVideos.length;
            screenTransitionDirection = direction >= 0 ? 1 : -1;
            screenTransitionStart = performance.now();
            transitionVideoSource = setProjectionSource(transitionVideo, pendingAnimationIndex, transitionVideoSource);
            preloadAnimationVideos(pendingAnimationIndex);
            transitionVideo.currentTime = 0;
            transitionVideo.muted = projectionVideo.muted;
            if (!animationPaused) {
                transitionVideo.play().catch(() => {});
                projectionVideo.play().catch(() => {});
            }
            screenMaterial.uniforms.uDirection.value = screenTransitionDirection;
            setStatus(`Animation screen: ${animationVideos[pendingAnimationIndex].title}.`);
        }

        function shapePointForProject(projectKey, seedIndex) {
            const objects = projectObjects.get(projectKey) || [];
            const object = objects.find((candidate) => candidate.userData.shapeCloud) || objects[0];
            const cloud = object?.userData?.shapeCloud;
            if (!object || !cloud?.userData?.base) return projectCenterForKey(projectKey);
            const base = cloud.userData.base;
            const count = base.length / 3;
            if (!count) return projectCenterForKey(projectKey);
            const offset = (seedIndex * 37) % count;
            const point = new THREE.Vector3(base[offset * 3], base[offset * 3 + 1], base[offset * 3 + 2]);
            return object.localToWorld(point);
        }

        let flowTargetProject = "";
        let flowTargetFrame = 0;
        let flowRecolorCursor = flowCount;

        function updateFlowTargets(projectKey) {
            flowTargetFrame += 1;
            const projectChanged = projectKey !== flowTargetProject;
            if (projectChanged) flowRecolorCursor = 0;
            if (!projectChanged && flowTargetFrame % 3 !== 0) return;
            const targets = flowGeometry.attributes.aTarget.array;
            const colors = flowGeometry.attributes.color.array;
            for (let i = 0; i < flowCount; i += 1) {
                const shapeTarget = shapePointForProject(projectKey, i);
                targets[i * 3] = shapeTarget.x;
                targets[i * 3 + 1] = shapeTarget.y;
                targets[i * 3 + 2] = shapeTarget.z;
            }
            const recolorEnd = Math.min(flowCount, flowRecolorCursor + Math.max(32, Math.floor(flowCount / 7)));
            for (let i = flowRecolorCursor; i < recolorEnd; i += 1) {
                const color = particleColorForProject(projectKey);
                flowSeeds[i].color.copy(color);
                colors[i * 3] = color.r;
                colors[i * 3 + 1] = color.g;
                colors[i * 3 + 2] = color.b;
            }
            flowRecolorCursor = recolorEnd;
            flowGeometry.attributes.aTarget.needsUpdate = true;
            if (flowRecolorCursor > 0) flowGeometry.attributes.color.needsUpdate = true;
            flowTargetProject = projectKey;
        }

        function updateFlowParticles(elapsed) {
            if (effectiveQualityPreset() === "lowest") {
                flowGeometry.setDrawRange(0, 0);
                flowParticles.visible = false;
                return;
            }
            const projectKey = activeProjectKey();
            updateFlowTargets(projectKey);
            flowMaterial.uniforms.uGuideTarget.value.copy(projectVectorAt(projectionFloat));
            flowMaterial.uniforms.uSpout.value.copy(spoutOrigin);
            flowMaterial.uniforms.uTime.value = elapsed;
            flowMaterial.uniforms.uSpeed.value = visualSettings.particleSpeed;
            flowMaterial.uniforms.uSpread.value = visualSettings.particleSpread * (1 + hoverPulse * 0.32);
            flowMaterial.uniforms.uSize.value = visualSettings.particleSize;
            flowMaterial.uniforms.uShapeAttraction.value = visualSettings.particleShapeAttraction;
            const animationSuppression = 1 - alphaForProject(4);
            flowParticles.visible = animationSuppression > 0.03;
            flowMaterial.uniforms.uOpacity.value = visualSettings.particleOpacity
                * 0.76
                * currentEnvironmentOpacity
                * currentStageReveal
                * activeProjectionAlpha()
                * animationSuppression;
        }

        function updateAmbientParticles(elapsed) {
            const quality = effectiveQualityPreset();
            const qualityCap = quality === "lowest" ? 0 : quality === "low" ? 220 : quality === "medium" ? 460 : quality === "high" ? 720 : ambientParticleCount;
            const drawCount = Math.min(ambientParticleCount, Math.floor(qualityCap * Number(visualSettings.performanceParticles ?? 1)), Math.max(0, Math.floor(visualSettings.ambientParticleAmount)));
            ambientParticleGeometry.setDrawRange(0, drawCount);
            ambientParticles.visible = drawCount > 0 && currentEnvironmentOpacity > 0.06;
            if (drawCount <= 0) return;
            ambientParticleMaterial.size = visualSettings.ambientParticleSize;
            ambientParticleMaterial.opacity = 0.34 * currentEnvironmentOpacity;
            const palette = blendedProjectPalette();
            const positions = ambientParticleGeometry.attributes.position.array;
            const colors = ambientParticleGeometry.attributes.color.array;
            for (let i = 0; i < drawCount; i += 1) {
                const seed = ambientParticleSeeds[i];
                positions[i * 3] = seed.x + Math.sin(elapsed * 0.12 + seed.phase) * 0.06;
                positions[i * 3 + 1] = seed.y + Math.sin(elapsed * 0.18 + seed.phase * 1.7) * 0.05;
                positions[i * 3 + 2] = seed.z + Math.cos(elapsed * 0.1 + seed.phase) * 0.06;
                const color = palette[i % palette.length];
                colors[i * 3] = color.r;
                colors[i * 3 + 1] = color.g;
                colors[i * 3 + 2] = color.b;
            }
            ambientParticleGeometry.attributes.position.needsUpdate = true;
            ambientParticleGeometry.attributes.color.needsUpdate = true;
        }

        function updatePerformanceOverlay() {
            const now = performance.now();
            perfFrames += 1;
            if (now - perfLastStamp >= 500) {
                perfFpsValue = Math.round((perfFrames * 1000) / Math.max(1, now - perfLastStamp));
                perfFrames = 0;
                perfLastStamp = now;
            }
            const quality = effectiveQualityPreset();
            const rugProfile = carpetQualityProfile();
            const flowRange = flowGeometry.drawRange?.count || flowCount;
            const ambientRange = ambientParticleGeometry.drawRange?.count || 0;
            if (perfFps) perfFps.textContent = String(perfFpsValue);
            if (perfFrame) perfFrame.textContent = `${renderer.info.render.calls} calls / ${Math.round(renderer.info.render.triangles / 1000)}k tris`;
            if (perfQuality) perfQuality.textContent = `${quality} / ${rugProfile.label}`;
            if (perfParticles) perfParticles.textContent = `${flowRange + ambientRange} active`;
            if (perfRug) perfRug.textContent = `${rugProfile.segX}x${rugProfile.segZ}${rugProfile.fringes ? " fringe" : " no fringe"}`;
        }

        function monitorRuntimePerformance(now = performance.now()) {
            runtimeFpsFrames += 1;
            const elapsed = now - runtimeFpsWindowStart;
            if (elapsed < 5200) return;
            const fps = (runtimeFpsFrames * 1000) / Math.max(1, elapsed);
            runtimeFpsFrames = 0;
            runtimeFpsWindowStart = now;
            if (visualSettings.qualityPreset !== "auto" || fps >= 34 || now - runtimeFpsLastDowngrade < 9000) return;
            const current = effectiveQualityPreset();
            const currentIndex = qualityDowngradeOrder.indexOf(current);
            if (currentIndex < 0 || currentIndex >= qualityDowngradeOrder.length - 1) return;
            runtimeQualityOverride = qualityDowngradeOrder[currentIndex + 1];
            runtimeFpsLastDowngrade = now;
            applyVisualSettings();
            setStatus(`Auto quality reduced to ${runtimeQualityOverride} after sustained ${Math.round(fps)} FPS.`);
        }

        function updateHourglassSand(elapsed) {
            const hourglass = assetObjects.get("hourglass");
            if (!hourglass) return;
            hourglassFlipProgress = Math.min(1, hourglassFlipProgress + 0.018);
            const flipEase = smootherstep(hourglassFlipProgress);
            const desiredFlipX = (hourglass.userData.flipBaseX || 0) + hourglassFlipTarget;
            hourglass.rotation.x += (desiredFlipX - hourglass.rotation.x) * (0.04 + flipEase * 0.035);
            const positions = sandGeometry.attributes.position.array;
            const flipped = Math.round(hourglassFlipTarget / Math.PI) % 2 !== 0;
            for (let i = 0; i < sandCount; i += 1) {
                const seed = sandSeeds[i];
                const fall = (seed.phase + elapsed * seed.speed * 0.16 + hourglassFlipTarget * 0.045) % 1;
                const jitter = Math.sin(elapsed * 3.1 + i * 1.7) * 0.006;
                let y;
                let radius;
                if (fall < 0.42) {
                    const chamber = fall / 0.42;
                    y = 0.58 - chamber * 0.38;
                    radius = 0.06 + (y - 0.14) * 0.7;
                } else if (fall < 0.55) {
                    const stream = (fall - 0.42) / 0.13;
                    y = 0.18 - stream * 0.36;
                    radius = 0.025 + seed.radius * 0.018;
                } else {
                    const pile = (fall - 0.55) / 0.45;
                    const layer = Math.sqrt(seed.phase);
                    const fill = smootherstep(pile);
                    y = -0.58 + layer * 0.3 * fill;
                    radius = 0.11 + (1 - layer) * 0.3 * fill;
                }
                const angle = seed.phase * Math.PI * 13.7 + i;
                positions[i * 3] = Math.cos(angle) * radius * (0.42 + seed.radius) + jitter;
                positions[i * 3 + 1] = (flipped ? -1 : 1) * y;
                positions[i * 3 + 2] = Math.sin(angle) * radius * 0.46 + seed.z * 0.05;
            }
            sandGeometry.attributes.position.needsUpdate = true;
            hourglassSandPile.position.y = flipped ? 0.58 : -0.58;
            hourglassSandPile.rotation.x = flipped ? Math.PI : 0;
            const pileFill = 0.68 + Math.sin(elapsed * 0.18) * 0.03;
            hourglassSandPile.scale.set(pileFill, 0.72, pileFill * 0.46);
        }

        function updateVideoScreen(elapsed) {
            const animationScreen = assetObjects.get("animationScreen");
            if (!animationScreen) return;
            const alpha = alphaForProject(4);
            const projected = new THREE.Vector3();
            animationScreen.getWorldPosition(projected);
            projected.project(camera);
            const screenX = (projected.x * 0.5 + 0.5) * window.innerWidth;
            const screenY = (-projected.y * 0.5 + 0.5) * window.innerHeight;
            const gap = clamp(window.innerWidth * 0.095, 92, 158);
            const pointerX = (pointerCurrent.x * 0.5 + 0.5) * window.innerWidth;
            const pointerY = (-pointerCurrent.y * 0.5 + 0.5) * window.innerHeight;
            const nearScreen = Math.hypot(pointerX - screenX, pointerY - screenY) < gap * 1.25;
            const hover = hoveredInteractive === animationScreen || grabbedProjection === animationScreen || nearScreen;
            screenHover += ((hover && alpha > 0.4 ? 1 : 0) - screenHover) * 0.08;
            videoControls.classList.toggle("visible", screenHover > 0.15 && alpha > 0.45);
            document.documentElement.style.setProperty("--screen-control-x", `${screenX.toFixed(1)}px`);
            document.documentElement.style.setProperty("--screen-control-y", `${screenY.toFixed(1)}px`);
            document.documentElement.style.setProperty("--screen-control-gap", `${gap.toFixed(1)}px`);
            if (grabbedProjection !== animationScreen && !animationScreen.userData.inertia) {
                animationScreen.rotation.x += (THREE.MathUtils.degToRad(-11 + pointerCurrent.y * 3.2 * screenHover) - animationScreen.rotation.x) * 0.035;
                animationScreen.rotation.y += (THREE.MathUtils.degToRad(-11 + pointerCurrent.x * 2.2 * screenHover) - animationScreen.rotation.y) * 0.035;
            }
            if (pendingAnimationIndex !== null) {
                const progress = clamp((performance.now() - screenTransitionStart) / 720);
                screenMaterial.uniforms.uTransition.value = progress;
                if (progress >= 1) {
                    currentAnimationIndex = pendingAnimationIndex;
                    pendingAnimationIndex = null;
                    projectionVideoSource = setProjectionSource(projectionVideo, currentAnimationIndex, "");
                    projectionVideo.currentTime = transitionVideo.currentTime || 0;
                    projectionVideo.muted = transitionVideo.muted;
                    if (!animationPaused) projectionVideo.play().catch(() => {});
                    transitionVideo.pause();
                    screenMaterial.uniforms.uTransition.value = 0;
                    animationAutoAdvanceArmed = true;
                }
            }
            if (!animationPaused && pendingAnimationIndex === null && projectionVideo.duration && projectionVideo.currentTime > projectionVideo.duration - 0.22 && animationAutoAdvanceArmed) {
                animationAutoAdvanceArmed = false;
                setAnimationVideo(currentAnimationIndex + 1, 1);
            }
            sampleAnimationVideoPalette(elapsed);
            updateScreenTethers(alpha);
        }

        function sampleAnimationVideoPalette(elapsed) {
            if (!videoPaletteCtx || elapsed - lastVideoPaletteSample < 0.9 || projectionVideo.readyState < 2) return;
            lastVideoPaletteSample = elapsed;
            try {
                videoPaletteCtx.drawImage(projectionVideo, 0, 0, videoPaletteCanvas.width, videoPaletteCanvas.height);
                const data = videoPaletteCtx.getImageData(0, 0, videoPaletteCanvas.width, videoPaletteCanvas.height).data;
                const buckets = [
                    { color: new THREE.Color(0, 0, 0), weight: 0 },
                    { color: new THREE.Color(0, 0, 0), weight: 0 },
                    { color: new THREE.Color(0, 0, 0), weight: 0 }
                ];
                for (let i = 0; i < data.length; i += 16) {
                    const r = data[i] / 255;
                    const g = data[i + 1] / 255;
                    const b = data[i + 2] / 255;
                    const luma = r * 0.2126 + g * 0.7152 + b * 0.0722;
                    const bucket = luma < 0.3 ? 0 : luma < 0.62 ? 1 : 2;
                    buckets[bucket].color.r += r;
                    buckets[bucket].color.g += g;
                    buckets[bucket].color.b += b;
                    buckets[bucket].weight += 1;
                }
                buckets.forEach((bucket, index) => {
                    if (bucket.weight > 0) bucket.color.multiplyScalar(1 / bucket.weight);
                    sampledAnimationPalette[index].lerp(bucket.weight > 0 ? bucket.color : sampledAnimationPalette[index], 0.18);
                });
            } catch {
                // Local media can still be temporarily unavailable while a texture swaps.
            }
        }

        function updateScreenTethers(alpha) {
            const animationScreen = assetObjects.get("animationScreen");
            if (!animationScreen) return;
            const tetherAlpha = alpha * currentStageReveal;
            screenTethers.visible = tetherAlpha > 0.025;
            screenTetherMaterial.uniforms.uOpacity.value = tetherAlpha * 0.34;
            screenTetherMaterial.uniforms.uColor.value.lerp(blendedProjectPalette()[1], 0.08);
            screenTetherMaterial.uniforms.uTime.value = performance.now() * 0.001;
            if (!screenTethers.visible) return;
            const positions = screenTetherGeometry.attributes.position.array;
            const corners = [
                new THREE.Vector3(-0.64, 1.14, 0.02),
                new THREE.Vector3(0.64, 1.14, 0.02),
                new THREE.Vector3(0.64, -1.14, 0.02),
                new THREE.Vector3(-0.64, -1.14, 0.02)
            ];
            const extension = smootherstep(tetherAlpha);
            corners.forEach((corner, index) => {
                const worldCorner = screenGroup.localToWorld(corner.clone());
                const end = spoutOrigin.clone().lerp(worldCorner, extension);
                const p = index * 6;
                positions[p] = spoutOrigin.x;
                positions[p + 1] = spoutOrigin.y;
                positions[p + 2] = spoutOrigin.z;
                positions[p + 3] = end.x;
                positions[p + 4] = end.y;
                positions[p + 5] = end.z;
            });
            screenTetherGeometry.attributes.position.needsUpdate = true;
        }

        function applyProjectionInertia() {
            if (!objectInteractionsEnabled()) return;
            interactiveProjectionRoots.forEach((object) => {
                const inertia = object.userData.inertia;
                if (!inertia || grabbedProjection === object) return;
                if (inertia.type === "screen") {
                    object.rotation.y += inertia.vy;
                    object.rotation.x += inertia.vx;
                    inertia.vy *= 0.92;
                    inertia.vx *= 0.92;
                    if (Math.abs(inertia.vy) + Math.abs(inertia.vx) < 0.0008) object.userData.inertia = null;
                    return;
                }
                if (inertia.type === "dual-return") {
                    object.rotation.y += inertia.vy;
                    object.rotation.x += inertia.vx;
                    const rest = object.userData.restRotation;
                    if (rest) {
                        object.rotation.x += (rest.x - object.rotation.x) * 0.028;
                        object.rotation.y += (rest.y - object.rotation.y) * 0.028;
                        object.rotation.z += (rest.z - object.rotation.z) * 0.028;
                    }
                    inertia.vy *= 0.9;
                    inertia.vx *= 0.9;
                    if (Math.abs(inertia.vy) + Math.abs(inertia.vx) < 0.0008 && (!rest || (Math.abs(object.rotation.x - rest.x) + Math.abs(object.rotation.y - rest.y)) < 0.004)) object.userData.inertia = null;
                    return;
                }
                object.rotation[inertia.axis || "y"] += inertia.velocity;
                inertia.velocity *= 0.92;
                if (Math.abs(inertia.velocity) < 0.0008) object.userData.inertia = null;
            });
        }

        function installTransformControlEvents(controls) {
        controls.addEventListener("dragging-changed", (event) => {
            transformDragging = event.value;
            orbitControls.enabled = sceneMode && !scenePageVisible && !event.value;
        });

        controls.addEventListener("mouseDown", () => {
            if (!selectedObject) return;
            transformStart = snapshotObject(selectedObject);
            multiTransformStart = null;
            if (multiSelectedObjects.size > 1 && multiSelectedObjects.has(selectedObject)) {
                multiTransformStart = new Map([...multiSelectedObjects].map((object) => [object, snapshotObject(object)]));
            }
        });

        controls.addEventListener("mouseUp", () => {
            if (selectedObject && multiTransformStart?.size) {
                multiTransformStart.forEach((before, object) => {
                    pushTransformAction(object, before, snapshotObject(object), "Multi-object transform");
                });
            } else if (selectedObject && transformStart) {
                pushTransformAction(selectedObject, transformStart, snapshotObject(selectedObject), "Transform gizmo");
            }
            transformStart = null;
            multiTransformStart = null;
            updateInspector();
        });

        controls.addEventListener("objectChange", () => {
            if (selectedObject && controls.getMode() === "scale" && shiftDown && transformStart) {
                const ratios = ["x", "y", "z"].map((axis) => selectedObject.scale[axis] / Math.max(transformStart.scale[["x", "y", "z"].indexOf(axis)], 0.0001));
                const ratio = ratios.reduce((sum, value) => sum + value, 0) / ratios.length;
                selectedObject.scale.set(
                    transformStart.scale[0] * ratio,
                    transformStart.scale[1] * ratio,
                    transformStart.scale[2] * ratio
                );
            }
            if (selectedObject && multiTransformStart?.size && multiTransformStart.has(selectedObject)) {
                const mode = transformControls.getMode();
                const selectedStart = multiTransformStart.get(selectedObject);
                const deltaPosition = selectedObject.position.clone().sub(new THREE.Vector3().fromArray(selectedStart.position));
                const deltaRotation = new THREE.Euler(
                    selectedObject.rotation.x - selectedStart.rotation[0],
                    selectedObject.rotation.y - selectedStart.rotation[1],
                    selectedObject.rotation.z - selectedStart.rotation[2]
                );
                const scaleRatio = new THREE.Vector3(
                    selectedObject.scale.x / Math.max(selectedStart.scale[0], 0.0001),
                    selectedObject.scale.y / Math.max(selectedStart.scale[1], 0.0001),
                    selectedObject.scale.z / Math.max(selectedStart.scale[2], 0.0001)
                );
                multiTransformStart.forEach((snapshot, object) => {
                    if (object === selectedObject || object.userData.editorLocked || object.userData.editorHidden) return;
                    if (mode === "translate") object.position.fromArray(snapshot.position).add(deltaPosition);
                    if (mode === "rotate") {
                        object.rotation.set(
                            snapshot.rotation[0] + deltaRotation.x,
                            snapshot.rotation[1] + deltaRotation.y,
                            snapshot.rotation[2] + deltaRotation.z
                        );
                    }
                    if (mode === "scale") {
                        object.scale.set(
                            snapshot.scale[0] * scaleRatio.x,
                            snapshot.scale[1] * scaleRatio.y,
                            snapshot.scale[2] * scaleRatio.z
                        );
                    }
                });
            }
            if (selectedObject === cameraRig) {
                camera.position.copy(cameraRig.position);
                camera.lookAt(orbitControls.target);
            }
            if (selectedObject?.userData.assetId === "lamp") updateSpoutFromLamp(selectedObject);
            updateInspector();
        });
        }

        translateBtn.addEventListener("click", () => setTransformMode("translate"));
        rotateBtn.addEventListener("click", () => setTransformMode("rotate"));
        scaleBtn.addEventListener("click", () => setTransformMode("scale"));
        snapBtn.addEventListener("click", () => {
            snapEnabled = !snapEnabled;
            transformControls.setTranslationSnap(snapEnabled ? 0.25 : null);
            transformControls.setRotationSnap(snapEnabled ? THREE.MathUtils.degToRad(15) : null);
            transformControls.setScaleSnap(snapEnabled ? 0.1 : null);
            snapBtn.classList.toggle("active", snapEnabled);
            setStatus(snapEnabled ? "Snap enabled." : "Snap disabled.");
        });
        undoBtn.addEventListener("click", runUndo);
        redoBtn.addEventListener("click", runRedo);
        resetObjectBtn?.addEventListener("click", resetSelectedObject);
        deleteBtn.addEventListener("click", deleteSelectedObject);
        addLightBtn.addEventListener("click", addEditorLight);
        refreshObjectsBtn.addEventListener("click", renderObjectList);
        sceneToggle.addEventListener("click", () => {
            if (!devModeEnabled) return;
            setSceneMode(!sceneMode);
        });
        settingsToggle?.addEventListener("click", () => {
            if (!devModeEnabled) return;
            setSettingsOpen(!settingsOpen);
        });
        sceneCloseBtn.addEventListener("click", () => {
            if (settingsOpen && !sceneMode) setSettingsOpen(false);
            else setSceneMode(false);
        });
        modelFileInput.addEventListener("change", (event) => {
            loadModelFromFile(event.target.files[0]);
            event.target.value = "";
        });
        transformInputs.forEach((input) => input.addEventListener("change", () => applyInspectorValue(input)));
        liveSettingInputs.forEach((input) => {
            const handler = () => {
                const key = input.dataset.setting;
                if (!key) return;
                if (key === "selectedProject") {
                    syncProjectSettingInputs(input.value);
                    applyVisualSettings();
                    return;
                }
                visualSettings[key] = input.type === "checkbox" ? input.checked : input.type === "range" ? Number(input.value) : input.value;
                if (key === "hologramColor") setProjectColor(visualSettings.selectedProject, input.value);
                if (key === "hologramOpacity") setProjectOpacity(visualSettings.selectedProject, Number(input.value));
                if (key === "hologramSpin") getProjectSetting(visualSettings.selectedProject).spin = Number(input.value);
                if (key === "blackholeNonOrbit") localStorage.setItem("pouya-ai-blackhole-video-choice", input.checked ? "nonOrbit" : "orbit");
                if (key === "qualityPreset") {
                    runtimeQualityOverride = "";
                    persistQualityPreset(String(visualSettings[key]));
                }
                if (input.dataset.rebuildCarpet === "true") rebuildFlyingCarpetFringes();
                if (key.startsWith("hourglass") && !["hourglassGlassOpacity", "hourglassTint", "hourglassStreamThickness", "hourglassStreamOverlap", "hourglassTimerSeconds", "hourglassColumns"].includes(key)) rebuildImportedHourglass();
                applyVisualSettings();
            };
            input.addEventListener("input", handler);
            input.addEventListener("change", handler);
        });
        projectDescriptionEditor?.addEventListener("input", () => {
            const key = projectTextTarget?.value || visualSettings.selectedProject;
            projectText[key] = projectDescriptionEditor.value;
            localStorage.setItem("pouya-ai-project-text", JSON.stringify(projectText));
            const card = projectCards.find((candidate) => candidate.dataset.projectCard === key);
            const copy = card?.querySelector(".project-copy");
            if (copy) copy.textContent = projectDescriptionEditor.value;
        });
        projectTextTarget?.addEventListener("change", () => {
            if (projectDescriptionEditor) projectDescriptionEditor.value = projectText[projectTextTarget.value] || "";
        });
        hourglassFlipBtn?.addEventListener("click", (event) => {
            event.preventDefault();
            flipHourglassProjection();
        });

        saveBrowserBtn.addEventListener("click", () => {
            localStorage.setItem("pouya-ai-scene", JSON.stringify(serializeScene()));
            setStatus("Scene saved in this browser.");
        });
        loadBrowserBtn.addEventListener("click", () => applySceneData(JSON.parse(localStorage.getItem("pouya-ai-scene") || "null")));
        exportSceneBtn.addEventListener("click", () => downloadJson("pouya-ai-scene.json", serializeScene()));
        saveSettingsBtn?.addEventListener("click", () => {
            const data = serializeSettings();
            localStorage.setItem("pouya-ai-settings-config", JSON.stringify(data));
            downloadJson("pouya-ai-settings-config.json", data);
        });
        settingLoadInput?.addEventListener("change", (event) => {
            readJsonFile(event.target.files[0], applySettingsData);
            event.target.value = "";
        });
        resetAllSettingsBtn?.addEventListener("click", resetAllSettings);
        sceneLoadInput.addEventListener("change", (event) => {
            readJsonFile(event.target.files[0], applySceneData);
            event.target.value = "";
        });
        cameraKeyframeBtn.addEventListener("click", addCameraKeyframe);
        cameraPlayBtn.addEventListener("click", () => {
            cameraPlaying = cameraKeyframes.length >= 2;
            cameraPlayOffset = Number(cameraTimeline.value) || 0;
            cameraPlayStart = performance.now();
            setStatus(cameraPlaying ? "Camera playback started." : "Add at least two keyframes.");
        });
        cameraPauseBtn.addEventListener("click", () => {
            cameraPlaying = false;
            setStatus("Camera playback paused.");
        });
        cameraTimeline.addEventListener("input", () => {
            setCameraTimelineProgress(Number(cameraTimeline.value));
        });
        cameraUpdateKeyframeBtn.addEventListener("click", () => updateSelectedCameraKeyframe());
        timelineExpandBtn?.addEventListener("click", () => cameraTimelineDock?.classList.toggle("expanded"));
        timelineAddKeyframeBtn?.addEventListener("click", addCameraKeyframe);
        cameraThirdPersonBtn.addEventListener("click", () => {
            cameraThirdPerson = !cameraThirdPerson;
            cameraThirdPersonBtn.classList.toggle("active", cameraThirdPerson);
            cameraRig.visible = cameraThirdPerson;
            cameraRig.position.copy(camera.position);
            cameraRig.lookAt(orbitControls.target);
            if (cameraThirdPerson && !editableObjects.includes(cameraRig)) registerEditable(cameraRig);
            if (cameraThirdPerson) attachToObject(cameraRig);
            setStatus(cameraThirdPerson ? "3rd person camera rig enabled." : "3rd person camera rig hidden.");
        });
        cameraSmoothBtn.addEventListener("click", () => {
            cameraEasing.value = "smooth-flow";
            normalizeCameraTimes();
            renderCameraKeyframes();
            setStatus("Camera sequence set to smooth flow spline.");
        });
        cameraSaveSequenceBtn.addEventListener("click", saveCameraSequence);
        cameraSequenceSelect.addEventListener("change", () => loadCameraSequence(cameraSequenceSelect.value));
        cameraExportBtn.addEventListener("click", () => downloadJson("pouya-ai-camera-animation.json", { cameraKeyframes }));
        cameraLoadInput.addEventListener("change", (event) => {
            readJsonFile(event.target.files[0], (data) => {
                cameraKeyframes.length = 0;
                (data.cameraKeyframes || data || []).forEach((keyframe) => cameraKeyframes.push(keyframe));
                renderCameraKeyframes();
                setStatus("Camera animation loaded.");
            });
            event.target.value = "";
        });
        videoPrevBtn.addEventListener("click", () => setAnimationVideo(currentAnimationIndex - 1, -1));
        videoNextBtn.addEventListener("click", () => setAnimationVideo(currentAnimationIndex + 1, 1));
        videoAudioBtn?.addEventListener("click", () => {
            const muted = !projectionVideo.muted;
            projectionVideo.muted = muted;
            transitionVideo.muted = muted;
            videoAudioBtn.setAttribute("aria-label", muted ? "Unmute animation" : "Mute animation");
            videoAudioBtn.innerHTML = `<i class="ph ph-${muted ? "speaker-slash" : "speaker-high"}" aria-hidden="true"></i>`;
            if (!muted) projectionVideo.play().catch(() => {});
        });
        videoPauseBtn?.addEventListener("click", () => {
            animationPaused = !animationPaused;
            if (animationPaused) {
                projectionVideo.pause();
                transitionVideo.pause();
            } else {
                projectionVideo.play().catch(() => {});
                if (pendingAnimationIndex !== null) transitionVideo.play().catch(() => {});
            }
            videoPauseBtn.setAttribute("aria-label", animationPaused ? "Play animation" : "Pause animation");
            videoPauseBtn.innerHTML = `<i class="ph ph-${animationPaused ? "play" : "pause"}" aria-hidden="true"></i>`;
        });
        projectionVideo.addEventListener("ended", () => {
            if (!animationPaused && pendingAnimationIndex === null) setAnimationVideo(currentAnimationIndex + 1, 1);
        });

        pageEditorCloseBtn?.addEventListener("click", () => setPageEditorMode(false));
        pageElementSelect?.addEventListener("change", () => setSelectedPageElement(pageElementSelect.value));
        const updateSelectedPageElementFromInputs = (event) => {
            const entry = pageElements.get(selectedPageElementId);
            if (!entry) return;
            if (pageElementName) entry.label = pageElementName.value || entry.label;
            const timelineSource = event?.target === pageElementTimelineNumber ? pageElementTimelineNumber : pageElementTimeline;
            entry.timeline = Number(timelineSource?.value ?? entry.timeline);
            entry.x = Number(pageElementX?.value ?? entry.x);
            entry.y = Number(pageElementY?.value ?? entry.y);
            entry.width = Number(pageElementWidth?.value ?? entry.width);
            entry.height = Number(pageElementHeight?.value ?? entry.height);
            entry.opacity = Number(pageElementOpacity?.value ?? entry.opacity);
            entry.font = pageElementFont?.value ?? entry.font;
            entry.color = pageElementColor?.value ?? entry.color;
            if (pageElementText) writePageElementText(entry, pageElementText.value);
            applyPageElement(entry);
            setSelectedPageElement(entry.id);
            updateProjectCards();
            updateAboutScroll(window.scrollY || 0, Math.max(window.innerHeight, 1));
        };
        const pageEditorInputs = [pageElementName, pageElementTimeline, pageElementTimelineNumber, pageElementX, pageElementY, pageElementWidth, pageElementHeight, pageElementOpacity, pageElementFont, pageElementColor, pageElementText];
        pageEditorInputs.forEach((input) => {
            input?.addEventListener("focusin", () => {
                const entry = pageElements.get(selectedPageElementId);
                pageInputBefore = snapshotPageElement(entry);
            });
            input?.addEventListener("input", updateSelectedPageElementFromInputs);
            input?.addEventListener("change", () => {
                const entry = pageElements.get(selectedPageElementId);
                pushPageAction(entry, pageInputBefore, snapshotPageElement(entry), "Edit page element");
                pageInputBefore = null;
            });
        });
        pageAddTextBtn?.addEventListener("click", () => {
            const entry = createPageTextElement({ timeline: clamp(window.scrollY / maxPageScroll()), text: "New text element" });
            discoverPageElements();
            setSelectedPageElement(entry.id);
            renderPageTimeline();
            renderPageEditorFrames();
            actionStack.push({ type: "page-add", id: entry.id, snapshot: snapshotPageElement(entry), label: "Add page text element" });
            redoStack.length = 0;
        });
        pageResetElementBtn?.addEventListener("click", () => {
            const entry = pageElements.get(selectedPageElementId);
            if (!entry) return;
            const before = snapshotPageElement(entry);
            entry.x = 0;
            entry.y = Number(entry.element.dataset.pageEditorY || 0);
            entry.opacity = 1;
            entry.font = "";
            entry.color = "#ffffff";
            const rect = entry.element.getBoundingClientRect();
            entry.width = Math.round(rect.width);
            entry.height = entry.element.dataset.pageEditorWrapHeight === "1" ? 0 : Math.round(rect.height);
            applyPageElement(entry);
            setSelectedPageElement(entry.id);
            pushPageAction(entry, before, snapshotPageElement(entry), "Reset page element");
        });
        pageSaveConfigBtn?.addEventListener("click", () => {
            localStorage.setItem("pouya-ai-page-editor-config", JSON.stringify(serializePageConfig()));
            setStatus("Page editor config saved in this browser.");
        });
        pageLoadConfigBtn?.addEventListener("click", () => {
            const raw = localStorage.getItem("pouya-ai-page-editor-config");
            if (!raw) return setStatus("No saved page editor config found.");
            applyPageElementConfig(JSON.parse(raw));
            setStatus("Page editor config loaded.");
        });
        pageExportConfigBtn?.addEventListener("click", () => {
            const blob = new Blob([JSON.stringify(serializePageConfig(), null, 2)], { type: "application/json" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "pouya-ai-page-editor-config.json";
            a.click();
            URL.revokeObjectURL(a.href);
        });
        pageImportConfigFile?.addEventListener("change", async () => {
            const file = pageImportConfigFile.files?.[0];
            if (!file) return;
            applyPageElementConfig(JSON.parse(await file.text()));
            pageImportConfigFile.value = "";
            setStatus("Page editor config imported.");
        });
        pageTimelineAddBtn?.addEventListener("click", () => pageAddTextBtn?.click());

        window.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("dblclick", onProjectionDoubleClick);
        window.addEventListener("pointermove", (event) => {
            pointerTarget.x = (event.clientX / window.innerWidth - 0.5) * 2;
            pointerTarget.y = (event.clientY / window.innerHeight - 0.5) * 2;
            if (activeInteractionPointerId !== null && event.pointerId !== activeInteractionPointerId) return;
            const interactiveUi = event.target.closest?.("a, button, input, textarea, select, label, #scene-hud, #camera-timeline-dock, #page-editor-panel, #page-timeline-dock, .page-editor-frame");
            if (!grabbedProjection && !sceneMode && currentEnvironmentOpacity > 0.2 && !interactiveUi && updateFlyingCarpetPointer(event)) {
                if (draggedCarpet) event.preventDefault();
                return;
            }
            if (grabbedProjection) {
                event.preventDefault();
                const axis = grabbedProjection.userData.grabAxis || "y";
                const now = performance.now();
                const dt = Math.max(16, now - grabLastTime);
                const dx = event.clientX - grabStartX;
                const dy = event.clientY - grabStartY;
                if (axis === "move-return") {
                    pointerRayFromEvent(event);
                    if (raycaster.ray.intersectPlane(grabMovePlane, grabMoveWorld)) {
                        const local = grabbedProjection.parent.worldToLocal(grabMoveWorld.clone());
                        const before = grabbedProjection.position.clone();
                        grabbedProjection.position.lerp(local, 0.75);
                        grabbedProjection.userData.dragVelocity = grabbedProjection.position.clone().sub(before).multiplyScalar(0.9);
                        const velocity = grabbedProjection.userData.dragVelocity;
                        grabbedProjection.rotation.z += (clamp(-velocity.x * 3.6, -0.5, 0.5) - grabbedProjection.rotation.z) * 0.18;
                        grabbedProjection.rotation.x += (clamp(velocity.y * 2.5, -0.34, 0.34) - grabbedProjection.rotation.x) * 0.16;
                        orientLampHandleToCamera(grabbedProjection, 0.22);
                        updateSpoutFromLamp(grabbedProjection);
                    }
                } else if (axis === "screen") {
                    grabbedProjection.rotation.y = grabStartRotations.y + dx * 0.006;
                    grabbedProjection.rotation.x = grabStartRotations.x - dy * 0.006;
                    grabbedProjection.userData.inertia = {
                        type: "screen",
                        vy: ((event.clientX - grabLastX) / dt) * 0.095,
                        vx: -((event.clientY - grabLastY) / dt) * 0.095
                    };
                } else if (axis === "dual-return") {
                    const parentInv = grabbedProjection.parent.getWorldQuaternion(new THREE.Quaternion()).invert();
                    const cameraRight = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion).applyQuaternion(parentInv).normalize();
                    const cameraUp = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion).applyQuaternion(parentInv).normalize();
                    const yaw = new THREE.Quaternion().setFromAxisAngle(cameraUp, dx * 0.006);
                    const pitch = new THREE.Quaternion().setFromAxisAngle(cameraRight, dy * 0.0045);
                    grabbedProjection.quaternion.copy(grabStartQuaternion).premultiply(yaw).premultiply(pitch);
                    grabbedProjection.userData.inertia = {
                        type: "dual-return",
                        vy: ((event.clientX - grabLastX) / dt) * 0.08,
                        vx: ((event.clientY - grabLastY) / dt) * 0.065
                    };
                } else {
                    grabbedProjection.rotation[axis] = grabStartRotation + dx * 0.008;
                    grabbedProjection.userData.inertia = {
                        type: "axis",
                        axis,
                        velocity: ((event.clientX - grabLastX) / dt) * 0.12
                    };
                }
                grabLastX = event.clientX;
                grabLastY = event.clientY;
                grabLastTime = now;
            } else if (!sceneMode && currentEnvironmentOpacity > 0.2 && !interactiveUi) {
                hoveredInteractive = pickInteractiveProjection(event);
                document.body.style.cursor = hoveredInteractive ? "grab" : "";
            }
        }, { passive: false });
        window.addEventListener("pointerup", releasePointerInteraction);
        window.addEventListener("pointercancel", releasePointerInteraction);
        window.addEventListener("lostpointercapture", releasePointerInteraction);
        window.addEventListener("blur", () => releasePointerInteraction(null, { force: true }));
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) releasePointerInteraction(null, { force: true });
        });
        window.addEventListener("keydown", (event) => {
            const key = event.key.toLowerCase();
            const editingField = event.target?.matches?.("input, textarea, select");
            const passiveControl = event.target?.matches?.("input[type='range'], input[type='checkbox'], input[type='color'], select");
            if (editingField && !passiveControl && !event.ctrlKey && !event.metaKey) return;
            if (!editingField && key.length === 1 && /^[a-z]$/.test(key)) {
                devUnlockBuffer = (devUnlockBuffer + key).slice(-5);
                if (devUnlockBuffer === "pouya") setDevMode(!devModeEnabled);
            }
        });
        window.addEventListener("resize", () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(preferredPixelRatio());
            if (composer) {
                composer.setSize(window.innerWidth, window.innerHeight);
                composer.setPixelRatio(preferredPixelRatio());
            }
            resizeTitle();
            updateScrollState();
        });
        window.addEventListener("scroll", updateScrollState, { passive: true });
        window.addEventListener("wheel", (event) => {
            if (!sceneMode || !transformDragging || !selectedObject) return;
            event.preventDefault();
            const mode = transformControls.getMode();
            const delta = -event.deltaY * (mode === "rotate" ? 0.0008 : 0.0015);
            const targets = multiSelectedObjects.size ? [...multiSelectedObjects] : [selectedObject];
            targets.forEach((object) => {
                if (object.userData.editorLocked || object.userData.editorHidden || object.visible === false) return;
                const before = snapshotObject(object);
                if (mode === "translate") object.position.z += delta;
                if (mode === "rotate") object.rotation.z += delta;
                if (mode === "scale") {
                    if (shiftDown) {
                        const next = Math.max(0.02, object.scale.z + delta);
                        object.scale.setScalar(next);
                    } else {
                        object.scale.z = Math.max(0.02, object.scale.z + delta);
                    }
                }
                if (object.userData.assetId === "lamp") updateSpoutFromLamp(object);
                pushTransformAction(object, before, snapshotObject(object), "Wheel 3rd axis");
            });
            updateInspector();
        }, { passive: false });

        function animate() {
            const now = performance.now();
            const elapsed = now * 0.001;
            monitorRuntimePerformance(now);
            const lowestQuality = effectiveQualityPreset() === "lowest";
            pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.035;
            pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.035;
            hoverPulse += (clamp(Math.hypot(pointerCurrent.x - 0.32, pointerCurrent.y + 0.08) < 0.62 ? 1 : 0) - hoverPulse) * 0.055;

            const parallaxStrength = sceneMode ? 0.04 : visualSettings.titleParallax;
            titleGroup.rotation.y = pointerCurrent.x * parallaxStrength;
            titleGroup.rotation.x = -pointerCurrent.y * parallaxStrength * 0.45;
            resizeTitle();
            titleSparkles.forEach(({ sprite, baseScale }, index) => {
                const pulse = 0.78 + Math.sin(elapsed * 1.7 + index * 1.8) * 0.24;
                sprite.scale.set(baseScale * pulse, baseScale * pulse, 1);
                sprite.material.opacity = (0.24 + pulse * 0.26) * currentTitleOpacity * visualSettings.titleSparkle;
            });

            const globe = assetObjects.get("globe");
            const icosahedron = assetObjects.get("icosahedron");
            const iran = assetObjects.get("iran");
            const bull = assetObjects.get("bull");
            const hourglass = assetObjects.get("hourglass");
            const screen = assetObjects.get("animationScreen");
            const projectionOffset = lampProjectionOffset;
            if (globe && !lowestQuality && !prefersReducedMotion && !sceneMode) {
                globe.userData.restRotation.y += projectSettings.geo.spin;
                if (grabbedProjection !== globe) {
                    if (!globe.userData.inertia) {
                        globe.rotation.x += (globe.userData.restRotation.x - globe.rotation.x) * 0.065;
                        globe.rotation.y += (globe.userData.restRotation.y - globe.rotation.y) * 0.065;
                    }
                    globe.position.set(geoCenter.x + projectionOffset.x, geoCenter.y + projectionOffset.y + (projectSettings.geo.bob ? Math.sin(elapsed * 0.72) * 0.022 : 0), geoCenter.z + projectionOffset.z);
                }
            }
            if (icosahedron && !lowestQuality && !prefersReducedMotion && !sceneMode) {
                if (grabbedProjection !== icosahedron) icosahedron.rotation.y += projectSettings.geo.frameSpin ?? -0.0061;
                icosahedron.rotation.x = Math.sin(elapsed * 0.4) * 0.08;
                icosahedron.position.copy(geoCenter).add(projectionOffset);
            }
            if (iran && !lowestQuality && !prefersReducedMotion && !sceneMode) {
                if (grabbedProjection !== iran && !iran.userData.inertia) {
                    const cameraLocal = iran.parent.worldToLocal(camera.getWorldPosition(new THREE.Vector3()).clone());
                    const targetYaw = Math.atan2(cameraLocal.x - iran.position.x, cameraLocal.z - iran.position.z);
                    iran.rotation.y += (targetYaw - iran.rotation.y) * 0.075;
                    iran.rotation.x += (THREE.MathUtils.degToRad(6) - iran.rotation.x) * 0.07;
                    iran.rotation.z = THREE.MathUtils.degToRad(4) + Math.sin(elapsed * (1.7 + Math.abs(projectSettings.iran.spin) * 60)) * 0.02;
                    iran.userData.restRotation?.copy(iran.rotation);
                }
                iran.position.set(iranCenter.x + projectionOffset.x, iranCenter.y + projectionOffset.y + (projectSettings.iran.bob ? Math.sin(elapsed * 0.78 + 1.3) * 0.022 : 0), iranCenter.z + projectionOffset.z);
                iran.traverse((child) => {
                    if (child.material?.userData?.iranHeartbeat) {
                        child.material.userData.iranHeartbeat.value = elapsed * (grabbedProjection === iran ? 1.15 : 0.72);
                        child.material.userData.iranGrabBoost.value += ((grabbedProjection === iran ? 1 : 0) - child.material.userData.iranGrabBoost.value) * 0.08;
                    }
                });
            }
            if (bull && !lowestQuality && !prefersReducedMotion && !sceneMode && grabbedProjection !== bull) {
                bull.rotation.y += projectSettings.history.spin;
                bull.position.set(historyCenter.x + projectionOffset.x, historyCenter.y + projectionOffset.y + (projectSettings.history.bob ? Math.sin(elapsed * 0.85) * 0.032 : 0), historyCenter.z + projectionOffset.z);
            }
            if (hourglass && !lowestQuality && !prefersReducedMotion && !sceneMode && grabbedProjection !== hourglass) {
                hourglass.rotation.y += projectSettings.timeline.spin;
                hourglass.position.set(timelineCenter.x + projectionOffset.x, timelineCenter.y + projectionOffset.y + (projectSettings.timeline.bob ? Math.sin(elapsed * 0.7) * 0.026 : 0), timelineCenter.z + projectionOffset.z);
            }
            if (screen && !lowestQuality && !sceneMode && grabbedProjection !== screen) screen.position.copy(animationsCenter).add(lampProjectionOffsetTarget);

            if (lowestQuality) {
                grabbedProjection = null;
                hoveredInteractive = null;
                flowParticles.visible = false;
                ambientParticles.visible = false;
                screenTethers.visible = false;
            } else {
                updateLampFloatAndSpout(elapsed);
                applyProjectionInertia();
                updateFlowParticles(elapsed);
                updateAmbientParticles(elapsed);
                updateImportedHourglass(elapsed);
            }
            updateFlyingCarpet(elapsed);
            if (!lowestQuality) {
                [globe, iran, bull, hourglass].forEach((object, index) => {
                    if (object) updateShapeCloud(object, particleAlphaForProject(index), elapsed);
                });
                updateVideoScreen(elapsed);
            }
            updateProjectionState();
            updateChromaticCssPalette();
            if (pageEditorActive) {
                renderPageEditorFrames();
            }
            if (perfOverlayActive) updatePerformanceOverlay();

            if (scrollSyncToggle.checked && cameraKeyframes.length >= 2) {
                applyCameraAnimation(currentProjectionProgress, sceneMode, cameraThirdPerson && sceneMode);
            } else if (cameraPlaying) {
                const progress = clamp(cameraPlayOffset + (performance.now() - cameraPlayStart) / 6000);
                cameraTimeline.value = progress.toFixed(3);
                document.documentElement.style.setProperty("--timeline-progress", progress.toFixed(3));
                applyCameraAnimation(progress, true, cameraThirdPerson && sceneMode);
                if (progress >= 1) cameraPlaying = false;
            } else {
                applyDefaultScrollCamera();
            }

            updateSelectionRing();
            orbitControls.update();
            if (useComposerRender && currentEnvironmentOpacity > 0.05) composer.render();
            else renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }

        window.portfolioScene = {
            scene,
            camera,
            renderer,
            projectionStage,
            editableObjects,
            selectableObjects,
            setSceneMode,
            serializeScene,
            applySceneData,
            spoutOrigin,
            geoCenter,
            iranCenter,
            historyCenter,
            timelineCenter,
            animationsCenter,
            projectSettings,
            visualSettings,
            getPerformanceState: () => ({
                requested: visualSettings.qualityPreset,
                effective: effectiveQualityPreset(),
                runtimeOverride: runtimeQualityOverride || null,
                device: deviceCapabilityProfile()
            }),
            getInteractionState: () => ({
                grabbed: grabbedProjection?.name || null,
                carpetGrabbed: Boolean(draggedCarpet),
                activePointerId: activeInteractionPointerId,
                activeTouchPointers: [...activeTouchPointers]
            }),
            getCameraSequence: () => cameraKeyframes.map((keyframe) => ({ ...keyframe, position: [...keyframe.position], target: [...keyframe.target] })),
            setAnimationVideo,
            getAnimationState: () => ({
                currentAnimationIndex,
                pendingAnimationIndex,
                source: projectionVideoSource,
                transitionSource: transitionVideoSource,
                paused: animationPaused,
                muted: projectionVideo.muted
            }),
            makeLiquidGlass3DMaterial,
            createLiquidGlassPanel3D
        };

        attachToObject(cube);
        transformControls.visible = false;
        transformControls.enabled = false;
        applyProjectTextToCards();
        syncProjectSettingInputs("geo");
        discoverPageElements();
        const savedPageConfig = localStorage.getItem("pouya-ai-page-editor-config");
        if (savedPageConfig) {
            try {
                applyPageElementConfig(JSON.parse(savedPageConfig));
            } catch (error) {
                console.warn("Could not restore page editor config", error);
            }
        }
        if (!cameraKeyframes.length) {
            const initialCameraKeyframes = deviceCapabilityProfile().mobile ? mobileDefaultCameraKeyframes : defaultCameraKeyframes;
            initialCameraKeyframes.forEach((keyframe) => cameraKeyframes.push({ ...keyframe, position: [...keyframe.position], target: [...keyframe.target] }));
            selectedCameraKeyframe = 0;
        }
        if (cameraEasing) cameraEasing.value = "smooth-flow";
        if (scrollSyncToggle) scrollSyncToggle.checked = true;
        applyVisualSettings();
        syncAllSettingInputs();
        installSettingResetButtons();
        preloadAnimationVideos();
        renderObjectList();
        renderCameraKeyframes();
        renderCameraSequences();
        loadAssetModels();
        updateScrollState();
        animate();

        document.querySelectorAll(".liquid-glass").forEach((element) => {
            element.addEventListener("pointermove", (event) => {
                const rect = element.getBoundingClientRect();
                element.style.setProperty("--x", `${event.clientX - rect.left}px`);
                element.style.setProperty("--y", `${event.clientY - rect.top}px`);
            });
        });

        function reveal() {
            document.querySelectorAll(".reveal").forEach((element) => {
                const top = element.getBoundingClientRect().top;
                if (top < window.innerHeight - 90) element.classList.add("active");
            });
        }

        window.addEventListener("scroll", reveal, { passive: true });
        window.addEventListener("load", reveal);
        reveal();
