import React, { useEffect, useRef } from 'react';
import AudioRecorder from 'intron-transcribe-widget';
import 'intron-transcribe-widget/main.css';
function IntronWidget() {
    const widgetRef = useRef(null);

    useEffect(() => {
        let widget;
        if (widgetRef.current) {
            widget = new AudioRecorder();
            widget.init();
        }
        return () => {
            // Cleanup if needed, for example:
            // widget.destroy();
        };
    }, []);

    return <div ref={widgetRef} />;
}

export default IntronWidget;
