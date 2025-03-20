import React from 'react';
import "@/styles/globals.css";

function FloatingApp() {
    return (
        <div>
            <div className="floating-buttons">
                <a
                    href="/FloatApp/s5.ipa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-button ios"
                >
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                        alt="Download on iOS"
                    />
                    <span>Download on iOS</span>
                </a>
                <a
                    href="/FloatApp/s5.apk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-button android"
                >
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Android_robot.svg"
                        alt="Download on Android"
                    />
                    <span>Download on Android</span>
                </a>
            </div>
        </div>
    );
}
export default FloatingApp;
