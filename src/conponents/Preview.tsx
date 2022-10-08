import React, { useEffect, useRef } from 'react';

interface PreviewProps {
    code: string;
}

// double script tag will be split boundle - as browser looking for closed script tag
const html = `
    <html>
        <head></head>
        <body>
        <div id="root"></div>
        <script>
            window.addEventListener('message', (event) => {
                try {
                    eval(event.data);
                } catch(err) {
                    // when error happens put error in div
                    const root = document.querySelector('#root');
                    root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>'
                    console.error(err);
                }
            }, false);
        </script>
        </body>
    </html>
`;

const Preview: React.FC<PreviewProps> = ({ code }) => {
    const iframe = useRef<any>();

    useEffect(() => {
        iframe.current.srcdoc = html;
        iframe.current.contentWindow.postMessage(code, '*');
    }, [code]);

    // iframe - sandbox we don't have direct acces between parent and child, only allows html like this by default
    // iframe - srcDoc using content from local file
    return <iframe title="preview" ref={iframe} sandbox="allow-scripts" srcDoc={html} />;
};

export default Preview;
