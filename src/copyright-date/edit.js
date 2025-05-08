import { __ } from "@wordpress/i18n";
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import { PanelBody, TextControl, ToggleControl } from "@wordpress/components";
import ServerSideRender from "@wordpress/server-side-render";


/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
  const {showStartingYear, startingYear, companyName } = attributes;
  
  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Settings", "copyright-date")}>
        <ToggleControl
          checked={ !! showStartingYear }
          onChange={() => setAttributes({showStartingYear: ! showStartingYear })}
          label="Show starting year"
          />
          {showStartingYear && <TextControl
            label="Starting Year"
            value={startingYear}
            onChange={(newValue) => setAttributes({ startingYear: newValue })}
          />}
          <TextControl
            label="Company name"
            value={companyName}
            onChange={(newValue) => setAttributes({ companyName: newValue })}
          />
        </PanelBody>
      </InspectorControls>
      <div {...useBlockProps()}>
        <ServerSideRender
          block="jcore/copyright-date"
          attributes={{ ...attributes, preview: true }}
        />
      </div>
    </>
  );
}
