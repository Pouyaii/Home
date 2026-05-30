function bindTimelineTrack(track, updateProgress, progressFromEvent) {
    if (!track || track.dataset.editorTimelineBound === "1") return;
    track.dataset.editorTimelineBound = "1";
    track.addEventListener("click", (event) => {
        if (event.target.closest?.(".timeline-marker, .page-timeline-chip, .timeline-playhead, button")) return;
        updateProgress(progressFromEvent(event, track));
    });
    const playhead = track.querySelector(".timeline-playhead");
    playhead?.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        event.stopPropagation();
        playhead.setPointerCapture(event.pointerId);
        const onMove = (moveEvent) => updateProgress(progressFromEvent(moveEvent, track));
        const onUp = () => {
            playhead.removeEventListener("pointermove", onMove);
            playhead.removeEventListener("pointerup", onUp);
            playhead.removeEventListener("pointercancel", onUp);
            playhead.removeEventListener("lostpointercapture", onUp);
        };
        onMove(event);
        playhead.addEventListener("pointermove", onMove);
        playhead.addEventListener("pointerup", onUp);
        playhead.addEventListener("pointercancel", onUp);
        playhead.addEventListener("lostpointercapture", onUp);
    });
}

export function installEditorTimelineInteractions({
    cameraTrack,
    pageTrack,
    setCameraProgress,
    setPageProgress,
    progressFromEvent
}) {
    bindTimelineTrack(cameraTrack, setCameraProgress, progressFromEvent);
    bindTimelineTrack(pageTrack, setPageProgress, progressFromEvent);
}

export function installEditorKeyboardInteractions(api) {
    if (document.body.dataset.editorKeyboardBound === "1") return;
    document.body.dataset.editorKeyboardBound = "1";
    window.addEventListener("keydown", (event) => {
        if (!api.isDevEnabled()) return;
        const key = event.key.toLowerCase();
        api.setShiftDown(event.shiftKey);
        const editingField = event.target?.matches?.("input, textarea, select");
        const passiveControl = event.target?.matches?.("input[type='range'], input[type='checkbox'], input[type='color'], select");
        if (editingField && !passiveControl && !event.ctrlKey && !event.metaKey) return;
        if (key === "h") {
            event.preventDefault();
            api.toggleSceneMode();
        }
        if (key === "o") {
            event.preventDefault();
            api.toggleSettings();
        }
        if (key === "p") {
            event.preventDefault();
            api.togglePageEditor();
        }
        if (key === "l") {
            event.preventDefault();
            api.togglePerformanceOverlay();
        }
        if (key === "v" && api.isSceneMode()) api.setScenePageVisible(true);
        if (key === "k" && api.isSceneMode()) {
            event.preventDefault();
            api.toggleSceneLayoutPreview();
        }
        if ((event.ctrlKey || event.metaKey) && key === "z") {
            event.preventDefault();
            api.runUndo();
        }
        if ((event.ctrlKey || event.metaKey) && (key === "y" || (event.shiftKey && key === "z"))) {
            event.preventDefault();
            api.runRedo();
        }
        if (!api.isSceneMode()) return;
        if (key === "w") api.setTransformMode("translate");
        if (key === "e") api.setTransformMode("rotate");
        if (key === "r") api.setTransformMode("scale");
        if (key === "delete" || key === "backspace") api.deleteSelectedObject();
        if (key === "escape") api.closeSceneMode();
        if (key === "+" || key === "=") api.resizeTransformControl(0.1);
        if (key === "-" || key === "_") api.resizeTransformControl(-0.1);
    });
    window.addEventListener("keyup", (event) => {
        api.setShiftDown(event.shiftKey);
        if (event.key.toLowerCase() === "v") api.setScenePageVisible(false);
    });
}
