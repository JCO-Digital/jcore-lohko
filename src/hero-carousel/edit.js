import { __ } from "@wordpress/i18n";
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import { PanelBody, TextControl, ToggleControl } from "@wordpress/components";
import ServerSideRender from "@wordpress/server-side-render";
import "./editor.css";
import { useEffect } from '@wordpress/element';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes, clientId }) {

    const { numberOfPosts, displayLogo } = attributes;

    useEffect(() => {
        if (!attributes.blockId) {
            setAttributes({ blockId: clientId });
        }
    }, []);

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Settings")}>
            <TextControl
                label="Number of Posts"
                type="number"
                value={numberOfPosts}
                onChange={(newValue) => setAttributes({ numberOfPosts: parseInt(newValue, 10) || 0 })}
                min={1}
                max={10}
            />
            <ToggleControl
                label="Display logo"
                checked={ displayLogo }
                onChange={ (newValue) => setAttributes({ displayLogo: newValue })}
            />
        </PanelBody>
      </InspectorControls>

      <div {...useBlockProps()}>
        <ServerSideRender
          block="jcore/hero-carousel"
          attributes={{ ...attributes, preview: true }}
        />
      </div>
    </>
  );
}
