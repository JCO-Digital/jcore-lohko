import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";
import ServerSideRender from "@wordpress/server-side-render";
import "./editor.css";

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @return {Element} Element to render.
 */
export default function Edit(attributes) {
  return (
    <div {...useBlockProps()}>
      <ServerSideRender
        block="jcore/example-dynamic"
        attributes={{ ...attributes, preview: true }}
      />
    </div>
  );
}
