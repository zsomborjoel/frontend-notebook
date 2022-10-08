// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react';
import './resizable.css';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import { clearTimeout } from 'timers';

interface ResizableProps {
    direction: 'horizontal' | 'vertical';
}

/**
 * Contraints to how much user can bring the resizeable window
 * @param childten - component
 * @returns A resize react component
 */
const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
    let resizableProps: ResizableBoxProps;
    const [innerHeight, setInnerHeight] = useState(window.innerHeight);
    const [innerWidth, setInnerWidth] = useState(window.innerWidth);

    // To not let page size change reset ResizeableBox width
    const [width, setWidth] = useState(window.innerWidth * 0.75);

    // Debouncing for performance improvement
    useEffect(() => {
        let timer: any;

        const listener = (): any => {
            if (timer) {
                clearTimeout(timer);
            }

            timer = setTimeout(() => {
                setInnerHeight(window.innerHeight);
                setInnerWidth(window.innerWidth);

                if (window.innerWidth * 0.75 < width) {
                    setWidth(window.innerWidth * 0.75);
                }
            }, 100);
        };

        window.addEventListener('resize', listener);

        return () => {
            window.removeEventListener('resize', listener);
        };
    }, [width]);

    if (direction === 'horizontal') {
        resizableProps = {
            className: 'resize-horizontal',
            minConstraints: [innerWidth * 0.2, Infinity],
            maxConstraints: [innerWidth * 0.75, Infinity],
            height: Infinity,
            width,
            resizeHandles: ['e'],
            onResizeStop: (_, data) => {
                setWidth(data.size.width);
            },
        };
    } else {
        resizableProps = {
            minConstraints: [Infinity, 24],
            maxConstraints: [Infinity, innerHeight * 0.9],
            height: 300,
            width: Infinity,
            resizeHandles: ['s'],
        };
    }

    return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
