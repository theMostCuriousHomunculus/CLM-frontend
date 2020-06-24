import React from 'react';

const HoverPreview = (props) => {
    return (
        <div
            className="hover-preview-container"
            style={{display: props.container_display, left: props.left, top: props.top}}
        >
            <img
                alt="front of card"
                className="hover-preview-image"
                src={props.image}
                style={{display: props.image_display}}
            />
            {props.back_image &&
                <img
                    alt="back of card"
                    className="hover-preview-image"
                    src={props.back_image}
                    style={{display: props.image_display}}
                />
            }
        </div>
    );
}

export default HoverPreview;