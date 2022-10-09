// eslint-disable-next-line no-use-before-define
import React, { useEffect, useRef } from 'react';
import './preview.css';

interface PreviewProps {
    code: string;
    err: string;
}

// double script tag will be split boundle - as browser looking for closed script tag
const html = `
    <html>
      <head>
        <style>html { background-color: white; }</style>
      </head>
      <body>
        <div id="root"></div>
        <script>
          const handleError = (err) => {
            const root = document.querySelector('#root');
            root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
            console.error(err);
          };

          window.addEventListener('error', (event) => {
            event.preventDefault();
            handleError(event.error);
          });

          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              handleError(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

/**
 * Responsible to show code output on the screen
 * @param param0
 * @returns
 */
const Preview: React.FC<PreviewProps> = ({ code, err }) => {
    const iframe = useRef<any>();

    useEffect(() => {
        iframe.current.srcdoc = html;

        // To have browser enough time in previos step (its short not effects ux)
        setTimeout(() => {
            iframe.current.contentWindow.postMessage(code, '*');
        }, 50);
    }, [code]);

    // iframe - sandbox we don't have direct acces between parent and child, only allows html like this by default
    // iframe - srcDoc using content from local file
    return (
        <div className="preview-wrapper">
            <iframe title="preview" ref={iframe} sandbox="allow-scripts" srcDoc={html} />
            {err && <div className="preview-error">{err}</div>}
        </div>
    );
};

export default Preview;
