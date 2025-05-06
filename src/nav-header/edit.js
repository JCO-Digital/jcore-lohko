import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  InspectorControls,
  InnerBlocks,
} from "@wordpress/block-editor";
import { PanelBody, ToggleControl } from "@wordpress/components";

import "./editor.css";

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
  const { scroll, sticky } = attributes;

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Settings")}>
          <ToggleControl
            __nextHasNoMarginBottom
            label={__("Scroll classes")}
            help={__("Set jutils scroll classes on scroll.")}
            checked={scroll}
            onChange={(newValue) => setAttributes({ scroll: newValue })}
          />
          <ToggleControl
            __nextHasNoMarginBottom
            label={__("Sticky")}
            help={__("Set jutils sticky.")}
            checked={sticky}
            onChange={(newValue) => setAttributes({ sticky: newValue })}
          />
        </PanelBody>
      </InspectorControls>

      <header {...useBlockProps()} data-jscroll={scroll} data-jsticky={sticky}>
        <InnerBlocks />
      </header>
    </>
  );
}
