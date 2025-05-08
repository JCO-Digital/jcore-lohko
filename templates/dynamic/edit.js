import { __ } from "@wordpress/i18n";
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import { PanelBody, TextControl } from "@wordpress/components";
import ServerSideRender from "@wordpress/server-side-render";
import "./editor.css";

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Settings")}>
          <TextControl
            label="Test"
            value={attributes.test}
            onChange={(newValue) => setAttributes({ test: newValue })}
          />
        </PanelBody>
      </InspectorControls>

      <div {...useBlockProps()}>
        <ServerSideRender
          block="jcore/dynamic"
          attributes={{ ...attributes, preview: true }}
        />
      </div>
    </>
  );
}
